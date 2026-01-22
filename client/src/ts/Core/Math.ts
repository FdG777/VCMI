import {
    I_Serializable, Serializable
} from "./Serializer.js";


export function divmod( dividend: number, divisor: number ): { quotient: number; remainder: number } {
    if( divisor === 0 ) throw new Error( "divisor must not be 0" );
    if( ! Number.isInteger( dividend ) ) throw new Error( "dividend must be an integer: " + dividend );
    if( ! Number.isInteger( divisor ) ) throw new Error( "divisor must be an integer: " + divisor );
    const q = Math.trunc( dividend / divisor );
    let r = dividend - divisor * q;
    if( r < 0 ) {
        const d = Math.abs( divisor );
        r += d;
        return { quotient: q - Math.sign( divisor ), remainder: r };
    }
    return { quotient: q, remainder: r };
}


export function roundDecimals( value: number, decimals: number ): number {
    const pow = Math.pow( 10, decimals );
    return Math.round( value * pow ) / pow;
}
export function splitNumber( value: number ): { whole: number, fractional: number, wholeLength: number, fractionalLength: number } {
    if( Number.isNaN( value ) ) return { whole: Number.NaN, fractional: Number.NaN, wholeLength: 0, fractionalLength: 0 };
    if( Number.isInteger( value ) ) return { whole: value, fractional: Number.NaN, wholeLength: value.toString().length, fractionalLength: 0 };
    const valueString = String( value );
    const parts = valueString.split( "." );
    return { whole: parseInt( parts[0] ), fractional: parseInt( parts[1] ), wholeLength: parts[0].length, fractionalLength: parts[1].length };
}



export function clampToleranceInQuantum( tolerance: number ): number {
    if( ! Number.isFinite( tolerance ) ) return 0;
    return Math.min( 0.5, Math.max( 0, tolerance ) );
}
export function discretize( value: number, quantum: number ): number {
    if( ! Number.isFinite( value ) ) return value;
    if( ! Number.isFinite( quantum ) || quantum === 0 ) return value;
    return quantum * Math.round( value / quantum );
}
export function isDiscrete( value: number, quantum: number ): boolean {
    return Object.is( 0, quantizationError( value, quantum ) );
}
export function isNearlyDiscrete( value: number, quantum: number, tolerance: number ): boolean {
    return absoluteQuantizationError( value, quantum ) <= clampToleranceInQuantum( tolerance ) * quantum;
}
export function quantizationError( value: number, quantum: number ): number {
    return discretize( value, quantum ) - value;
}
export function absoluteQuantizationError( value: number, quantum: number ): number {
    return Math.abs( quantizationError( value, quantum ) );
}





export function compareNumbers( a: number, b: number ): number {
    return a < b ? -1 : b < a ? 1 : 0;
}


