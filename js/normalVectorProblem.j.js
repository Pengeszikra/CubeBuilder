//http://stackoverflow.com/questions/17443056/threejs-keep-object-on-surface-of-another-object


var raycaster = new THREE.Raycaster();
raycaster.set(yourMovingObject.position, THREE.Vector3(0, -1, 0));
// After that you will need to determine a distance from the ground where the object needs to stop 'falling'

var distance = 40; //set to your own measurements
// And last but not least, check the intersections

var velocity = new THREE.Vector3();

var intersects = raycaster.intersectObject(floor); //use intersectObjects() to check the intersection on multiple

//new position is higher so you need to move you object upwards
if (distance > intersects[0].distance) {        
    yourMovingObject.position.y += (distance - intersects[0].distance) - 1; // the -1 is a fix for a shake effect I had
}

//gravity and prevent falling through floor
if (distance >= intersects[0].distance && velocity.y <= 0) {
    velocity.y = 0;
} else if (distance <= intersects[0].distance && velocity.y === 0) {
    velocity.y -= delta ;
}

yourMovingObject.translateY(velocity.y);