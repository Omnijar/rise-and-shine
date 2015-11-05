#pragma strict

var topColor : Color;
var bottomColor : Color;

function Awake () {
	var gradient : Texture2D = new Texture2D(1,2);
	gradient.SetPixel(0,0,topColor);
	gradient.SetPixel(0,1,bottomColor);
	gradient.filterMode = FilterMode.Bilinear;
	GetComponent.<Renderer>().material.SetTexture("_MainTex", gradient);
	gradient.wrapMode = TextureWrapMode.Clamp;
	gradient.Apply();
	GetComponent.<Renderer>().enabled = true;
}
