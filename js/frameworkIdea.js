/*

  simple modular JS.ES6 framework based on hexmachina ideas

    injector,
    modules,
    commands,
    ( services ),

    instead protected variable global var

    destination is: class creating with dependency injection

    app = fun( inject )


    function Lami( inject ){ let { foo,id } = inject ; return new class Inner{ get zorro(){ return foo } }}
    l = new Lami({foo:GUID()})
    z = Lami({foo:()=>GUID()})
    z.zorro()
    z.zorro


    function Application( inject )
    {
      let
      { 
        dependency1, 
        dependency2         
      } 
      = inject

      return new class 
      
      ( ApplicationInstance
        {
          constructor( data )
          {
            this.data = data
          }

        }
      )( dependency1 )
    }

    // http://jsblocks.com/

*/

'use strict';
// utility
Object.defineProperty( window , 'log' , { set: p => console.log(p), get: ()=>'log = ...' })
var GUID = ( wide = 7 ) => Math.random().toString(36).match(/[a-zA-Z].*/)[0].slice(-wide).toUpperCase();

// jo kerdes hogy van-e valami ertelme ennek a szerkezetnek ?

// complex solution with di, this less class with protected variables
function Application( inject )
{
  let
  { 
    dependency1, 
    dependency2         
  } 
  = inject
  // = { dependency1:inject.a, dependency1:inject.b } // remap inject names

  class ApplicationInstance
  {
    constructor( data )
    {
      this.data = data
    }

    get d1(){ return dependency2 }
  }

  return new ApplicationInstance( dependency1 )
}


function GooFoo( inject )
{
  var { foo, goo } = inject

  return new function()
  {
    this.sum = foo + goo()
  }
}



// window.tie = new CubeBuilder( config.CubeBuilder )

// --------------------[ Application ]----------------------

  class FooMacro
  {
    constructor(){ this.module = inject.IFooModule }

    execute()
    { 
      //log = let value = this.module.guid     
      add( FooAdapterCommand )

    }
  }

  class FooModule
  {
    constructor(){} 
    
    fooFunction()
    {
      log = 'FooModule.fooFunction'
      log = inject.document
    } 
  }    

  var inject =
  {
    CubeBuilderApplication:
    {
      window,
      document,
      three: THREE,
      IFooModule: FooModule,
    }
  }

// class with protected parts
var CreateApplication = function( inject )
{

  //var scene = inject.scene
  //var camera = inject.camera
  var { scene , camera } = inject

  var ID

  class BasicCommand
  {
    constructor()
    {
      this.runner = inject.runner
      log = this.guid = GUID
    }

    add()
    {
      this.runner.add( this )
    }

    execute(){}
  }

  class FooAdapterCommand extends BasicCommand
  {
    execute()
    {
      let module = inject.IFooModule
          module.fooFunction()
    }
  }

  class EndDrag extends BasicCommand
  {
    execute()
    {
      let module = inject.IFooModule
          module.endDrag()
    }
  }  

  return new class CubeBuilder
  {
    constructor()
    {      
      ID = this.id = GUID()
      log = this.getId()
    }

    getId(){ return ID + ':' + this.id }

    getFoo(){ return inject.IFooModule }
  }
}

// simple class factory         
// let factory = ( className ) => new this[ className ]( config[ className ] )

// DI with destructor
// http://blog.brightinventions.pl/simplistic-javascript-dependency-injection-es6-destructuring/