import * as _ from "lodash";
import { DataFrame } from "data-forge";

export class FancyFrame {
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

    public to_array(): any[] {
        return this.__data.toArray();
    }

    public to_dataframe(): DataFrame {
        return this.__data;
    }

    public print() {
        // tslint:disable-next-line:no-console
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
                columns = [columns];
            }
            data = data.subset(columns);
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

        return new FancyFrame(data);
    }

    public apply(predicate, axis: number = 0): FancyFrame {
        // the predicate receives a Series object equivalent to a column
        let data: any;
        if (axis === 1) {
            data = this.transpose()
                .to_dataframe()
                .select(predicate);
            return new FancyFrame(data).transpose();
        }

        data = this.__data.select(predicate);
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

    public group_by(column: any, predicate): FancyFrame {
        let data: any = this.__data.groupBy(x => x[column]);
        data = data.select(predicate);
        data = data.orderBy(x => x[column]);
        return new FancyFrame(data);
    }

    public get columns(): any[] {
        return this.__data.getColumnNames();
    }

    public rename_columns(columns: string[]): FancyFrame {
        const data = this.__data.renameSeries(
            _.zipObject(this.columns, columns)
        );
        return new FancyFrame(data);
    }

    public append(frame: FancyFrame, axis: number): FancyFrame {
        if (axis === 1) {
            const data: any = this.__data.zip(
                frame.__data,
                (a, b) => (Object.assign(a, b))
            );
            return new FancyFrame(data);
        }
        const a0: any[] = this.to_array();
        const b0: any[] = frame.to_array();
        const data0: any = a0.concat(b0);
        return new FancyFrame().from_array(data0);
    }
}
