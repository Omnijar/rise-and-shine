#pragma strict

var worth : int = 250;
private var pitchIncrease : float = 0.1f;
var animator : Animator;

public var audioClip: AudioClip;
private var used : boolean;
private var audioSource : AudioSource;

function Awake () {
	audioSource = GetComponent.<AudioSource>();
}

function OnTriggerEnter (other : Collider) : void { 
	if(used)
		return;

	used = true;
	var scoreManager : ScoreManager = other.GetComponent.<ScoreManager>();
	var thisPitch : float = scoreManager.GetPitch();	
	audioSource.pitch = thisPitch;
	audioSource.PlayOneShot(audioClip, 1F);
	scoreManager.AddScore(worth);
	scoreManager.currentPitch += pitchIncrease;
	Remove();
}

function Remove () : IEnumerator {
	animator.SetTrigger("Remove");
	yield WaitForSeconds(2f);
	Destroy(gameObject);
}