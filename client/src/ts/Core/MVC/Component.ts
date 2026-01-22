import {
    I_Serializable, PropertyBagSerializable
} from "../Serializer.js";

export function isComponent( candidate: unknown ): candidate is I_Component {
    return candidate != null && ( candidate as I_Component ).isComponent;
}

export interface I_ComponentConfig {
}

export interface I_Component extends I_Serializable {
    readonly isComponent: true;
    addComponentListener( type: ComponentEventType, listener: ComponentListener ): void;
    addComponentListeners( listener: ComponentListener ): void;
    removeComponentListener( type: ComponentEventType, listener: ComponentListener ): void;
    removeComponentListeners( listener: ComponentListener ): void;
    terminate(): void;
}

export class Component<CONFIG extends I_ComponentConfig> extends PropertyBagSerializable implements I_Component {
    private readonly listeners: ComponentListeners;
    public constructor( config: CONFIG ) {
        super();
        this.listeners = { terminate: [], update: [] } as const;
        if( config ) {
            this.initProperties( config );
            this.addSubComponentListeners();
        }
    }
    public get isComponent(): true {
        return true;
    }
    protected initProperties( config: CONFIG ): void {
    }
    protected addSubComponentListeners(): void {
    }
    protected removeSubComponentListeners(): void {
    }
    public addComponentListener( type: ComponentEventType, listener: ComponentListener ): void {
        if( ! this.listeners[type].includes( listener ) ) this.listeners[type].push( listener );
    }
    public addComponentListeners( listener: ComponentListener ): void {
        this.addComponentListener( "terminate", listener );
        this.addComponentListener( "update", listener );
    }
    public removeComponentListener( type: ComponentEventType, listener: ComponentListener ): void {
        const index = this.listeners[type].indexOf( listener );
        if( index >= 0 ) this.listeners[type].splice( index, 1 );
    }
    public removeComponentListeners( listener: ComponentListener ): void {
        this.removeComponentListener( "terminate", listener );
        this.removeComponentListener( "update", listener );
    }
    private dispatchComponentEvent( event: ComponentEvent ): void {
        const listeners = this.listeners[event.type].slice();
        for( let i = 0; i < listeners.length; i++ ) {
            const listener = listeners[i];
            typeof listener === "function" ? listener( event ) : listener.handleComponentEvent( event );
        }
    }
    public override delinearize( data: unknown[] ): number {
        this.removeSubComponentListeners();
        const index = super.delinearize( data );
        this.addSubComponentListeners();
        return index;
    }
    protected notifyUpdate( update: string, detail: Record<string, unknown> = {} ): void {
        this.dispatchComponentEvent( new ComponentUpdateEvent( this, update, detail ) );
    }
    public terminate(): void {
        this.removeSubComponentListeners();
        this.dispatchComponentEvent( new ComponentTerminateEvent( this ) );
    }
    protected throwSubComponentTerminateError( event: ComponentTerminateEvent ): void {
        console.warn( "unable to terminate source as long as component is alive", { component: this, source: event.source, event: event } );
        throw new Error( "unable to terminate event source" );
    }
    public override toString(): string {
        return this.constructor.name;
    }
    protected error( message: string, context?: Record<string, unknown> ): void {
        console.error( this, message, context );
    }
    protected info( message: string, context?: Record<string, unknown> ): void {
        console.info( this, message, context );
    }
    protected warn( message: string, context?: Record<string, unknown> ): void {
        console.warn( this, message, context );
    }
}


export abstract class ComponentEvent {
    public readonly source: I_Component;
    public readonly type: ComponentEventType;
    protected constructor( source: I_Component, type: ComponentEventType ) {
        this.source = source;
        this.type = type;
    }
}
export class ComponentTerminateEvent extends ComponentEvent {
    public static readonly TYPE = "terminate";
    public constructor( source: I_Component ) {
        super( source, ComponentTerminateEvent.TYPE );
    }
}
export class ComponentUpdateEvent extends ComponentEvent {
    public static readonly TYPE = "update";
    public readonly update: string;
    public readonly detail: Record<string, any>;
    public constructor( source: I_Component, update: string, detail: Record<string, any> = {} ) {
        super( source, ComponentUpdateEvent.TYPE );
        this.update = update;
        this.detail = detail;
    }
}


export interface I_ComponentListener {
    handleComponentEvent( event: ComponentEvent ): void;
}
export type ComponentEventType = "terminate" | "update";
export type ComponentListener = I_ComponentListener | ( ( e: ComponentEvent ) => void );
export type ComponentListeners = Readonly<{ readonly terminate: ComponentListener[], readonly update: ComponentListener[] }>;
