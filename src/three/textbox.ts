import * as _ from "lodash";
import * as THREE from "three";
import { Primitive } from "./primitive";
import * as three_tools from "./three_tools";
import TextTexture from "three.texttexture";
import { ITextBoxParams } from "../core/iparams";
// -----------------------------------------------------------------------------

export class TextBox extends Primitive {
    private __get_font_family(): string {
        const family: string = this._three_item.material[5].map.fontFamily;
        return family.replace(/"/g, "");
    }

    public get _default_params(): object {
        return {
            "name": "",
            "visible": true,
            "color/hue": 0,
            "color/saturation": 0,
            "color/value": 1,
            "color/alpha": 1,
            "translate/x": 0,
            "translate/y": 0,
            "translate/z": 0,
            "rotate/x": 0,
            "rotate/y": 0,
            "rotate/z": 0,
            "scale/x": 1,
            "scale/y": 1,
            "scale/z": 1,
            "font/text": "DEFAULT TEXT",
            "font/family": "Tahoma",
            "font/style": "normal",
            "font/size": 300,
        }
    };

    public _create_three_item(params: ITextBoxParams): THREE.Mesh {
        const texture = new TextTexture({
            text: params["font/text"],
            fontFamily: `"${params["font/family"]}"`,
            fontStyle: params["font/style"],
            fontSize: params["font/size"],
        });
        const bg = new THREE.MeshLambertMaterial({
            opacity: 0,
            transparent: true,
        });
        const text = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true,
        });
        const materials: THREE.MeshLambertMaterial[] = [
            bg, bg, bg, bg, text, text,
        ];

        const geo: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const three_item = new THREE.Mesh(geo, materials);
        return three_item;
    }

    public _is_destructive(params: ITextBoxParams): boolean {
        for (const key of _.keys(params)) {
            if (three_tools.FONT_KEYS.includes(key)) {
                return true;
            }
        }
        return false;
    }

    // public create(params: ITextBoxParams, parent: any): void {
    //     super.create(params);
    // }

    public read(): ITextBoxParams {
        const params: ITextBoxParams = super.read();
        params["font/text"]   = this.three_item.material[5].map.text;
        params["font/family"] = this.__get_font_family();
        params["font/style"]  = this.three_item.material[5].map.fontStyle;
        params["font/size"]   = this.three_item.material[5].map.fontSize;
        return params;
    }

    public update(params: ITextBoxParams): void {
        super.update(params);
    }
}
