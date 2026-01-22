export function arrayRemoveDuplicates<INPUT extends unknown[]>( input: INPUT ): INPUT[number][] {
    const out: INPUT[number][] = [];
    const seen = new Set<INPUT[number]>();
    input.forEach( ( e: INPUT[number] ) => {
        if( ! seen.has( e ) ) {
            seen.add( e );
            out.push( e );
        }
    } );
    return out;
}

export async function loop( loopCount: number, cycleTime: number, func: ( loopCount: number ) => void ): Promise<void> {
    if( loopCount  < 1 ) return;
    let incrementer = 0;
    return new Promise( ( resolve ) => {
        const interval = setInterval( () => {
            func( ++incrementer );
            if( incrementer >= loopCount ) {
                clearInterval( interval );
                resolve();
            }
        }, cycleTime )
    } );
}
