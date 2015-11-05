#pragma strict

var jumpClip: AudioClip;
var deathClip: AudioClip;
var respawnClip: AudioClip;
//var audioClip: AudioClip;
private var audioSource : AudioSource;

function Awake () {
	audioSource = GetComponent.<AudioSource>();
}

function Jump () : void {
	audioSource.PlayOneShot(jumpClip, 1F);	
}

function Death () : void {
	audioSource.PlayOneShot(deathClip, 1F);	
}

function Respawn () : void {
	audioSource.PlayOneShot(respawnClip, 1F);	
}