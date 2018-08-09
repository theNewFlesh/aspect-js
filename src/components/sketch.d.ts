declare interface Sketch {
    // props
    presetColors: any[];
    disableAlpha: boolean;
    disableFields: boolean;

    // computed
    hex: any;
    activeColor: string;

    // methods
    handlePreset: any;
    colorIsTransparent: any;
    childChange: any;
    inputChange: any;
}
