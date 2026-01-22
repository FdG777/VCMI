import {
    I_IndexedController,
    I_IndexedControllerConfig,
    I_IndexedModel,
    I_IndexedModelConfig,
    I_IndexedView,
    I_IndexedViewConfig,
    IndexedController,
    IndexedModel,
    IndexedView
} from '../Indexed.js';
import {Domain, DomainElement} from "../../../../../../../Domain.js";
import {AccessLevel, UserAccess} from "../../../../../../../Interaction.js";

export function isArrayModel( candidate: unknown ): candidate is I_ArrayModel {
    return candidate != null && ( candidate as I_ArrayModel ).isArrayModel;
}
export interface I_ArrayModelConfig<DOMAIN extends Domain> extends I_IndexedModelConfig<DOMAIN> {
    state?: DomainElement<DOMAIN>[];
}
export interface I_ArrayModel<DOMAIN extends Domain = Domain> extends I_IndexedModel<number, DOMAIN> {
    readonly isArrayModel: true;
    readonly length: number;
    tuples(): [number, DomainElement<DOMAIN>][];
    append( element: DomainElement<DOMAIN>, accessLevel?: AccessLevel ): boolean;
    empty( accessLevel?: AccessLevel ): boolean;
    insert( index: number, element: DomainElement<DOMAIN>, accessLevel?: AccessLevel ): boolean;
    remove( element: DomainElement<DOMAIN>, accessLevel?: AccessLevel ): boolean;
    removeIndex( index: number, accessLevel?: AccessLevel ): boolean;
    replace( newElement: DomainElement<DOMAIN>, oldElement: DomainElement<DOMAIN>, accessLevel?: AccessLevel ): boolean;
}
export class ArrayModel<DOMAIN extends Domain, CONFIG extends I_ArrayModelConfig<DOMAIN>> extends IndexedModel<number, DOMAIN, CONFIG> implements I_ArrayModel<DOMAIN> {
    public get isArrayModel(): true {
        return true;
    }
    protected get state(): DomainElement<DOMAIN>[] {
        return this.getProperty( "state" ) as DomainElement<DOMAIN>[];
    }
    public get length(): number {
        return this.state.length;
    }
    public get( index: number ): DomainElement<DOMAIN> | undefined {
        if( ! this.assertKey( index ) ) return undefined;
        return this.state[index];
    }
    public hasKey( key: number ): boolean {
        return key >= 0 && key < this.length && Number.isInteger( key );
    }
    public elements(): DomainElement<DOMAIN>[] {
        return this.state.slice();
    }
    public keys(): number[] {
        const keys = [];
        for( let i = 0; i < this.length; i++ ) keys.push( i );
        return keys;
    }
    public tuples(): [number, DomainElement<DOMAIN>][] {
        const tuples: [number, DomainElement<DOMAIN>][] = [];
        for( let i = 0; i < this.length; i++ ) tuples.push( [i, this.state[i]] );
        return tuples;
    }
    public override toString(): string {
        return JSON.stringify( this.state );
    }
    protected override initProperties( config: CONFIG ): void {
        super.initProperties( config );
        this.initProperty( "state", config.state ?? [] );
    }
    public override createController(): I_ArrayController<this> {
        return new ArrayController( { model: this } );
    }
    public append( element: DomainElement<DOMAIN>, accessLevel: AccessLevel = UserAccess ): boolean {
        if( ! this.access( "append", accessLevel ) ) return false;
        if( ! this.validateElement( element ) ) return false;
        this.state.push( element );
        this.notifyUpdate( "insert", { new: [[this.length - 1, element]] } );
        return true;
    }
    public empty( accessLevel: AccessLevel = UserAccess ): boolean {
        if( ! this.access( "empty", accessLevel ) ) return false;
        if( this.length === 0 ) return true;
        const tuples = this.tuples();
        this.state.length = 0;
        this.notifyUpdate( "remove", { old: tuples } );
        return true;
    }
    public insert( index: number, element: DomainElement<DOMAIN>, accessLevel: UserAccess ): boolean {
        if( ! this.access( "insert", accessLevel ) ) return false;
        if( index !== this.length || ! this.assertKey( index ) ) return false;
        if( ! this.validateElement( element ) ) return false;
        this.state.splice( index, 0, element );
        this.notifyUpdate( "insert", { new: [[index, element]] } );
        return true;
    }
    public remove( element: DomainElement<DOMAIN>, accessLevel: AccessLevel = UserAccess ): boolean {
        if( ! this.access( "remove", accessLevel ) ) return false;
        let tuples: [number, DomainElement<DOMAIN>] []= [];
        for( let i = this.length - 1; i >= 0; i-- ) {
            if( Object.is( element, this.state[i] ) ) {
                tuples.push( [i, element] );
                this.state.splice( i, 1 );
            }
        }
        if( tuples.length > 0 ) {
            if( tuples.length > 1 ) tuples = tuples.reverse();
            this.notifyUpdate( "remove", { old: tuples } );
        }
        return true;
    }
    public removeIndex( index: number, accessLevel: AccessLevel = UserAccess ): boolean {
        if( ! this.access( "removeIndex", accessLevel ) ) return false;
        if( ! this.assertKey( index ) ) return false;
        const element = this.state[index];
        this.state.splice( index, 1 );
        this.notifyUpdate( "remove", { old: [[index, element]] } );
        return true;
    }
    public replace( newElement: DomainElement<DOMAIN>, oldElement: DomainElement<DOMAIN>, accessLevel: AccessLevel = UserAccess ): boolean {
        if( ! this.access( "replace", accessLevel ) ) return false;
        let newTuples: [number, DomainElement<DOMAIN>] []= [];
        let oldTuples: [number, DomainElement<DOMAIN>] []= [];
        for( let i = this.length - 1; i >= 0; i-- ) {
            if( Object.is( oldElement, this.state[i] ) ) {
                newTuples.push( [i, newElement] );
                oldTuples.push( [i, oldElement] );
                this.state.splice( i, 1, newElement );
            }
        }
        if( newTuples.length > 0 ) {
            if( newTuples.length > 1 ) {
                newTuples = newTuples.reverse();
                oldTuples = oldTuples.reverse();
            }
            this.notifyUpdate( "replace", { new: newTuples, old: oldTuples } );
        }
        return true;
    }
    public set( index: number, element: DomainElement<DOMAIN>, accessLevel: AccessLevel = UserAccess ): boolean {
        if( ! this.access( "set", accessLevel ) ) return false;
        if( ! this.assertKey( index ) ) return false;
        if( ! this.validateElement( element ) ) return false;
        const oldElement = this.state[index];
        this.state[index] = element;
        this.notifyUpdate( "replace", { new: [[index, element]], old: [[index, element]] } );
        return true;
    }
}

