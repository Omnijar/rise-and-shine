#pragma strict

var worth : int = 2000;
var animator : Animator;
var follow : Follow;

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
	audioSource.PlayOneShot(audioClip, 1F);
	scoreManager.AddScore(worth);
	follow.Initialise();
	Remove();
}

function Remove () : IEnumerator {
	//animator.SetTrigger("Remove");
	Destroy(GetComponent.<Collider>());
}