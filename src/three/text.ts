import * as _ from "lodash";
import * as THREE from "three";
import { Primitive } from "./primitive";
import { FONT_KEYS } from "./three_tools";
import TextTexture from "three.texttexture";
import { ITextParams } from "../core/iparams";
// -----------------------------------------------------------------------------

export class Text extends Primitive {
    public _class: string = "text";

    public _create_three_item(params: ITextParams): THREE.Sprite {
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

    // public create(params: ITextParams, parent: any): void {
    //     super.create(params);
    // }

    public read(): ITextParams {
        const params: ITextParams = super.read();
        params["font/text"]   = this.three_item.material.map.text;
        params["font/family"] = this.three_item.material.map.fontFamily;
        params["font/style"]  = this.three_item.material.map.fontStyle;
        params["font/size"]   = this.three_item.material.map.fontSize;
        return params;
    }

    public update(params: ITextParams): void {
        super.update(params);
    }
}
