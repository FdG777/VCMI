export type WritableCSSProperties = {
    [K in keyof CSSStyleDeclaration as
        CSSStyleDeclaration[K] extends Function ? never :
            K extends 'length' | 'parentRule' | 'cssText' | 'cssFloat' ? never :
                K
    ]?: CSSStyleDeclaration[K];
};

export type CSSStyle = string | WritableCSSProperties;
