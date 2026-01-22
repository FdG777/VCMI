import {
    I_MappingModelConfig, I_MappingModel, MappingModel,
    I_MappingControllerConfig, I_MappingController, MappingController,
    I_MappingViewConfig, I_MappingView, MappingView
} from '../Mapping.js';
import {
    Domain
} from "../../../../../../Domain.js";

export type Index = number | readonly number[];

export function isIndexedModel( candidate: unknown ): candidate is I_IndexedModel {
    return candidate != null && ( candidate as I_IndexedModel ).isIndexedModel;
}
export interface I_IndexedModelConfig<DOMAIN extends Domain> extends I_MappingModelConfig<DOMAIN> {
}
export interface I_IndexedModel<KEY extends Index = Index, DOMAIN extends Domain = Domain> extends I_MappingModel<KEY, DOMAIN> {
    readonly isIndexedModel: true;
}
export abstract class IndexedModel<KEY extends Index, DOMAIN extends Domain, CONFIG extends I_IndexedModelConfig<DOMAIN>> extends MappingModel<KEY, DOMAIN, CONFIG> implements I_IndexedModel<KEY, DOMAIN> {
    public get isIndexedModel(): true {
        return true;
    }
    public override createController(): I_IndexedController<this> {
        return new IndexedController( { model: this } );
    }
}

export function isIndexedController( candidate: unknown ): candidate is I_IndexedController<I_IndexedModel> {
    return candidate != null && ( candidate as I_IndexedController<I_IndexedModel> ).isIndexedController;
}
export interface I_IndexedControllerConfig<MODEL extends I_IndexedModel> extends I_MappingControllerConfig<MODEL> {
}
export interface I_IndexedController<MODEL extends I_IndexedModel> extends I_MappingController<MODEL> {
    readonly isIndexedController: true;
}
export class IndexedController<MODEL extends I_IndexedModel, CONFIG extends I_IndexedControllerConfig<MODEL>> extends MappingController<MODEL, CONFIG> implements I_IndexedController<MODEL> {
    public constructor( config: CONFIG ) {
        super( config );
    }
    public get isIndexedController(): true {
        return true;
    }
}

export function isIndexedView( candidate: unknown ): candidate is I_IndexedView<Node, I_IndexedModel, I_IndexedController<I_IndexedModel>> {
    return candidate != null && ( candidate as I_IndexedView<Node, I_IndexedModel, I_IndexedController<I_IndexedModel>> ).isIndexedView;
}
export interface I_IndexedViewConfig<MODEL extends I_IndexedModel, CONTROLLER extends I_IndexedController<MODEL>> extends I_MappingViewConfig<MODEL, CONTROLLER> {
}
export interface I_IndexedView<ROOT extends Node, MODEL extends I_IndexedModel, CONTROLLER extends I_IndexedController<MODEL>> extends I_MappingView<ROOT, MODEL, CONTROLLER> {
    readonly isIndexedView: true;
}
export abstract class IndexedView<ROOT extends Node, MODEL extends I_IndexedModel, CONTROLLER extends I_IndexedController<MODEL>, CONFIG extends I_IndexedViewConfig<MODEL, CONTROLLER>> extends MappingView<ROOT, MODEL, CONTROLLER, CONFIG> implements I_IndexedView<ROOT, MODEL, CONTROLLER> {
    protected constructor( config: CONFIG ) {
        super( config );
    }
    public get isIndexedView(): true {
        return true;
    }
    protected abstract override createRoot(): ROOT;
}


