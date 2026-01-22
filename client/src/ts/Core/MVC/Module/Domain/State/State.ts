import {
    I_DomainModelConfig, I_DomainModel, DomainModel,
    I_DomainControllerConfig, I_DomainController, DomainController,
    I_DomainViewConfig, I_DomainView, DomainView
} from '../Domain.js';
import {
    Domain, DomainElement
} from "../../../../Domain.js";
import {
    AccessLevel, UserAccess
} from "../../../../Interaction.js";


export function isStateModel( candidate: unknown ): candidate is I_StateModel {
    return candidate != null && ( candidate as I_StateModel ).isStateModel;
}
export interface I_StateModelConfig<DOMAIN extends Domain> extends I_DomainModelConfig<DOMAIN> {
    state: DomainElement<DOMAIN>;
}
export interface I_StateModel<DOMAIN extends Domain = Domain> extends I_DomainModel<DOMAIN> {
    readonly isStateModel: true;
    readonly state: DomainElement<DOMAIN>;
    set( state: DomainElement<DOMAIN> ): boolean;
}
export class StateModel<DOMAIN extends Domain, CONFIG extends I_StateModelConfig<DOMAIN>> extends DomainModel<DOMAIN, CONFIG> implements I_StateModel<DOMAIN> {
    public constructor( config: CONFIG ) {
        super( config );
    }
    public get isStateModel(): true {
        return true;
    }
    public get state(): DomainElement<DOMAIN> {
        return this.getProperty( "state" ) as DomainElement<DOMAIN>;
    }
    protected override initProperties( config: CONFIG ): void {
        super.initProperties( config );
        this.initProperty( "state", config.state );
    }
    public override createController(): I_StateController<this> {
        return new StateController( { model: this } );
    }
    public set( state: DomainElement<DOMAIN>, accessLevel: AccessLevel = UserAccess ): boolean {
        if( ! this.access( "setState", accessLevel ) ) return false;
        if( Object.is( state, this.state ) ) return  true;
        if( ! this.validateElement( state ) ) return false;
        const old = this.state;
        this.setProperty( "state", state );
        this.notifyUpdate( "replace", { new: state, old: old } );
        return true;
    }
}

export function isStateController( candidate: unknown ): candidate is I_StateController<I_StateModel> {
    return candidate != null && ( candidate as I_StateController<I_StateModel> ).isStateController;
}
export interface I_StateControllerConfig<MODEL extends I_StateModel> extends I_DomainControllerConfig<MODEL> {
}
export interface I_StateController<MODEL extends I_StateModel> extends I_DomainController<MODEL> {
    readonly isStateController: true;
}
export class StateController<MODEL extends I_StateModel, CONFIG extends I_StateControllerConfig<MODEL>> extends DomainController<MODEL, CONFIG> implements I_StateController<MODEL> {
    public constructor( config: CONFIG ) {
        super( config );
    }
    public get isStateController(): true {
        return true;
    }
}

export function isStateView( candidate: unknown ): candidate is I_StateView<Node, I_StateModel, I_StateController<I_StateModel>> {
    return candidate != null && ( candidate as I_StateView<Node, I_StateModel, I_StateController<I_StateModel>> ).isStateView;
}
export interface I_StateViewConfig<MODEL extends I_StateModel, CONTROLLER extends I_StateController<MODEL>> extends I_DomainViewConfig<MODEL, CONTROLLER> {
}
export interface I_StateView<ROOT extends Node, MODEL extends I_StateModel, CONTROLLER extends I_StateController<MODEL>> extends I_DomainView<ROOT, MODEL, CONTROLLER> {
    readonly isStateView: true;
}
export abstract class StateView<ROOT extends Node, MODEL extends I_StateModel, CONTROLLER extends I_StateController<MODEL>, CONFIG extends I_StateViewConfig<MODEL, CONTROLLER>> extends DomainView<ROOT, MODEL, CONTROLLER, CONFIG> implements I_StateView<ROOT, MODEL, CONTROLLER> {
    protected constructor( config: CONFIG ) {
        super( config );
    }
    public get isStateView(): true {
        return true;
    }
    protected abstract override createRoot(): ROOT;
}


