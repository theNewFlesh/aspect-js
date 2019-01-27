import * as _ from "lodash";
import { expect } from "chai";
import { DataFrame, IDataFrame } from "data-forge";
// -----------------------------------------------------------------------------

/**
 * Scaffold is a class which wraps and extends data-forge DataFrames.
 * It's API is conformed to be more like Pandas DataFrames and should be thought
 * of as a TypeScript equivalent.
 */
export class Scaffold {
    /**
     * Converts a DataFrame object into an Array of objects and then back to a
     * DataFrame
     * @param data A data-forge DataFrame
     */
    public constructor(data?: DataFrame) {
        if (data !== undefined) {
            expect(data).instanceof(DataFrame);
            this.__data = this.__from_array(data.toArray());
        }
    }

    private __data: DataFrame;

    /**
     * Converts an Array of objects into a DataFrame
     * @param arr Array of objects
     */
    private __from_array(arr: object[]): DataFrame {
        const temp_arr: object[] = [];
        for (const items of arr) {
            let temp = items;
            if (items instanceof Array) {
                temp = _.zipObject(_.range(items.length), items);
            }
            temp_arr.push(temp);
        }
        return new DataFrame(temp_arr);
    }
    // -------------------------------------------------------------------------

    /**
     * Converts an Array of objects into a new Scaffold
     * @param arr Array of objects
     */
    public from_array(arr: object[]): Scaffold {
        const data: DataFrame = this.__from_array(arr);
        return new Scaffold(data);
    }

    /**
     * Converts an objects into a Scaffold with key and value columns
     * @param obj Non-nested object to be converted
     * @returns Scaffold with key and value columns
     */
    public from_object(obj: object): Scaffold {
        let data: any = [];
        for (const key of _.keys(obj)) {
            data.push({
                "key": key,
                "value": obj[key],
            });
        }
        data = new DataFrame(data);
        return new Scaffold(data);
    }

    /**
     * Converts a DataFrame into a new Scaffold (same as constructor)
     * @param data DataFrame
     */
    public from_dataframe(data: DataFrame): Scaffold {
        return new Scaffold(data);
    }

    /**
     * An Array of rows (likely objects)
     */
    public to_array(): any[] {
        return this.__data.toArray();
    }

    /**
     * Converts a Scaffold into an object. Requires key and value columns.
     * @param key Column to be used as the objects keys
     * @param value Column to be used as the objects values
     */
    public to_object(key: string = "key", value: string = "value"): object {
        const keys: any[] = this.loc(null, key).apply(x => x[key]).to_array();
        const values: any[] = this.loc(null, value).apply(x => x[value]).to_array();
        return _.zipObject(keys, values);
    }

    /**
     * DataFrame
     */
    public to_dataframe(): DataFrame {
        return this.__data;
    }

    /**
     * Prints Scaffold data to console
     */
    public print() {
        // tslint:disable-next-line:no-console
        console.log(this.__data.toString());
    }
    // -------------------------------------------------------------------------

    /**
     * The number of rows and columns
     */
    public get shape(): number[] {
        return [this.to_array().length, this.columns.length];
    }

    /**
     * @param value Number of rows from the top
     * @returns The first N number of rows
     */
    public head(value: number): Scaffold {
        const data: any = this.__data.head(value);
        return new Scaffold(data);
    }

    /**
     * @param value Number of rows from the bottom
     * @returns The last N number of rows
     */
    public tail(value: number): Scaffold {
        const data: any = this.__data.tail(value);
        return new Scaffold(data);
    }

    /**
     * Index over the rows (similar to Pandas API)
     * Indices are reset upon method return
     * @param start The index of the first row to include
     * @param stop 1 plus the index of the last row to include
     * @returns Scaffold with row indices that sit witin the given range
     */
    public ix(start: number, stop: number = null): Scaffold {
        let index: any = start;
        if (stop !== null) {
            index = [start, stop];
        }
        return this.loc(index);
    }

    /**
     * @param columns A string or Array of strings
     * @returns A Scaffold with only these columns
     */
    public cx(columns: any): Scaffold {
        return this.loc(null, columns);
    }

