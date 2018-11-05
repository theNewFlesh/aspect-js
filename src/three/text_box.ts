import * as _ from "lodash";
import * as THREE from "three";
import { Primitive } from "./primitive";
import { FONT_KEYS } from "./three_tools";
import TextTexture from "three.texttexture";
// -----------------------------------------------------------------------------

export interface ITextBoxParams {
    "id"?: string;
    "name"?: string;
    "opacity"?: number;
    "visible"?: boolean;
    "color/hue"?: number;
    "color/saturation"?: number;
    "color/value"?: number;
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
        const texture = new TextTexture({
            text: params["font/text"] || "DEFAULT TEXT",
            fontFamily: `"${params["font/family"]}"` || "Tahoma",
            fontSize: params["font/size"] || 300,
            fontStyle: params["font/style"] || "normal",
        });
        const bg = new THREE.MeshBasicMaterial({
            opacity: 0,
            transparent: true,
        });
        const text = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
        });
        const materials: THREE.MeshBasicMaterial[] = [
            bg, bg, bg, bg, text, text,
        ];

        const geo: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const item = new THREE.Mesh(geo, materials);
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

    public crate(params: ITextBoxParams): void {
        super.create(params);
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

    public update(params: ITextBoxParams): void {
        super.update(params);
    }
}
