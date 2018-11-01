import * as _ from "lodash";
import { DataFrame, Index } from "data-forge";

export default class FancyFrame {
    public constructor(data?: any) {
        if (data !== undefined) {
            this.__data = data;
        }
    }

    private __data: DataFrame;

    public from_array(arr: object[]): FancyFrame {
        const data: DataFrame = new DataFrame(arr);
        return new FancyFrame(data);
    }

    public from_dataframe(data: DataFrame): FancyFrame {
        return new FancyFrame(data);
    }

    public to_dataframe(): DataFrame {
        return this.__data;
    }

    public print() {
        console.log(this.__data.toString());
    }

    public loc(index: any = null, columns: any = null): FancyFrame {
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
                data = data.subset([columns]);
            }
            else {
                data = data.subset(columns);
            }
        }

        return new FancyFrame(data);
    }

    public transpose(): FancyFrame {
        // transpose
        let data: any = this.__data.getColumns().select(
            x => x.series.toArray()
        );
        data = new DataFrame(data);

        // rename index
        const cols: any = this.__data.getColumnNames();
        data = data.withIndex(cols);

        // check to see if all original columns were numbers
        const orig = _.map(cols, x => Number(x).toString());
        const trans = _.filter(
            orig, x => x !== "NaN"
        );

        // rename columns
        if (trans.length != 0 && trans.length == orig.length) {
            const orig = this.__data.getIndex().toArray();
            const trans = data.getColumnNames();
            const renamer: object = _.zipObject(trans, orig);
            data = data.renameSeries(renamer);
        }

        return new FancyFrame(data);
    }

    public apply(predicate, axis: number = 0): FancyFrame {
        // the predicate receives a Series object equivalent to a column
        if (axis === 1) {
            const data: any = this.transpose()
                .to_dataframe()
                .select(predicate)
            return new FancyFrame(data).transpose();
        }

        const data: any = this.__data.select(predicate);
        return new FancyFrame(data);
    }

    public applymap(predicate): FancyFrame {
        const data: any = this.__data.select(
            x => _.map(_.values(x), predicate)
        );
        return new FancyFrame(data);
    }

    public fill_na(from: any[] = [null, undefined], to: any = NaN): FancyFrame {
        function _fill_na(item) {
            if (from.includes(item)) {
                return to;
            }
            return item;
        }
        return this.applymap(_fill_na);
    }

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
}