    /**
     * API similar to Pandas DataFrame.loc, wherein the user can index over the
     * rows and columns of a Scaffod
     * @param index A row index or Array of row indices (must be numbers)
     * @param columns A column or Array of columns (must be strings)
     * @returns A Scaffold that only includes the specified rows and columns
     */
    public loc(index: any = null, columns: any = null): Scaffold {
        let data: any = this.__data;

        // cull rows
        if (index !== null) {
            if (typeof index === "number") {
                data = data.after(index - 1);
                data = data.before(index + 1);
            }
            else {
                if (index[0] !== undefined) {
                    data = data.after(index[0]);
                }
                if (index[1] !== undefined) {
                    data = data.before(index[1]);
                }
            }
        }

        // cull columns
        if (columns !== null) {
            if (!(columns instanceof Array)) {
                columns = [columns];
            }
            data = data.subset(columns);
        }

        return new Scaffold(data);
    }

    /**
     * The columns within the Scaffold
     */
    public get columns(): any[] {
        return this.__data.getColumnNames();
    }

    /**
     * Renames the columns to the given names. Requieres that the length of the
     * new columns and their order be correct.
     * @param columns New column names
     * @returns A Scaffold with new column names
     */
    public rename_columns(columns: string[]): Scaffold {
        let data: any = this.__data.renameSeries(
            _.zipObject(this.columns, columns)
        );
        data = new DataFrame(data);
        return new Scaffold(data);
    }

    /**
     * Sort Scaffold by a given column according to a given predicate
     * @param predicate A function of the signature: (any) => (number)
     * @param column Column to be sorted
     * @param ascending Lowest value to highest
     * @returns A Scaffold sorted by the values the given column
     */
    public sort_by(predicate, column: string, ascending: boolean = true): Scaffold {
        if (ascending) {
            const data: any = this.__data.orderBy(x => predicate(x[column]));
            return new Scaffold(data);
        } else {
            const data: any = this.__data.orderByDescending(x => predicate(x[column]));
            return new Scaffold(data);
        }
    }
    // -------------------------------------------------------------------------

    /**
     * Applies a predicate to every column or row. Used for mutating data in a
     * broadcast fashion. Similar to Pandas DataFrame.apply.
     * @param predicate A function of the signature: (Series) => (Series)
     * @param axis 0 for columns, 1 for rows
     * @returns A Scaffold in which the predicate has been applied to the axis
     */
    public apply(predicate, axis: number = 0): Scaffold {
        // the predicate receives a Series object equivalent to a column
        let data: any;
        if (axis === 1) {
            data = this.transpose()
                .to_dataframe()
                .select(predicate);
            return new Scaffold(data).transpose();
        }

        data = this.__data.select(predicate);
        return new Scaffold(data);
    }

    /**
     * Element-wise application of a given predicate to Scaffold data.
     * Similar to Pandas DataFrame.applymap.
     * @param predicate A function of the signature: (any) => (any)
     * @returns A Scaffold in which every element has been modified by the predicate
     */
    public applymap(predicate): Scaffold {
        const data: any = this.__data.select(
            x => _.map(_.values(x), predicate)
        );
        return new Scaffold(data);
    }

    /**
     * Apply a predicate to a given row and assign its results to a new column
     * @param predicate A function of the signature: (Series) => (any)
     * @param column New column to be assigned
     * @returns A Scaffold with a new column appended
     */
    public assign(predicate: any, column: string): Scaffold {
        const col: Scaffold = this.apply(x => [predicate(x)]).rename_columns([column]);
        return this.append(col, 1);
    }
    // -------------------------------------------------------------------------

    /**
     * Append a given scaffold to the bottom or right of the current Scaffold.
     * Similar to Pandas DataFrame.append.
     * @param scaffold The Scaffold to be appended
     * @param axis 0 for bottom, 1 for right
     * @returns A Scaffold with the new data appended
     */
    public append(scaffold: Scaffold, axis: number = 0): Scaffold {
        if (axis === 1) {
            const data: any = this.__data.zip(
                scaffold.__data,
                (a, b) => (Object.assign(a, b))
            );
            return new Scaffold(data);
        }
        const a0: any[] = this.to_array();
        const b0: any[] = scaffold.to_array();
        const data0: any = a0.concat(b0);
        return new Scaffold().from_array(data0);
    }

    /**
     * Filters rows according to a predicate applied to the columns of each row.
     * The inverse of drop.
     * @param predicate A function of the signature: (any) => (boolean)
     * @param columns Columns of each row the predicate will be applied to
     * @param how "any" keep the row if any column is true, "all" keep row only
     * if all columns are true
     */
    public filter(predicate: any, columns: any = null, how: string = "any"): Scaffold {
        if (columns === null) {
            columns = this.columns;
        }
        else if (!(columns instanceof Array)) {
            columns = [columns];
        }

        const data: any = this.__data.where(row => {
            let keys: any = _.keys(row);
            keys = _.filter(keys, x => columns.includes(x));

            const results: boolean[] = _.map(
                keys, x => Boolean(predicate(row[x]))
            );
            if (how === "all") {
                return _.sum(results) === results.length;
            }
            return _.filter(results, x => x).length > 0;
        });
        return new Scaffold(data);
    }

