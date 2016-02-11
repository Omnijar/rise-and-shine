#pragma strict

var gameMusic : AudioSource;
var menuMusic : AudioSource;

function Awake () {
	DontDestroyOnLoad(this);
}

function OnLevelWasLoaded () : void {
	if(Application.loadedLevelName == "01Game")
		Game();
	else
		Menu();
}

function Menu () : void {
	menuMusic.volume = 0.5f;
	gameMusic.Stop();
	menuMusic.Play();
}

function Game () : void {
	menuMusic.volume = 0.5f;
	gameMusic.Play();
	menuMusic.Stop();
}

function Pause () : void {
	menuMusic.volume = 0.1f;
	gameMusic.Stop();
	menuMusic.Play();
}

function Resume () : void {
	menuMusic.volume = 0.5f;
	gameMusic.Play();
	menuMusic.Stop();
}