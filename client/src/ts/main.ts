/**
 * Application entry point.
 *
 * - Imports linker.js to expose all module exports on globalThis
 * - Starts the application
 */
import {Domain} from "./Core/Domain.js";
import {BooleanAnd, BooleanNot, BooleanOr, IsInInterval, IsLessOrEqual, IsMultiple} from "./Core/Expression.js";
import {DivView, I_DivViewConfig} from "./Core/MVC/View.js";
import {NumberGuard} from "./Core/TypeGuard.js";
import {ArrayModel, NumberArrayModel} from "./Core/MVC/Module/Domain/Collection/Mapping/Indexed/Array/Array.js";
import {SystemAccess, UserAccess} from "./Core/Interaction.js";


testArray();
//testDomain();
//testState();




function testDomain(): void {
    const or = new BooleanOr( [new IsInInterval( -8, -2, ), new IsInInterval( 2, 8 )] );
    const multiple = new IsMultiple( 2 );
    const and = new BooleanAnd( [or, multiple] );
    const not = new BooleanNot( and );
    const domain = new Domain( new NumberGuard(), not ).clone(); // domain should work after deserialization (Serializer roundtrip)
    for( let i = -10; i <= 10; i++ ) {
        const expression = domain.expression.stringify( i );
        const result = domain.accept( i );
        console.log( expression, " === ", result );
    } // domain works
}

function testArray(): void {
    const max = 20;
    const domain = new Domain<number>( new NumberGuard(), new IsLessOrEqual( max ) );
    const accessLevel = UserAccess;
    const model = new NumberArrayModel( { domain, accessLevel } );
    const controller = model.createController();
    const tagName = "div";
    const config: I_DivViewConfig = { tagName, controller };
    const view1 = new DivView( config );
    const view2 = new DivView( config);
    document.body.append( view1.root, view2.root );
    let increment = true;
    setInterval( () => {
        if( increment ) {
            model.append( model.length );
            if( model.length === max ) increment = false;
        }
        else {
            model.removeIndex( model.length - 1 );
            if( model.length === 0 ) increment = true;
        }
    }, 1000 );
}

/*
function testState(): void {
    const min = -10;
    const max = 10;
    const domain = new Domain<number>( new IsInInterval( min, max ) );
    const model = new StateModel( { domain, state: min } );
    const controller = model.createController();
    const tagName = "span";
    const config: I_DivViewConfig = { tagName, controller };
    const view1 = new SpanView( config );
    const view2 = new SpanView( config);
    document.body.append( view1.root, HTML.span( " | " ), view2.root );
    let increment = true;
    let state = model.state as number;
    setInterval( () => {
        if( increment ) {
            model.set( ++state );
            if( state >= max ) increment = false;
        }
        else {
            model.set( --state );
            if( state <= min ) increment = true;
        }
    }, 500 );
}
*/
