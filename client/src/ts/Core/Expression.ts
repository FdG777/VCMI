import {I_Serializable, Serializable} from "./Serializer.js";
import {isDiscrete, isNearlyDiscrete} from "./Math.js";

export function boolNot<CTX>(e: I_BooleanExpression<CTX>): I_BooleanExpression<CTX> {
    if( e instanceof True ) return new False<CTX>();
    if( e instanceof False ) return new True<CTX>();
    const c = e.complement();
    if( c ) return c as I_BooleanExpression<CTX>;
    return new BooleanNot<CTX>( e );
}
export function boolAnd<CTX>( ...expressions: I_BooleanExpression<CTX>[] ): I_BooleanExpression<CTX> {
    const items: I_BooleanExpression<CTX>[] = [];
    for( const e of expressions ) {
        if( e instanceof False ) return new False<CTX>(); // False ∧ X = False
        if( e instanceof True ) continue;                 // True ∧ X = X
        if( e instanceof BooleanAnd ) items.push( ...( e.operands as I_BooleanExpression<CTX>[] ) ); // flatten
        else items.push( e );
    }
    if( items.length === 0 ) return new True<CTX>(); // ∧ over empty = True
    if( items.length === 1 ) return items[0];
    return new BooleanAnd<CTX>( items );
}
export function boolOr<CTX>( ...expressions: I_BooleanExpression<CTX>[] ): I_BooleanExpression<CTX> {
    const items: I_BooleanExpression<CTX>[] = [];
    for( const e of expressions ) {
        if( e instanceof True ) return new True<CTX>(); // True ∨ X = True
        if( e instanceof False ) continue;              // False ∨ X = X
        if( e instanceof BooleanOr ) items.push( ...( e.operands as I_BooleanExpression<CTX>[] ) ); // flatten
        else items.push(e);
    }
    if( items.length === 0 ) return new False<CTX>();   // ∨ over empty = False
    if( items.length === 1 ) return items[0];

    return new BooleanOr<CTX>(items);
}
export function boolDiff<CTX>( a: I_BooleanExpression<CTX>, b: I_BooleanExpression<CTX> ): I_BooleanExpression<CTX> {
    return boolAnd(a, boolNot(b));
}
export function boolImplies<CTX>( a: I_BooleanExpression<CTX>, b: I_BooleanExpression<CTX> ): I_BooleanExpression<CTX> {
    return boolOr( boolNot( a ), b );
}

export interface I_Expression<T, CTX> extends I_Serializable {
    complement(): I_Expression<T, CTX> | undefined;
    evaluate( context: CTX ): T;
    stringify( context: CTX ): string;
}
export abstract class Expression<T, CTX> extends Serializable implements I_Expression<T, CTX> {
    public complement(): I_Expression<T, CTX> | undefined {
        return undefined;
    }
    public abstract evaluate( context: CTX ): T;
    public abstract stringify( context: CTX ): string;
}
export abstract class Operation<T, CTX> extends Expression<T, CTX> implements I_Expression<T, CTX> {
    private __operands: readonly I_Expression<T, CTX>[] = [];
    public constructor( operands: readonly I_Expression<T, CTX>[] ) {
        super();
        if( operands ) this.__operands = operands.slice();
        Object.freeze( this.__operands );
    }
    public get operands(): readonly I_Expression<T, CTX>[] {
        return this.__operands;
    }
    public override linearize(): unknown[] {
        const data = super.linearize();
        data.push( this.__operands );
        return data;
    }
    public override delinearize( data: unknown[] ): number {
        let i = super.delinearize( data );
        this.__operands = ( data[i++] as I_Expression<T, CTX>[] ).slice();
        Object.freeze( this.__operands );
        return i;
    }
}

