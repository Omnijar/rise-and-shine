#pragma strict

function Awake () {
	GetComponent.<UnityEngine.UI.Text>().text = PlayerPrefs.GetInt("highScore").ToString();
}
