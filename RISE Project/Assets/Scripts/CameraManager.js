#pragma strict

var target : Transform;
var playerCamera : Transform;

@Range(1f,40f)
var speed : float = 10f;
var offset : Vector3; // Set at runtime

var follow : boolean = true;
private var velocity : Vector3;

function Awake () {
	offset = playerCamera.position-target.position;
}

function RemoveControl () : void {
	Debug.Log("Control Removed");
	follow = false;
}

function RegainControl () : void {
	Debug.Log("Control Received");
	follow = true;
}

function LateUpdate () {
	if(follow)
		playerCamera.position = Vector3.SmoothDamp(playerCamera.position, target.position+offset, velocity, Time.deltaTime*speed);
		
		//playerCamera.position = Vector3.Lerp(playerCamera.position, target.position+offset, Time.deltaTime*speed);
		//playerCamera.position.x = target.position.x+offset.x;
}