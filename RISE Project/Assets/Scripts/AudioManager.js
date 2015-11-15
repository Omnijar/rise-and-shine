#pragma strict

var jumpClip: AudioClip;
var deathClip: AudioClip;
var respawnClip: AudioClip;
var clickClip: AudioClip;
//var audioClip: AudioClip;
private var audioSource : AudioSource;

function Awake () {
	audioSource = GetComponent.<AudioSource>();
}

function Jump () : void {
	audioSource.PlayOneShot(jumpClip, 0.8F);	
}

function Death () : void {
	audioSource.PlayOneShot(deathClip, 1F);	
}

function Respawn () : void {
	audioSource.PlayOneShot(respawnClip, 1F);	
}

function Click () : void {
	audioSource.PlayOneShot(clickClip, 0.7F);	
}