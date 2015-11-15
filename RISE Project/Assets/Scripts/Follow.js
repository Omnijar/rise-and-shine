#pragma strict

var target : Transform;
var targetVisual : Transform;

var playerController : PlayerController;

var followDelay : float = 0.2f;
var recordedPos : List.<Vector3>;
var recordedRot : List.<float>;
var recordedJump : List.<boolean>;

var pos : int;

var collected : boolean;
var respawning : boolean;

var animator : Animator;
var characterVisual : Transform;

var recruitAnimator : Animator;
private var running : boolean;

var lastPos : Vector3;
//var particleEffect : ParticleSystem;
var recruitEffect : GameObject;

function Initialise ( toggle : boolean ) : IEnumerator {
	if(running)
		return;
	
	running = true;
	respawning = false;	
	
	if(toggle){
		transform.position.x = target.position.x;
		transform.position.y = target.position.y;
		characterVisual.rotation.y = targetVisual.rotation.y;
	}else{
		collected = true;
		animator.SetBool("recruit", true);
		recruitAnimator.SetTrigger("show");
	
		var thisEffect : GameObject = Instantiate(recruitEffect, transform.position, Quaternion.identity);
		thisEffect.transform.parent = transform;
		//if(particleEffect)
		//	particleEffect.Play();
		//else
		//	Debug.Log("Need's Particle");
	}
	
	Record();
	yield WaitForSeconds(followDelay);
	Follow();
	yield WaitForSeconds(0.1f);
	animator.SetBool("recruit", false);

}

function Record () : IEnumerator {
	while(!respawning){
		recordedPos.Add(target.position);
		recordedRot.Add(targetVisual.rotation.y);
		recordedJump.Add(playerController.jumping);	
		yield;
	}
}

function Follow () : IEnumerator {
	while(!respawning){
			
			lastPos.x = transform.position.x;			
			lastPos.y = transform.position.y;			
			//animator.SetBool("jumping", true);
		
			transform.position.x = Mathf.Lerp(transform.position.x, recordedPos[pos].x, Time.deltaTime*15);
			transform.position.y = Mathf.Lerp(transform.position.y, recordedPos[pos].y, Time.deltaTime*20);
			animator.SetBool("jumping", recordedJump[pos]);
			//characterVisual.rotation.y = Mathf.Lerp(characterVisual.position.y, recordedRot[pos], Time.deltaTime*10);
			characterVisual.rotation.y = recordedRot[pos];
			pos++;
			
			var currentPos : Vector3 = transform.position;	
			var speed : float = Mathf.Abs(currentPos.x-lastPos.x);	
			
			//var jumpSpeed : float = Mathf.Abs(currentPos.y-lastPos.y);
			
			//if(jumpSpeed > 0.05){
			//	animator.SetBool("jumping", true);
			//}else{
			//	animator.SetBool("jumping", false);
			//}
			
			//Debug.Log(speed);
																							
			if(speed > 0.05){
				animator.SetInteger("speed", 1);
			}else{
				animator.SetInteger("speed", 0);
			}
						
		//}
		yield;
	}
	
	running = false;
	pos = 0;
	recordedPos.Clear();
	recordedRot.Clear();
	recordedJump.Clear();
}