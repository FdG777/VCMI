import {
    I_ModelConfig, I_Model, Model,
    I_ControllerConfig, I_Controller, Controller,
    I_ViewConfig, I_View, View
} from '../../Module.js';
import {
    Domain, DomainElement
} from "../../../Domain.js";


export function isDomainModel( candidate: unknown ): candidate is I_DomainModel {
    return candidate != null && ( candidate as I_DomainModel ).isDomainModel;
}
export interface I_DomainModelConfig<DOMAIN extends Domain = Domain> extends I_ModelConfig {
    domain: DOMAIN;
}
export interface I_DomainModel<DOMAIN extends Domain = Domain> extends I_Model {
    readonly isDomainModel: true;
    readonly domain: DOMAIN;
}
export class DomainModel<DOMAIN extends Domain, CONFIG extends I_DomainModelConfig<DOMAIN>> extends Model<CONFIG> implements I_DomainModel<DOMAIN> {
    public constructor( config: CONFIG ) {
        super( config );
    }
    public get isDomainModel(): true {
        return true;
    }
    public get domain(): DOMAIN {
        return this.getProperty( "domain" ) as DOMAIN;
    }
    protected override initProperties( config: CONFIG ): void {
        super.initProperties( config );
        this.initProperty( "domain", config.domain );
    }
    public override createController(): I_DomainController<this> {
        return new DomainController( { model: this } );
    }
    protected validateElement( element: unknown ): element is DomainElement<DOMAIN> {
        if( ! this.domain.accept( element ) ) {
            this.warn( "invalid element", { element } );
            return false;
        }
        return true;
    }
}

export function isDomainController( candidate: unknown ): candidate is I_DomainController<I_DomainModel> {
    return candidate != null && ( candidate as I_DomainController<I_DomainModel> ).isDomainController;
}
export interface I_DomainControllerConfig<MODEL extends I_DomainModel> extends I_ControllerConfig<MODEL> {
}
export interface I_DomainController<MODEL extends I_DomainModel> extends I_Controller<MODEL> {
    readonly isDomainController: true;
}
export class DomainController<MODEL extends I_DomainModel, CONFIG extends I_DomainControllerConfig<MODEL>> extends Controller<MODEL, CONFIG> implements I_DomainController<MODEL> {
    public constructor( config: CONFIG ) {
        super( config );
    }
    public get isDomainController(): true {
        return true;
    }
}

export function isDomainView( candidate: unknown ): candidate is I_DomainView<Node, I_DomainModel, I_DomainController<I_DomainModel>> {
    return candidate != null && ( candidate as I_DomainView<Node, I_DomainModel, I_DomainController<I_DomainModel>> ).isDomainView;
}
export interface I_DomainViewConfig<MODEL extends I_DomainModel, CONTROLLER extends I_DomainController<MODEL>> extends I_ViewConfig<MODEL, CONTROLLER> {
}
export interface I_DomainView<ROOT extends Node, MODEL extends I_DomainModel, CONTROLLER extends I_DomainController<MODEL>> extends I_View<ROOT, MODEL, CONTROLLER> {
    readonly isDomainView: true;
}
export abstract class DomainView<ROOT extends Node, MODEL extends I_DomainModel, CONTROLLER extends I_DomainController<MODEL>, CONFIG extends I_DomainViewConfig<MODEL, CONTROLLER>> extends View<ROOT, MODEL, CONTROLLER, CONFIG> implements I_DomainView<ROOT, MODEL, CONTROLLER> {
    protected constructor( config: CONFIG ) {
        super( config );
    }
    public get isDomainView(): true {
        return true;
    }
    protected abstract override createRoot(): ROOT;
}


