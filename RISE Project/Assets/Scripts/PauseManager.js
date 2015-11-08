#pragma strict

var paused : boolean;

var pauseKey : KeyCode = KeyCode.Escape;
var pauseMenu : GameObject;

var firstSelected : GameObject;

var eventSystem : UnityEngine.EventSystems.EventSystem;


function Pressed () : void {
	Toggle();
}

function Toggle () {
	paused = !paused;
	pauseMenu.SetActive(paused);
	
	eventSystem.SetSelectedGameObject(null);
	
	if(paused){
		eventSystem.SetSelectedGameObject(firstSelected);
		Time.timeScale = 0f;
	}else{
		Time.timeScale = 1f;
	}
	
}

function Update () {
	if(Input.GetKeyDown(pauseKey)){
		Toggle();
	}
}