'use strict';
// Play with cubes ... minimal 3D engine begining ... spider paint next version

Object.defineProperty( window , 'log' , { set: p => console.log(p), get: ()=>'log = ...' })

const RAD = 180/Math.PI
const SIZE = 42

const colorRandom = () => ~~( Math.random() * 0xFFFFFF ) 
const colorLightGray = () => ~~( Math.random()*0x7F + 0x80 ) * 0x010101
const colorGray = () => (~~( Math.random() * 0xFF ) * 0x010101)

const ACTION_DOWN = "mousedown"
const ACTION_MOVE = "mousemove"
const ACTION_UP = "mouseup"


function TIE( window, document ) // Three Interactive Engine
{  

const RAD = 180/Math.PI
const FOW = 55
const MAX_DISTANCE = 15000

var renderer, scene, camera, width, height

  class Core
  {
    constructor( startWidth, startHeight )
    {
      this.window = window
      this.document = document        
      
      scene = new THREE.Scene()
      width = startWidth
      height = startHeight
      
      camera = new THREE.PerspectiveCamera( FOW , this.aspect , 1, MAX_DISTANCE )
      camera.position.set( 0, 0, 500 )
      camera.updateProjectionMatrix()
      
      renderer = new THREE.WebGLRenderer( { antialias: true } )
      renderer.setSize( startWidth, startHeight )
      
      this.backgroundColor = 0x7799AA
      scene.fog = new THREE.FogExp2( this.backgroundColor , 0.00001 )
      renderer.setClearColor( this.backgroundColor )
      renderer.setClearAlpha( 1 )

      renderer.shadowMap.enabled = true
      
      let hemiLight = new THREE.HemisphereLight( 0xFFFFFF, 0xAAAAAA, 1 )
        hemiLight.color.setHSL( 0.6, 1 , 0.6 )
        hemiLight.color.setHex( 0x010101 )
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 )
        hemiLight.groundColor.setHex( 0xAAAAAA )
        hemiLight.position.set( 800, 500, 0 )
      
      this.hemiLight = hemiLight
      scene.add( this.hemiLight )

      this.ambient = new THREE.AmbientLight( 0x999999 )
      scene.add( this.ambient )

      document.body.appendChild( renderer.domElement )
      renderer.domElement.oncontextmenu = e => e.preventDefault()
      window.addEventListener('resize',this.resize.bind(this),false)

      scene.add( camera )
      this.animate()      
    }

    animate()
    {      
      requestAnimationFrame( this.animate.bind( this ) )
      renderer.render( scene, camera )
    }
    
    get aspect(){ return width/ height }
    
    // exports 
    get camera(){ return camera }
    get scene(){ return scene }
    get renderer(){ return renderer }
    get width(){ return width }
    get height(){ return height }
    
    resize()
    {
      width = window.innerWidth
      height = window.innerHeight
      renderer.setSize( width, height )
      camera.aspect = this.aspect
      camera.updateProjectionMatrix()
    }

    testAsset()
    {
       let box = this.boxFactory( SIZE, SIZE, SIZE , 0xBBCCDD ) 
       scene.add( box )
       box.rotateX( 12/RAD )
       //requestAnimationFrame( _ => box.rotateY( 3/RAD ) )
       this.stop = setInterval( _ => box.rotateY( 3/RAD ) , 20 )
    }

    boxFactory( w , h , d , color, opacity = 1 )
    {
      let geom = new THREE.BoxGeometry( w , h , d, 1, 1, 1 )
          geom.translate( 0 , 0 , d/2 )
      let shading = THREE.FlatShading
      // let wireframe = true      
      opacity = Math.random() >.9 ? .5 : 1
      let transparent = opacity < 1
      let mat = new THREE.MeshPhongMaterial( {color, shading, opacity , transparent } )
      return new THREE.Mesh( geom, mat )
    }
    
    cylinderFactory( w=30, h=70, color )
    {
      let geom = new THREE.CylinderGeometry( 0, w , h , 7, 1 )
          geom.translate( 0, h/2, 0 )
          geom.rotateX( Math.PI/2 )
      let shading = THREE.FlatShading
      let mat = new THREE.MeshPhongMaterial( {color, shading } )
      return new THREE.Mesh( geom, mat )
    }      

    cube( x=0 , y=0 , z=0, color=0x337788 )
    {
      let cube = this.boxFactory( SIZE, SIZE, SIZE , color )
      let DIST = SIZE * 1.1
      cube.translateX( DIST*x ).translateY( DIST*y ).translateZ( DIST*z )      
      scene.add( cube )
      return cube
    }    
  }
  
  class Editor{}
  
  return new Core( window.innerWidth , window.innerHeight )
  
} // end TIE

