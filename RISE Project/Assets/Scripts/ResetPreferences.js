#pragma strict

function ResetPreferences () : void {
	PlayerPrefs.DeleteAll();
	PlayerPrefs.Save();
	Application.LoadLevel(0);
}