type RangeKind = "empty" | "point" | "interval";
export function rangeKind( r: I_NumberRange ): RangeKind {
    return r.isEmpty ? "empty" : r.min === r.max ? "point" : "interval";
}
export function equalRanges( a: I_NumberRange, b: I_NumberRange ): boolean {
    return a.min === b.min && a.max === b.max && a.includesMin === b.includesMin && a.includesMax === b.includesMax;
}
export function compareNumberRangesByLength(a: I_NumberRange, b: I_NumberRange): number {
    const r = compareNumbers( a.measureLength, b.measureLength );
    if( r !== 0 ) return r;
    const aEnds = ( a.includesMin ? 1 : 0 ) + ( a.includesMax ? 1 : 0 );
    const bEnds = ( b.includesMin ? 1 : 0 ) + ( b.includesMax ? 1 : 0 );
    let t = compareNumbers( aEnds, bEnds );
    if( t !== 0 ) return t;
    t = compareNumbers( a.includesMin ? 1 : 0, b.includesMin ? 1 : 0 );
    if( t !== 0 ) return t;
    return compareNumbers( a.includesMax ? 1 : 0, b.includesMax ? 1 : 0 );
}
export function compareNumberRangesByMax( a: I_NumberRange, b: I_NumberRange ): number {
    const r = compareNumbers( a.max, b.max );
    return r === 0 ? compareNumbers( a.includesMax ? 1 : 0, b.includesMax ? 1 : 0 ) : r;
}
export function compareNumberRangesByMin(a: I_NumberRange, b: I_NumberRange): number {
    const r = compareNumbers( a.min, b.min );
    return r === 0 ? compareNumbers( a.includesMin ? 1 : 0, b.includesMin ? 1 : 0 ) : r;
}
export function compareNumberRanges( a: I_NumberRange, b: I_NumberRange ): number {
    const r = compareNumberRangesByMin( a, b );
    return r === 0 ? compareNumberRangesByLength( a, b ) : r;
}
export function compareNumberRangesForNormalize( a: I_NumberRange, b: I_NumberRange ): number {
    let r = compareNumberRangesByMin( a, b );
    if( r !== 0 ) return r;
    r = compareNumberRangesByMax( a, b );
    if( r !== 0 ) return r;
    return 0;
}
export function buildNumberRange( min: number, max: number, includesMin: boolean, includesMax: boolean ): I_NumberRange {
    if( includesMin && includesMax ) return new InclusiveNumberRange( [min, max] );
    if( ! includesMin && ! includesMax ) return new ExclusiveNumberRange( [min, max] );
    if( includesMin && ! includesMax ) return new MinInclusiveNumberRange( [min, max] );
    return new MaxInclusiveNumberRange( [min, max] );
}
export function rangeIncludesPoint( r: I_NumberRange, x: number ): boolean {
    if( Number.isNaN( x ) ) return false;
    if( x < r.min || x > r.max ) return false;
    if( x === r.min && ! r.includesMin ) return false;
    if( x === r.max && ! r.includesMax ) return false;
    return true;
}
export function intersectNumberRanges(a: I_NumberRange, b: I_NumberRange): I_NumberRange | null {
    // min
    let min: number;
    let includesMin: boolean;

    if (a.min > b.min) { min = a.min; includesMin = a.includesMin; }
    else if (b.min > a.min) { min = b.min; includesMin = b.includesMin; }
    else { min = a.min; includesMin = a.includesMin && b.includesMin; }

    // max
    let max: number;
    let includesMax: boolean;

    if (a.max < b.max) { max = a.max; includesMax = a.includesMax; }
    else if (b.max < a.max) { max = b.max; includesMax = b.includesMax; }
    else { max = a.max; includesMax = a.includesMax && b.includesMax; }

    // Check emptiness of result without constructing invalid ranges
    if (min < max) return buildNumberRange(min, max, includesMin, includesMax);
    if (min > max) return null;
    // min === max: point exists only if both ends include that point
    if (includesMin && includesMax) return buildNumberRange(min, max, true, true);
    return null;
}
export function subtractNumberRanges(a: I_NumberRange, b: I_NumberRange): I_NumberRange[] {
    const i = intersectNumberRanges(a, b);
    if (!i) return [a.copy()];
    const out: I_NumberRange[] = [];
    // Left remainder: from a.min to i.min (excluding the intersection boundary if needed)
    {
        const leftMin = a.min;
        const leftMax = i.min;

        // left part exists if it has any point
        const leftIncludesMin = a.includesMin;
        const leftIncludesMax = rangeIncludesPoint( a, leftMax ) && ! rangeIncludesPoint( i, leftMax );

        if (leftMin < leftMax || (leftMin === leftMax && leftIncludesMin && leftIncludesMax)) {
            out.push(buildNumberRange(leftMin, leftMax, leftIncludesMin, leftIncludesMax));
        }
    }
    // Right remainder: from i.max to a.max
    {
        const rightMin = i.max;
        const rightMax = a.max;

        const rightIncludesMin = rangeIncludesPoint( a, rightMin ) && ! rangeIncludesPoint( i, rightMin );
        const rightIncludesMax = a.includesMax;

        if (rightMin < rightMax || (rightMin === rightMax && rightIncludesMin && rightIncludesMax)) {
            out.push(buildNumberRange(rightMin, rightMax, rightIncludesMin, rightIncludesMax));
        }
    }
    return out;
}
export function canMergeRanges(a: I_NumberRange, b: I_NumberRange): boolean {
    // assume a.min <= b.min (sorted)
    if (b.min < a.max) return true;
    if (b.min > a.max) return false;
    // b.min === a.max: merge only if boundary is included by union
    return a.includesMax || b.includesMin;
}
export function mergeRanges(a: I_NumberRange, b: I_NumberRange): I_NumberRange {
    // min comes from a (sorted)
    const min = a.min;
    const includesMin = (a.min === b.min) ? (a.includesMin || b.includesMin) : a.includesMin;

    // max is the larger max
    if (a.max > b.max) return buildNumberRange(min, a.max, includesMin, a.includesMax);
    if (b.max > a.max) return buildNumberRange(min, b.max, includesMin, b.includesMax);
    // equal max
    return buildNumberRange(min, a.max, includesMin, a.includesMax || b.includesMax);
}
export function normalizeNumberRanges(ranges: ReadonlyArray<I_NumberRange>): I_NumberRange[] {
    const list = ranges.map( r => r.copy() ).sort( compareNumberRangesForNormalize );
    const out: I_NumberRange[] = [];
    for( const r of list ) {
        const last = out[out.length - 1];
        if( ! last ) {
            out.push(r); continue;
        }
        if( canMergeRanges( last, r) ) out[out.length - 1] = mergeRanges( last, r );
        else out.push( r );
    }
    return out;
}