//------------ Sweeper Interaction ---- [ https://github.com/Pengeszikra/lastline-frontend ]

class ThreeSwiper 
{
  constructor( tie )
  {     
    // this.focus = tie.scene
    // log this.focus
    this.win = tie.window
    this.tie = tie
    this.areaWidth = tie.width
    this.areaHeight = tie.height    
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.origo = new THREE.Vector2();
    this.final = new THREE.Vector2(1,1);
    this.sensorOn()
  }

  sensorOn()
  { 
    this.win.addEventListener( ACTION_DOWN, this.moveStart.bind(this),false)
    this.win.addEventListener( ACTION_MOVE, this.moving.bind(this),false)
    this.win.addEventListener( ACTION_UP, this.moveStop.bind(this),false)    
    this.isDown = false
  }

  sensorOff()
  { 
    this.win.removeEventListener(ACTION_DOWN, this.moveStart.bind(this) )
    this.win.removeEventListener( ACTION_MOVE, this.moving.bind(this) )
    this.win.removeEventListener( ACTION_UP, this.moveStop.bind(this) )    
  }

  moveStart( e )
  {   
    this.setMouse( e ) 
    this.isDown = true    
    this.final = this.origo = this.mouse.clone() 
    requestAnimationFrame( this.swiping.bind(this) )
  }

  moveStop(){ this.isDown = false }

  moving(e)
  { 
    this.setMouse( e )  
    if(this.isDown){      
      this.final = this.mouse.clone() 
    }
  } 

  swiping(){ if(this.isDown) requestAnimationFrame( this.swiping.bind(this) ) }

  setMouse(e)
  { 
    this.mouse.x = ( e.clientX / this.areaWidth ) * 2 - 1
    this.mouse.y = -( e.clientY / this.areaHeight ) * 2 + 1     
  }

  get distance()
  { 
    let ox = this.origo.x
    let fx = this.final.x
    let oy = this.origo.y
    let fy = this.final.y    
    return Math.sqrt( (ox-fx)*(ox-fx) + (oy-fy)*(oy-fy) )
  }

  get tilt(){ return (this.origo.x - this.final.x) / (this.origo.y - this.final.y) }
}

class CameraSwiper extends ThreeSwiper 
{
  constructor( tie )
  { 
    super( tie )
    this.focus = false
  }
  
  setMouse(e)
  { 
    this.mouse.x = ( e.clientX / this.areaWidth ) * 2 - 1
    this.mouse.y = -( e.clientY / this.areaHeight ) * 2 + 1 
  } 

  moveStart(e){ 
    this.isAltOnStart = e.altKey 
    
    this.focus = this.found().find
    this.isFocusRotating = e.shiftKey
    this.isFocusZooming = e.ctrlKey || e.button == 2
    this.setMouse( e ) 
    this.isDown = true    
    this.final = this.origo = this.mouse.clone() 
    super.moveStart( e )
    requestAnimationFrame( this.swiping.bind(this) )    
  } 

