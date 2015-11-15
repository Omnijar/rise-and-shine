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
	if(follow){
		//playerCamera.position.x = Mathf.SmoothDamp(playerCamera.position.x, target.position.x+offset.x, velocity.x, Time.deltaTime*speed);
		playerCamera.position.x = Mathf.Lerp(playerCamera.position.x, target.position.x+offset.x, Time.deltaTime*15);
		playerCamera.position.y = Mathf.Lerp(playerCamera.position.y, target.position.y+offset.y, Time.deltaTime*6);
		//playerCamera.position.y = Mathf.SmoothDamp(playerCamera.position.y, target.position.y+offset.y, velocity.y, Time.deltaTime*(speed*3));		
	}	
		
		//playerCamera.position = Vector3.Lerp(playerCamera.position, target.position+offset, Time.deltaTime*speed);
		//playerCamera.position.x = target.position.x+offset.x;
}