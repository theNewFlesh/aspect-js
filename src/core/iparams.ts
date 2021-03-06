/**
 * Generic interface for Primitives
 */
export interface IParams {
    "id"?: string;
    "type"?: string;
    "name"?: string;
    "order"?: number;
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
    "radius"?: number;
}

/**
 * Interface for Scene components
 */
export interface ISceneParams {
    "id"?: string;
    "type"?: string;
    "name"?: string;
}

/**
 * Interface for Edge components
 */
export interface IEdgeParams {
    "id"?: string;
    "type"?: string;
    "name"?: string;
    "visible"?: boolean;
    "source/id"?: string;
    "source/translate/x"?: number;
    "source/translate/y"?: number;
    "source/translate/z"?: number;
    "destination/id"?: string;
    "destination/translate/x"?: number;
    "destination/translate/y"?: number;
    "destination/translate/z"?: number;
    "scale/x"?: number;
    "scale/y"?: number;
    "scale/z"?: number;
    "radius"?: number;
    "color/hue"?: number;
    "color/saturation"?: number;
    "color/value"?: number;
    "color/alpha"?: number;
}

/**
 * Interface for Node components
 */
export interface INodeParams {
    "id"?: string;
    "type"?: string;
    "name"?: string;
    "visible"?: boolean;
    "translate/x"?: number;
    "translate/y"?: number;
    "translate/z"?: number;
    "scale/x"?: number;
    "scale/y"?: number;
    "scale/z"?: number;
    "color/hue"?: number;
    "color/saturation"?: number;
    "color/value"?: number;
    "color/alpha"?: number;
    "font/color/hue"?: number;
    "font/color/saturation"?: number;
    "font/color/value"?: number;
    "font/color/alpha"?: number;
    "font/text"?: string;
    "font/family"?: string;
    "font/style"?: string;
    "font/size"?: number;
}

/**
 * Interface for Port components
 */
export interface IPortParams {
    "id"?: string;
    "type"?: string;
    "order"?: number;
    "name"?: string;
    "visible"?: boolean;
    "translate/x"?: number;
    "translate/y"?: number;
    "translate/z"?: number;
    "scale/x"?: number;
    "scale/y"?: number;
    "scale/z"?: number;
    "color/hue"?: number;
    "color/saturation"?: number;
    "color/value"?: number;
    "color/alpha"?: number;
}

/**
 * Generic interface for Components
 */
export interface IComponentParams {
    "id"?: string;
    "type"?: string;
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
    "radius"?: number;
}

/**
 * Interface for Cylinder primitives
 */
export interface ICylinderParams {
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
    "height"?: number;
    "radius/top"?: number;
    "radius/bottom"?: number;
}

/**
 * Interface for Sphere primitives
 */
export interface ISphereParams {
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
    "radius"?: number;
}

/**
 * Interface for Text primitives
 */
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

/**
 * Interface for TextBox primitives
 */
export interface ITextBoxParams {
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
