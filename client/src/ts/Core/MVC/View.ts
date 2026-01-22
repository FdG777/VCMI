/**
 * String views can display all models by rendering them as String(model).
 * Therefore, the way a model is displayed in a string view depends on the specific implementation of its toString function.
 */

import {
    I_Controller, I_Model, I_ViewConfig, I_View, View
} from "./Module.js";
import {
    CSSStyle
} from "./Style.js";

// ---------------------------------------------
// StringView Tag Names (alphabetical)
// ---------------------------------------------
export const InlineTagNames = ["a", "b", "button", "code", "em", "i", "label", "mark", "s", "small", "span", "strong", "sub", "sup", "time", "u",] as const;
export const BlockTagNames = ["blockquote", "div", "h1", "h2", "h3", "h4", "h5", "h6", "p", "pre",] as const;
export const LeafTagNames = ["caption", "dd", "dt", "li", "option", "td", "th",] as const;

// ---------------------------------------------
// Inferred Base Types
// ---------------------------------------------
export type InlineTagName = typeof InlineTagNames[number];
export type BlockTagName  = typeof BlockTagNames[number];
export type LeafTagName   = typeof LeafTagNames[number];
export type StringViewTagName = InlineTagName | BlockTagName | LeafTagName;

export interface I_StringViewConfig extends I_ViewConfig<I_Model, I_Controller> {
}
export interface I_StringView<ROOT extends Node> extends I_View<ROOT, I_Model, I_Controller> {
}
export abstract class StringView<ROOT extends Node, CONFIG extends I_StringViewConfig> extends View<ROOT, I_Model, I_Controller, CONFIG> implements I_StringView<ROOT> {
}

export interface I_ViewAttributeConfig<LOCAL_NAME extends string> extends I_StringViewConfig {
    localName: LOCAL_NAME;
}
export interface I_ViewAttribute<LOCAL_NAME extends string> extends I_StringView<Attr> {
    readonly localName: LOCAL_NAME;
}
export class ViewAttribute<LOCAL_NAME extends string, CONFIG extends I_ViewAttributeConfig<LOCAL_NAME>> extends StringView<Attr, CONFIG> implements I_ViewAttribute<LOCAL_NAME> {
    public constructor( config: CONFIG ) {
        super( config );
    }
    protected override createRoot( config: CONFIG ): Attr {
        return document.createAttribute( config.localName );
    }
    public get localName(): LOCAL_NAME {
        return this.root.localName as LOCAL_NAME;
    }
}

export interface I_ViewTextConfig extends I_StringViewConfig {
}
export interface I_ViewText extends I_StringView<Text> {
}
export class ViewText<CONFIG extends I_ViewTextConfig> extends StringView<Text, CONFIG> implements I_ViewText {
    public constructor( config: CONFIG ) {
        super( config );
    }
    protected override createRoot( config: CONFIG ): Text {
        return document.createTextNode( "" );
    }
}




export interface I_StringViewElementConfig<TAG_NAME extends string> extends I_StringViewConfig {
    tagName: StringViewTagName;
    style?: CSSStyle;
}
export interface I_StringViewElement<ROOT extends HTMLElement, TAG_NAME extends string> extends I_StringView<ROOT> {
}
export abstract class StringViewElement<ROOT extends HTMLElement, TAG_NAME extends string, CONFIG extends I_StringViewElementConfig<TAG_NAME>> extends StringView<ROOT, CONFIG> {
    protected override createRoot( config: CONFIG ): ROOT {
        const root = this.__createRoot( config );
        if( config.style != null ) switch( typeof config.style ) {
            case "string":
                root.style.cssText = config.style;
                break;
            case "object":
                for( const key in config.style ) {
                    const value = config.style[key];
                    if( value != null && value !== "" ) {
                        const cssProperty = key.replace( /[A-Z]/g, m => `-${m.toLowerCase()}` );
                        root.style.setProperty( cssProperty, value );
                    }
                }
                break;
        }
        return root;
    }
    protected abstract __createRoot( config: CONFIG ): ROOT;
}

// =====================================================
// Inline String-Views
// These tags are typically used in-flow with text.
// =====================================================

export interface I_AViewConfig extends I_StringViewElementConfig<"a"> {
    href: string;
}
export interface I_AView extends I_StringViewElement<HTMLAnchorElement, "a"> {
}
export class AView extends StringViewElement<HTMLAnchorElement, "a", I_AViewConfig> implements I_AView {
    protected override __createRoot( config: I_AViewConfig ): HTMLAnchorElement {
        const root = document.createElement( "a" );
        root.href = config.href;
        return root;
    }
}