export interface I_BooleanArrayModel extends I_ArrayModel<Domain<boolean>> {}
export class BooleanArrayModel extends ArrayModel<Domain<boolean>, I_ArrayModelConfig<Domain<boolean>>> implements I_BooleanArrayModel {}
export interface I_NumberArrayModel extends I_ArrayModel<Domain<number>> {}
export class NumberArrayModel extends ArrayModel<Domain<number>, I_ArrayModelConfig<Domain<number>>> implements I_NumberArrayModel {}
export interface I_StringArrayModel extends I_ArrayModel<Domain<string>> {}
export class StringArrayModel extends ArrayModel<Domain<string>, I_ArrayModelConfig<Domain<string>>> implements I_StringArrayModel {}


export function isArrayController( candidate: unknown ): candidate is I_ArrayController<I_ArrayModel> {
    return candidate != null && ( candidate as I_ArrayController<I_ArrayModel> ).isArrayController;
}
export interface I_ArrayControllerConfig<MODEL extends I_ArrayModel> extends I_IndexedControllerConfig<MODEL> {
}
export interface I_ArrayController<MODEL extends I_ArrayModel> extends I_IndexedController<MODEL> {
    readonly isArrayController: true;
}
export class ArrayController<MODEL extends I_ArrayModel, CONFIG extends I_ArrayControllerConfig<MODEL>> extends IndexedController<MODEL, CONFIG> implements I_ArrayController<MODEL> {
    public constructor( config: CONFIG ) {
        super( config );
    }
    public get isArrayController(): true {
        return true;
    }
}

export function isArrayView( candidate: unknown ): candidate is I_ArrayView<Node, I_ArrayModel, I_ArrayController<I_ArrayModel>> {
    return candidate != null && ( candidate as I_ArrayView<Node, I_ArrayModel, I_ArrayController<I_ArrayModel>> ).isArrayView;
}
export interface I_ArrayViewConfig<MODEL extends I_ArrayModel, CONTROLLER extends I_ArrayController<MODEL>> extends I_IndexedViewConfig<MODEL, CONTROLLER> {
}
export interface I_ArrayView<ROOT extends Node, MODEL extends I_ArrayModel, CONTROLLER extends I_ArrayController<MODEL>> extends I_IndexedView<ROOT, MODEL, CONTROLLER> {
    readonly isArrayView: true;
}
export abstract class ArrayView<ROOT extends Node, MODEL extends I_ArrayModel, CONTROLLER extends I_ArrayController<MODEL>, CONFIG extends I_ArrayViewConfig<MODEL, CONTROLLER>> extends IndexedView<ROOT, MODEL, CONTROLLER, CONFIG> implements I_ArrayView<ROOT, MODEL, CONTROLLER> {
    protected constructor( config: CONFIG ) {
        super( config );
    }
    public get isArrayView(): true {
        return true;
    }
    protected abstract override createRoot(): ROOT;
}
