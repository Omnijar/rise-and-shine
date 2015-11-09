#pragma strict

//var pickups : float;
//var time : float;
var score : float;

var actualPickups : float;
var actualTime : float;
var actualScore : float;

var timeForProcess : float = 2f;

var bronze : Color;
var silver : Color;
var gold : Color;

var pickupValue : UnityEngine.UI.Text;
var timeValue : UnityEngine.UI.Text;
var totalValue : UnityEngine.UI.Text;

var highscoreAnimator : Animator;

var totalGameTime : int = 600;

var buttons : UnityEngine.UI.Button[];

// Bronze

// Silver

// Gold

// New Highscore Animator

function Awake () {
	pickupValue.text = "0";
	timeValue.text = "00:00";
	totalValue.text = "0";
	
	SetButtons(false);
}

function Process (pickups : float, thisTime : int) : IEnumerator {
	
	var time : float = thisTime/1f;
	
	yield WaitForSeconds(0.5f);

	var colorToSet : Color;
	
	var scoreMultiplier : float = time/totalGameTime;
	
	time = totalGameTime-time;
	
	score = (pickups*10)*scoreMultiplier;
	
	if(score < 5000)
		colorToSet = bronze;
	else if(score < 10000)
		colorToSet = silver;
	else
		colorToSet = gold;
	
	var i : float = 0f;
	
	while ( i < 1 ) {
		i+= Time.deltaTime/timeForProcess;
		
		totalValue.color = Color.Lerp(Color.white, colorToSet, i*2);
		
		actualPickups = Mathf.Lerp(0, pickups, i);
		pickupValue.text = Mathf.RoundToInt(actualPickups).ToString();
		
		actualTime = Mathf.Lerp(0, time, i);
		ConvertTime();
		//timeValue.text = Mathf.RoundToInt(actualTime).ToString();
		
		actualScore = Mathf.Lerp(0, score, i);
		totalValue.text = Mathf.RoundToInt(actualScore).ToString();
		yield;
	}
	
	yield WaitForSeconds(0.5f);
	
	Debug.Log(score);
	Debug.Log(PlayerPrefs.GetInt("highScore"));
	
	
	if(Mathf.RoundToInt(score) > PlayerPrefs.GetInt("highScore")){
		highscoreAnimator.SetBool("NewHighscore", true);
		PlayerPrefs.SetInt("highScore", score);
		PlayerPrefs.Save();
	}
	
	SetButtons(true);

}

function SetButtons ( toggle : boolean ) : void {
	for(var i = 0; i < buttons.Length; i++){
		buttons[i].interactable = toggle;
	}
}

function ConvertTime () {
 	var minutes : int = Mathf.FloorToInt(actualTime / 60F);
	var seconds : int = Mathf.FloorToInt(actualTime - minutes * 60);
	var formattedTime : String = String.Format("{0:00}:{1:00}", minutes, seconds);
    timeValue.text = formattedTime;
}