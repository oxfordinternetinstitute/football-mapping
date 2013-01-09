"use strict";
//Color blending functions
function normBlend(a,b,weightA) {
	a=hexToRgb(a);
	b=hexToRgb(b);
	
	weightA=(weightA>1)?1:weightA;
	weightA=(weightA<0)?0:weightA;

	var blend = {};
	blend.r=a.r*weightA+b.r*(1-weightA);
	blend.g=a.g*weightA+b.g*(1-weightA);
	blend.b=a.b*weightA+b.b*(1-weightA);
	//console.log(blend);

	var hex = rgbToHex(blend.r,blend.g,blend.b);
	//console.log(hex);

	return hex;
}

function blend(a,weightA,b,weightB) {
	return normBlend(a,b,weightA/(weightA+weightB));
	/*a=hexToRgb(a);
	b=hexToRgb(b);

	//console.log(a);
	//console.log(b);

	var weightSum = weightA+weightB;

	var blend = {}
	blend.r=(a.r*weightA+b.r*weightB)/weightSum;
	blend.g=(a.g*weightA+b.g*weightB)/weightSum;
	blend.b=(a.b*weightA+b.b*weightB)/weightSum;
	//console.log(blend);

	var hex = rgbToHex(blend.r,blend.g,blend.b);
	//console.log(hex);

	return hex;*/

}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function componentToHex(c) {
	c=Math.round(c);
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getLightShade(color) {
	var c = tinycolor(color);
	var hsl = c.toHsl();	
	hsl.l=0.8;
	var tmp = tinycolor(hsl).toRgb();
	return rgbToHex(tmp.r,tmp.g,tmp.b);
}

function getDarkShade(color) {
	var c = tinycolor(color);
	var hsl = c.toHsl();	
	hsl.l=0.2;
	var tmp = tinycolor(hsl).toRgb();
	return rgbToHex(tmp.r,tmp.g,tmp.b);
}