export function isNumberRange( candidate: unknown ): candidate is I_NumberRange {
    return candidate != null && ( candidate as I_NumberRange ).isNumberRange;
}
export interface I_NumberRange extends I_Serializable {
    readonly isNumberRange: true;
    readonly isEmpty: boolean;
    readonly measureLength: number;
    readonly max: number;
    readonly min: number;
    readonly includesMax: boolean;
    readonly includesMin: boolean;
    includes( value: number ): boolean;
    equals( range: I_NumberRange ): boolean;
    copy(): I_NumberRange;
    invert(): I_NumberRange;
}
export abstract class NumberRange extends Serializable implements I_NumberRange{
    private _max: number;
    private _min: number;
    private _includesMax: boolean;
    private _includesMin: boolean;
    private _measureLength: number;
    private _isEmpty: boolean;
    protected constructor(range: [number, number], includesMin = true, includesMax = true) {
        super();
        this._max = Math.max(range[0], range[1]);
        this._min = Math.min(range[0], range[1]);
        this._includesMax = includesMax;
        this._includesMin = includesMin;
        this._measureLength = this._max - this._min;
        // emptiness for real intervals:
        // - min < max => non-empty
        // - min > max => (can't happen after min/max) but would be empty
        // - min === max => point only if both inclusive
        this._isEmpty =
            Number.isNaN( this._min ) || Number.isNaN( this._max ) ? true :
                this._min < this._max ? false :
                    this._min > this._max ? true :
                        ! ( this._includesMin && this._includesMax );
    }
    public get isNumberRange(): true {
        return true;
    }
    public get isEmpty(): boolean {
        return this._isEmpty;
    }
    public get measureLength(): number {
        return this._measureLength;
    }
    public get max(): number {
        return this._max;
    }
    public get min(): number {
        return this._min;
    }
    public get includesMax(): boolean {
        return this._includesMax;
    }
    public get includesMin(): boolean {
        return this._includesMin;
    }
    public override linearize(): unknown[] {
        const data = super.linearize();
        data.push( this._min, this._max, this._includesMin, this._includesMax, this._measureLength, this._isEmpty );
        return data;
    }
    public override delinearize( data: unknown[] ): number {
        let i = super.delinearize( data );
        this._min = data[i++] as number;
        this._max = data[i++] as number;
        this._includesMin = data[i++] as boolean;
        this._includesMax = data[i++] as boolean;
        this._measureLength = data[i++] as number;
        this._isEmpty = data[i++] as boolean;
        return i;
    }
    public equals( range: I_NumberRange ): boolean {
        return compareNumberRanges( this, range ) === 0;
    }
    public abstract includes( value: number ): boolean;
    public abstract copy(): I_NumberRange;
    public abstract invert(): I_NumberRange;
}
export class InclusiveNumberRange extends NumberRange {
    public constructor( range: [number, number] = [-1, 1] ) {
        super( range, true, true );
    }
    public override includes( value: number ): boolean {
        return ! Number.isNaN( value )  && value >= this.min && value <= this.max;
    }
    public override copy(): I_NumberRange {
        return new InclusiveNumberRange( [this.min, this.max] );
    }
    public override invert(): I_NumberRange {
        return new InclusiveNumberRange( [-this.max, -this.min] );
    }
}
export class ExclusiveNumberRange extends NumberRange {
    public constructor( range: [number, number] = [-1, 1] ) {
        super( range, false, false );
    }
    public override includes( value: number ): boolean {
        return ! Number.isNaN( value )  && value > this.min && value < this.max;
    }
    public override copy(): I_NumberRange {
        return new ExclusiveNumberRange( [this.min, this.max] );
    }
    public override invert(): I_NumberRange {
        return new ExclusiveNumberRange( [-this.max, -this.min] );
    }
}
export class MinInclusiveNumberRange extends NumberRange {
    public constructor( range: [number, number] = [-1, 1] ) {
        super( range, true, false );
    }
    public override includes( value: number ): boolean {
        return ! Number.isNaN( value )  && value >= this.min && value < this.max;
    }
    public override copy(): I_NumberRange {
        return new MinInclusiveNumberRange( [this.min, this.max] );
    }
    public override invert(): I_NumberRange {
        return new MaxInclusiveNumberRange( [-this.max, -this.min] );
    }
}
export class MaxInclusiveNumberRange extends NumberRange {
    public constructor( range: [number, number] = [-1, 1] ) {
        super( range, false, true );
    }
    public override includes( value: number ): boolean {
        return ! Number.isNaN( value )  && value > this.min && value <= this.max;
    }
    public override copy(): I_NumberRange {
        return new MaxInclusiveNumberRange( [this.min, this.max] );
    }
    public override invert(): I_NumberRange {
        return new MinInclusiveNumberRange( [-this.max, -this.min] );
    }
}
