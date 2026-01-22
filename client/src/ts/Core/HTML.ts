import {
    DOM, DOMAttributes
} from "./DOM.js";

export type HTMLInputEventType = "change"|"input";
export type HTMLHeadingLevel = 1|2|3|4|5|6;
export type HTMLInputType = "checkbox"|"color"|"date"|"number"|"password"|"range"|"text";

export class HTML {
    public static headingLevel( reference: HTMLHeadingLevel, difference: number ): HTMLHeadingLevel {
        // difference > 0 => smaller heading, difference < 0 => bigger heading
        return Math.max( 1, Math.min( 6, reference + difference ) ) as HTMLHeadingLevel;
    }
    public static br( count: number = 1 ): DocumentFragment {
        const fragment = document.createDocumentFragment();
        for( let i = 0; i < count; i++ ) fragment.append( document.createElement( "br" ) );
        return fragment;
    }
    public static input( type: HTMLInputType, attr?: DOMAttributes ): HTMLInputElement {
        const element = DOM.element( "input", attr ) as HTMLInputElement;
        element.type = type;
        return element;
    }
    public static select( attr?: DOMAttributes ): HTMLSelectElement {
        return DOM.element( "select", attr ) as HTMLSelectElement;
    }
    public static option( text: string, attr?: DOMAttributes ): HTMLOptionElement {
        const option = DOM.element( "option", attr ) as HTMLOptionElement;
        option.text = text;
        return option;
    }
    public static div( textContent?: string, attr?: DOMAttributes ): HTMLDivElement {
        const element = DOM.element( "div", attr ) as HTMLDivElement;
        if( textContent ) element.textContent = textContent;
        return element;
    }
    public static span( textContent?: string, attr?: DOMAttributes ): HTMLSpanElement {
        const element = DOM.element( "span", attr ) as HTMLSpanElement;
        if( textContent ) element.textContent = textContent;
        return element;
    }
    public static h( level: HTMLHeadingLevel, textContent?: string, attr?: DOMAttributes ): HTMLHeadingElement {
        const element = DOM.element( "h" + level, attr ) as HTMLHeadingElement;
        if( textContent ) element.textContent = textContent;
        return element;
    }
}
