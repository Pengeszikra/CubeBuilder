/*

  simple modular JS.ES6 framework based on hexmachina ideas

    injector,
    modules,
    commands,
    ( services ),

    instead protected variable global var

    destination is: class creating with dependency injection

    app = fun( inject )

*/

'use strict';
// utility
Object.defineProperty( window , 'log' , { set: p => console.log(p), get: ()=>'log = ...' })
var GUID = ( wide = 7 ) => Math.random().toString(36).match(/[a-zA-Z].*/)[0].slice(-wide).toUpperCase();



// window.tie = new CubeBuilder( config.CubeBuilder )

// --------------------[ Application ]----------------------

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

  var scene = inject.scene
  var camera = inject.camera
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