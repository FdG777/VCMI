import {Serializable} from "./Serializer.js";
import {I_BooleanExpression, boolAnd, boolDiff, boolOr, True} from "./Expression.js";
import {BooleanGuard, FunctionGuard, NumberGuard, ObjectGuard, StringGuard, TypeGuard} from "./TypeGuard.js";
import {AnyFunction} from "./Type.js";

export type DomainElement<DOMAIN> = DOMAIN extends Domain<infer ELEMENT> ? ELEMENT : never;

export function domainIntersection<E>( a: Domain<E>, b: Domain<E> ): Domain<E> {
    return a.spawn( boolAnd( a.expression, b.expression ) );
}
export function domainUnion<E>( a: Domain<E>, b: Domain<E> ): Domain<E> {
    return a.spawn( boolOr( a.expression, b.expression ) );
}
export function domainDifference<E>( a: Domain<E>, b: Domain<E> ): Domain<E> {
    return a.spawn( boolDiff( a.expression, b.expression ) );
}

export class Domain<ELEMENT = unknown> extends Serializable {
    private __expression: I_BooleanExpression<ELEMENT>;
    private __guard: TypeGuard<ELEMENT>;
    public constructor( guard: TypeGuard<ELEMENT>, expression?: I_BooleanExpression<ELEMENT> ) {
        super();
        this.__expression = expression ?? new True();
        this.__guard = guard;
    }
    public get expression(): I_BooleanExpression<ELEMENT> {
        return this.__expression;
    }
    public get guard(): TypeGuard<ELEMENT> {
        return this.__guard;
    }
    public accept( element: ELEMENT ): boolean {
        return this.expression.evaluate( element );
    }
    public override linearize(): unknown[] {
        const data = super.linearize();
        data.push( this.__guard );
        data.push( this.__expression );
        return data;
    }
    public override delinearize( data: unknown[] ): number {
        let i = super.delinearize( data );
        this.__guard = data[i++] as TypeGuard<ELEMENT>;
        this.__expression = data[i++] as I_BooleanExpression<ELEMENT>;
        return i;
    }
    public spawn( expression: I_BooleanExpression<ELEMENT> ): Domain<ELEMENT> {
        return new Domain<ELEMENT>( this.__guard, expression );
    }
}

export class BooleanDomain extends Domain<boolean> {
    public constructor( expression?: I_BooleanExpression<boolean> ) {
        super( new BooleanGuard(), expression );
    }
    public override spawn( expression: I_BooleanExpression<boolean> ): BooleanDomain {
        return new BooleanDomain( expression );
    }
}
export class FunctionDomain extends Domain<AnyFunction> {
    public constructor( expression?: I_BooleanExpression<AnyFunction> ) {
        super( new FunctionGuard(), expression );
    }
    public override spawn( expression: I_BooleanExpression<Function> ): FunctionDomain {
        return new FunctionDomain( expression );
    }
}
export class NumberDomain extends Domain<number> {
    public constructor( expression?: I_BooleanExpression<number> ) {
        super( new NumberGuard(), expression );
    }
    public override spawn( expression: I_BooleanExpression<number> ): NumberDomain {
        return new NumberDomain( expression );
    }
}
export class ObjectDomain extends Domain<object> {
    public constructor( expression?: I_BooleanExpression<object> ) {
        super( new ObjectGuard(), expression );
    }
    public override spawn( expression: I_BooleanExpression<object> ): ObjectDomain {
        return new ObjectDomain( expression );
    }
}
export class StringDomain extends Domain<string> {
    public constructor( expression?: I_BooleanExpression<string> ) {
        super( new StringGuard(), expression );
    }
    public override spawn( expression: I_BooleanExpression<string> ): StringDomain {
        return new StringDomain( expression );
    }
}