export interface I_BViewConfig extends I_StringViewElementConfig<"b"> {
}
export interface I_BView extends I_StringViewElement<HTMLElement, "b"> {
}
export class BView extends StringViewElement<HTMLElement, "b", I_BViewConfig> implements I_BView {
    protected override __createRoot( config: I_BViewConfig ): HTMLElement {
        return document.createElement( "b" );
    }
}

export interface I_ButtonViewConfig extends I_StringViewElementConfig<"button"> {
}
export interface I_ButtonView extends I_StringViewElement<HTMLButtonElement, "button"> {
}
export class ButtonView extends StringViewElement<HTMLButtonElement, "button", I_ButtonViewConfig> implements I_ButtonView {
    protected override __createRoot( config: I_ButtonViewConfig ): HTMLButtonElement {
        return document.createElement( "button" );
    }
}

export interface I_CodeViewConfig extends I_StringViewElementConfig<"code"> {
}
export interface I_CodeView extends I_StringViewElement<HTMLElement, "code"> {
}
export class CodeView extends StringViewElement<HTMLElement, "code", I_CodeViewConfig> implements I_CodeView {
    protected override __createRoot( config: I_CodeViewConfig ): HTMLElement {
        return document.createElement( "code" );
    }
}

export interface I_EmViewConfig extends I_StringViewElementConfig<"em"> {
}
export interface I_EmView extends I_StringViewElement<HTMLElement, "em"> {
}
export class EmView extends StringViewElement<HTMLElement, "em", I_EmViewConfig> implements I_EmView {
    protected override __createRoot( config: I_EmViewConfig ): HTMLElement {
        return document.createElement( "em" );
    }
}

export interface I_IViewConfig extends I_StringViewElementConfig<"i"> {
}
export interface I_IView extends I_StringViewElement<HTMLElement, "i"> {
}
export class IView extends StringViewElement<HTMLElement, "i", I_IViewConfig> implements I_IView {
    protected override __createRoot( config: I_IViewConfig ): HTMLElement {
        return document.createElement( "i" );
    }
}

export interface I_LabelViewConfig extends I_StringViewElementConfig<"label"> {
    htmlFor?: string;
}
export interface I_LabelView extends I_StringViewElement<HTMLLabelElement, "label"> {
}
export class LabelView extends StringViewElement<HTMLLabelElement, "label", I_LabelViewConfig> implements I_LabelView {
    protected override __createRoot( config: I_LabelViewConfig ): HTMLLabelElement {
        const root = document.createElement( "label" );
        if( typeof config.htmlFor === "string" ) root.htmlFor = config.htmlFor;
        return root;
    }
}

export interface I_MarkViewConfig extends I_StringViewElementConfig<"mark"> {
}
export interface I_MarkView extends I_StringViewElement<HTMLElement, "mark"> {
}
export class MarkView extends StringViewElement<HTMLElement, "mark", I_MarkViewConfig> implements I_MarkView {
    protected override __createRoot( config: I_MarkViewConfig ): HTMLElement {
        return document.createElement( "mark" );
    }
}

export interface I_SViewConfig extends I_StringViewElementConfig<"s"> {
}
export interface I_SView extends I_StringViewElement<HTMLElement, "s"> {
}
export class SView extends StringViewElement<HTMLElement, "s", I_SViewConfig> implements I_SView {
    protected override __createRoot( config: I_SViewConfig ): HTMLElement {
        return document.createElement( "s" );
    }
}

export interface I_SmallViewConfig extends I_StringViewElementConfig<"small"> {
}
export interface I_SmallView extends I_StringViewElement<HTMLElement, "small"> {
}
export class SmallView extends StringViewElement<HTMLElement, "small", I_SmallViewConfig> implements I_SmallView {
    protected override __createRoot( config: I_SmallViewConfig ): HTMLElement {
        return document.createElement( "small" );
    }
}

export interface I_SpanViewConfig extends I_StringViewElementConfig<"span"> {
}
export interface I_SpanView extends I_StringViewElement<HTMLSpanElement, "span"> {
}
export class SpanView extends StringViewElement<HTMLSpanElement, "span", I_SpanViewConfig> implements I_SpanView {
    protected override __createRoot( config: I_SpanViewConfig ): HTMLSpanElement {
        return document.createElement( "span" );
    }
}

export interface I_StrongViewConfig extends I_StringViewElementConfig<"strong"> {
}
export interface I_StrongView extends I_StringViewElement<HTMLElement, "strong"> {
}
export class StrongView extends StringViewElement<HTMLElement, "strong", I_StrongViewConfig> implements I_StrongView {
    protected override __createRoot( config: I_StrongViewConfig ): HTMLElement {
        return document.createElement( "strong" );
    }
}

