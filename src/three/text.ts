import * as _ from "lodash";
import * as THREE from "three";
import { Primitive } from "./primitive";
import { FONT_KEYS } from "./three_tools";
import TextTexture from "three.texttexture";
import { ITextParams } from "../core/iparams";
// -----------------------------------------------------------------------------

/**
 * Sprite with text and a transparent background
 */
export class Text extends Primitive {
    /**
     * "text"
     */
    public _class: string = "text";

    /**
     * Creates a THREE.Sprite item with given text
     * Defaults:
     *     text: "DEFAULT TEXT"
     *     fontFamily: "Tahoma"
     *     fontSize: 100
     *     fontStyle: "normal"
     * @param params Text params
     * @returns Sprite with text
     */
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

    /**
     * Returns true if keys contain "font"
     * @param params Text params
     */
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

    /**
     * Reads text params from primitives
     */
    public read(): ITextParams {
        const params: ITextParams = super.read();
        params["font/text"] = this.three_item.material.map.text;
        params["font/family"] = this.three_item.material.map.fontFamily;
        params["font/style"] = this.three_item.material.map.fontStyle;
        params["font/size"] = this.three_item.material.map.fontSize;
        return params;
    }

    /**
     * Update Text componenent with given params
     * @param params Text params
     */
    public update(params: ITextParams): void {
        super.update(params);
    }
}
