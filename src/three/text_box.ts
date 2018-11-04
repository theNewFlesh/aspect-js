import * as _ from "lodash";
import * as THREE from "three";
import { Primitive, FONT_KEYS } from "./primitive";
import TextTexture from "three.texttexture";
// -----------------------------------------------------------------------------

export interface ITextBoxParams {
    "id"?: string;
    "name"?: string;
    "opacity"?: number;
    "visible"?: boolean;
    "color/hue"?: number;
    "color/saturation"?: number;
    "color/luminance"?: number;
    "translate/x"?: number;
    "translate/y"?: number;
    "translate/z"?: number;
    "rotate/x"?: number;
    "rotate/y"?: number;
    "rotate/z"?: number;
    "scale/x"?: number;
    "scale/y"?: number;
    "scale/z"?: number;
    "font/text"?: string;
    "font/family"?: string;
    "font/style"?: string;
    "font/size"?: number;
}

export class TextBox extends Primitive {
    public _create_item(params: ITextBoxParams): THREE.Mesh {
        const geo: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const texture = new TextTexture({
            text: params["font/text"] || "DEFAULT TEXT",
            fontFamily: `"${params["font/family"]}"` || "Tahoma",
            fontSize: params["font/size"] || 300,
            fontStyle: params["font/style"] || "normal",
        });
        const material = new THREE.MeshBasicMaterial({
            // color: 0x7ec4cf,
            map: texture,
            transparent: true,
        });

        const item = new THREE.Mesh(geo, material);
        return item;
    }

    public _is_destructive(params: ITextBoxParams): boolean {
        for (const key of _.keys(params)) {
            if (FONT_KEYS.includes(key)) {
                return true;
            }
        }
        return false;
    }

    public read(): ITextBoxParams {
        const item = this._item;
        const params: ITextBoxParams = super.read();
        params["font/text"] =  item.material.map.text;
        params["font/family"] =item.material.map.fontFamily;
        params["font/style"] = item.material.map.fontStyle;
        params["font/size"] = item.material.map.fontSize;
        return params;
    }
}
