/*
 * Version: 2
 * Date: 2025-12-27
 * */

export function isSerializable( candidate: unknown ): candidate is I_Serializable {
    return candidate != null && ( candidate as I_Serializable ).isSerializable
        && typeof ( candidate as any ).linearize === "function"
        && typeof ( candidate as any ).delinearize === "function";
}

export interface I_Serializable {

    readonly isSerializable: true;
    /**
     * @return The linearized properties.
     */
    linearize(): unknown[];

    /**
     *
     * @param data The linearized properties.
     * @return The next unread index (offset).
     */
    delinearize( data: unknown[] ): number;
}

export class Serializable implements I_Serializable {
    public get isSerializable(): true {
        return true;
    }
    public clone(): this {
        return Serializer.roundTrip( this );
    }
    public linearize(): unknown[] {
        return [];
    }
    public delinearize( data: unknown[] ): number {
        return 0;
    }
}

/**
 * Base class for serializable objects backed by a property bag.
 *
 * - Encapsulates all serialization logic.
 * - Subclasses interact exclusively via getters/setters.
 * - Default-constructible for serializer reconstruction.
 * - Properties are stored in a Record<string, unknown>.
 */
export class PropertyBagSerializable extends Serializable {
    private _properties: Map<string, unknown>;
    public constructor() {
        super();
        this._properties = new Map();
    }
    protected getProperty( key: string ): unknown {
        return this._properties.get( key );
    }
    protected initProperty( key: string, value: unknown ): void {
        if( this._properties.has( key ) ) throw new Error( "duplicate property '" + key + "'" );
        this._properties.set( key, value )
    }
    protected setProperty( key: string, value: unknown ): void {
        if( ! this._properties.has( key ) ) throw new Error( "undefined property '" + key + "'" );
        this._properties.set( key, value );
    }
    public override linearize(): unknown[] {
        return [this._properties];
    }
    public override delinearize( data: unknown[] ): number {
        this._properties = data[0] as Map<string, unknown>;
        return 1;
    }
}


type SerializerID = number;
type SerializerName = string;

type SerializerUndefined = "a";
type SerializerNull = "b";
type SerializerBoolean = "c";
type SerializerString = "d";
type SerializerNumber = "e";
type SerializerBigInt = "f";
type SerializerPI = "g";
type SerializerE = "h";
type SerializerNaN = "i";
type SerializerPositiveInfinity = "j";
type SerializerNegativeInfinity = "k";
type SerializerArray = "l";
type SerializerPrototypeObject = "m";
type SerializerClassInstance = "n";
type SerializerGlobalSymbol = "o";
type SerializerLocalSymbol = "p";
type SerializerSerializable = "q";

type SerializerUndefinedData = [SerializerID, SerializerUndefined];
type SerializerNullData = [SerializerID, SerializerNull];
type SerializerBooleanData = [SerializerID, SerializerBoolean, boolean];
type SerializerStringData = [SerializerID, SerializerString, string];
type SerializerNumberData = [SerializerID, SerializerNumber, number];
type SerializerBigIntData = [SerializerID, SerializerBigInt, string];
type SerializerPIData = [SerializerID, SerializerPI];
type SerializerEData = [SerializerID, SerializerE];
type SerializerNaNData = [SerializerID, SerializerNaN];
type SerializerPositiveInfinityData = [SerializerID, SerializerPositiveInfinity];
type SerializerNegativeInfinityData = [SerializerID, SerializerNegativeInfinity];
type SerializerArrayData = [SerializerID, SerializerArray, unknown[]];
type SerializerPrototypeObjectData = [SerializerID, SerializerPrototypeObject, {[p in number|string]: unknown}];
type SerializerClassInstanceData = [SerializerID, SerializerClassInstance, SerializerName, unknown];
type SerializerSerializableData = [SerializerID, SerializerSerializable, SerializerName, unknown];
type SerializerGlobalSymbolData = [SerializerID, SerializerGlobalSymbol, string];
type SerializerLocalSymbolData = [SerializerID, SerializerLocalSymbol, string|undefined];

