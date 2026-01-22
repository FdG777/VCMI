import {
    I_DomainModelConfig, I_DomainModel, DomainModel,
    I_DomainControllerConfig, I_DomainController, DomainController,
    I_DomainViewConfig, I_DomainView, DomainView
} from '../Domain.js';
import {
    Domain, DomainElement
} from "../../../../Domain.js";


export function isCollectionModel( candidate: unknown ): candidate is I_CollectionModel {
    return candidate != null && ( candidate as I_CollectionModel ).isCollectionModel;
}
export interface I_CollectionModelConfig<DOMAIN extends Domain> extends I_DomainModelConfig<DOMAIN> {
}
export interface I_CollectionModel<DOMAIN extends Domain = Domain> extends I_DomainModel<DOMAIN> {
    readonly isCollectionModel: true;
    elements(): DomainElement<DOMAIN>[],
}
export abstract class CollectionModel<DOMAIN extends Domain, CONFIG extends I_CollectionModelConfig<DOMAIN>> extends DomainModel<DOMAIN, CONFIG> implements I_CollectionModel<DOMAIN> {
    public constructor( config: CONFIG ) {
        super( config );
    }
    public get isCollectionModel(): true {
        return true;
    }
    public abstract elements(): DomainElement<DOMAIN>[];
    public override createController(): I_CollectionController<this> {
        return new CollectionController( { model: this } );
    }
}

export function isCollectionController( candidate: unknown ): candidate is I_CollectionController<I_CollectionModel> {
    return candidate != null && ( candidate as I_CollectionController<I_CollectionModel> ).isCollectionController;
}
export interface I_CollectionControllerConfig<MODEL extends I_CollectionModel> extends I_DomainControllerConfig<MODEL> {
}
export interface I_CollectionController<MODEL extends I_CollectionModel> extends I_DomainController<MODEL> {
    readonly isCollectionController: true;
}
export class CollectionController<MODEL extends I_CollectionModel, CONFIG extends I_CollectionControllerConfig<MODEL>> extends DomainController<MODEL, CONFIG> implements I_CollectionController<MODEL> {
    public constructor( config: CONFIG ) {
        super( config );
    }
    public get isCollectionController(): true {
        return true;
    }
}

export function isCollectionView( candidate: unknown ): candidate is I_CollectionView<Node, I_CollectionModel, I_CollectionController<I_CollectionModel>> {
    return candidate != null && ( candidate as I_CollectionView<Node, I_CollectionModel, I_CollectionController<I_CollectionModel>> ).isCollectionView;
}
export interface I_CollectionViewConfig<MODEL extends I_CollectionModel, CONTROLLER extends I_CollectionController<MODEL>> extends I_DomainViewConfig<MODEL, CONTROLLER> {
}
export interface I_CollectionView<ROOT extends Node, MODEL extends I_CollectionModel, CONTROLLER extends I_CollectionController<MODEL>> extends I_DomainView<ROOT, MODEL, CONTROLLER> {
    readonly isCollectionView: true;
}
export abstract class CollectionView<ROOT extends Node, MODEL extends I_CollectionModel, CONTROLLER extends I_CollectionController<MODEL>, CONFIG extends I_CollectionViewConfig<MODEL, CONTROLLER>> extends DomainView<ROOT, MODEL, CONTROLLER, CONFIG> implements I_CollectionView<ROOT, MODEL, CONTROLLER> {
    protected constructor( config: CONFIG ) {
        super( config );
    }
    public get isCollectionView(): true {
        return true;
    }
    protected abstract override createRoot(): ROOT;
}


