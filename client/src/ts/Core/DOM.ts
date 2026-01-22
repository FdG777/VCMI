export type DOMAttributes = Record<string, string>;

export class DOM {
    public static empty( node: Node ): void {
        while( node.firstChild ) node.removeChild( node.firstChild );
    }
    public static element( tag: string, attr?: DOMAttributes ): Element {
        const element = document.createElement( tag );
        if( attr ) {
            const a = Object.keys( attr );
            for( let i = 0; i < a.length; i++ ) element.setAttribute( a[i], attr[a[i]] );
        }
        return element;
    }
    public static text( text: string ): Text {
        return document.createTextNode( text );
    }
}
