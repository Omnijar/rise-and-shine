#pragma strict

var highlightClip : AudioClip;
var pressClip : AudioClip;
private var audioSource : AudioSource;

function Awake () {
	audioSource = GetComponent.<AudioSource>();
}

function Highlight () : void {
	audioSource.PlayOneShot(highlightClip, 1f);
}

function Pressed () : void {
	audioSource.PlayOneShot(pressClip, 1f);
}