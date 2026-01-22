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


export function isMapModel( candidate: unknown ): candidate is I_MapModel {
    return candidate != null && ( candidate as I_MapModel ).isMapModel;
}
export interface I_MapModelConfig<KEY_DOMAIN extends Domain, DOMAIN extends Domain> extends I_AssociativeModelConfig<KEY_DOMAIN, DOMAIN> {
    state?: Map<DomainElement<KEY_DOMAIN>, DomainElement<DOMAIN>>;
}
export interface I_MapModel<KEY_DOMAIN extends Domain = Domain, DOMAIN extends Domain = Domain> extends I_AssociativeModel<KEY_DOMAIN, DOMAIN> {
    readonly isMapModel: true;
    readonly size: number;
}
export class MapModel<KEY_DOMAIN extends Domain, DOMAIN extends Domain, CONFIG extends I_MapModelConfig<KEY_DOMAIN, DOMAIN>> extends AssociativeModel<KEY_DOMAIN, DOMAIN, CONFIG> implements I_MapModel<KEY_DOMAIN, DOMAIN> {
    public constructor( config: CONFIG ) {
        super( config );
    }
    public get isMapModel(): true {
        return true;
    }
    protected get state(): Map<DomainElement<KEY_DOMAIN>, DomainElement<DOMAIN>> {
        return this.getProperty( "state" ) as Map<DomainElement<KEY_DOMAIN>, DomainElement<DOMAIN>>;
    }
    public get size(): number {
        return this.state.size;
    }
    public get( key: DomainElement<KEY_DOMAIN> ): DomainElement<DOMAIN> | undefined {
        if( ! this.assertKey( key ) ) return undefined;
        return this.state.get( key );
    }
    public set( key: DomainElement<KEY_DOMAIN>, element: DomainElement<DOMAIN>, accessLevel: AccessLevel = UserAccess ): boolean {
        if( ! this.access( "set", accessLevel ) ) return false;
        if( ! this.assertKey( key ) ) return false;
        if( ! this.validateElement( element ) ) return false;
        const oldElement = this.state.get( key );
        this.state.set( key, element );
        this.notifyUpdate( "replace", { new: [[key, element]], old: [[key, element]] } );
        return true;
    }
    public hasKey( key: DomainElement<KEY_DOMAIN> ): boolean {
        return this.state.has( key );
    }
    public override elements(): DomainElement<DOMAIN>[] {
        return Array.from( this.state.values() );
    }
    public keys(): DomainElement<KEY_DOMAIN>[] {
        return Array.from( this.state.keys() );
    }
    public tuples(): [DomainElement<KEY_DOMAIN>, DomainElement<DOMAIN>][] {
        return Array.from( this.state.entries() );
    }
    protected override initProperties( config: CONFIG ): void {
        super.initProperties( config );
        this.initProperty( "state", config.state ?? new Map() );
    }
    public override createController(): I_MapController<this> {
        return new MapController( { model: this } );
    }
}

export function isMapController( candidate: unknown ): candidate is I_MapController<I_MapModel> {
    return candidate != null && ( candidate as I_MapController<I_MapModel> ).isMapController;
}
export interface I_MapControllerConfig<MODEL extends I_MapModel> extends I_AssociativeControllerConfig<MODEL> {
}
export interface I_MapController<MODEL extends I_MapModel> extends I_AssociativeController<MODEL> {
    readonly isMapController: true;
}
export class MapController<MODEL extends I_MapModel, CONFIG extends I_MapControllerConfig<MODEL>> extends AssociativeController<MODEL, CONFIG> implements I_MapController<MODEL> {
    public constructor( config: CONFIG ) {
        super( config );
    }
    public get isMapController(): true {
        return true;
    }
}

export function isMapView( candidate: unknown ): candidate is I_MapView<Node, I_MapModel, I_MapController<I_MapModel>> {
    return candidate != null && ( candidate as I_MapView<Node, I_MapModel, I_MapController<I_MapModel>> ).isMapView;
}
export interface I_MapViewConfig<MODEL extends I_MapModel, CONTROLLER extends I_MapController<MODEL>> extends I_AssociativeViewConfig<MODEL, CONTROLLER> {
}
export interface I_MapView<ROOT extends Node, MODEL extends I_MapModel, CONTROLLER extends I_MapController<MODEL>> extends I_AssociativeView<ROOT, MODEL, CONTROLLER> {
    readonly isMapView: true;
}
export abstract class MapView<ROOT extends Node, MODEL extends I_MapModel, CONTROLLER extends I_MapController<MODEL>, CONFIG extends I_MapViewConfig<MODEL, CONTROLLER>> extends AssociativeView<ROOT, MODEL, CONTROLLER, CONFIG> implements I_MapView<ROOT, MODEL, CONTROLLER> {
    protected constructor( config: CONFIG ) {
        super( config );
    }
    public get isMapView(): true {
        return true;
    }
    protected abstract override createRoot(): ROOT;
}


