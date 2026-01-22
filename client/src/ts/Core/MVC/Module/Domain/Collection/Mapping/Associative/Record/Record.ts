import {
    I_AssociativeModelConfig, I_AssociativeModel, AssociativeModel,
    I_AssociativeControllerConfig, I_AssociativeController, AssociativeController,
    I_AssociativeViewConfig, I_AssociativeView, AssociativeView
} from '../Associative.js';
import {
    Domain, DomainElement
} from "../../../../../../../Domain.js";
import {
    AccessLevel, UserAccess
} from "../../../../../../../Interaction.js";


export function isRecordModel( candidate: unknown ): candidate is I_RecordModel {
    return candidate != null && ( candidate as I_RecordModel ).isRecordModel;
}
export interface I_RecordModelConfig<KEY_DOMAIN extends Domain<string>, DOMAIN extends Domain> extends I_AssociativeModelConfig<KEY_DOMAIN, DOMAIN> {
    state?: Record<DomainElement<KEY_DOMAIN>, DomainElement<DOMAIN>>;
}
export interface I_RecordModel<KEY_DOMAIN extends Domain<string> = Domain<string>, DOMAIN extends Domain = Domain> extends I_AssociativeModel<KEY_DOMAIN, DOMAIN> {
    readonly isRecordModel: true;
}
export class RecordModel<KEY_DOMAIN extends Domain<string>, DOMAIN extends Domain, CONFIG extends I_RecordModelConfig<KEY_DOMAIN, DOMAIN>> extends AssociativeModel<KEY_DOMAIN, DOMAIN, CONFIG> implements I_RecordModel<KEY_DOMAIN, DOMAIN> {
    public constructor( config: CONFIG ) {
        super( config );
    }
    public get isRecordModel(): true {
        return true;
    }
    protected get state(): Record<DomainElement<KEY_DOMAIN>, DomainElement<DOMAIN>> {
        return this.getProperty( "state" ) as Record<DomainElement<KEY_DOMAIN>, DomainElement<DOMAIN>>;
    }
    public get( key: DomainElement<KEY_DOMAIN> ): DomainElement<DOMAIN> | undefined {
        if( ! this.assertKey( key ) ) return undefined;
        return this.state[key];
    }
    public set( key: DomainElement<KEY_DOMAIN>, element: DomainElement<DOMAIN>, accessLevel: AccessLevel = UserAccess ): boolean {
        if( ! this.access( "set", accessLevel ) ) return false;
        if( ! this.assertKey( key ) ) return false;
        if( ! this.validateElement( element ) ) return false;
        const oldElement = this.state[key];
        this.state[key] = element;
        this.notifyUpdate( "replace", { new: [[key, element]], old: [[key, element]] } );
        return true;
    }
    public hasKey( key: DomainElement<KEY_DOMAIN> ): boolean {
        return Object.keys( this.state ).includes( key );
    }
    public elements(): DomainElement<DOMAIN>[] {
        const keys: DomainElement<KEY_DOMAIN>[] = Object.keys( this.state ) as any;
        const elements: DomainElement<DOMAIN>[] = [];
        keys.forEach( k => elements.push( this.state[k] ) );
        return elements;
    }
    public keys(): DomainElement<KEY_DOMAIN>[] {
        return Object.keys( this.state ) as DomainElement<KEY_DOMAIN>[];
    }
    public tuples(): [DomainElement<KEY_DOMAIN>, DomainElement<DOMAIN>][] {
        const keys = this.keys();
        const tuples: [DomainElement<KEY_DOMAIN>, DomainElement<DOMAIN>][] = [];
        keys.forEach( k => tuples.push( [k, this.state[k]] ) );
        return tuples;
    }
    protected override initProperties( config: CONFIG ): void {
        super.initProperties( config );
        this.initProperty( "state", config.state ?? {} );
    }
    public override createController(): I_RecordController<this> {
        return new RecordController( { model: this } );
    }
}

export function isRecordController( candidate: unknown ): candidate is I_RecordController<I_RecordModel> {
    return candidate != null && ( candidate as I_RecordController<I_RecordModel> ).isRecordController;
}
export interface I_RecordControllerConfig<MODEL extends I_RecordModel> extends I_AssociativeControllerConfig<MODEL> {
}
export interface I_RecordController<MODEL extends I_RecordModel> extends I_AssociativeController<MODEL> {
    readonly isRecordController: true;
}
export class RecordController<MODEL extends I_RecordModel, CONFIG extends I_RecordControllerConfig<MODEL>> extends AssociativeController<MODEL, CONFIG> implements I_RecordController<MODEL> {
    public constructor( config: CONFIG ) {
        super( config );
    }
    public get isRecordController(): true {
        return true;
    }
}

export function isRecordView( candidate: unknown ): candidate is I_RecordView<Node, I_RecordModel, I_RecordController<I_RecordModel>> {
    return candidate != null && ( candidate as I_RecordView<Node, I_RecordModel, I_RecordController<I_RecordModel>> ).isRecordView;
}
export interface I_RecordViewConfig<MODEL extends I_RecordModel, CONTROLLER extends I_RecordController<MODEL>> extends I_AssociativeViewConfig<MODEL, CONTROLLER> {
}
export interface I_RecordView<ROOT extends Node, MODEL extends I_RecordModel, CONTROLLER extends I_RecordController<MODEL>> extends I_AssociativeView<ROOT, MODEL, CONTROLLER> {
    readonly isRecordView: true;
}
export abstract class RecordView<ROOT extends Node, MODEL extends I_RecordModel, CONTROLLER extends I_RecordController<MODEL>, CONFIG extends I_RecordViewConfig<MODEL, CONTROLLER>> extends AssociativeView<ROOT, MODEL, CONTROLLER, CONFIG> implements I_RecordView<ROOT, MODEL, CONTROLLER> {
    protected constructor( config: CONFIG ) {
        super( config );
    }
    public get isRecordView(): true {
        return true;
    }
    protected abstract override createRoot(): ROOT;
}


