import spline from 'cubic-spline';

type interpolationMode = 'linear' | 'spline';

const black = [0., 0., 0., 1.0];

const linear = (x:number, xs:number[], ys:number[]) => {
    const index= xs.reduce((pre,current,i)=>current <= x ? i : pre, 0);
    const i = index === xs.length-1 ? xs.length-2 : index;

    return (ys[i+1]-ys[i])/(xs[i+1]-xs[i])*(x-xs[i])+ys[i];
};

export default class GradationGenerator {
    parameters: {[key: number]: number[]}; // {x1: [r1,g1,b1,a1], x2: [r2,g2,b2a2]}
    baseColors: number[][];　// [rs, gs, bs, as]
    xs: number[];
    mode: string;
    size: number;
    len: number;

    constructor(modeName:interpolationMode){
        this.parameters = {};
        this.initParams();
        this.setMode(modeName);
    }

    initParams() {
        this.baseColors = new Array(this.len | 3).fill([]);
        this.xs = [];
        this.size = 0;
    }

    addBaseColor(x:number, color:number[]) {
        if (this.len === undefined) this.len = color.length;
        if (x < 0. || x > 1.) throw "range error: 'x' must be 0.0 ~ 1.0";
        this.parameters[x] = [];
        this.parameters[x] = color.length >= this.len ? color.slice(0,this.len) : color.concat(black.slice(color.length,this.len));

        this.setParameters();
    }

    clear() {
        this.parameters = {};
        this.initParams();
    }

    private setParameters() {
        this.initParams();

        const keys = Object.keys(this.parameters).map(x => parseFloat(x)).sort((a,b) => a < b ? -1: 1);

        this.xs = [...keys];
        this.size = keys.length;

        for (let i = 0; i < 4; i++) {
            let color_args = [];

            for (let k = 0; k < this.size; k++) {
                color_args.push(this.parameters[keys[k]][i]);
            }

            this.baseColors[i] = color_args;
        }
    }

    setMode(modeName:interpolationMode) {
        this.mode = modeName;
    }

    getColor(x:number) {
        if (this.size === 0) return undefined;
        if (this.size === 1) return this.parameters[this.xs[0]];

        let func: (x:number, xs:number[], ys:number[]) => number;

        switch (this.mode) {
            case 'linear':
                func = linear;
                break;
            case 'spline':
                func = spline;
                break;
        }

        let retColor = new Array(this.len);

        for (let i = 0; i < this.len; i++) {
            retColor[i] = func(x, this.xs, this.baseColors[i]);
        }

        return retColor;
    }
}