    /**
     * Drops rows according to a predicate applied to the columns of each row.
     * The inverse of filter.
     * @param predicate A function of the signature: (any) => (boolean)
     * @param columns Columns of each row the predicate will be applied to
     * @param how "any" drop the row if any column is true, "all" drop row only
     * if all columns are true
     */
    public drop(predicate: any, columns: any = null, how: string = "any"): Scaffold {
        return this.filter(x => !predicate(x), columns, how);
    }

    /**
     * Drops rows that contain undefined, null, NaN or ""
     * @param columns Columns of each row to be checked
     * @param how "any" drop the row if any column is null, "all" drop row only
     * if all columns are null
     */
    public dropna(columns: any = null, how: string = "any"): Scaffold {
        return this.drop(x => [undefined, null, NaN, ""].includes(x), columns, how);
    }

    /**
     * Fills in an element matching the nullset (from) to a given value (to).
     * Similar to Pandas DataFrame.fillna.
     * @param from Set of null values
     * @param to Fill value
     */
    public fill_na(from: any[] = [null, undefined], to: any = NaN): Scaffold {
        function _fill_na(item) {
            if (from.includes(item)) {
                return to;
            }
            return item;
        }
        return this.applymap(_fill_na);
    }

    /**
     * A Scaffold with unique rows
     */
    public unique(): Scaffold {
        // returns IDataFrame, so use any instead
        const data: any = this.__data.distinct();
        // const data: DataFrame = this.__data.distinct((a, b) => (a !== b));
        return new Scaffold(data);
    }
    // -------------------------------------------------------------------------

    /**
     * Converts Scaffold into lut object (lookup table).
     * Unique value of given column are cast as keys
     * Rows as Arrays of objects are cast as values per key
     * @param column Column to group by
     * @returns Lut object
     * <p></p>
     * <b>Example</b>
     * <pre>
     * >>> data = new Scaffold().from_array([
     *     {a: 1, b: 10, c: 100},
     *     {a: 2, b: 20, c: 200},
     *     {a: 2, b: 30, c: 300},
     * ]).to_lut("a");
     * {
     *     1: [
     *            {a: 1, b: 10, c: 100}
     *        ],
     *     2: [
     *            {a: 2, b: 20, c: 200},
     *            {a: 2, b: 30, c: 300},
     *        ]
     * }
     * </pre>
     */
    public to_lut(column: string): object {
        const group = this.__data.groupBy(x => x[column]).toArray();
        const output = {};
        for (const df of group) {
            const key = df.getSeries(column).head(1).toArray()[0];

            // sort dataframe
            const data = df.orderBy(x => x[column]);
            output[key] = data.toArray();
        }
        return output;
    }

    /**
     * Group by column and aggregate the results by aggregator.
     * Similar to Pandas DataFrame.group_by.
     * @param aggregator A function of signature: (DataFrame) => (any)
     * @param column Column to group by
     * @returns Grouped and aggregated Scaffold
     */
    public group_by(aggregator: any, column: any): Scaffold {
        let data: any = this.__data.groupBy(x => x[column]);
        data = data.select(x => new Scaffold(x));
        data = data.select(aggregator);
        data = data.orderBy(x => x[column]);
        data = new DataFrame(data);
        return new Scaffold(data);
    }
    // -------------------------------------------------------------------------

    /**
     * Transpose, same as Pandas DataFrame.transpose.
     * @returns Transposed Scaffold
     */
    public transpose(): Scaffold {
        // transpose
        let data: any = this.__data.getColumns().select(
            x => x.series.toArray()
        );
        data = new DataFrame(data);

        // rename index
        const cols: any = this.__data.getColumnNames();
        data = data.withIndex(cols);

        // check to see if all original columns were numbers
        let orig: any;
        orig = _.map(cols, x => Number(x).toString());
        let trans: any;
        trans = _.filter(
            orig, x => x !== "NaN"
        );

        // rename columns
        if (trans.length !== 0 && trans.length === orig.length) {
            orig = this.__data.getIndex().toArray();
            trans = data.getColumnNames();
            const renamer: object = _.zipObject(trans, orig);
            data = data.renameSeries(renamer);
        }

        return new Scaffold(data);
    }
}
