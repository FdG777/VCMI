import {
    I_Component, I_ComponentConfig, I_ComponentListener, Component, ComponentEvent, ComponentTerminateEvent, ComponentUpdateEvent
} from "./Component.js";
import {
    AccessLevel
} from "../Interaction.js";


export function isModel( candidate: unknown ): candidate is I_Model {
    return candidate != null && ( candidate as I_Model ).isModel;
}
export interface I_ModelConfig extends I_ComponentConfig {
    accessLevel: AccessLevel;
}
export interface I_Model extends I_Component {
    readonly isModel: true;
    readonly accessLevel: AccessLevel;
    createController(): I_Controller<this>;
}
export abstract class Model<CONFIG extends I_ModelConfig> extends Component<CONFIG> implements I_Model {
    public get isModel(): true {
        return true;
    }
    public get accessLevel(): AccessLevel {
        return this.getProperty( "accessLevel" ) as AccessLevel;
    }
    protected override initProperties( config: CONFIG ): void {
        super.initProperties( config );
        this.initProperty( "accessLevel", config.accessLevel );

    }
    public createController(): I_Controller<this> {
        return new Controller( { model: this } );
    }
    public access( action: string, accessLevel: AccessLevel ): boolean {
        if( this.accessLevel < accessLevel ) {
            this.warn( "access denied", { action: action, accessLevel: accessLevel, exceeded: this.accessLevel } );
            return false;
        }
        return true;
    }
}



export function isController( candidate: unknown ): candidate is I_Controller<any> {
    return candidate != null && ( candidate as I_Controller<any> ).isController;
}
export interface I_ControllerConfig<MODEL> extends I_ComponentConfig {
    model: MODEL | null;
}
export interface I_Controller<MODEL extends I_Model = I_Model> extends I_Component, I_ComponentListener {
    readonly isController: true;
    readonly model: MODEL | null;
    setModel( model?: MODEL | null ): void;
}
export class Controller<MODEL extends I_Model, CONFIG extends I_ControllerConfig<MODEL>> extends Component<CONFIG> implements I_Controller<MODEL> {
    public constructor( config: CONFIG ) {
        super( config );
        this.setModel( config.model );
    }
    public get isController(): true {
        return true;
    }
    protected override initProperties( config: CONFIG ): void {
        this.initProperty( "model", null );
        super.initProperties( config );
    }
    public get model(): MODEL | null {
        return this.getProperty( "model" ) as MODEL | null;
    }
    public setModel( model: MODEL | null = null ): void {
        if( ! Object.is( model, this.model ) ) {
            const detail = { update: "setModel", new: model, old: this.model } as const;
            if( this.model ) this.model.removeComponentListeners( this );
            this.setProperty( "model", model );
            if( this.model ) this.model.addComponentListeners( this );
            this.notifyUpdate( "setModel", detail );
        }
    }
    public handleComponentEvent( event: ComponentEvent ): void {
        if( Object.is( event.source, this.model ) ) {
            if( event instanceof ComponentTerminateEvent ) {
                this.setModel( null );
            }
            else if( event instanceof ComponentUpdateEvent ) {
                this.notifyUpdate( "modelUpdate", event.detail );
            }
            else {
                console.warn( "unhandled model event", { controller: this, event: event }  );
            }
        }
    }
    public override delinearize( data: unknown[] ): number {
        if( this.model ) this.model.removeComponentListeners( this );
        const index = super.delinearize( data );
        if( this.model ) this.model.addComponentListeners( this );
        return index;
    }
    public override terminate(): void {
        this.setModel( null );
        super.terminate();
    }
}


export function isView( candidate: unknown ): candidate is I_View {
    return candidate != null && ( candidate as I_View ).isView;
}
export interface I_View<ROOT extends Node = Node, MODEL extends I_Model = I_Model, CONTROLLER extends I_Controller<MODEL> = I_Controller<MODEL>> extends I_Component, I_ComponentListener {
    readonly isView: true;
    readonly root: ROOT;
    readonly controller: CONTROLLER | null;
    readonly model: MODEL | null;
    setController( controller?: CONTROLLER | null ): void;
}
export interface I_ViewConfig<MODEL extends I_Model, CONTROLLER extends I_Controller<MODEL>> extends I_ComponentConfig {
    controller: CONTROLLER | null;
}
export abstract class View<ROOT extends Node, MODEL extends I_Model, CONTROLLER extends I_Controller<MODEL>, CONFIG extends I_ViewConfig<MODEL, CONTROLLER>> extends Component<CONFIG> implements I_View<ROOT, MODEL, CONTROLLER> {
    public readonly root: ROOT;
    public constructor( config: CONFIG ) {
        super( config );
        this.root = this.createRoot( config );
        this.compose( config );
        this.setController( config.controller );
    }
    public get isView(): true {
        return true;
    }
    public get controller(): CONTROLLER | null {
        return this.getProperty( "controller" ) as CONTROLLER | null;
    }
    public get model(): MODEL | null {
        return this.controller ? this.controller.model : null;
    }
    protected compose( config: CONFIG ): void {
        // NOOP
    }
    protected performUpdate( detail?: Record<string, unknown> ): void {
        this.root.textContent = String( this.model );
    }
    protected override initProperties( config: CONFIG ): void {
        super.initProperties( config );
        this.initProperty( "controller", null );
    }
    public setController( controller: CONTROLLER | null = null ): void {
        if( Object.is( controller, this.controller ) ) return;
        const controllerAfter = controller;
        const controllerBefore = this.controller;
        const modelAfter = controllerAfter ? controllerAfter.model : null;
        const modelBefore = this.model;
        const modelChange = ! Object.is( modelAfter, modelBefore );
        const detail = { update: "setController", new: controllerAfter, old: controllerBefore, newModel: modelAfter, oldModel: modelBefore, modelChange: modelChange } as const;
        if( this.controller ) this.controller.removeComponentListeners( this );
        this.setProperty( "controller", controller )
        if( this.controller ) this.controller.addComponentListeners( this );
        if( modelChange ) this.performUpdate();
        this.notifyUpdate( "setController", detail );
    }
    public handleComponentEvent( event: ComponentEvent ): void {
        if( Object.is( event.source, this.controller ) ) {
            if( event instanceof ComponentTerminateEvent ) {
                this.setController( null );
            }
            else if( event instanceof ComponentUpdateEvent ) {
                this.performUpdate( event.detail );
            }
        }
    }
    public override delinearize( data: unknown[] ): number {
        if( this.controller ) this.controller.removeComponentListeners( this );
        const index = super.delinearize( data );
        if( this.controller ) this.controller.addComponentListeners( this );
        return index;
    }
    public override terminate() {
        this.setController( null );
        super.terminate();
    }

    protected abstract createRoot( config: CONFIG ): ROOT;
}
