#pragma strict

var topColorStart : Color;
var bottomColorStart : Color;
var lightColorStart : Color;
var ambientColorStart : Color;
var fogColorStart : Color;

var topColorMiddle : Color;
var bottomColorMiddle : Color;
var lightColorMiddle : Color;
var ambientColorMiddle : Color;
var fogColorMiddle : Color;

var topColorEnd : Color;
var bottomColorEnd : Color;
var lightColorEnd : Color;
var ambientColorEnd : Color;
var fogColorEnd : Color;

var skyPlane : Renderer;
var globalLight : Light;

var player : Transform;
//var start : Transform;
var end : Transform;

private var startPos : float;
var playerPos : float;
private var endPos : float;
private var totalLength : float;

var playerCompletion : float;
var ambienceCurve : AnimationCurve;

private var currentTopColor : Color;
private var currentBottomColor : Color;
private var currentLightColor : Color;
private var currentAmbientColor : Color;
private var currentFogColor : Color;

private var actualTopColor : Color;
private var actualBottomColor : Color;
private var actualLightColor : Color;
private var actualAmbientColor : Color;
private var actualFogColor : Color;

function Awake () {
	actualTopColor = topColorStart;
	actualBottomColor = bottomColorStart;
	actualLightColor = lightColorStart;
	actualAmbientColor = ambientColorStart;
	actualFogColor =fogColorStart;
	
	startPos = player.position.x;
	playerPos = player.position.x;
	endPos = end.position.x;
	totalLength = endPos - startPos;
	
	SetLighting(0f);
	skyPlane.enabled = true;	
}


function Update () {
	playerPos = player.position.x - startPos;
	
	var newPlayerCompletion = playerPos/totalLength;
	
	if(newPlayerCompletion > playerCompletion){
		playerCompletion = newPlayerCompletion;
		SetLighting(playerCompletion);
	}
	
	Calculate();	
}

function SetLighting ( pos : float ) : void {
	if(pos < 0.333f){
		//Gradient
		currentTopColor = Color.Lerp(topColorStart, topColorMiddle, ambienceCurve.Evaluate(pos));
		currentBottomColor = Color.Lerp(bottomColorStart, bottomColorMiddle, ambienceCurve.Evaluate(pos));
		//Lighting
		currentLightColor = Color.Lerp(lightColorStart, lightColorMiddle, ambienceCurve.Evaluate(pos));
		currentAmbientColor = Color.Lerp(ambientColorStart, ambientColorMiddle, ambienceCurve.Evaluate(pos));
		currentFogColor = Color.Lerp(fogColorStart, fogColorMiddle, ambienceCurve.Evaluate(pos));
	}else if(pos < 0.666f){
		//Gradient
		currentTopColor = Color.Lerp(topColorMiddle, topColorMiddle, ambienceCurve.Evaluate(pos));
		currentBottomColor = Color.Lerp(bottomColorMiddle, bottomColorMiddle, ambienceCurve.Evaluate(pos));
		//Lighting
		currentLightColor = Color.Lerp(lightColorMiddle, lightColorMiddle, ambienceCurve.Evaluate(pos));
		currentAmbientColor = Color.Lerp(ambientColorMiddle, ambientColorMiddle, ambienceCurve.Evaluate(pos));
		currentFogColor = Color.Lerp(fogColorMiddle, fogColorMiddle, ambienceCurve.Evaluate(pos));
	}else{
		//Gradient
		currentTopColor = Color.Lerp(topColorMiddle, topColorEnd, ambienceCurve.Evaluate(pos));
		currentBottomColor = Color.Lerp(bottomColorMiddle, bottomColorEnd, ambienceCurve.Evaluate(pos));
		//Lighting
		currentLightColor = Color.Lerp(lightColorMiddle, lightColorEnd, ambienceCurve.Evaluate(pos));
		currentAmbientColor = Color.Lerp(ambientColorMiddle, ambientColorEnd, ambienceCurve.Evaluate(pos));
		currentFogColor = Color.Lerp(fogColorMiddle, fogColorEnd, ambienceCurve.Evaluate(pos));
	}
}

function Calculate () : void {
	var top : Color;
	var bottom : Color;
	
	actualTopColor = Color.Lerp(actualTopColor, currentTopColor, Time.deltaTime); 
	actualBottomColor = Color.Lerp(actualBottomColor, currentBottomColor, Time.deltaTime); 
	actualLightColor = Color.Lerp(actualLightColor, currentLightColor, Time.deltaTime);  
	actualAmbientColor = Color.Lerp(actualAmbientColor, currentAmbientColor, Time.deltaTime);  
	
	globalLight.color = actualLightColor;
	RenderSettings.ambientSkyColor = actualAmbientColor;
	RenderSettings.fogColor = actualFogColor;
	
	var gradient : Texture2D = new Texture2D(1,2);
	gradient.SetPixel(0,0,actualTopColor);
	gradient.SetPixel(0,1,actualBottomColor);
	gradient.filterMode = FilterMode.Bilinear;
	skyPlane.material.SetTexture("_MainTex", gradient);
	gradient.wrapMode = TextureWrapMode.Clamp;
	gradient.Apply();
}

