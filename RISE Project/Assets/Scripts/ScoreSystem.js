#pragma strict

var actualScore : int;
var actualTime : int;

function Awake () {
	DontDestroyOnLoad(this);
}

function OnLevelWasLoaded () : void {
	var thisLevel : String = Application.loadedLevelName;

	if(thisLevel == "01Game")
		Debug.Log("In Game");
	else if(thisLevel == "02Score")
		CalculateScore();
	else
		Destroy(gameObject);
	
}

function SubmitScore ( thisScore : float, thisTime : int ) : void {
	actualScore = thisScore;
	actualTime = thisTime;
	Debug.Log("Recording Score...");
}

function CalculateScore () : void {
	GameObject.Find("ScoreProcessor").GetComponent.<ScoreProcessor>().Process(actualScore, actualTime);
	Debug.Log("Calculating Score...");
}