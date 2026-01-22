import {
    I_MappingModelConfig, I_MappingModel, MappingModel,
    I_MappingControllerConfig, I_MappingController, MappingController,
    I_MappingViewConfig, I_MappingView, MappingView
} from '../Mapping.js';
import {
    Domain, DomainElement
} from "../../../../../../Domain.js";


export function isAssociativeModel( candidate: unknown ): candidate is I_AssociativeModel {
    return candidate != null && ( candidate as I_AssociativeModel ).isAssociativeModel;
}
export interface I_AssociativeModelConfig<KEY_DOMAIN extends Domain, DOMAIN extends Domain> extends I_MappingModelConfig<DOMAIN> {
    keyDomain: KEY_DOMAIN;
}
export interface I_AssociativeModel<KEY_DOMAIN extends Domain = Domain, DOMAIN extends Domain = Domain> extends I_MappingModel<DomainElement<KEY_DOMAIN>, DOMAIN> {
    readonly isAssociativeModel: true;
    readonly keyDomain: KEY_DOMAIN;
    tuples(): [DomainElement<KEY_DOMAIN>, DomainElement<DOMAIN>][]
}
export abstract class AssociativeModel<KEY_DOMAIN extends Domain, DOMAIN extends Domain, CONFIG extends I_AssociativeModelConfig<KEY_DOMAIN, DOMAIN>> extends MappingModel<DomainElement<KEY_DOMAIN>, DOMAIN, CONFIG> implements I_AssociativeModel<KEY_DOMAIN, DOMAIN> {
    public get isAssociativeModel(): true {
        return true;
    }
    public get keyDomain(): KEY_DOMAIN {
        return this.getProperty( "keyDomain" ) as KEY_DOMAIN;
    }
    public abstract tuples(): [DomainElement<KEY_DOMAIN>, DomainElement<DOMAIN>][];
    protected override initProperties( config: CONFIG ): void {
        super.initProperties( config );
        this.initProperty( "keyDomain", config.keyDomain );
    }
    public override createController(): I_AssociativeController<this> {
        return new AssociativeController( { model: this } );
    }
}

export function isAssociativeController( candidate: unknown ): candidate is I_AssociativeController<I_AssociativeModel> {
    return candidate != null && ( candidate as I_AssociativeController<I_AssociativeModel> ).isAssociativeController;
}
export interface I_AssociativeControllerConfig<MODEL extends I_AssociativeModel> extends I_MappingControllerConfig<MODEL> {
}
export interface I_AssociativeController<MODEL extends I_AssociativeModel> extends I_MappingController<MODEL> {
    readonly isAssociativeController: true;
}
export class AssociativeController<MODEL extends I_AssociativeModel, CONFIG extends I_AssociativeControllerConfig<MODEL>> extends MappingController<MODEL, CONFIG> implements I_AssociativeController<MODEL> {
    public constructor( config: CONFIG ) {
        super( config );
    }
    public get isAssociativeController(): true {
        return true;
    }
}

export function isAssociativeView( candidate: unknown ): candidate is I_AssociativeView<Node, I_AssociativeModel, I_AssociativeController<I_AssociativeModel>> {
    return candidate != null && ( candidate as I_AssociativeView<Node, I_AssociativeModel, I_AssociativeController<I_AssociativeModel>> ).isAssociativeView;
}
export interface I_AssociativeViewConfig<MODEL extends I_AssociativeModel, CONTROLLER extends I_AssociativeController<MODEL>> extends I_MappingViewConfig<MODEL, CONTROLLER> {
}
export interface I_AssociativeView<ROOT extends Node, MODEL extends I_AssociativeModel, CONTROLLER extends I_AssociativeController<MODEL>> extends I_MappingView<ROOT, MODEL, CONTROLLER> {
    readonly isAssociativeView: true;
}
export abstract class AssociativeView<ROOT extends Node, MODEL extends I_AssociativeModel, CONTROLLER extends I_AssociativeController<MODEL>, CONFIG extends I_AssociativeViewConfig<MODEL, CONTROLLER>> extends MappingView<ROOT, MODEL, CONTROLLER, CONFIG> implements I_AssociativeView<ROOT, MODEL, CONTROLLER> {
    protected constructor( config: CONFIG ) {
        super( config );
    }
    public get isAssociativeView(): true {
        return true;
    }
    protected abstract override createRoot(): ROOT;
}