export interface I_BooleanExpression<CTX> extends I_Expression<boolean, CTX> {
}
export abstract class BooleanExpression<CTX> extends Expression<boolean, CTX> implements I_BooleanExpression<CTX> {
}
export class False<CTX> extends BooleanExpression<CTX> {
    public static symbol = "FALSE";
    public override evaluate( context: CTX ): boolean {
        return false;
    }
    public stringify( context: CTX ): string {
        return False.symbol;
    }
}
export class True<CTX> extends BooleanExpression<CTX> {
    public static symbol = "TRUE";
    public override evaluate( context: CTX ): boolean {
        return true;
    }
    public stringify( context: CTX ): string {
        return True.symbol;
    }
}
export abstract class BooleanOperation<CTX> extends Operation<boolean, CTX> implements I_BooleanExpression<CTX> {
}
export class BooleanNot<CTX> extends BooleanOperation<CTX> {
    public static symbol = "NOT";
    public constructor( expression: I_BooleanExpression<CTX> ) {
        super( [expression] );
    }
    public override complement(): I_Expression<boolean, CTX> {
        return this.operands[0]; // ¬(¬x) = x
    }
    public evaluate( context: CTX ): boolean {
        return ! this.operands[0].evaluate( context );
    }
    public stringify( context: CTX ): string {
        return BooleanNot.symbol + "( " + this.operands[0].stringify( context ) + " )";
    }
}
export class BooleanAnd<CTX> extends BooleanOperation<CTX> {
    public static symbol = "AND";
    public override complement(): I_Expression<boolean, CTX> {
        // ¬(a ∧ b ∧ ...) = (¬a ∨ ¬b ∨ ...)
        const neg = this.operands.map( op => boolNot( op as I_BooleanExpression<CTX> ) );
        return new BooleanOr<CTX>( neg );
    }
    public evaluate( context: CTX  ): boolean {
        for( let i = 0; i < this.operands.length; i++ ) if( ! this.operands[i].evaluate( context ) ) return false;
        return true;
    }
    public stringify( context: CTX ): string {
        const substrings = [];
        for( let i = 0; i < this.operands.length; i++ ) {
            const operand = this.operands[i];
            const substring = operand.stringify( context );
            substrings.push( operand instanceof BooleanOr ? "( " + substring + " )" : substring );
        }
        return substrings.join( " " + BooleanAnd.symbol + " " );
    }
}
export class BooleanOr<CTX> extends BooleanOperation<CTX> {
    public static symbol = "OR";
    public override complement(): I_Expression<boolean, CTX> {
        // ¬(a ∨ b ∨ ...) = (¬a ∧ ¬b ∧ ...)
        const neg = this.operands.map( op => boolNot( op as I_BooleanExpression<CTX> ) );
        return new BooleanAnd<CTX>( neg );
    }
    public evaluate( context: CTX  ): boolean {
        for( let i = 0; i < this.operands.length; i++ ) if( this.operands[i].evaluate( context ) ) return true;
        return false;
    }
    public stringify( context: CTX ): string {
        const substrings = [];
        for( let i = 0; i < this.operands.length; i++ ) {
            substrings.push( this.operands[i].stringify( context ) );
        }
        return substrings.join( " " + BooleanOr.symbol + " " );
    }
}
export abstract class Predicate<CTX> extends BooleanExpression<CTX> {
    public abstract override evaluate( context: CTX ): boolean;
}
export abstract class NumberPredicate extends Predicate<number> {
    public abstract override evaluate( context: number ): boolean;
    public override stringify( context: number ): string {
        return this.constructor.name + "( " + String( context ) + " )";
    }
}
export class IsInteger extends NumberPredicate {
    public override complement(): I_Expression<boolean, number> {
        return new IsNonInteger();
    }
    public override evaluate( x: number ): boolean {
        return Number.isInteger( x ); // NaN/±Inf => false
    }
}
export class IsNonInteger extends NumberPredicate {
    public override complement(): I_Expression<boolean, number> {
        return new IsInteger();
    }
    public override evaluate( x: number ): boolean {
        if( Number.isNaN( x ) ) return false;
        return ! Number.isInteger(x); // ±Inf => true
    }
}
export class IsSafeInteger extends NumberPredicate {
    public override complement(): I_Expression<boolean, number> {
        return new IsNonSafeInteger();
    }
    public override evaluate( x: number ): boolean {
        return Number.isSafeInteger( x ); // NaN/±Inf => false
    }
}
export class IsNonSafeInteger extends NumberPredicate {
    public override complement(): I_Expression<boolean, number> {
        return new IsSafeInteger();
    }
    public override evaluate(x: number): boolean {
        if( Number.isNaN( x ) ) return false;
        return ! Number.isSafeInteger( x ); // ±Inf => true
    }
}
export abstract class NumberPredicate1 extends NumberPredicate {
    private __operand1: number;
    public constructor( operand: number ) {
        super();
        this.__operand1 = operand;
    }
    public get operand1(): number {
        return this.__operand1;
    }
    public override linearize(): unknown[] {
        return [...super.linearize(), this.__operand1];
    }
    public override delinearize( data: unknown[] ): number {
        let i = super.delinearize( data );
        this.__operand1 = data[i++] as number;
        return i;
    }
    public override stringify( context: number ): string {
        return this.constructor.name + "( " + String( context ) + ", " + String( this.operand1 ) + " )";
    }
}
export class IsEqual extends NumberPredicate1 {
    public static symbol = "=";
    public override complement(): I_Expression<boolean, number> {
        return new IsNotEqual( this.operand1 );
    }
    public override evaluate(x: number): boolean {
        const c = this.operand1;
        if( Number.isNaN( c ) ) return Number.isNaN( x );
        if( Number.isNaN( x ) ) return false;
        return x === c;
    }
    public override stringify( context: number ): string {
        return String( context ) + " " + IsEqual.symbol + " " + String( this.operand1 );
    }
}
export class IsNotEqual extends NumberPredicate1 {
    public static symbol = "!=";
    public override complement(): I_Expression<boolean, number> {
        return new IsEqual( this.operand1 );
    }
    public override evaluate( x: number ): boolean {
        const c = this.operand1;
        if( Number.isNaN( c ) ) return ! Number.isNaN( x );
        if( Number.isNaN( x ) ) return false;
        return x !== c;
    }
    public override stringify( context: number ): string {
        return String( context ) + " " + IsNotEqual.symbol + " " + String( this.operand1 );
    }
}
export class IsLess extends NumberPredicate1 {
    public static symbol = "<";
    public override complement(): I_Expression<boolean, number> {
        return new IsGreaterOrEqual( this.operand1 );
    }
    public override evaluate( x: number ): boolean {
        if( isNaN( this.operand1 ) ) return false;
        return x < this.operand1;
    }
    public override stringify( context: number ): string {
        return String( context ) + " " + IsLess.symbol + " " + String( this.operand1 );
    }
}
export class IsLessOrEqual extends NumberPredicate1 {
    public static symbol = "<=";
    public override complement(): I_Expression<boolean, number> {
        return new IsGreater( this.operand1 );
    }
    public override evaluate( x: number ): boolean {
        if( isNaN( this.operand1 ) ) return false;
        return x <= this.operand1;
    }
    public override stringify( context: number ): string {
        return String( context ) + " " + IsLessOrEqual.symbol + " " + String( this.operand1 );
    }
}
export class IsGreater extends NumberPredicate1 {
    public static symbol = ">";
    public override complement(): I_Expression<boolean, number> {
        return new IsLessOrEqual( this.operand1 );
    }
    public override evaluate( x: number ): boolean {
        if( isNaN( this.operand1 ) ) return false;
        return x > this.operand1;
    }
    public override stringify( context: number ): string {
        return String( context ) + " " + IsGreater.symbol + " " + String( this.operand1 );
    }
}
export class IsGreaterOrEqual extends NumberPredicate1 {
    public static symbol = ">=";
    public override complement(): I_Expression<boolean, number> {
        return new IsLess( this.operand1 );
    }
    public override evaluate( x: number ): boolean {
        if( isNaN( this.operand1 ) ) return false;
        return x >= this.operand1;
    }
    public override stringify( context: number ): string {
        return String( context ) + " " + IsGreaterOrEqual.symbol + " " + String( this.operand1 );
    }
}
export class IsMultiple extends NumberPredicate1 {
    public override complement(): I_Expression<boolean, number> {
        return new IsNoMultiple( this.operand1 );
    }
    public override evaluate(x: number): boolean {
        const n = this.operand1;
        if( ! Number.isFinite( n ) || n === 0 ) return false;
        if( ! Number.isFinite( x ) ) return false;
        return Number.isInteger( x / n );
    }
}
export class IsNoMultiple extends NumberPredicate1 {
    public override complement(): I_Expression<boolean, number> {
        return new IsMultiple( this.operand1 );
    }
    public override evaluate(x: number): boolean {
        const n = this.operand1;
        if( ! Number.isFinite( n ) || n === 0 ) return false;
        if( ! Number.isFinite( x ) ) return false;
        return ! Number.isInteger( x / n );
    }
}
export class IsDivisor extends NumberPredicate1 {
    public override complement(): I_Expression<boolean, number> {
        return new IsNoDivisor( this.operand1 );
    }
    public override evaluate(x: number): boolean {
        const n = this.operand1;
        if( ! Number.isFinite( n ) ) return false;
        if( ! Number.isFinite( x ) || x === 0 ) return false;
        return Number.isInteger( n / x );
    }
}
export class IsNoDivisor extends NumberPredicate1 {
    public override complement(): I_Expression<boolean, number> {
        return new IsDivisor( this.operand1 );
    }
    public override evaluate(x: number): boolean {
        const n = this.operand1;
        if( ! Number.isFinite( n ) ) return false;
        if( ! Number.isFinite( x ) || x === 0 ) return false;
        return ! Number.isInteger( n / x );
    }
}
export class IsDiscrete extends NumberPredicate1 {
    public constructor( quantum: number ) {
        super( quantum );
    }
    public get quantum(): number {
        return this.operand1;
    }
    override complement(): I_Expression<boolean, number> {
        return new IsNotDiscrete( this.operand1 );
    }
    public override evaluate( context: number ): boolean {
        return isDiscrete( context, this.operand1 );
    }
}
export class IsNotDiscrete extends NumberPredicate1 {
    public constructor( quantum: number ) {
        super( quantum );
    }
    public get quantum(): number {
        return this.operand1;
    }
    override complement(): I_Expression<boolean, number> {
        return new IsDiscrete( this.operand1 );
    }
    public override evaluate( context: number ): boolean {
        return ! isDiscrete( context, this.operand1 );
    }
}
export abstract class NumberPredicate2 extends NumberPredicate1 {
    private __operand2: number;
    protected constructor( operand1: number, operand2: number ) {
        super( operand1 );
        this.__operand2 = operand2;
    }
    public get operand2(): number {
        return this.__operand2;
    }
    public override linearize(): unknown[] {
        return [...super.linearize(), this.__operand2];
    }
    public override delinearize( data: unknown[] ): number {
        let i = super.delinearize( data );
        this.__operand2 = data[i++] as number;
        return i;
    }
    public override stringify( context: number ): string {
        return this.constructor.name + "( " + String( context ) + ", " + String( this.operand1 ) + ", " + String( this.operand2 ) + " )";
    }
}
export class IsNearlyDiscrete extends NumberPredicate2 {
    public constructor( quantum: number, tolerance: number ) {
        super( quantum, tolerance );
    }
    public get quantum(): number {
        return this.operand1;
    }
    public get tolerance(): number {
        return this.operand2;
    }
    override complement(): I_Expression<boolean, number> {
        return new IsNotNearlyDiscrete( this.operand1, this.operand2 );
    }
    public override evaluate( context: number ): boolean {
        return isNearlyDiscrete( context, this.operand1, this.operand2 );
    }
}
export class IsNotNearlyDiscrete extends NumberPredicate2 {
    public constructor( quantum: number, tolerance: number ) {
        super( quantum, tolerance );
    }
    public get quantum(): number {
        return this.operand1;
    }
    public get tolerance(): number {
        return this.operand2;
    }
    override complement(): I_Expression<boolean, number> {
        return new IsNearlyDiscrete( this.operand1, this.operand2 );
    }
    public override evaluate( context: number ): boolean {
        return ! isNearlyDiscrete( context, this.operand1, this.operand2 );
    }
}
export abstract class NumberIntervalPredicate extends NumberPredicate2 {
    private __minInclusive: boolean;
    private __maxInclusive: boolean;
    protected constructor( min: number, max: number, minInclusive: boolean, maxInclusive: boolean ) {
        super( Math.min( min, max ), Math.max( min, max ) );
        this.__minInclusive = minInclusive;
        this.__maxInclusive = maxInclusive;
    }
    public get isEmpty(): boolean {
        if( this.min < this.max ) return false;
        if( this.min > this.max ) return true;
        return ! ( this.minInclusive && this.maxInclusive );
    }
    public get min(): number {
        return this.operand1;
    }
    public get max(): number {
        return this.operand2;
    }
    public get minInclusive(): boolean {
        return this.__minInclusive;
    }
    public get maxInclusive(): boolean {
        return this.__maxInclusive;
    }
    public override linearize(): unknown[] {
        return [...super.linearize(), this.__minInclusive, this.__maxInclusive];
    }
    public override delinearize( data: unknown[] ): number {
        let i = super.delinearize( data );
        this.__minInclusive = data[i++] as boolean;
        this.__maxInclusive = data[i++] as boolean;
        return i;
    }
}
export class IsInInterval extends NumberIntervalPredicate {
    public constructor( min: number, max: number, minInclusive: boolean = true, maxInclusive: boolean = true ) {
        super( min, max, minInclusive, maxInclusive );
    }
    public override complement(): I_Expression<boolean, number> | undefined {
        return new IsOutOfInterval( this.min, this.max, this.minInclusive, this.maxInclusive );
    }

    public override evaluate(x: number): boolean {
        if( Number.isNaN( x ) ) return false;
        if( this.isEmpty ) return false;
        const left  = this.minInclusive ? x >= this.min : x > this.min;
        const right = this.maxInclusive ? x <= this.max : x < this.max;
        return left && right;
    }
}
export class IsOutOfInterval extends NumberIntervalPredicate {
    private __complement: IsInInterval;
    public constructor( min: number, max: number, minInclusive: boolean = true, maxInclusive: boolean = true ) {
        super( min, max, minInclusive, maxInclusive );
        this.__complement = new IsInInterval( this.min, this.max, this.minInclusive, this.maxInclusive );
    }
    public override complement(): I_Expression<boolean, number> | undefined {
        return this.__complement;
    }
    public override delinearize( data: unknown[] ): number {
        let i = super.delinearize( data );
        this.__complement = new IsInInterval( this.min, this.max, this.minInclusive, this.maxInclusive );
        return i;
    }
    public override evaluate(x: number): boolean {
        if( Number.isNaN( x ) ) return false;
        return ! this.__complement.evaluate( x );
    }
}
