#pragma strict

var staticMargin : int = 50; // pixels

@Range(0f,100f)
var jumpScreenPercentage : float = 70;

var speed : float = 1f;
private var actualSpeed : float;
var acceleration : float = 1f;

var errorCorrection : boolean;
var errorCorrectionTime : float = 0.2f; // seconds

@Range(0f,20f)
var jumpHeight : float = 12f;

var animator : Animator;
var characterVisual : Transform;

var direction : int; // horizontal movement

var jumping : boolean;
var grounded : boolean = true;
 
private var characterRigidbody : Rigidbody; // Set at runtime
private var jumpBoundary : float; // Set at runtime
private var leftBoundary : float; // Set at runtime
private var rightBoundary : float; // Set at runtime

var playerMask : LayerMask;

var keyboardMode : boolean = true;
var touchMode : boolean;

// Interface

var jumpPanelHeight : RectTransform;
var jumpPanel : Animator;

var playable : boolean;

private var startLocation : Vector3;
private var rotateTarget : Quaternion; // Set at runtime
private var interacting : boolean; // User input detection
private var forward : boolean; // characterVisual direction
var audioManager : AudioManager;

var jumpCheckTime : float = 0.2f;
var holdingJump : boolean;

function Awake () {
	// Set interactive regions
	startLocation = transform.position;
	var halfWidth : float = (Screen.width/2)-(staticMargin/2);
	leftBoundary = halfWidth;
	rightBoundary = Screen.width-halfWidth;
	jumpBoundary = Screen.height*(jumpScreenPercentage/100);
	jumpPanelHeight.rect.y = jumpBoundary;
	// Set Physics
	characterRigidbody = GetComponent.<Rigidbody>();
	// Set Audio
	audioManager = GetComponent.<AudioManager>();
}

function StartGame () : void {
	playable = true;
}

function JumpCheck () : IEnumerator {
	if(holdingJump || !errorCorrection && !grounded)
		return;
	
	holdingJump = true;
	
	var jumpTime : float;
	
	while(holdingJump && jumpTime < jumpCheckTime){
		jumpTime += Time.deltaTime;
		yield;
	}
	
	if(jumpTime >= jumpCheckTime && holdingJump){
		JumpBig();
	}else{
		JumpSmall();
	}
	
	holdingJump = false;
	
}

function Update () {
	if(!playable)
		return;
	// Check for input
	
	//KEYBOARD
	if(keyboardMode){
		if(Input.GetKey(KeyCode.LeftArrow) && Input.GetKey(KeyCode.RightArrow) || Input.GetKey(KeyCode.A) && Input.GetKey(KeyCode.D)){
			interacting = false;
			direction = 0;
		}else if(Input.GetKey(KeyCode.LeftArrow) || Input.GetKey(KeyCode.A)){
			interacting = true;
			direction = -1;
		}else if(Input.GetKey(KeyCode.RightArrow) || Input.GetKey(KeyCode.D)){
			interacting = true;
			direction = 1;
		}else{
			interacting = false;
			direction = 0;
		}
	
		if(Input.GetKeyDown(KeyCode.Space))
			JumpCheck();
		
		if(Input.GetKeyUp(KeyCode.Space))
			holdingJump = false;
			
			
	}
	
	//TOUCH
	if(touchMode){
		if(Input.GetMouseButton(0)){
			interacting = true;
			
			if(Input.mousePosition.x < leftBoundary)
				direction = -1;
			else if(Input.mousePosition.x > rightBoundary)
				direction = 1;
			else
				direction = 0;
			
			if(Input.mousePosition.y > jumpBoundary){
				jumpPanel.SetBool("Jump", true);	
				JumpBig();
			}else{
				jumpPanel.SetBool("Jump", false);	
			}
						
		}else{
			interacting = false;
			jumpPanel.SetBool("Jump", false);	
		}
	}
	
	// Manage acceleration
	if(direction != 0)
		actualSpeed = Mathf.Lerp(actualSpeed, speed, Time.deltaTime*acceleration);
	else
		actualSpeed = Mathf.Lerp(actualSpeed, 0, Time.deltaTime*acceleration);	
	
	if(!interacting)
		actualSpeed = 0f;			
	
	// Perform raycast to check for being airbourne ( two rays, one for each foot )
	var ray : Ray;
	var hit : RaycastHit;
	
	var distanceOne : boolean;
	var distanceTwo : boolean;
	
	if(Physics.Raycast(transform.position+Vector3(0.2,0.1,0), -Vector3.up, 0.2f, playerMask))
		distanceOne = true;
	if(Physics.Raycast(transform.position+Vector3(-0.2,0.1,0), -Vector3.up, 0.2f, playerMask))
		distanceTwo = true;		
		
	if(!distanceOne && !distanceTwo){
		ErrorCorrection();
		grounded = false;
	}else{
		grounded = true;
	}
	// Manage visual rotation		
	if(direction > 0)
		rotateTarget = Quaternion.Euler(0,90,0);
	else if(direction < 0)
		rotateTarget = Quaternion.Euler(0,-90,0);
		
	characterVisual.rotation = Quaternion.Slerp(characterVisual.rotation, rotateTarget, Time.deltaTime*20f);	
	
}

function ErrorCorrection () : IEnumerator {
	if(jumping)
		return;
	
	if(errorCorrection)
		return;
		
	errorCorrection = true;
	var i : float = 0f;
	while( i < errorCorrectionTime) {
		i += Time.deltaTime;
		yield;
	}
	
	errorCorrection = false;
}

function FixedUpdate () {
	// Character Movement
	characterRigidbody.velocity.x = direction*actualSpeed;
}

function RemoveControl () : void {
	Debug.Log("Control Removed");
	playable = false;
}

function RegainControl () : void {
	Debug.Log("Control Received");
	playable = true;
}

function JumpSmall () : IEnumerator {
	if(jumping && !errorCorrection)
		return;
	
	Debug.Log("Jump Small");
	errorCorrection = false;
	jumping = true;	
	audioManager.Jump();
	characterRigidbody.velocity.y = jumpHeight/1.5;	
	yield WaitForSeconds(0.1f); // Lift off
	
	while(!grounded){
		yield; // Wait until landed
	}
	
	jumping = false;
}

function JumpBig () : IEnumerator {
	if(jumping && !errorCorrection)
		return;
	
	Debug.Log("Jump Big");
	errorCorrection = false;
	jumping = true;	
	audioManager.Jump();
	characterRigidbody.velocity.y = jumpHeight;	
	yield WaitForSeconds(0.1f); // Lift off
	
	while(!grounded){
		yield; // Wait until landed
	}
	
	jumping = false;
}