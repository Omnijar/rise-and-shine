#pragma strict

var sfxMixer : Audio.AudioMixer;

var audioOn : Sprite;
var audioOff : Sprite;
var audioButton : UnityEngine.UI.Image;

var toggle : boolean = true;
private var toggleInt : int;

// 0 = Off
// 1 = On

function Start () {
	toggleInt = PlayerPrefs.GetInt("SFX");
	
	if(toggleInt == 0)
		Toggle();
			
}

function Toggle () : void {
	toggle = !toggle;

	if(toggle){
		audioButton.sprite = audioOn;
		PlayerPrefs.SetInt("SFX", 1);
		sfxMixer.SetFloat("SFXvolume", 0f);
	}else{
		audioButton.sprite = audioOff;
		PlayerPrefs.SetInt("SFX", 0);
		sfxMixer.SetFloat("SFXvolume", -100f);
	}
}
