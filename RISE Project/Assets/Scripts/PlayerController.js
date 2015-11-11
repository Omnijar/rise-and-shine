#pragma strict

var staticMargin : int = 50; // pixels

@Range(0f,100f)
var jumpScreenPercentage : float = 70;

var speed : float = 1f;
private var actualSpeed : float;
var acceleration : float = 1f;

var errorCorrection : boolean;
var errorCorrectionTime : float = 0.2f; // seconds

@Range(10f,100f)
var jumpHeight : float = 22.5;

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

var jumpPanel : Animator;

var playable : boolean;

private var startLocation : Vector3;
private var rotateTarget : Quaternion; // Set at runtime
private var interacting : boolean; // User input detection
private var forward : boolean; // characterVisual direction
var audioManager : AudioManager;

var jumpCheckTime : float = 0.2f;
var holdingJump : boolean;
var lifeManager : LifeManager;

var previousTouchPoint : Vector2;
var lastPosition : Vector2;
var jumpSwipe : float;
var jumpLine : float;

var movementPanelWidth : int = 200;
var movementPanelHeight : int = 200;
var jumpPanelWidth : int = 100;
var jumpPanelHeight : int = 100;
var edging : int = 20;

function Awake () {
	#if UNITY_ANDROID || UNITY_IPHONE
		keyboardMode = false;
		touchMode = true;
	#endif

	// Set interactive regions
	startLocation = transform.position;
	var halfWidth : float = (Screen.width/2)-(staticMargin/2);
	leftBoundary = halfWidth;
	rightBoundary = Screen.width-halfWidth;
	jumpBoundary = Screen.height*(jumpScreenPercentage/100);
	//jumpPanelHeight.rect.y = jumpBoundary;
	jumpSwipe = Screen.height/jumpScreenPercentage;
	// Set Physics
	characterRigidbody = GetComponent.<Rigidbody>();
	// Set Audio
	audioManager = GetComponent.<AudioManager>();
}

function StartGame () : void {
	playable = true;
}

function JumpCheck ( inputType : int ) : IEnumerator {
	if(holdingJump || !errorCorrection && !grounded)
		return;
		
	holdingJump = true;
	
	JumpSmall();
	
	var jumpTime : float;
	
	if(inputType == 0){
		while(holdingJump && jumpTime < jumpCheckTime){
			jumpTime += Time.deltaTime;
			yield;
		}
		
		if(jumpTime >= jumpCheckTime && holdingJump)
			JumpBig();		
	}else if(inputType == 1){
		while(jumpTime < jumpCheckTime){
			jumpTime += Time.deltaTime;
			yield;
		}	
	}else if(inputType == 2){
		while(holdingJump && jumpTime < jumpCheckTime){
			jumpTime += Time.deltaTime;
			yield;
		}	
		if(jumpTime >= jumpCheckTime)
			JumpBig();			
		
	}
	
	holdingJump = false;
	
}

