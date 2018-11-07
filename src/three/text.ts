import * as _ from "lodash";
import * as THREE from "three";
import { Primitive } from "./primitive";
import { FONT_KEYS } from "./three_tools";
import TextTexture from "three.texttexture";
// -----------------------------------------------------------------------------

export interface ITextParams {
    "id"?: string;
    "name"?: string;
    "visible"?: boolean;
    "color/hue"?: number;
    "color/saturation"?: number;
    "color/value"?: number;
    "color/alpha"?: number;
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
// -----------------------------------------------------------------------------

export class Text extends Primitive {
    public _create_item(params: ITextParams): THREE.Sprite {
        const texture = new TextTexture({
            text: params["font/text"] || "DEFAULT TEXT",
            fontFamily: `"${params["font/family"]}"` || "Tahoma",
            fontSize: params["font/size"] || 100,
            fontStyle: params["font/style"] || "normal",
        });
        const material = new THREE.SpriteMaterial({
            map: texture
        });
        const sprite = new THREE.Sprite(material);
        sprite.translateZ(0.01);
        sprite.scale.setX(texture.imageAspect);

        return sprite;
    }

    public _is_destructive(params: ITextParams): boolean {
        for (const key of _.keys(params)) {
            if (FONT_KEYS.includes(key)) {
                return true;
            }
        }
        return false;
    }

    public create(params: ITextParams): void {
        super.create(params);
    }

    public read(): ITextParams {
        const item = this._item;
        const params: ITextParams = super.read();
        params["font/text"] =  item.material.map.text;
        params["font/family"] =item.material.map.fontFamily;
        params["font/style"] = item.material.map.fontStyle;
        params["font/size"] = item.material.map.fontSize;
        return params;
    }

    public update(params: ITextParams): void {
        super.update(params);
    }
}
