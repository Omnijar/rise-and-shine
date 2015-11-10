#pragma strict

var target : Transform;
var followDelay : float = 0.2f;
var recordedPos : List.<Vector3>;
var pos : int;

private var running : boolean;

function Initialise () : IEnumerator {
	if(running)
		return;
		
	running = true;
	Record();
	yield WaitForSeconds(followDelay);
	Follow();
}

function Record () : IEnumerator {
	while(true){
		recordedPos.Add(target.position);	
		yield;
	}
}

function Follow () : IEnumerator {
	while(true){
		transform.position.x = Mathf.Lerp(transform.position.x, recordedPos[pos].x, Time.deltaTime*15);
		transform.position.y = Mathf.Lerp(transform.position.y, recordedPos[pos].y, Time.deltaTime*20);
		pos++;
		yield;
	}
	running = false;
}