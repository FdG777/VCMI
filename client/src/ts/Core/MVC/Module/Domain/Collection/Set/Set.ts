import {
    I_CollectionModelConfig, I_CollectionModel, CollectionModel,
    I_CollectionControllerConfig, I_CollectionController, CollectionController,
    I_CollectionViewConfig, I_CollectionView, CollectionView
} from '../Collection.js';
import {
    Domain, DomainElement
} from "../../../../../Domain.js";


export function isSetModel( candidate: unknown ): candidate is I_SetModel {
    return candidate != null && ( candidate as I_SetModel ).isSetModel;
}
export interface I_SetModelConfig<DOMAIN extends Domain> extends I_CollectionModelConfig<DOMAIN> {
    state: Set<DomainElement<DOMAIN>>;
}
export interface I_SetModel<DOMAIN extends Domain = Domain> extends I_CollectionModel<DOMAIN> {
    readonly isSetModel: true;
    readonly size: number;
}
export class SetModel<DOMAIN extends Domain, CONFIG extends I_SetModelConfig<DOMAIN>> extends CollectionModel<DOMAIN, CONFIG> implements I_SetModel<DOMAIN> {
    public get isSetModel(): true {
        return true;
    }
    protected get state(): Set<DomainElement<DOMAIN>> {
        return this.getProperty( "state" ) as Set<DomainElement<DOMAIN>>;
    }
    public get size(): number {
        return this.state.size;
    }
    public override elements(): DomainElement<DOMAIN>[] {
        return Array.from( this.state );
    }
    public override initProperties( config: CONFIG ): void {
        super.initProperties( config );
        this.initProperty( "state", config.state );
    }
    public override createController(): I_SetController<this> {
        return new SetController( { model: this } );
    }
}

export function isSetController( candidate: unknown ): candidate is I_SetController<I_SetModel> {
    return candidate != null && ( candidate as I_SetController<I_SetModel> ).isSetController;
}
export interface I_SetControllerConfig<MODEL extends I_SetModel> extends I_CollectionControllerConfig<MODEL> {
}
export interface I_SetController<MODEL extends I_SetModel> extends I_CollectionController<MODEL> {
    readonly isSetController: true;
}
export class SetController<MODEL extends I_SetModel, CONFIG extends I_SetControllerConfig<MODEL>> extends CollectionController<MODEL, CONFIG> implements I_SetController<MODEL> {
    public constructor( config: CONFIG ) {
        super( config );
    }
    public get isSetController(): true {
        return true;
    }
}

export function isSetView( candidate: unknown ): candidate is I_SetView<Node, I_SetModel, I_SetController<I_SetModel>> {
    return candidate != null && ( candidate as I_SetView<Node, I_SetModel, I_SetController<I_SetModel>> ).isSetView;
}
export interface I_SetViewConfig<MODEL extends I_SetModel, CONTROLLER extends I_SetController<MODEL>> extends I_CollectionViewConfig<MODEL, CONTROLLER> {
}
export interface I_SetView<ROOT extends Node, MODEL extends I_SetModel, CONTROLLER extends I_SetController<MODEL>> extends I_CollectionView<ROOT, MODEL, CONTROLLER> {
    readonly isSetView: true;
}
export abstract class SetView<ROOT extends Node, MODEL extends I_SetModel, CONTROLLER extends I_SetController<MODEL>, CONFIG extends I_SetViewConfig<MODEL, CONTROLLER>> extends CollectionView<ROOT, MODEL, CONTROLLER, CONFIG> implements I_SetView<ROOT, MODEL, CONTROLLER> {
    protected constructor( config: CONFIG ) {
        super( config );
    }
    public get isSetView(): true {
        return true;
    }
    protected abstract override createRoot(): ROOT;
}


