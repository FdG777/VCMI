import {
    Serializable
} from "./Serializer.js";
import {
    AnyFunction
} from "./Type.js";

export abstract class TypeGuard<T> extends Serializable {
    public abstract accept( value: unknown ): value is T;
}

export class BooleanGuard extends TypeGuard<boolean> {
    public override accept( value: unknown ): value is boolean {
        return typeof value === "boolean";
    }
}


export class FunctionGuard extends TypeGuard<AnyFunction> {
    public override accept( value: unknown ): value is AnyFunction {
        return typeof value === "function";
    }
}

export class NumberGuard extends TypeGuard<number> {
    public override accept( value: unknown ): value is number {
        return typeof value === "number";
    }
}

export class ObjectGuard extends TypeGuard<object> {
    public override accept( value: unknown ): value is object {
        return typeof value === "object" && value !== null;
    }
}

export class StringGuard extends TypeGuard<string> {
    public override accept( value: unknown ): value is string {
        return typeof value === "string";
    }
}
