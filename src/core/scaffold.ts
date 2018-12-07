import * as _ from "lodash";
import { expect } from "chai";
import { DataFrame } from "data-forge";
// -----------------------------------------------------------------------------

export class Scaffold {
    public constructor(data?: DataFrame) {
        if (data !== undefined) {
            expect(data).instanceof(DataFrame);
            this.__data = this._from_array(data.toArray());
        }
    }

    private __data: DataFrame;

    public _from_array(arr: object[]): DataFrame {
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

    public from_array(arr: object[]): Scaffold {
        const data: DataFrame = this._from_array(arr);
        return new Scaffold(data);
    }

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

    public from_dataframe(data: DataFrame): Scaffold {
        return new Scaffold(data);
    }

    public to_array(): any[] {
        return this.__data.toArray();
    }

    public to_object(key: string = "key", value: string = "value"): object {
        const keys: any[] = this.loc(null, key).apply(x => x[key]).to_array();
        const values: any[] = this.loc(null, value).apply(x => x[value]).to_array();
        return _.zipObject(keys, values);
    }

    public to_dataframe(): DataFrame {
        return this.__data;
    }

    public print() {
        // tslint:disable-next-line:no-console
        console.log(this.__data.toString());
    }
    // -------------------------------------------------------------------------

    public get shape(): number[] {
        return [this.to_array().length, this.columns.length];
    }

    public head(value: number): Scaffold {
        const data: any = this.__data.head(value);
        return new Scaffold(data);
    }

    public tail(value: number): Scaffold {
        const data: any = this.__data.tail(value);
        return new Scaffold(data);
    }

    public ix(start: number, stop: number = null): Scaffold {
        let index: any = start;
        if (stop !== null) {
            index = [start, stop];
        }
        return this.loc(index);
    }

    public cx(columns: any): Scaffold {
        return this.loc(null, columns);
    }

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
            if ( !(columns instanceof Array) ) {
                columns = [columns];
            }
            data = data.subset(columns);
        }

        return new Scaffold(data);
    }

    public get columns(): any[] {
        return this.__data.getColumnNames();
    }

    public rename_columns(columns: string[]): Scaffold {
        let data: any = this.__data.renameSeries(
            _.zipObject(this.columns, columns)
        );
        data = new DataFrame(data);
        return new Scaffold(data);
    }

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

    public applymap(predicate): Scaffold {
        const data: any = this.__data.select(
            x => _.map(_.values(x), predicate)
        );
        return new Scaffold(data);
    }

    public assign(predicate: any, column: string): Scaffold {
        const col: Scaffold = this.apply(x => [predicate(x)]).rename_columns([column]);
        return this.append(col, 1);
    }
    // -------------------------------------------------------------------------

    public append(frame: Scaffold, axis: number = 0): Scaffold {
        if (axis === 1) {
            const data: any = this.__data.zip(
                frame.__data,
                (a, b) => (Object.assign(a, b))
            );
            return new Scaffold(data);
        }
        const a0: any[] = this.to_array();
        const b0: any[] = frame.to_array();
        const data0: any = a0.concat(b0);
        return new Scaffold().from_array(data0);
    }

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

    public drop(predicate: any, columns: any = null, how: string = "any"): Scaffold {
        return this.filter(x => !predicate(x), columns, how);
    }

    public dropna(columns: any = null, how: string = "any"): Scaffold {
        return this.drop(x => [undefined, null, NaN, ""].includes(x), columns, how);
    }

    public fill_na(from: any[] = [null, undefined], to: any = NaN): Scaffold {
        function _fill_na(item) {
            if (from.includes(item)) {
                return to;
            }
            return item;
        }
        return this.applymap(_fill_na);
    }

    public unique(): Scaffold {
        const data: DataFrame = this.__data.distinct((a, b) => (a !== b));
        return new Scaffold(data);
    }
    // -------------------------------------------------------------------------

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

    public group_by(aggregator: any, column: any): Scaffold {
        let data: any = this.__data.groupBy(x => x[column]);
        data = data.select(x => new Scaffold(x));
        data = data.select(aggregator);
        data = data.orderBy(x => x[column]);
        data = new DataFrame(data);
        return new Scaffold(data);
    }
    // -------------------------------------------------------------------------

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
