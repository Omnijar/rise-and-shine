#pragma strict

var playerController : PlayerController;

var menuAnimator : Animator;
var interfaceAnimator : Animator;
var gameoverAnimator : Animator;
var gameOverPanel : GameObject;

var lifeManager : LifeManager;
var scoreManager : ScoreManager;
var timeManager : TimeManager;

var startingLives : int = 3;
var gameTime : int = 600;

var startGame : boolean;
var sceneLoader : SceneLoader;
var slowmotionCurve : AnimationCurve;
var gameEnded : boolean;
var menuButton : UnityEngine.UI.Button;

function Start () {
	StartGame();
}

function Play () : void {
	//StartGame();
}

function StartGame () : IEnumerator {
	if(startGame)
		return;

	startGame = true;
	//menuAnimator.SetBool("Hide", true);
	//yield WaitForSeconds(1f);
	playerController.StartGame();
	timeManager.EnableTimer(gameTime);
	
	lifeManager.StartGame(startingLives);
	
	startGame = false;
	
	
	//interfaceAnimator.SetTrigger("Play");

}
/*
function EndGame () : IEnumerator {
	yield WaitForSeconds(1f);
	gameOverPanel.SetActive(true);
	gameoverAnimator.SetTrigger("End");
	yield WaitForSeconds(2.5f);
	Utilities.Transition(1f,0f,1f);	
	yield WaitForSeconds(0.5f);	
	sceneLoader.Load();
}
*/

function EndGame () : IEnumerator {
	if(gameEnded)
		return;
	
	menuButton.interactable = false;
	
	yield WaitForSeconds(1f);
	
	if(gameEnded)
		return;
		
	gameOverPanel.SetActive(true);
	gameoverAnimator.SetTrigger("End");
		
	var i : float = 0;
	
	while ( i < 1f ) {
		i+= Time.unscaledDeltaTime/2.5;
		Time.timeScale = slowmotionCurve.Evaluate(1-i);
		yield;
	}
	
	if(gameEnded)
		return;
			
	i = 0;
	
	Utilities.Transition(1f,0f,1f);	
	
	while ( i < 0.5f ) {
		i+= Time.unscaledDeltaTime/1f;
		yield;
	}	
		
	if(gameEnded)
		return;
			
	sceneLoader.Load();
}