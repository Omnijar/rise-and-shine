#pragma strict

var fader : UnityEngine.UI.Image;
var cutout : Material;

function Awake () {
	Feeder(0f,1f,0.5f);
}

function Transition (to : float, from : float, time : float) : void {
	Feeder(to,from,time);
} 

function Feeder (to : float, from : float, time : float) : IEnumerator {
	Debug.Log("Transition Received");
	var i : float = 0f;
	var cutoffValue : float;
	
	while ( i < 1 ){ 
		i += Time.unscaledDeltaTime/time;
		cutoffValue = Mathf.Lerp(to, from, i);
		cutout.SetFloat("_Cutoff", cutoffValue);
		//fader.material = cutout;
		yield;
	}
}

function OnApplicationQuit () {
	cutout.SetFloat("_Cutoff", 1f);
}