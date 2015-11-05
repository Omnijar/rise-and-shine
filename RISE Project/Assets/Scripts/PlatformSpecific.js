#pragma strict

var desktop : boolean;
var iphone : boolean;
var android : boolean;
var webgl : boolean;

function Awake () {
	#if UNITY_STANDALONE
		gameObject.SetActive(desktop);
	#endif
	
	#if UNITY_IPHONE
		gameObject.SetActive(iphone);
	#endif
	
	#if UNITY_ANDROID
		gameObject.SetActive(android);
	#endif
	
	#if UNITY_WEBGL
		gameObject.SetActive(webgl);
	#endif
}