  swiping(){  
    if(this.isDown)
    {
      let distX = (this.origo.x - this.final.x)
      let distY = (this.origo.y - this.final.y)

      if( this.focus )
      {
        if ( this.isFocusRotating )
        {
          this.focus.rotateY( distX  * -.02 )
          this.focus.rotateX( distY  * +.02 ) // two direction rotate
        } 
        else if( this.isFocusZooming )
        {
          this.focus.translateZ( distY  * 25 ) 
        } 
        else 
        { 
          this.focus.translateX( distX  * - 15 )
          this.focus.translateY( distY  * - 15 )
        }
        this.focus.updateMatrixWorld()
      } 
      else 
      {
        if ( this.isFocusRotating )
        {
          //
        } 
        else if ( this.isFocusZooming )
        {
          this.tie.camera.translateX( distX  * -25 ) 
          this.tie.camera.translateY( distY  * -25 ) 
        } 
        else 
        {
          this.tie.camera.rotateY( distX  * .05 )         
          this.tie.camera.translateZ( distY  * 25 )
        }       
      }

      requestAnimationFrame( this.swiping.bind(this) )
    }
  } 


  moveStop()
  {
    super.moveStop()
    if( this.isAltOnStart && this.distance < 0.01 ) this.placeObject()
  }

  found()
  {
    let ray = new THREE.Raycaster()
        ray.setFromCamera( this.mouse, this.tie.camera )
        // log = ray        
    var intersects = ray.intersectObjects( this.tie.scene.children , true )    
    window.sect = intersects //TODO:remove 
    let find = intersects.length ? intersects[0].object : null
    return {find,intersects}
  }
  
  // https://threejs.org/examples/#webgl_raycast_texture
  // https://threejs.org/examples/?q=ray#webgl_geometry_terrain_raycast
  
  placeObject()
  {
    let box = Math.random()>.5 ?
      this.tie.cube(0,0,0, colorRandom() )
      :
      this.tie.cylinderFactory( SIZE/5, SIZE,  colorLightGray() ); this.tie.scene.add( box )
    window.lbox = box //TODO:remove 
    let f = this.found()

    if(!f.find)
    {
      box.position.addVectors( this.tie.camera.position , new THREE.Vector3( 0 , 0 , 0  ) )
      box.translateZ( -200 )      
    }
    else
    {      
      // https://threejs.org/docs/index.html#Reference/Math/Quaternion
      window.f = f      
      let fi = f.intersects[0]
      fi.object.updateMatrixWorld()
      let faceNormal = fi.face.normal
      let clacedNormal = fi.face.normal.clone().applyQuaternion( fi.object.getWorldQuaternion() )

        box.lookAt( faceNormal )
        fi.object.add( box )
        let localPoint = fi.point.clone().sub( fi.object.getWorldPosition() )
        // talan meg el is kell forgatnom ??
        box.position.copy( localPoint )
      return

      box.lookAt( clacedNormal ) // KIHAL -- majdnem jo
      box.position.copy( fi.point )
    }
  }
  
  
} 

window.onload = function()
{
  let tie = new TIE( window, document )
  window.tie = tie
  
  window.interaction = new CameraSwiper( tie )
  
  
  tie.testAsset()
 
  let cub = tie.cube(1,1)
      cub.rotateY( 45/RAD )
  tie.cube(1,2)  
  tie.cube(2,2)
  tie.cube(1,3)
  
  /*
  tie.cube(3,1)
  tie.cube(3,2)  
  tie.cube(3,3)
  
  tie.cube(-1,1)
  tie.cube(-1,2)  
  tie.cube(-2,2,0,0xAAAA77)
  tie.cube(-1,3)
  tie.cube(-1,-1,0,0xAAAA77)  
  
  
  let big = tie.boxFactory( 800, 800, 2 ,  0x888855 )
      tie.scene.add( big )
      big.translateZ( -900 ) 
      big.rotateY( 75/RAD )
   */
  
  // https://github.com/mrdoob/three.js/issues/1486  
  // http://stackoverflow.com/questions/17443056/threejs-keep-object-on-surface-of-another-object
  // http://stackoverflow.com/questions/16268482/three-js-convert-face-normal-from-local-space-to-world-space

  // JSON pretty print
  // JSON.stringify( o.toJSON(), null , "  " )
  // JSON.stringify( o.toJSON(), null , 2 )
  
  /* TODO 
  
    - move and rotation by global position
    - color selection
    - scale object
    - detach object
    - select shape
    
    - modular interface for editor 
    - short keys
    - save/load 
    
    
  
  */

  
}


