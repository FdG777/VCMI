export interface I_Loader {
    loadBlob( url: string ): Promise<Blob>;
    loadJSON( url: string ): Promise<any>;
    loadResponse( url: string ): Promise<Response>;
    loadText( url: string ): Promise<string>;
}

export class Loader implements I_Loader {
    public async loadBlob( url: string ): Promise<Blob> {
        const response = await fetch( url );
        return response.blob();
    }
    public async loadJSON( url: string ): Promise<any> {
        const response = await fetch( url );
        return response.json();
    }
    public async loadResponse( url: string ): Promise<Response> {
        return fetch( url );
    }
    public async loadText( url: string ): Promise<string> {
        const response = await fetch( url );
        return response.text();
    }
}