type SerializerData =
    SerializerID |
    SerializerUndefinedData |
    SerializerNullData |
    SerializerBooleanData |
    SerializerStringData |
    SerializerNumberData |
    SerializerBigIntData |
    SerializerPIData |
    SerializerEData |
    SerializerNaNData |
    SerializerPositiveInfinityData |
    SerializerNegativeInfinityData |
    SerializerArrayData |
    SerializerPrototypeObjectData |
    SerializerClassInstanceData |
    SerializerSerializableData |
    SerializerGlobalSymbolData |
    SerializerLocalSymbolData

export class Serializer {

    private static readonly Undefined: SerializerUndefined = "a";
    private static readonly Null: SerializerNull = "b";
    private static readonly Boolean: SerializerBoolean = "c";
    private static readonly String: SerializerString = "d";
    private static readonly Number: SerializerNumber = "e";
    private static readonly BigInt: SerializerBigInt = "f";
    private static readonly PI: SerializerPI = "g";
    private static readonly E: SerializerE = "h";
    private static readonly NaN: SerializerNaN = "i";
    private static readonly PositiveInfinity: SerializerPositiveInfinity = "j";
    private static readonly NegativeInfinity: SerializerNegativeInfinity = "k";
    private static readonly Array: SerializerArray = "l";
    private static readonly PrototypeObject: SerializerPrototypeObject = "m";
    private static readonly ClassInstance: SerializerClassInstance = "n";
    private static readonly GlobalSymbol: SerializerGlobalSymbol = "o";
    private static readonly LocalSymbol: SerializerLocalSymbol = "p";
    private static readonly Serializable: SerializerSerializable = "q";

    private static incrementer: number | undefined;
    private static prepareCache: Map<any, number> | undefined;
    private static restoreCache: Map<number, any> | undefined;
    private static classes: Record<string, { encode: ( o: unknown ) => unknown; decode: ( d: unknown ) => unknown }> = {};

    public static addClass<CLASS extends object>( name: string, codec: { encode: (object: CLASS ) => unknown; decode: ( data: unknown ) => CLASS } ): void {
        Serializer.classes[name] = {
            encode: (o: unknown ) => codec.encode( o as CLASS ),
            decode: (d: unknown ) => codec.decode( d ),
        };
    }

    private static encode( object: object ): unknown {
        const codec = Serializer.classes[object.constructor.name];
        if( ! codec ) throw new Error( "unsupported class " + object.constructor.name );
        return codec.encode( object );
    }

    private static decode( className: string, data: unknown ): object {
        const codec = Serializer.classes[className];
        if( ! codec ) throw new Error( "unsupported class " + className );
        const obj = codec.decode( data );
        if( obj === null || typeof obj !== "object" ) throw new Error( "class codec did not return an object for " + className );
        return obj;
    }

    public static roundTrip<DATA>( data: DATA ): DATA {
        return Serializer.deserialize( Serializer.serialize( data ) ) as DATA;
    }

    // serialize

    public static serialize( data: unknown ): string {
        Serializer.incrementer = 0;
        Serializer.prepareCache = new Map();
        const serializerData = Serializer.prepare( data );
        Serializer.incrementer = undefined;
        Serializer.prepareCache = undefined;
        return JSON.stringify( serializerData );
    }

