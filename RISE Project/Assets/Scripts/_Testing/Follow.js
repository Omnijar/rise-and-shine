#pragma strict

var target : Transform;
var followDelay : float = 0.2f;
var recordedPos : List.<Vector3>;
var pos : int;

var collected : boolean;
var respawning : boolean;
private var running : boolean;

function Initialise ( toggle : boolean ) : IEnumerator {
	if(running)
		return;
	
	running = true;
	respawning = false;	
	
	if(toggle){
		transform.position.x = target.position.x;
		transform.position.y = target.position.y;
	}else{
		collected = true;
	}
	
	Record();
	yield WaitForSeconds(followDelay);
	Follow();
}

function Record () : IEnumerator {
	while(!respawning){
		recordedPos.Add(target.position);	
		yield;
	}
}

function Follow () : IEnumerator {
	while(!respawning){
	
		//if(respawning){
		//	transform.position.x = target.position.x;
		//	transform.position.y = target.position.y;	
		//}else{
			transform.position.x = Mathf.Lerp(transform.position.x, recordedPos[pos].x, Time.deltaTime*15);
			transform.position.y = Mathf.Lerp(transform.position.y, recordedPos[pos].y, Time.deltaTime*20);
			pos++;
		//}
		yield;
	}
	
	running = false;
	pos = 0;
	recordedPos.Clear();
}