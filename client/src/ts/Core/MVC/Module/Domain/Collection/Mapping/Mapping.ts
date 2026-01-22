import {
    I_CollectionModelConfig, I_CollectionModel, CollectionModel,
    I_CollectionControllerConfig, I_CollectionController, CollectionController,
    I_CollectionViewConfig, I_CollectionView, CollectionView
} from '../Collection.js';
import {
    Domain, DomainElement
} from "../../../../../Domain.js";
import {
    AccessLevel
} from "../../../../../Interaction.js";


export function isMappingModel( candidate: unknown ): candidate is I_MappingModel {
    return candidate != null && ( candidate as I_MappingModel ).isMappingModel;
}
export interface I_MappingModelConfig<DOMAIN extends Domain> extends I_CollectionModelConfig<DOMAIN> {
}
export interface I_MappingModel<KEY = unknown, DOMAIN extends Domain = Domain> extends I_CollectionModel<DOMAIN> {
    readonly isMappingModel: true;
    get( key: KEY ): DomainElement<DOMAIN> | undefined;
    hasKey( key: KEY ): boolean;
    keys(): KEY[];
    set( key: KEY, element: DomainElement<DOMAIN>, accessLevel?: AccessLevel ): boolean;
}
export abstract class MappingModel<KEY, DOMAIN extends Domain, CONFIG extends I_MappingModelConfig<DOMAIN>> extends CollectionModel<DOMAIN, CONFIG> implements I_MappingModel<KEY, DOMAIN> {
    public get isMappingModel(): true {
        return true;
    }
    public override createController(): I_MappingController<this> {
        return new MappingController( { model: this } );
    }
    protected assertKey( key: KEY ): boolean {
        if( ! this.hasKey( key ) ) {
            this.warn( "undefined key", { key } );
            return false;
        }
        return true;
    }
    public abstract get( key: KEY ): DomainElement<DOMAIN> | undefined;
    public abstract hasKey( key: KEY ): boolean;
    public abstract keys(): KEY[];
    public abstract set( key: KEY, element: DomainElement<DOMAIN>, accessLevel?: AccessLevel ): boolean;
}

export function isMappingController( candidate: unknown ): candidate is I_MappingController<I_MappingModel> {
    return candidate != null && ( candidate as I_MappingController<I_MappingModel> ).isMappingController;
}
export interface I_MappingControllerConfig<MODEL extends I_MappingModel> extends I_CollectionControllerConfig<MODEL> {
}
export interface I_MappingController<MODEL extends I_MappingModel> extends I_CollectionController<MODEL> {
    readonly isMappingController: true;
}
export class MappingController<MODEL extends I_MappingModel, CONFIG extends I_MappingControllerConfig<MODEL>> extends CollectionController<MODEL, CONFIG> implements I_MappingController<MODEL> {
    public constructor( config: CONFIG ) {
        super( config );
    }
    public get isMappingController(): true {
        return true;
    }
}

export function isMappingView( candidate: unknown ): candidate is I_MappingView<Node, I_MappingModel, I_MappingController<I_MappingModel>> {
    return candidate != null && ( candidate as I_MappingView<Node, I_MappingModel, I_MappingController<I_MappingModel>> ).isMappingView;
}
export interface I_MappingViewConfig<MODEL extends I_MappingModel, CONTROLLER extends I_MappingController<MODEL>> extends I_CollectionViewConfig<MODEL, CONTROLLER> {
}
export interface I_MappingView<ROOT extends Node, MODEL extends I_MappingModel, CONTROLLER extends I_MappingController<MODEL>> extends I_CollectionView<ROOT, MODEL, CONTROLLER> {
    readonly isMappingView: true;
}
export abstract class MappingView<ROOT extends Node, MODEL extends I_MappingModel, CONTROLLER extends I_MappingController<MODEL>, CONFIG extends I_MappingViewConfig<MODEL, CONTROLLER>> extends CollectionView<ROOT, MODEL, CONTROLLER, CONFIG> implements I_MappingView<ROOT, MODEL, CONTROLLER> {
    protected constructor( config: CONFIG ) {
        super( config );
    }
    public get isMappingView(): true {
        return true;
    }
    protected abstract override createRoot(): ROOT;
}