    private static prepare( data: unknown ): SerializerData {
        if( Serializer.prepareCache!.has( data ) ) return Serializer.prepareCache!.get( data )!;
        if( Object.is( data, undefined ) ) return Serializer.prepareUndefined();
        if( Object.is( data, null ) ) return Serializer.prepareNull();
        if( Object.is( data, Number.NaN ) ) return Serializer.prepareNaN();
        if( Object.is( data, Number.POSITIVE_INFINITY ) ) return Serializer.preparePositiveInfinity();
        if( Object.is( data, Number.NEGATIVE_INFINITY ) ) return Serializer.prepareNegativeInfinity();
        if( Object.is( data, Math.PI ) ) return Serializer.preparePI();
        if( Object.is( data, Math.E ) ) return Serializer.prepareE();
        if( Array.isArray( data ) ) return Serializer.prepareArray( data );
        if( typeof( data ) === "boolean" ) return Serializer.prepareBoolean( data );
        if( typeof( data ) === "bigint" ) return Serializer.prepareBigInt( data );
        if( typeof( data ) === "number" ) return Serializer.prepareNumber( data );
        if( typeof( data ) === "string" ) return Serializer.prepareString( data );
        if( typeof( data ) === "symbol") {
            const key = Symbol.keyFor( data );
            if( Object.is( key, undefined ) ) return Serializer.prepareLocalSymbol( data );
            else return Serializer.prepareGlobalSymbol( data );
        }
        if( typeof( data ) === "object" ) {
            const prototype = Object.getPrototypeOf( data );
            if( prototype === Object.prototype || prototype === null ) return Serializer.preparePrototypeObject( data as any );
            if( isSerializable( data ) ) return Serializer.prepareSerializable( data );
            return Serializer.prepareClassInstance( data! );
        }
        console.warn( "unable to prepare unsupported type " + typeof( data ), data );
        throw new Error( "unsupported type " + typeof( data ) );
    }

    private static prepareUndefined(): SerializerUndefinedData {
        const id = ++Serializer.incrementer!;
        Serializer.prepareCache!.set( undefined, id );
        const serializerData = [id, Serializer.Undefined];
        return serializerData as any;
    }

    private static prepareNull(): SerializerNullData {
        const id = ++Serializer.incrementer!;
        Serializer.prepareCache!.set( null, id );
        const serializerData = [id, Serializer.Null];
        return serializerData as any;
    }

    private static prepareBoolean( data: boolean ): SerializerBooleanData {
        const id = ++Serializer.incrementer!;
        Serializer.prepareCache!.set( data, id );
        const serializerData = [id, Serializer.Boolean, data];
        return serializerData as any;
    }

    private static prepareString( data: string ): SerializerStringData {
        const id = ++Serializer.incrementer!;
        Serializer.prepareCache!.set( data, id );
        const serializerData = [id, Serializer.String, data];
        return serializerData as any;
    }

    private static prepareNumber( data: number ): SerializerNumberData {
        const id = ++Serializer.incrementer!;
        Serializer.prepareCache!.set( data, id );
        const serializerData = [id, Serializer.Number, data];
        return serializerData as any;
    }

    private static prepareBigInt( data: bigint ): SerializerBigIntData {
        const id = ++Serializer.incrementer!;
        Serializer.prepareCache!.set( data, id );
        const serializerData = [id, Serializer.BigInt, data.toString()];
        return serializerData as any;
    }

    private static preparePI(): SerializerPIData {
        const id = ++Serializer.incrementer!;
        Serializer.prepareCache!.set( Math.PI, id );
        const serializerData = [id, Serializer.PI];
        return serializerData as any;
    }

    private static prepareE(): SerializerEData {
        const id = ++Serializer.incrementer!;
        Serializer.prepareCache!.set( Math.E, id );
        const serializerData = [id, Serializer.E];
        return serializerData as any;
    }

    private static prepareNaN(): SerializerNaNData {
        const id = ++Serializer.incrementer!;
        Serializer.prepareCache!.set( Number.NaN, id );
        const serializerData = [id, Serializer.NaN];
        return serializerData as any;
    }

    private static preparePositiveInfinity(): SerializerPositiveInfinityData {
        const id = ++Serializer.incrementer!;
        Serializer.prepareCache!.set( Number.POSITIVE_INFINITY, id );
        const serializerData = [id, Serializer.PositiveInfinity];
        return serializerData as any;
    }

    private static prepareNegativeInfinity(): SerializerNegativeInfinityData {
        const id = ++Serializer.incrementer!;
        Serializer.prepareCache!.set( Number.NEGATIVE_INFINITY, id );
        const serializerData = [id, Serializer.NegativeInfinity];
        return serializerData as any;
    }

    private static prepareArray( data: unknown[] ): SerializerArrayData {
        const id = ++Serializer.incrementer!;
        Serializer.prepareCache!.set( data, id );
        const serializerArray = [];
        for( let i = 0; i < data.length; i++ ) serializerArray.push( Serializer.prepare( data[i] ) );
        const serializerData = [id, Serializer.Array, serializerArray];
        return serializerData as any;
    }

