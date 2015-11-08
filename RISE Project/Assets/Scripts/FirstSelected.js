#pragma strict

var firstSelected : GameObject;
var eventSystem : UnityEngine.EventSystems.EventSystem;

function Start () {
	//eventSystem.SetSelectedGameObject(null);
	eventSystem.SetSelectedGameObject(firstSelected);
}