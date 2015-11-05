#pragma strict

// Game variables
var currentScore : float;
var actualScore : float;
var highScore : float;

// Interface
var scoreText : UnityEngine.UI.Text;
var scoreAnimator : Animator;

private var incrementSpeed : float = 500f;

function Awake () {
	highScore = PlayerPrefs.GetFloat("highScore");	
	scoreText.text = "x 0";	
}

function SubmitScore () : void {
	if(actualScore > highScore)
		PlayerPrefs.SetFloat("highScore", actualScore);
		
	print("Highscore has been set to : " + Mathf.RoundToInt(actualScore));
}

function AddScore ( worth : float ) : void {
	actualScore += worth;
	scoreAnimator.SetTrigger("Pulse");
}

function Update () {
	if(currentScore != actualScore){
		currentScore += Time.deltaTime*incrementSpeed;
		currentScore = Mathf.Clamp(currentScore, 0, actualScore);
		//currentScore = Mathf.Lerp(currentScore, actualScore, Time.deltaTime*incrementSpeed);
		scoreText.text = "x " + Mathf.RoundToInt(currentScore).ToString();
	}
}