    private static preparePrototypeObject( data: {[key in number|string]: unknown } ): SerializerPrototypeObjectData {
        const id = ++Serializer.incrementer!;
        Serializer.prepareCache!.set( data, id );
        const serializerProperties = {} as any;
        for( let p in data ) serializerProperties[p] = Serializer.prepare( data[p] );
        const serializerData = [id, Serializer.PrototypeObject, serializerProperties];
        return serializerData as any;
    }

    private static prepareClassInstance( data: object ): SerializerClassInstanceData {
        const id = ++Serializer.incrementer!;
        Serializer.prepareCache!.set( data, id );
        const serializerData = [id, Serializer.ClassInstance, data.constructor.name, Serializer.prepare( Serializer.encode( data ) )];
        return serializerData as any;
    }

    private static prepareSerializable( data: I_Serializable ): SerializerSerializableData {
        const id = ++Serializer.incrementer!;
        Serializer.prepareCache!.set( data, id );
        const serializerData = [id, Serializer.Serializable, data.constructor.name, Serializer.prepare( data.linearize() )];
        return serializerData as any;
    }

    private static prepareGlobalSymbol( data: symbol ): SerializerGlobalSymbolData {
        const id = ++Serializer.incrementer!;
        Serializer.prepareCache!.set( data, id );
        return [id, Serializer.GlobalSymbol, Symbol.keyFor( data )!];
    }

    private static prepareLocalSymbol( data: symbol ): SerializerLocalSymbolData {
        const id = ++Serializer.incrementer!;
        Serializer.prepareCache!.set( data, id );
        return [id, Serializer.LocalSymbol, ( data as symbol & { description?: string } ).description];
    }

    // deserialize

    public static deserialize( data: string ): unknown {
        const serializerData = JSON.parse( data );
        Serializer.restoreCache = new Map();
        const result = Serializer.restore( serializerData );
        Serializer.restoreCache = undefined;
        return result;
    }

