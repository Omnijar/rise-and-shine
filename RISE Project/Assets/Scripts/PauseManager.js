#pragma strict

var paused : boolean;

var pauseKey : KeyCode = KeyCode.Escape;
var pauseMenu : GameObject;

var firstSelected : GameObject;

var eventSystem : UnityEngine.EventSystems.EventSystem;
var musicManager : MusicManager;

function Awake () : void {
	musicManager = GameObject.Find("MusicManager").GetComponent.<MusicManager>();
}

function Pressed () : void {
	Toggle();
}

function Toggle () {
	paused = !paused;
	pauseMenu.SetActive(paused);
	
	eventSystem.SetSelectedGameObject(null);
	
	if(paused){
		musicManager.Pause();
		eventSystem.SetSelectedGameObject(firstSelected);
		Time.timeScale = 0f;
	}else{
		musicManager.Resume();
		Time.timeScale = 1f;
	}
	
}

function Update () {
	if(Input.GetKeyDown(pauseKey)){
		Toggle();
	}
}