export interface I_SubViewConfig extends I_StringViewElementConfig<"sub"> {
}
export interface I_SubView extends I_StringViewElement<HTMLElement, "sub"> {
}
export class SubView extends StringViewElement<HTMLElement, "sub", I_SubViewConfig> implements I_SubView {
    protected override __createRoot( config: I_SubViewConfig ): HTMLElement {
        return document.createElement( "sub" );
    }
}

export interface I_SupViewConfig extends I_StringViewElementConfig<"sup"> {
}
export interface I_SupView extends I_StringViewElement<HTMLElement, "sup"> {
}
export class SupView extends StringViewElement<HTMLElement, "sup", I_SupViewConfig> implements I_SupView {
    protected override __createRoot( config: I_SupViewConfig ): HTMLElement {
        return document.createElement( "sup" );
    }
}

export interface I_TimeViewConfig extends I_StringViewElementConfig<"time"> {
}
export interface I_TimeView extends I_StringViewElement<HTMLTimeElement, "time"> {
}
export class TimeView extends StringViewElement<HTMLTimeElement, "time", I_TimeViewConfig> implements I_TimeView {
    protected override __createRoot( config: I_TimeViewConfig ): HTMLTimeElement {
        return document.createElement( "time" );
    }
}

export interface I_UViewConfig extends I_StringViewElementConfig<"u"> {
}
export interface I_UView extends I_StringViewElement<HTMLElement, "u"> {
}
export class UView extends StringViewElement<HTMLElement, "u", I_UViewConfig> implements I_UView {
    protected override __createRoot( config: I_UViewConfig ): HTMLElement {
        return document.createElement( "u" );
    }
}

// =====================================================
// Block String-Views
// These tags are typically used as standalone text blocks.
// =====================================================

export interface I_BlockquoteViewConfig extends I_StringViewElementConfig<"blockquote"> {
}
export interface I_BlockquoteView extends I_StringViewElement<HTMLQuoteElement, "blockquote"> {
}
export class BlockquoteView extends StringViewElement<HTMLQuoteElement, "blockquote", I_BlockquoteViewConfig> implements I_BlockquoteView {
    protected override __createRoot( config: I_BlockquoteViewConfig ): HTMLQuoteElement {
        return document.createElement( "blockquote" );
    }
}

export interface I_DivViewConfig extends I_StringViewElementConfig<"div"> {
}
export interface I_DivView extends I_StringViewElement<HTMLDivElement, "div"> {
}
export class DivView extends StringViewElement<HTMLDivElement, "div", I_DivViewConfig> implements I_DivView {
    protected override __createRoot( config: I_DivViewConfig ): HTMLDivElement {
        return document.createElement( "div" );
    }
}

export interface I_H1ViewConfig extends I_StringViewElementConfig<"h1"> {
}
export interface I_H1View extends I_StringViewElement<HTMLHeadingElement, "h1"> {
}
export class H1View extends StringViewElement<HTMLHeadingElement, "h1", I_H1ViewConfig> implements I_H1View {
    protected override __createRoot( config: I_H1ViewConfig ): HTMLHeadingElement {
        return document.createElement( "h1" );
    }
}

export interface I_H2ViewConfig extends I_StringViewElementConfig<"h2"> {
}
export interface I_H2View extends I_StringViewElement<HTMLHeadingElement, "h2"> {
}
export class H2View extends StringViewElement<HTMLHeadingElement, "h2", I_H2ViewConfig> implements I_H2View {
    protected override __createRoot( config: I_H2ViewConfig ): HTMLHeadingElement {
        return document.createElement( "h2" );
    }
}

export interface I_H3ViewConfig extends I_StringViewElementConfig<"h3"> {
}
export interface I_H3View extends I_StringViewElement<HTMLHeadingElement, "h3"> {
}
export class H3View extends StringViewElement<HTMLHeadingElement, "h3", I_H3ViewConfig> implements I_H3View {
    protected override __createRoot( config: I_H3ViewConfig ): HTMLHeadingElement {
        return document.createElement( "h3" );
    }
}

export interface I_H4ViewConfig extends I_StringViewElementConfig<"h4"> {
}
export interface I_H4View extends I_StringViewElement<HTMLHeadingElement, "h4"> {
}
export class H4View extends StringViewElement<HTMLHeadingElement, "h4", I_H4ViewConfig> implements I_H4View {
    protected override __createRoot( config: I_H4ViewConfig ): HTMLHeadingElement {
        return document.createElement( "h4" );
    }
}

export interface I_H5ViewConfig extends I_StringViewElementConfig<"h5"> {
}
export interface I_H5View extends I_StringViewElement<HTMLHeadingElement, "h5"> {
}
export class H5View extends StringViewElement<HTMLHeadingElement, "h5", I_H5ViewConfig> implements I_H5View {
    protected override __createRoot( config: I_H5ViewConfig ): HTMLHeadingElement {
        return document.createElement( "h5" );
    }
}

