#pragma strict

var sfxMixer : Audio.AudioMixer;

var audioOn : Sprite;
var audioOff : Sprite;
var audioButton : UnityEngine.UI.Image;

var toggle : boolean;
private var toggleInt : int;

// 0 = Off
// 1 = On

function Start () {
	toggleInt = PlayerPrefs.GetInt("SFX");
	
	Debug.Log("SFX is - " + toggleInt);
	
	if(toggleInt == 0)
		On();
	else
		Off();
			
}

function Toggle () : void {
	if(toggle){
		Off();
	}else{
		On();
	}
}

function On () : void {
	audioButton.sprite = audioOn;
	PlayerPrefs.SetInt("SFX", 0);
	sfxMixer.SetFloat("SFXvolume", 0f);
	toggle = true;
}

function Off () : void {
	audioButton.sprite = audioOff;
	PlayerPrefs.SetInt("SFX", 1);
	sfxMixer.SetFloat("SFXvolume", -100f);
	toggle = false;
}