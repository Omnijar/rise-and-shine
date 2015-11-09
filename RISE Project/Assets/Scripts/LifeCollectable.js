#pragma strict

var worth : int = 250;
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
	audioSource.PlayOneShot(audioClip, 1F);
	other.GetComponent.<LifeManager>().AddLives(worth);
	Remove();
}

function Remove () : IEnumerator {
	animator.SetTrigger("Remove");
	yield WaitForSeconds(2f);
	Destroy(gameObject);
}