export interface I_H6ViewConfig extends I_StringViewElementConfig<"h6"> {
}
export interface I_H6View extends I_StringViewElement<HTMLHeadingElement, "h6"> {
}
export class H6View extends StringViewElement<HTMLHeadingElement, "h6", I_H6ViewConfig> implements I_H6View {
    protected override __createRoot( config: I_H6ViewConfig ): HTMLHeadingElement {
        return document.createElement( "h6" );
    }
}

export interface I_PViewConfig extends I_StringViewElementConfig<"p"> {
}
export interface I_PView extends I_StringViewElement<HTMLParagraphElement, "p"> {
}
export class PView extends StringViewElement<HTMLParagraphElement, "p", I_PViewConfig> implements I_PView {
    protected override __createRoot( config: I_PViewConfig ): HTMLParagraphElement {
        return document.createElement( "p" );
    }
}

export interface I_PreViewConfig extends I_StringViewElementConfig<"pre"> {
}
export interface I_PreView extends I_StringViewElement<HTMLPreElement, "pre"> {
}
export class PreView extends StringViewElement<HTMLPreElement, "pre", I_PreViewConfig> implements I_PreView {
    protected override __createRoot( config: I_PreViewConfig ): HTMLPreElement {
        return document.createElement( "pre" );
    }
}

// =====================================================
// Leaf String-Views
// These tags are usually used as leaf nodes inside composites.
// =====================================================


export interface I_CaptionViewConfig extends I_StringViewElementConfig<"caption"> {
}
export interface I_CaptionView extends I_StringViewElement<HTMLTableCaptionElement, "caption"> {
}
export class CaptionView extends StringViewElement<HTMLTableCaptionElement, "caption", I_CaptionViewConfig> implements I_CaptionView {
    protected override __createRoot( config: I_CaptionViewConfig ): HTMLTableCaptionElement {
        return document.createElement( "caption" );
    }
}

export interface I_DdViewConfig extends I_StringViewElementConfig<"dd"> {
}
export interface I_DdView extends I_StringViewElement<HTMLElement, "dd"> {
}
export class DdView extends StringViewElement<HTMLElement, "dd", I_DdViewConfig> implements I_DdView {
    protected override __createRoot( config: I_DdViewConfig ): HTMLElement {
        return document.createElement( "dd" );
    }
}

export interface I_DtViewConfig extends I_StringViewElementConfig<"dt"> {
}
export interface I_DtView extends I_StringViewElement<HTMLElement, "dt"> {
}
export class DtView extends StringViewElement<HTMLElement, "dt", I_DtViewConfig> implements I_DtView {
    protected override __createRoot( config: I_DtViewConfig ): HTMLElement {
        return document.createElement( "dt" );
    }
}

export interface I_LiViewConfig extends I_StringViewElementConfig<"li"> {
}
export interface I_LiView extends I_StringViewElement<HTMLLIElement, "li"> {
}
export class LiView extends StringViewElement<HTMLLIElement, "li", I_LiViewConfig> implements I_LiView {
    protected override __createRoot( config: I_LiViewConfig ): HTMLLIElement {
        return document.createElement( "li" );
    }
}

export interface I_OptionViewConfig extends I_StringViewElementConfig<"option"> {
    value?: string;
}
export interface I_OptionView extends I_StringViewElement<HTMLOptionElement, "option"> {
}
export class OptionView extends StringViewElement<HTMLOptionElement, "option", I_OptionViewConfig> implements I_OptionView {
    protected override __createRoot( config: I_OptionViewConfig ): HTMLOptionElement {
        const root = document.createElement( "option" );
        if( typeof config.value === "string" ) root.value = config.value;
        return root;
    }
}

export interface I_TdViewConfig extends I_StringViewElementConfig<"td"> {
}
export interface I_TdView extends I_StringViewElement<HTMLTableCellElement, "td"> {
}
export class TdView extends StringViewElement<HTMLTableCellElement, "td", I_TdViewConfig> implements I_TdView {
    protected override __createRoot( config: I_TdViewConfig ): HTMLTableCellElement {
        return document.createElement( "td" );
    }
}

export interface I_ThViewConfig extends I_StringViewElementConfig<"th"> {
}
export interface I_ThView extends I_StringViewElement<HTMLTableCellElement, "th"> {
}
export class ThView extends StringViewElement<HTMLTableCellElement, "th", I_ThViewConfig> implements I_ThView {
    protected override __createRoot( config: I_ThViewConfig ): HTMLTableCellElement {
        return document.createElement( "th" );
    }
}