function Update () {

	animator.SetBool("jumping", jumping);
	
	if(characterRigidbody.velocity.magnitude > 1)
		animator.SetInteger("speed", 1);	
	else
		animator.SetInteger("speed", 0);
	
	if(!playable){
		if(keyboardMode && lifeManager.respawning)
			if(Input.GetKeyDown(KeyCode.Space))
				lifeManager.fastSpawn = true;
		
		if(touchMode && lifeManager.respawning)
			if(Input.GetMouseButton(0))
				if(Input.mousePosition.y > jumpBoundary)
					lifeManager.fastSpawn = true;
			
		return;
	}
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
			JumpCheck(0);
		
		if(Input.GetKeyUp(KeyCode.Space))
			holdingJump = false;
			
			
	}
	
	//TOUCH
	if(touchMode){
		
		#if UNITY_ANDROID || UNITY_IPHONE
		
		var fingerCount = 0;

		
	    if (Input.touchCount == 1 || Input.touchCount == 2 ){  // 

			interacting = true;
			
			for (var touch : Touch in Input.touches) {
				
				//Check for Jump
				if(touch.phase == TouchPhase.Began){
					if(touch.position.x > edging && touch.position.x < jumpPanelWidth+edging && touch.position.y > edging && touch.position.y < jumpPanelHeight+edging)
						JumpCheck(0);
					
				}
							
				if(touch.phase == TouchPhase.Ended){
					if(touch.position.x > edging && touch.position.x < jumpPanelWidth+edging && touch.position.y > edging && touch.position.y < jumpPanelHeight+edging)
						holdingJump = false;
				}
											
				if (touch.phase != TouchPhase.Ended && touch.phase != TouchPhase.Canceled){
					
					//Movement
					if(touch.position.x > Screen.width-(movementPanelWidth+edging) && touch.position.x < Screen.width-edging && touch.position.y > edging && touch.position.y < movementPanelHeight+edging){
						//Left
						if(touch.position.x > Screen.width-(movementPanelWidth+edging) && touch.position.x < Screen.width-edging-(movementPanelWidth/2) && touch.position.y > edging && touch.position.y < movementPanelHeight+edging){
							direction = -1;
						}
						
						//Right
						if(touch.position.x > (Screen.width-(movementPanelWidth+edging))+(movementPanelWidth/2) && touch.position.x < Screen.width-edging && touch.position.y > edging && touch.position.y < movementPanelHeight+edging){
							direction = 1;
						}						
					}else{
						direction = 0;
					}
				}
			}		
			
			
			
			
			/*
			if(Input.GetTouch(0).phase == TouchPhase.Began){
				previousTouchPoint = Input.GetTouch(0).position;
				lastPosition = Input.GetTouch(0).position;
			}
			
			if(Input.GetTouch(0).position.x < previousTouchPoint.x-70)
				direction = -1;
			else if(Input.GetTouch(0).position.x > previousTouchPoint.x+70)
				direction = 1;
			else
				direction = 0;
		
		
		
			var currentPosition = Input.GetTouch(0).position;
			var deltaPosition = currentPosition-lastPosition;
			lastPosition = currentPosition;	
			
			if(deltaPosition.y > 60){
					JumpCheck(2);
			}else if(deltaPosition.y>30){
					JumpCheck(1);			
			}
			
			*/
			
			/*	
			if(deltaPosition.y > 5){
				//track Y				
				jumpLine = Input.GetTouch(0).position.y-previousTouchPoint.y;
			}else{
				//reset Y
				if(jumpLine > Screen.height/3){
					JumpCheck(2);
				}else if(jumpLine > Screen.height/4){
					JumpCheck(1);
				}
				previousTouchPoint.y = Input.GetTouch(0).position.y;
				jumpLine = 0;	
			}
			*/
		
		#endif	
		#if UNITY_STANDALONE || UNITY_WEBGL
		 if(Input.GetMouseButton(0)){
			
			interacting = true;
			
			if(Input.GetMouseButtonDown(0)){
				lastPosition = Input.mousePosition;
				previousTouchPoint = Input.mousePosition;
			}
			
			if(previousTouchPoint.y > Input.mousePosition.y){
				previousTouchPoint.y = Input.mousePosition.y;
			}
			
			if(Input.mousePosition.x < previousTouchPoint.x-30)
				direction = -1;
			else if(Input.mousePosition.x > previousTouchPoint.x+30)
				direction = 1;
			else
				direction = 0;	
			
			var currentPosition = Input.mousePosition;
			var deltaPosition = currentPosition-lastPosition;
			lastPosition = currentPosition;
			
			if(deltaPosition.y > 5){
				jumpLine = Input.mousePosition.y-previousTouchPoint.y;
			}else{
				if(jumpLine > 300){
					JumpCheck(2);
					Debug.Log(jumpLine);
				}else if(jumpLine > 75){
					JumpCheck(1);
				}
				previousTouchPoint.y = Input.mousePosition.y;
				jumpLine = 0;
			}
			
			
			/*
			if(deltaPosition.y > jumpSwipe){ // 40
				JumpCheck(2);
			}else if(deltaPosition.y > jumpSwipe/2){ //22.5
				JumpCheck(1);
			} 
			*/
														
		#endif		
			
		}else{
			previousTouchPoint = Vector2.zero;
			interacting = false;
			//jumpPanel.SetBool("Jump", false);	
			direction = 0;
		}
		
		/*
     	if (Input.touchCount == 2){  // 
			if(Input.GetTouch(1).phase == TouchPhase.Began)
				JumpCheck(0);
		
		}
		*/
		
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
	
	//Debug.Log("Jump Small");
	errorCorrection = false;
	jumping = true;	
	audioManager.Jump();
	characterRigidbody.velocity.y = jumpHeight/1.5;	
	yield WaitForSeconds(0.1f); // Lift off
	
	while(!grounded){
		yield; // Wait until landed
	}
	
	animator.SetBool("jumpBig", false);

	jumping = false;
}

function JumpBig () : IEnumerator {
	//if(jumping && !errorCorrection)
	//	return;
	
	//Debug.Log("Jump Big");
	animator.SetTrigger("bigJump");
	errorCorrection = false;
	jumping = true;	
	audioManager.Jump();
	characterRigidbody.velocity.y += jumpHeight/2;		
	yield WaitForSeconds(0.1f); // Lift off
	
	//while(!grounded){
	//	yield; // Wait until landed
	//}
	
	//jumping = false;
}