    private static restore( data: any ): unknown {
        if( typeof( data ) === "number" ) {
            if( ! Serializer.restoreCache!.has( data ) ) throw new Error( "id " + data + " not found in restore cache" );
            return Serializer.restoreCache!.get( data );
        }
        if( ! Array.isArray( data ) ) throw new Error( "array expected but type " + typeof( data ) + " found" );
        const id = data[0];
        if( typeof( id ) !== "number" ) throw new Error( "illegal serializer id at array index 0" );
        switch( data[1] ) {
            case Serializer.Undefined: {
                Serializer.restoreCache!.set( id, undefined );
                return undefined;
            }
            case Serializer.Null: {
                Serializer.restoreCache!.set( id, null );
                return null;
            }
            case Serializer.PI: {
                Serializer.restoreCache!.set( id, Math.PI );
                return Math.PI;
            }
            case Serializer.E: {
                Serializer.restoreCache!.set( id, Math.E );
                return Math.E;
            }
            case Serializer.NaN: {
                Serializer.restoreCache!.set( id, Number.NaN );
                return Number.NaN;
            }
            case Serializer.PositiveInfinity: {
                Serializer.restoreCache!.set( id, Number.POSITIVE_INFINITY );
                return Number.POSITIVE_INFINITY;
            }
            case Serializer.NegativeInfinity: {
                Serializer.restoreCache!.set( id, Number.NEGATIVE_INFINITY );
                return Number.NEGATIVE_INFINITY;
            }
            case Serializer.Boolean: {
                const value = data[2];
                if( typeof( value ) !== "boolean" ) throw new Error( "boolean value expected at array index 2 but " + typeof( value ) + " found" );
                Serializer.restoreCache!.set( id, value );
                return value;
            }
            case Serializer.BigInt: {
                const raw = data[2];
                if( typeof raw !== "string" ) throw new Error( "string value expected at array index 2 for BigInt but " + typeof raw + " found" );
                const value = BigInt( raw );
                Serializer.restoreCache!.set( id, value );
                return value;
            }
            case Serializer.Number: {
                const value = data[2];
                if( typeof( value ) !== "number" ) throw new Error( "number value expected at array index 2 but " + typeof( value ) + " found" );
                Serializer.restoreCache!.set( id, value );
                return value;
            }
            case Serializer.String: {
                const value = data[2];
                if( typeof( value ) !== "string" ) throw new Error( "string value expected at array index 2 but " + typeof( value ) + " found" );
                Serializer.restoreCache!.set( id, value );
                return value;
            }
            case Serializer.Array: {
                const array = data[2];
                if( ! Array.isArray( array ) ) throw new Error( "array expected at array index 2 but " + typeof( array ) + " found" );
                Serializer.restoreCache!.set( id, array );
                for( let i = 0; i < array.length; i++ ) array[i] = Serializer.restore( array[i] );
                return array;
            }
            case Serializer.PrototypeObject: {
                const object = data[2];
                if( typeof( object ) !== "object" || object === null ) throw new Error( "prototype object expected at array index 2 but " + typeof( object ) + " found" );
                Serializer.restoreCache!.set( id, object );
                for( let p in object ) object[p] = Serializer.restore( object[p] );
                return object;
            }
            case Serializer.Serializable: {
                const className = data[2];
                if( typeof( className ) !== "string" ) throw new Error( "string class name expected at array index 2 but " + typeof( className ) + " found" );
                const ctor = ( globalThis as any )[className];
                if( ! ctor ) throw new Error( "unknown class '" + className + "'. Did you run linker?" );
                const serializable = new ctor();
                //const serializable = new ( eval( className ) )() as I_Serializable;
                Serializer.restoreCache!.set( id, serializable );
                const restoredData = Serializer.restore( data[3] );
                if( ! Array.isArray( restoredData ) ) throw new Error( "array expected at array index 3 but " + typeof( restoredData ) + " found" );
                serializable.delinearize( restoredData );
                return serializable;
            }
            case Serializer.ClassInstance: {
                const className = data[2];
                if( typeof( className ) !== "string" ) throw new Error( "string class name expected at array index 2 but " + typeof( className ) + " found" );
                const object = Serializer.decode( className, Serializer.restore( data[3] ) );
                Serializer.restoreCache!.set( id, object );
                return object;
            }
            case Serializer.GlobalSymbol: {
                const key = data[2];
                if( typeof( key ) !== "string" ) throw new Error( "string key expected at array index 2 but " + typeof( key ) + " found" );
                const symbol = Symbol.for( key );
                Serializer.restoreCache!.set( id, symbol );
                return symbol;
            }
            case Serializer.LocalSymbol: {
                const description = data[2];
                if( ! ( typeof description === "string" || typeof description === "undefined" ) ) throw new Error( "string|undefined description expected at array index 2 but " + typeof description + " found" );
                const symbol = Symbol( description );
                Serializer.restoreCache!.set( id, symbol );
                return symbol;
            }
            default: throw new Error( "unknown data code '" + data[1] + "' at array index 1" );
        }
    }
}


Serializer.addClass<Date>( Date.name, {
    encode: ( date: Date ): number => date.getTime(),
    decode: ( data: unknown ) => {
        if( typeof data === "number" ) return new Date( data );
        throw new Error( "number expected but " + typeof data + " found" );
    }
} );
Serializer.addClass<RegExp>( RegExp.name, {
    encode: ( regExp: RegExp ): string => regExp.source,
    decode: ( data: unknown ) => {
        if( typeof data === "string" ) return new RegExp( data );
        throw new Error( "string expected but " + typeof data + " found" );
    }
} );
Serializer.addClass<Map<unknown, unknown>>( Map.name, {
    encode: ( map: Map<unknown, unknown> ) => Array.from( map.entries() ),
    decode: (data: unknown) => {
        if( ! Array.isArray( data ) ) throw new Error( "array expected but " + typeof data + " found" );
        return new Map( data as [unknown, unknown][] );
    }
} );
Serializer.addClass<Set<unknown>>( Set.name, {
    encode: ( set: Set<unknown> ) => Array.from( set ),
    decode: ( data: unknown ) => {
        if( Array.isArray( data ) ) return new Set( data );
        throw new Error( "array expected but " + typeof data + " found" );
    }
} );
