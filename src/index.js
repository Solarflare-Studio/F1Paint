const paintshopversion= "v0.1.8.3";



import * as THREE from '../node_modules/three/build/three.module.js';

import { TWEEN } from '../node_modules/three/examples/jsm/libs/tween.module.min'

import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'

// import { SavePass } from '../node_modules/three/examples/jsm/postprocessing/SavePass.js';
// import { TexturePass } from '../node_modules/three/examples/jsm/postprocessing/TexturePass.js';


// import { GlitchPass } from '../node_modules/three/examples/jsm/postprocessing/GlitchPass.js';
// import { DotScreenPass } from '../node_modules/three/examples/jsm/postprocessing/DotScreenPass.js';
// import { HalftonePass } from '../node_modules/three/examples/jsm/postprocessing/HalftonePass.js';
// import { BloomPass } from '../node_modules/three/examples/jsm/postprocessing/BloomPass.js';
//import { F1BloomPass } from '../node_modules/three/examples/jsm/postprocessing/F1BloomPass.js';

// import { AfterimagePass } from '../node_modules/three/examples/jsm/postprocessing/AfterimagePass.js';
// import { SobelOperatorShader  } from '../node_modules/three/examples/jsm/shaders/SobelOperatorShader.js';


 import {Text} from 'troika-three-text'

 
import {F1Fonts} from './f1Fonts'
import {PatternItems} from './f1patternItems'
import {ProcessJSON} from './f1processJSON'
import {F1Materials} from './f1materials'
import {F1Garage} from './f1garage'
import {F1CarHelmet} from './f1carhelmet'
import {F1Layers} from './f1layers'
import {F1MetalRough} from './f1metalrough'
import {F1Gui} from './f1gui'
import {F1AssetFileNames} from './f1AssetFileNames'
import {F1PostRender} from'./f1postrender'
import {F1SpecialFX} from'./f1specialfx'
import {F1Text} from'./f1Text'
import {F1Ribbons} from'./f1Ribbons'
//import { setQuaternionFromProperEuler } from 'three/src/math/mathutils.js';


//==================================================
window.onloaded = onloaded;
window.introNextPage = introNextPage;
window.onPatternPicked = onPatternPicked;

// tabs
window.onPatternsTab = onPatternsTab;
window.onColoursTab = onColoursTab;
window.onTagTab = onTagTab;
window.onDecalTab = onDecalTab;

window.backNextPage = backNextPage;
window.onChangePaint = onChangePaint;

window.onConfirm = onConfirm;
window.onPreselectedPaint = onPreselectedPaint;
window.onRandomPaint = onRandomPaint;

window.expandDropdown = expandDropdown;

window.onLaunchARButton = onLaunchARButton;
window.onMaterialbutton = onMaterialbutton;

window.switchModel = switchModel;
window.onMinMax = onMinMax;
window.onConsole = onConsole;

//===================================
// const AWS = require('aws-sdk');
// import { DynamoDBClient, 
// 	ListTablesCommand 
// } from "@aws-sdk/client-dynamodb";



// AWS.config.region = 'EU (London) eu-west-2'; // Region
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//   IdentityPoolId: 'IDENTITY_POOL_ID',
// });
// const userID = '12345678';
// const userName = 'ben';
// const userEmail = 'ben@world.co.uk';

// expects params in url for userID, username and useremail and whether to use car or helmet model
// eg: https://www.f1.com/F1PaintShop.html?u="12345"&n="benedict"&e="ben@world.com"&m=car
const params = new URLSearchParams(document.location.search)
// allow choice
const forcecar = true;

if(!params.get('m') && !forcecar) {
	document.getElementById('introokbutton').classList.add('hidden');
	document.getElementById('introcarbutton').classList.remove('hidden');
	document.getElementById('introhelmetbutton').classList.remove('hidden');
}
else {
	document.getElementById('introokbutton').classList.remove('hidden');
	document.getElementById('introcarbutton').classList.add('hidden');
	document.getElementById('introhelmetbutton').classList.add('hidden');
}

var userID = (params.get('u') ? params.get('u') : "noID"); // user id
var userName = (params.get('n') ? params.get('n') : "no name"); // user name
var userEmail = (params.get('e') ? params.get('e') : "no email"); // user email
var userCarOrHelmet = (params.get('m') ? params.get('m') : "c"); // car or helmet
var userConsole = (params.get('c') ? params.get('c') : 0); // console



if(forcecar && userCarOrHelmet!='h') userCarOrHelmet='c';
const aUserParam = params.get('u');

// clearCookies();


// strip double quotes out of name and email address
userID = (userID.replace(/['"]+/g, ''));
userName = (userName.replace(/['"]+/g, ''));
userEmail = (userEmail.replace(/['"]+/g, ''));
userCarOrHelmet = (userCarOrHelmet.replace(/['"]+/g, ''));

console.log(">> ** name:" + userName + ", id:" + userID + ", email:"+ userEmail + ", model:"+ userCarOrHelmet);

// var cookie_uniqueID_value = document.cookie.replace(/(?:(?:^|.*;\s*)userID\s*\=\s*([^;]*).*$)|^.*$/, "$1");
// var cookie_name_value = document.cookie.replace(/(?:(?:^|.*;\s*)userName\s*\=\s*([^;]*).*$)|^.*$/, "$1");
// var cookie_email_value = document.cookie.replace(/(?:(?:^|.*;\s*)userEmail\s*\=\s*([^;]*).*$)|^.*$/, "$1");

var cookie_uniqueID_value = document.cookie.replace(/(?:(?:^|.*;\s*)userID\s*\=\s*([^;]*).*$)|^.*$/, "$1");
var cookie_name_value = document.cookie.replace(/(?:(?:^|.*;\s*)userName\s*\=\s*([^;]*).*$)|^.*$/, "$1");
var cookie_email_value = document.cookie.replace(/(?:(?:^|.*;\s*)userEmail\s*\=\s*([^;]*).*$)|^.*$/, "$1");
// var cookie_carorhelmet_value = document.cookie.replace(/(?:(?:^|.*;\s*)userCarOrHelmet\s*\=\s*([^;]*).*$)|^.*$/, "$1");

var cookie_livery_value = document.cookie.replace(/(?:(?:^|.*;\s*)F1Livery\s*\=\s*([^;]*).*$)|^.*$/, "$1");
if(aUserParam==null) {
	cookie_livery_value="";
}

const IFRAME_ID = 'my-iframe'  // iframe containing AR content.



function deleteCookie(name) {
	document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
function clearCookies() {
	deleteCookie('userID');
	deleteCookie('userName');
	deleteCookie('userEmail');
	deleteCookie('F1Livery');

	// deleteCookie('userCarOrHelmet');
}
var d = new Date();
d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // Expires in 1 year
var expires = "expires=" + d.toUTCString();
document.cookie = 'test1=' + 10 + "; " + expires + "; path=/";

function writeCookies() {
	var cookieName = "my_cookie";
	var d = new Date();
	d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // Expires in 1 year
	var expires = "expires=" + d.toUTCString();
	document.cookie = 'userID' + "=" + userID + "; " + expires + "; path=/";
	document.cookie = 'userName' + "=" + userName + "; " + expires + "; path=/";
	document.cookie = 'userEmail' + "=" + userEmail + "; " + expires + "; path=/";
	// document.cookie = 'userCarOrHelmet' + "=" + userCarOrHelmet + "; " + expires + "; path=/";
	
	// livery cookie!
// see json
}
// cookie_uniqueID_value="";
if(cookie_uniqueID_value=="" || cookie_uniqueID_value=="noID") {
	console.log(">> *** cookie = NONE PRESENT\n ** creating");
	writeCookies();
	// if(userID!="noID") {
	// 	console.log(">> *** have url data, creating cookie.")
	// 	writeCookies();
	// }
}
// else {
console.log(">> *** cookie:\nuserID:" + cookie_uniqueID_value +"\nuserName:" + cookie_name_value +"\nuserEmail:" + cookie_email_value +"\n");
// if we've no url params, use cookie data
if(userID=="noID") {
	userID = cookie_uniqueID_value;// (userID.replace(/['"]+/g, ''));
	userName = cookie_name_value;// (userName.replace(/['"]+/g, ''));
	userEmail = cookie_email_value;// (userEmail.replace(/['"]+/g, ''));
	// userCarOrHelmet = cookie_carorhelmet_value;
}
// }

// debug delete cookie
//  document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//  document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//  document.cookie = "userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";


clearCookies();

if(userID=="")
	userID="noID";

if(userID=="noID") {
	console.log(">> *** No user id");	
}


var isHelmet = false;
if(userCarOrHelmet=='h')
	isHelmet = true;

// var isHelmet = true;
// var renderSize = 2048;//1024;
var renderSize = 1024;

// set files names
var f1fnames = new F1AssetFileNames();



var scene;
// var sceneFX;

var camera;
var renderer;
let threecanvasElement;

var clock = new THREE.Clock();

var selectedChan = -1;
var selectedBasePatternIndex = -1;
var selectedTagIndex = -1;
var selectedDecalIndex = -1;
var selectedPatternIndex = -1;

var controls;
const gltfLoader = new GLTFLoader();
// var specialFXscene;

var mainLight;
var mainLight2;
var ambLight;
var dirLight;
var dirLightFloor;

var keepControlsTarget = 0;
var timelastinteracted = clock.getElapsedTime();
var interacting = false;
// var layerTexture_2;
// var fxStartTime = clock.getElapsedTime();


var patternItems = new PatternItems(!cookie_livery_value == "");
var processJSON = new ProcessJSON(patternItems);
processJSON.loadPatterns(isHelmet,userID,userName,userEmail,cookie_livery_value);
var f1Fonts = new F1Fonts();

var f1Gui = new F1Gui(processJSON);
f1Gui.updateProgress(5,'patterns');

// processJSON.writePatterns();

var f1Materials  = new F1Materials();

// var f1Garage = new F1Garage(f1Materials,f1Gui);



var f1Layers = new F1Layers(isHelmet, renderSize,f1fnames);

var f1MetalRough = new F1MetalRough(isHelmet, renderSize,f1fnames);
var f1PostRender = new F1PostRender(isHelmet, renderSize,f1fnames);
var f1SpecialFX =  new F1SpecialFX(isHelmet, renderSize,f1fnames);
var f1Text = new F1Text(f1Layers.mapUniforms, f1MetalRough.mapUniforms);
var f1Ribbons = new F1Ribbons();


f1Gui.updateProgress(5,'pipelines');
var f1Garage = new F1Garage(f1Materials,f1Gui);

// function tryEnv() {
// 	console.log(">> trying for envmap!");

// 	if(f1Materials.envMap) {
// 		console.log(">> got envmap!");
// 		f1Garage.garageMaterial.envMap = f1Materials.envMap;
// 		f1Garage.garageMaterial.needsUpdate=true;
// 	}
// 	else {
// 		setTimeout(function() {
// 			tryEnv();
// 		},1000);
// 	}
// }
// tryEnv();

var f1CarHelmet = new F1CarHelmet();

var alreadyInitScenes = false;

var rootScene = new THREE.Object3D();

// offscreenBuffering

// var fxUniforms;
// var bufferFXMaterial;

// var fxComposer, fxRenderScene;


// var backgroundGradientMesh; // for capture gradient
// var backgroundLogoMesh;


var doBuildBasemap = 0;

const pixelBuffer = new Uint8Array( 4*renderSize*renderSize );
const pixelBufferRoughMetal = new Uint8Array( 4*renderSize*renderSize );


const canvas = document.getElementById('canvas-container');

// const containerElement = f1Gui.getFromID('container');

// const faderblockElement = f1Gui.getFromID('faderblock');
// const intropagesElement = f1Gui.getFromID('intropages');




//===================================

// var f1BloomPass;
// var effectComposer;

//==================================================
//ben
/*!
 * iro.js v5.5.2
 * 2016-2021 James Daniel
 * Licensed under MPL 2.0
 * github.com/jaames/iro.js
 */
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(t=t||self).iro=n()}(this,function(){"use strict";var m,s,n,i,o,x={},j=[],r=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;function M(t,n){for(var i in n)t[i]=n[i];return t}function y(t){var n=t.parentNode;n&&n.removeChild(t)}function h(t,n,i){var r,e,u,o,l=arguments;if(n=M({},n),3<arguments.length)for(i=[i],r=3;r<arguments.length;r++)i.push(l[r]);if(null!=i&&(n.children=i),null!=t&&null!=t.defaultProps)for(e in t.defaultProps)void 0===n[e]&&(n[e]=t.defaultProps[e]);return o=n.key,null!=(u=n.ref)&&delete n.ref,null!=o&&delete n.key,c(t,n,o,u)}function c(t,n,i,r){var e={type:t,props:n,key:i,ref:r,n:null,i:null,e:0,o:null,l:null,c:null,constructor:void 0};return m.vnode&&m.vnode(e),e}function O(t){return t.children}function I(t,n){this.props=t,this.context=n}function w(t,n){if(null==n)return t.i?w(t.i,t.i.n.indexOf(t)+1):null;for(var i;n<t.n.length;n++)if(null!=(i=t.n[n])&&null!=i.o)return i.o;return"function"==typeof t.type?w(t):null}function a(t){var n,i;if(null!=(t=t.i)&&null!=t.c){for(t.o=t.c.base=null,n=0;n<t.n.length;n++)if(null!=(i=t.n[n])&&null!=i.o){t.o=t.c.base=i.o;break}return a(t)}}function e(t){(!t.f&&(t.f=!0)&&1===s.push(t)||i!==m.debounceRendering)&&(i=m.debounceRendering,(m.debounceRendering||n)(u))}function u(){var t,n,i,r,e,u,o,l;for(s.sort(function(t,n){return n.d.e-t.d.e});t=s.pop();)t.f&&(r=i=void 0,u=(e=(n=t).d).o,o=n.p,l=n.u,n.u=!1,o&&(i=[],r=k(o,e,M({},e),n.w,void 0!==o.ownerSVGElement,null,i,l,null==u?w(e):u),d(i,e),r!=u&&a(e)))}function S(n,i,t,r,e,u,o,l,s){var c,a,f,h,v,d,g,b=t&&t.n||j,p=b.length;if(l==x&&(l=null!=u?u[0]:p?w(t,0):null),c=0,i.n=A(i.n,function(t){if(null!=t){if(t.i=i,t.e=i.e+1,null===(f=b[c])||f&&t.key==f.key&&t.type===f.type)b[c]=void 0;else for(a=0;a<p;a++){if((f=b[a])&&t.key==f.key&&t.type===f.type){b[a]=void 0;break}f=null}if(h=k(n,t,f=f||x,r,e,u,o,null,l,s),(a=t.ref)&&f.ref!=a&&(g=g||[]).push(a,t.c||h,t),null!=h){if(null==d&&(d=h),null!=t.l)h=t.l,t.l=null;else if(u==f||h!=l||null==h.parentNode){t:if(null==l||l.parentNode!==n)n.appendChild(h);else{for(v=l,a=0;(v=v.nextSibling)&&a<p;a+=2)if(v==h)break t;n.insertBefore(h,l)}"option"==i.type&&(n.value="")}l=h.nextSibling,"function"==typeof i.type&&(i.l=h)}}return c++,t}),i.o=d,null!=u&&"function"!=typeof i.type)for(c=u.length;c--;)null!=u[c]&&y(u[c]);for(c=p;c--;)null!=b[c]&&N(b[c],b[c]);if(g)for(c=0;c<g.length;c++)E(g[c],g[++c],g[++c])}function A(t,n,i){if(null==i&&(i=[]),null==t||"boolean"==typeof t)n&&i.push(n(null));else if(Array.isArray(t))for(var r=0;r<t.length;r++)A(t[r],n,i);else i.push(n?n(function(t){if(null==t||"boolean"==typeof t)return null;if("string"==typeof t||"number"==typeof t)return c(null,t,null,null);if(null==t.o&&null==t.c)return t;var n=c(t.type,t.props,t.key,null);return n.o=t.o,n}(t)):t);return i}function f(t,n,i){"-"===n[0]?t.setProperty(n,i):t[n]="number"==typeof i&&!1===r.test(n)?i+"px":null==i?"":i}function R(t,n,i,r,e){var u,o,l,s,c;if("key"===(n=e?"className"===n?"class":n:"class"===n?"className":n)||"children"===n);else if("style"===n)if(u=t.style,"string"==typeof i)u.cssText=i;else{if("string"==typeof r&&(u.cssText="",r=null),r)for(o in r)i&&o in i||f(u,o,"");if(i)for(l in i)r&&i[l]===r[l]||f(u,l,i[l])}else"o"===n[0]&&"n"===n[1]?(s=n!==(n=n.replace(/Capture$/,"")),n=((c=n.toLowerCase())in t?c:n).slice(2),i?(r||t.addEventListener(n,v,s),(t.t||(t.t={}))[n]=i):t.removeEventListener(n,v,s)):"list"!==n&&"tagName"!==n&&"form"!==n&&!e&&n in t?t[n]=null==i?"":i:"function"!=typeof i&&"dangerouslySetInnerHTML"!==n&&(n!==(n=n.replace(/^xlink:?/,""))?null==i||!1===i?t.removeAttributeNS("http://www.w3.org/1999/xlink",n.toLowerCase()):t.setAttributeNS("http://www.w3.org/1999/xlink",n.toLowerCase(),i):null==i||!1===i?t.removeAttribute(n):t.setAttribute(n,i))}function v(t){return this.t[t.type](m.event?m.event(t):t)}function k(t,n,i,r,e,u,o,l,s,c){var a,f,h,v,d,g,b,p,y,w,k=n.type;if(void 0!==n.constructor)return null;(a=m.e)&&a(n);try{t:if("function"==typeof k){if(p=n.props,y=(a=k.contextType)&&r[a.c],w=a?y?y.props.value:a.i:r,i.c?b=(f=n.c=i.c).i=f.k:("prototype"in k&&k.prototype.render?n.c=f=new k(p,w):(n.c=f=new I(p,w),f.constructor=k,f.render=z),y&&y.sub(f),f.props=p,f.state||(f.state={}),f.context=w,f.w=r,h=f.f=!0,f.m=[]),null==f.j&&(f.j=f.state),null!=k.getDerivedStateFromProps&&M(f.j==f.state?f.j=M({},f.j):f.j,k.getDerivedStateFromProps(p,f.j)),h)null==k.getDerivedStateFromProps&&null!=f.componentWillMount&&f.componentWillMount(),null!=f.componentDidMount&&o.push(f);else{if(null==k.getDerivedStateFromProps&&null==l&&null!=f.componentWillReceiveProps&&f.componentWillReceiveProps(p,w),!l&&null!=f.shouldComponentUpdate&&!1===f.shouldComponentUpdate(p,f.j,w)){for(f.props=p,f.state=f.j,f.f=!1,(f.d=n).o=null!=s?s!==i.o?s:i.o:null,n.n=i.n,a=0;a<n.n.length;a++)n.n[a]&&(n.n[a].i=n);break t}null!=f.componentWillUpdate&&f.componentWillUpdate(p,f.j,w)}for(v=f.props,d=f.state,f.context=w,f.props=p,f.state=f.j,(a=m.M)&&a(n),f.f=!1,f.d=n,f.p=t,a=f.render(f.props,f.state,f.context),n.n=A(null!=a&&a.type==O&&null==a.key?a.props.children:a),null!=f.getChildContext&&(r=M(M({},r),f.getChildContext())),h||null==f.getSnapshotBeforeUpdate||(g=f.getSnapshotBeforeUpdate(v,d)),S(t,n,i,r,e,u,o,s,c),f.base=n.o;a=f.m.pop();)f.j&&(f.state=f.j),a.call(f);h||null==v||null==f.componentDidUpdate||f.componentDidUpdate(v,d,g),b&&(f.k=f.i=null)}else n.o=function(t,n,i,r,e,u,o,l){var s,c,a,f,h=i.props,v=n.props;if(e="svg"===n.type||e,null==t&&null!=u)for(s=0;s<u.length;s++)if(null!=(c=u[s])&&(null===n.type?3===c.nodeType:c.localName===n.type)){t=c,u[s]=null;break}if(null==t){if(null===n.type)return document.createTextNode(v);t=e?document.createElementNS("http://www.w3.org/2000/svg",n.type):document.createElement(n.type),u=null}return null===n.type?h!==v&&(null!=u&&(u[u.indexOf(t)]=null),t.data=v):n!==i&&(null!=u&&(u=j.slice.call(t.childNodes)),a=(h=i.props||x).dangerouslySetInnerHTML,f=v.dangerouslySetInnerHTML,l||(f||a)&&(f&&a&&f.O==a.O||(t.innerHTML=f&&f.O||"")),function(t,n,i,r,e){var u;for(u in i)u in n||R(t,u,null,i[u],r);for(u in n)e&&"function"!=typeof n[u]||"value"===u||"checked"===u||i[u]===n[u]||R(t,u,n[u],i[u],r)}(t,v,h,e,l),n.n=n.props.children,f||S(t,n,i,r,"foreignObject"!==n.type&&e,u,o,x,l),l||("value"in v&&void 0!==v.value&&v.value!==t.value&&(t.value=null==v.value?"":v.value),"checked"in v&&void 0!==v.checked&&v.checked!==t.checked&&(t.checked=v.checked))),t}(i.o,n,i,r,e,u,o,c);(a=m.diffed)&&a(n)}catch(t){m.o(t,n,i)}return n.o}function d(t,n){for(var i;i=t.pop();)try{i.componentDidMount()}catch(t){m.o(t,i.d)}m.c&&m.c(n)}function E(t,n,i){try{"function"==typeof t?t(n):t.current=n}catch(t){m.o(t,i)}}function N(t,n,i){var r,e,u;if(m.unmount&&m.unmount(t),(r=t.ref)&&E(r,null,n),i||"function"==typeof t.type||(i=null!=(e=t.o)),t.o=t.l=null,null!=(r=t.c)){if(r.componentWillUnmount)try{r.componentWillUnmount()}catch(t){m.o(t,n)}r.base=r.p=null}if(r=t.n)for(u=0;u<r.length;u++)r[u]&&N(r[u],n,i);null!=e&&y(e)}function z(t,n,i){return this.constructor(t,i)}function g(t,n){for(var i=0;i<n.length;i++){var r=n[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function b(){return(b=Object.assign||function(t){for(var n=arguments,i=1;i<arguments.length;i++){var r=n[i];for(var e in r)Object.prototype.hasOwnProperty.call(r,e)&&(t[e]=r[e])}return t}).apply(this,arguments)}m={},I.prototype.setState=function(t,n){var i=this.j!==this.state&&this.j||(this.j=M({},this.state));"function"==typeof t&&!(t=t(i,this.props))||M(i,t),null!=t&&this.d&&(this.u=!1,n&&this.m.push(n),e(this))},I.prototype.forceUpdate=function(t){this.d&&(t&&this.m.push(t),this.u=!0,e(this))},I.prototype.render=O,s=[],n="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,i=m.debounceRendering,m.o=function(t,n,i){for(var r;n=n.i;)if((r=n.c)&&!r.i)try{if(r.constructor&&null!=r.constructor.getDerivedStateFromError)r.setState(r.constructor.getDerivedStateFromError(t));else{if(null==r.componentDidCatch)continue;r.componentDidCatch(t)}return e(r.k=r)}catch(n){t=n}throw t},o=x;var t="(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)",l="[\\s|\\(]+("+t+")[,|\\s]+("+t+")[,|\\s]+("+t+")\\s*\\)?",p="[\\s|\\(]+("+t+")[,|\\s]+("+t+")[,|\\s]+("+t+")[,|\\s]+("+t+")\\s*\\)?",_=new RegExp("rgb"+l),H=new RegExp("rgba"+p),P=new RegExp("hsl"+l),$=new RegExp("hsla"+p),T="^(?:#?|0x?)",W="([0-9a-fA-F]{1})",C="([0-9a-fA-F]{2})",D=new RegExp(T+W+W+W+"$"),F=new RegExp(T+W+W+W+W+"$"),L=new RegExp(T+C+C+C+"$"),B=new RegExp(T+C+C+C+C+"$"),q=Math.log,G=Math.round,Z=Math.floor;function J(t,n,i){return Math.min(Math.max(t,n),i)}function K(t,n){var i=-1<t.indexOf("%"),r=parseFloat(t);return i?n/100*r:r}function Q(t){return parseInt(t,16)}function U(t){return t.toString(16).padStart(2,"0")}var V=function(){function l(t,n){this.$={h:0,s:0,v:0,a:1},t&&this.set(t),this.onChange=n,this.initialValue=b({},this.$)}var t=l.prototype;return t.set=function(t){if("string"==typeof t)/^(?:#?|0x?)[0-9a-fA-F]{3,8}$/.test(t)?this.hexString=t:/^rgba?/.test(t)?this.rgbString=t:/^hsla?/.test(t)&&(this.hslString=t);else{if("object"!=typeof t)throw new Error("Invalid color value");t instanceof l?this.hsva=t.hsva:"r"in t&&"g"in t&&"b"in t?this.rgb=t:"h"in t&&"s"in t&&"v"in t?this.hsv=t:"h"in t&&"s"in t&&"l"in t?this.hsl=t:"kelvin"in t&&(this.kelvin=t.kelvin)}},t.setChannel=function(t,n,i){var r;this[t]=b({},this[t],((r={})[n]=i,r))},t.reset=function(){this.hsva=this.initialValue},t.clone=function(){return new l(this)},t.unbind=function(){this.onChange=void 0},l.hsvToRgb=function(t){var n=t.h/60,i=t.s/100,r=t.v/100,e=Z(n),u=n-e,o=r*(1-i),l=r*(1-u*i),s=r*(1-(1-u)*i),c=e%6,a=[s,r,r,l,o,o][c],f=[o,o,s,r,r,l][c];return{r:J(255*[r,l,o,o,s,r][c],0,255),g:J(255*a,0,255),b:J(255*f,0,255)}},l.rgbToHsv=function(t){var n=t.r/255,i=t.g/255,r=t.b/255,e=Math.max(n,i,r),u=Math.min(n,i,r),o=e-u,l=0,s=e,c=0===e?0:o/e;switch(e){case u:l=0;break;case n:l=(i-r)/o+(i<r?6:0);break;case i:l=(r-n)/o+2;break;case r:l=(n-i)/o+4}return{h:60*l%360,s:J(100*c,0,100),v:J(100*s,0,100)}},l.hsvToHsl=function(t){var n=t.s/100,i=t.v/100,r=(2-n)*i,e=r<=1?r:2-r,u=e<1e-9?0:n*i/e;return{h:t.h,s:J(100*u,0,100),l:J(50*r,0,100)}},l.hslToHsv=function(t){var n=2*t.l,i=t.s*(n<=100?n:200-n)/100,r=n+i<1e-9?0:2*i/(n+i);return{h:t.h,s:J(100*r,0,100),v:J((n+i)/2,0,100)}},l.kelvinToRgb=function(t){var n,i,r,e=t/100;return r=e<66?(n=255,i=-155.25485562709179-.44596950469579133*(i=e-2)+104.49216199393888*q(i),e<20?0:.8274096064007395*(r=e-10)-254.76935184120902+115.67994401066147*q(r)):(n=351.97690566805693+.114206453784165*(n=e-55)-40.25366309332127*q(n),i=325.4494125711974+.07943456536662342*(i=e-50)-28.0852963507957*q(i),255),{r:J(Z(n),0,255),g:J(Z(i),0,255),b:J(Z(r),0,255)}},l.rgbToKelvin=function(t){for(var n,i=t.r,r=t.b,e=2e3,u=4e4;.4<u-e;){var o=l.kelvinToRgb(n=.5*(u+e));o.b/o.r>=r/i?u=n:e=n}return n},function(t,n,i){n&&g(t.prototype,n),i&&g(t,i)}(l,[{key:"hsv",get:function(){var t=this.$;return{h:t.h,s:t.s,v:t.v}},set:function(t){var n=this.$;if(t=b({},n,t),this.onChange){var i={h:!1,v:!1,s:!1,a:!1};for(var r in n)i[r]=t[r]!=n[r];this.$=t,(i.h||i.s||i.v||i.a)&&this.onChange(this,i)}else this.$=t}},{key:"hsva",get:function(){return b({},this.$)},set:function(t){this.hsv=t}},{key:"hue",get:function(){return this.$.h},set:function(t){this.hsv={h:t}}},{key:"saturation",get:function(){return this.$.s},set:function(t){this.hsv={s:t}}},{key:"value",get:function(){return this.$.v},set:function(t){this.hsv={v:t}}},{key:"alpha",get:function(){return this.$.a},set:function(t){this.hsv=b({},this.hsv,{a:t})}},{key:"kelvin",get:function(){return l.rgbToKelvin(this.rgb)},set:function(t){this.rgb=l.kelvinToRgb(t)}},{key:"red",get:function(){return this.rgb.r},set:function(t){this.rgb=b({},this.rgb,{r:t})}},{key:"green",get:function(){return this.rgb.g},set:function(t){this.rgb=b({},this.rgb,{g:t})}},{key:"blue",get:function(){return this.rgb.b},set:function(t){this.rgb=b({},this.rgb,{b:t})}},{key:"rgb",get:function(){var t=l.hsvToRgb(this.$),n=t.r,i=t.g,r=t.b;return{r:G(n),g:G(i),b:G(r)}},set:function(t){this.hsv=b({},l.rgbToHsv(t),{a:void 0===t.a?1:t.a})}},{key:"rgba",get:function(){return b({},this.rgb,{a:this.alpha})},set:function(t){this.rgb=t}},{key:"hsl",get:function(){var t=l.hsvToHsl(this.$),n=t.h,i=t.s,r=t.l;return{h:G(n),s:G(i),l:G(r)}},set:function(t){this.hsv=b({},l.hslToHsv(t),{a:void 0===t.a?1:t.a})}},{key:"hsla",get:function(){return b({},this.hsl,{a:this.alpha})},set:function(t){this.hsl=t}},{key:"rgbString",get:function(){var t=this.rgb;return"rgb("+t.r+", "+t.g+", "+t.b+")"},set:function(t){var n,i,r,e,u=1;if((n=_.exec(t))?(i=K(n[1],255),r=K(n[2],255),e=K(n[3],255)):(n=H.exec(t))&&(i=K(n[1],255),r=K(n[2],255),e=K(n[3],255),u=K(n[4],1)),!n)throw new Error("Invalid rgb string");this.rgb={r:i,g:r,b:e,a:u}}},{key:"rgbaString",get:function(){var t=this.rgba;return"rgba("+t.r+", "+t.g+", "+t.b+", "+t.a+")"},set:function(t){this.rgbString=t}},{key:"hexString",get:function(){var t=this.rgb;return"#"+U(t.r)+U(t.g)+U(t.b)},set:function(t){var n,i,r,e,u=255;if((n=D.exec(t))?(i=17*Q(n[1]),r=17*Q(n[2]),e=17*Q(n[3])):(n=F.exec(t))?(i=17*Q(n[1]),r=17*Q(n[2]),e=17*Q(n[3]),u=17*Q(n[4])):(n=L.exec(t))?(i=Q(n[1]),r=Q(n[2]),e=Q(n[3])):(n=B.exec(t))&&(i=Q(n[1]),r=Q(n[2]),e=Q(n[3]),u=Q(n[4])),!n)throw new Error("Invalid hex string");this.rgb={r:i,g:r,b:e,a:u/255}}},{key:"hex8String",get:function(){var t=this.rgba;return"#"+U(t.r)+U(t.g)+U(t.b)+U(Z(255*t.a))},set:function(t){this.hexString=t}},{key:"hslString",get:function(){var t=this.hsl;return"hsl("+t.h+", "+t.s+"%, "+t.l+"%)"},set:function(t){var n,i,r,e,u=1;if((n=P.exec(t))?(i=K(n[1],360),r=K(n[2],100),e=K(n[3],100)):(n=$.exec(t))&&(i=K(n[1],360),r=K(n[2],100),e=K(n[3],100),u=K(n[4],1)),!n)throw new Error("Invalid hsl string");this.hsl={h:i,s:r,l:e,a:u}}},{key:"hslaString",get:function(){var t=this.hsla;return"hsla("+t.h+", "+t.s+"%, "+t.l+"%, "+t.a+")"},set:function(t){this.hslString=t}}]),l}();function X(t){var n,i=t.width,r=t.sliderSize,e=t.borderWidth,u=t.handleRadius,o=t.padding,l=t.sliderShape,s="horizontal"===t.layoutDirection;return r=null!=(n=r)?n:2*o+2*u,"circle"===l?{handleStart:t.padding+t.handleRadius,handleRange:i-2*o-2*u,width:i,height:i,cx:i/2,cy:i/2,radius:i/2-e/2}:{handleStart:r/2,handleRange:i-r,radius:r/2,x:0,y:0,width:s?r:i,height:s?i:r}}function Y(t,n){var i=X(t),r=i.width,e=i.height,u=i.handleRange,o=i.handleStart,l="horizontal"===t.layoutDirection,s=l?r/2:e/2,c=o+function(t,n){var i=n.hsva,r=n.rgb;switch(t.sliderType){case"red":return r.r/2.55;case"green":return r.g/2.55;case"blue":return r.b/2.55;case"alpha":return 100*i.a;case"kelvin":var e=t.minTemperature,u=t.maxTemperature-e,o=(n.kelvin-e)/u*100;return Math.max(0,Math.min(o,100));case"hue":return i.h/=3.6;case"saturation":return i.s;case"value":default:return i.v}}(t,n)/100*u;return l&&(c=-1*c+u+2*o),{x:l?s:c,y:l?c:s}}var tt,nt=2*Math.PI,it=function(t,n){return(t%n+n)%n},rt=function(t,n){return Math.sqrt(t*t+n*n)};function et(t){return t.width/2-t.padding-t.handleRadius-t.borderWidth}function ut(t){var n=t.width/2;return{width:t.width,radius:n-t.borderWidth,cx:n,cy:n}}function ot(t,n,i){var r=t.wheelAngle,e=t.wheelDirection;return i&&"clockwise"===e?n=r+n:"clockwise"===e?n=360-r+n:i&&"anticlockwise"===e?n=r+180-n:"anticlockwise"===e&&(n=r-n),it(n,360)}function lt(t,n,i){var r=ut(t),e=r.cx,u=r.cy,o=et(t);n=e-n,i=u-i;var l=ot(t,Math.atan2(-i,-n)*(360/nt)),s=Math.min(rt(n,i),o);return{h:Math.round(l),s:Math.round(100/o*s)}}function st(t){var n=t.width,i=t.boxHeight;return{width:n,height:null!=i?i:n,radius:t.padding+t.handleRadius}}function ct(t,n,i){var r=st(t),e=r.width,u=r.height,o=r.radius,l=(n-o)/(e-2*o)*100,s=(i-o)/(u-2*o)*100;return{s:Math.max(0,Math.min(l,100)),v:Math.max(0,Math.min(100-s,100))}}function at(t,n,i,r){for(var e=0;e<r.length;e++){var u=r[e].x-n,o=r[e].y-i;if(Math.sqrt(u*u+o*o)<t.handleRadius)return e}return null}function ft(t){return{boxSizing:"border-box",border:t.borderWidth+"px solid "+t.borderColor}}function ht(t,n,i){return t+"-gradient("+n+", "+i.map(function(t){var n=t[0];return t[1]+" "+n+"%"}).join(",")+")"}function vt(t){return"string"==typeof t?t:t+"px"}var dt=["mousemove","touchmove","mouseup","touchend"],gt=function(n){function t(t){n.call(this,t),this.uid=(Math.random()+1).toString(36).substring(5)}return n&&(t.__proto__=n),((t.prototype=Object.create(n&&n.prototype)).constructor=t).prototype.render=function(t){var n=this.handleEvent.bind(this),i={onMouseDown:n,ontouchstart:n},r="horizontal"===t.layoutDirection,e=null===t.margin?t.sliderMargin:t.margin,u={overflow:"visible",display:r?"inline-block":"block"};return 0<t.index&&(u[r?"marginLeft":"marginTop"]=e),h(O,null,t.children(this.uid,i,u))},t.prototype.handleEvent=function(t){var n=this,i=this.props.onInput,r=this.base.getBoundingClientRect();t.preventDefault();var e=t.touches?t.changedTouches[0]:t,u=e.clientX-r.left,o=e.clientY-r.top;switch(t.type){case"mousedown":case"touchstart":!1!==i(u,o,0)&&dt.forEach(function(t){document.addEventListener(t,n,{passive:!1})});break;case"mousemove":case"touchmove":i(u,o,1);break;case"mouseup":case"touchend":i(u,o,2),dt.forEach(function(t){document.removeEventListener(t,n,{passive:!1})})}},t}(I);function bt(t){var n=t.r,i=t.url,r=n,e=n;return h("svg",{className:"IroHandle IroHandle--"+t.index+" "+(t.isActive?"IroHandle--isActive":""),style:{"-webkit-tap-highlight-color":"rgba(0, 0, 0, 0);",transform:"translate("+vt(t.x)+", "+vt(t.y)+")",willChange:"transform",top:vt(-n),left:vt(-n),width:vt(2*n),height:vt(2*n),position:"absolute",overflow:"visible"}},i&&h("use",Object.assign({xlinkHref:function(t){tt=tt||document.getElementsByTagName("base");var n=window.navigator.userAgent,i=/^((?!chrome|android).)*safari/i.test(n),r=/iPhone|iPod|iPad/i.test(n),e=window.location;return(i||r)&&0<tt.length?e.protocol+"//"+e.host+e.pathname+e.search+t:t}(i)},t.props)),!i&&h("circle",{cx:r,cy:e,r:n,fill:"none","stroke-width":2,stroke:"#000"}),!i&&h("circle",{cx:r,cy:e,r:n-2,fill:t.fill,"stroke-width":2,stroke:"#fff"}))}function pt(e){var t=e.activeIndex,u=void 0!==t&&t<e.colors.length?e.colors[t]:e.color,n=X(e),r=n.width,o=n.height,l=n.radius,s=Y(e,u),c=function(t,n){var i=n.hsv,r=n.rgb;switch(t.sliderType){case"red":return[[0,"rgb(0,"+r.g+","+r.b+")"],[100,"rgb(255,"+r.g+","+r.b+")"]];case"green":return[[0,"rgb("+r.r+",0,"+r.b+")"],[100,"rgb("+r.r+",255,"+r.b+")"]];case"blue":return[[0,"rgb("+r.r+","+r.g+",0)"],[100,"rgb("+r.r+","+r.g+",255)"]];case"alpha":return[[0,"rgba("+r.r+","+r.g+","+r.b+",0)"],[100,"rgb("+r.r+","+r.g+","+r.b+")"]];case"kelvin":for(var e=[],u=t.minTemperature,o=t.maxTemperature,l=o-u,s=u,c=0;s<o;s+=l/8,c+=1){var a=V.kelvinToRgb(s),f=a.r,h=a.g,v=a.b;e.push([12.5*c,"rgb("+f+","+h+","+v+")"])}return e;case"hue":return[[0,"#f00"],[16.666,"#ff0"],[33.333,"#0f0"],[50,"#0ff"],[66.666,"#00f"],[83.333,"#f0f"],[100,"#f00"]];case"saturation":var d=V.hsvToHsl({h:i.h,s:0,v:i.v}),g=V.hsvToHsl({h:i.h,s:100,v:i.v});return[[0,"hsl("+d.h+","+d.s+"%,"+d.l+"%)"],[100,"hsl("+g.h+","+g.s+"%,"+g.l+"%)"]];case"value":default:var b=V.hsvToHsl({h:i.h,s:i.s,v:100});return[[0,"#000"],[100,"hsl("+b.h+","+b.s+"%,"+b.l+"%)"]]}}(e,u);return h(gt,Object.assign({},e,{onInput:function(t,n,i){var r=function(t,n,i){var r,e=X(t),u=e.handleRange,o=e.handleStart;r="horizontal"===t.layoutDirection?-1*i+u+o:n-o,r=Math.max(Math.min(r,u),0);var l=Math.round(100/u*r);switch(t.sliderType){case"kelvin":var s=t.minTemperature;return s+l/100*(t.maxTemperature-s);case"alpha":return l/100;case"hue":return 3.6*l;case"red":case"blue":case"green":return 2.55*l;default:return l}}(e,t,n);e.parent.inputActive=!0,u[e.sliderType]=r,e.onInput(i,e.id)}}),function(t,n,i){return h("div",Object.assign({},n,{className:"IroSlider",style:Object.assign({},{position:"relative",width:vt(r),height:vt(o),borderRadius:vt(l),background:"conic-gradient(#ccc 25%, #fff 0 50%, #ccc 0 75%, #fff 0)",backgroundSize:"8px 8px"},i)}),h("div",{className:"IroSliderGradient",style:Object.assign({},{position:"absolute",top:0,left:0,width:"100%",height:"100%",borderRadius:vt(l),background:ht("linear","horizontal"===e.layoutDirection?"to top":"to right",c)},ft(e))}),h(bt,{isActive:!0,index:u.index,r:e.handleRadius,url:e.handleSvg,props:e.handleProps,x:s.x,y:s.y}))})}function yt(e){var t=st(e),r=t.width,u=t.height,o=t.radius,l=e.colors,s=e.parent,n=e.activeIndex,c=void 0!==n&&n<e.colors.length?e.colors[n]:e.color,a=function(t,n){return[[[0,"#fff"],[100,"hsl("+n.hue+",100%,50%)"]],[[0,"rgba(0,0,0,0)"],[100,"#000"]]]}(0,c),f=l.map(function(t){return function(t,n){var i=st(t),r=i.width,e=i.height,u=i.radius,o=n.hsv,l=u,s=r-2*u,c=e-2*u;return{x:l+o.s/100*s,y:l+(c-o.v/100*c)}}(e,t)});return h(gt,Object.assign({},e,{onInput:function(t,n,i){if(0===i){var r=at(e,t,n,f);null!==r?s.setActiveColor(r):(s.inputActive=!0,c.hsv=ct(e,t,n),e.onInput(i,e.id))}else 1===i&&(s.inputActive=!0,c.hsv=ct(e,t,n));e.onInput(i,e.id)}}),function(t,n,i){return h("div",Object.assign({},n,{className:"IroBox",style:Object.assign({},{width:vt(r),height:vt(u),position:"relative"},i)}),h("div",{className:"IroBox",style:Object.assign({},{width:"100%",height:"100%",borderRadius:vt(o)},ft(e),{background:ht("linear","to bottom",a[1])+","+ht("linear","to right",a[0])})}),l.filter(function(t){return t!==c}).map(function(t){return h(bt,{isActive:!1,index:t.index,fill:t.hslString,r:e.handleRadius,url:e.handleSvg,props:e.handleProps,x:f[t.index].x,y:f[t.index].y})}),h(bt,{isActive:!0,index:c.index,fill:c.hslString,r:e.activeHandleRadius||e.handleRadius,url:e.handleSvg,props:e.handleProps,x:f[c.index].x,y:f[c.index].y}))})}bt.defaultProps={fill:"none",x:0,y:0,r:8,url:null,props:{x:0,y:0}},pt.defaultProps=Object.assign({},{sliderShape:"bar",sliderType:"value",minTemperature:2200,maxTemperature:11e3});function wt(e){var r=ut(e).width,u=e.colors,o=(e.borderWidth,e.parent),l=e.color,s=l.hsv,c=u.map(function(t){return function(t,n){var i=n.hsv,r=ut(t),e=r.cx,u=r.cy,o=et(t),l=(180+ot(t,i.h,!0))*(nt/360),s=i.s/100*o,c="clockwise"===t.wheelDirection?-1:1;return{x:e+s*Math.cos(l)*c,y:u+s*Math.sin(l)*c}}(e,t)}),a={position:"absolute",top:0,left:0,width:"100%",height:"100%",borderRadius:"50%",boxSizing:"border-box"};return h(gt,Object.assign({},e,{onInput:function(t,n,i){if(0===i){if(!function(t,n,i){var r=ut(t),e=r.cx,u=r.cy,o=t.width/2;return rt(e-n,u-i)<o}(e,t,n))return!1;var r=at(e,t,n,c);null!==r?o.setActiveColor(r):(o.inputActive=!0,l.hsv=lt(e,t,n),e.onInput(i,e.id))}else 1===i&&(o.inputActive=!0,l.hsv=lt(e,t,n));e.onInput(i,e.id)}}),function(t,n,i){return h("div",Object.assign({},n,{className:"IroWheel",style:Object.assign({},{width:vt(r),height:vt(r),position:"relative"},i)}),h("div",{className:"IroWheelHue",style:Object.assign({},a,{transform:"rotateZ("+(e.wheelAngle+90)+"deg)",background:"clockwise"===e.wheelDirection?"conic-gradient(red, yellow, lime, aqua, blue, magenta, red)":"conic-gradient(red, magenta, blue, aqua, lime, yellow, red)"})}),h("div",{className:"IroWheelSaturation",style:Object.assign({},a,{background:"radial-gradient(circle closest-side, #fff, transparent)"})}),e.wheelLightness&&h("div",{className:"IroWheelLightness",style:Object.assign({},a,{background:"#000",opacity:1-s.v/100})}),h("div",{className:"IroWheelBorder",style:Object.assign({},a,ft(e))}),u.filter(function(t){return t!==l}).map(function(t){return h(bt,{isActive:!1,index:t.index,fill:t.hslString,r:e.handleRadius,url:e.handleSvg,props:e.handleProps,x:c[t.index].x,y:c[t.index].y})}),h(bt,{isActive:!0,index:l.index,fill:l.hslString,r:e.activeHandleRadius||e.handleRadius,url:e.handleSvg,props:e.handleProps,x:c[l.index].x,y:c[l.index].y}))})}var kt=function(i){function t(t){var n=this;i.call(this,t),this.colors=[],this.inputActive=!1,this.events={},this.activeEvents={},this.deferredEvents={},this.id=t.id,(0<t.colors.length?t.colors:[t.color]).forEach(function(t){return n.addColor(t)}),this.setActiveColor(0),this.state=Object.assign({},t,{color:this.color,colors:this.colors,layout:t.layout})}return i&&(t.__proto__=i),((t.prototype=Object.create(i&&i.prototype)).constructor=t).prototype.addColor=function(t,n){void 0===n&&(n=this.colors.length);var i=new V(t,this.onColorChange.bind(this));this.colors.splice(n,0,i),this.colors.forEach(function(t,n){return t.index=n}),this.state&&this.setState({colors:this.colors}),this.deferredEmit("color:init",i)},t.prototype.removeColor=function(t){var n=this.colors.splice(t,1)[0];n.unbind(),this.colors.forEach(function(t,n){return t.index=n}),this.state&&this.setState({colors:this.colors}),n.index===this.color.index&&this.setActiveColor(0),this.emit("color:remove",n)},t.prototype.setActiveColor=function(t){this.color=this.colors[t],this.state&&this.setState({color:this.color}),this.emit("color:setActive",this.color)},t.prototype.setColors=function(t,n){var i=this;void 0===n&&(n=0),this.colors.forEach(function(t){return t.unbind()}),this.colors=[],t.forEach(function(t){return i.addColor(t)}),this.setActiveColor(n),this.emit("color:setAll",this.colors)},t.prototype.on=function(t,n){var i=this,r=this.events;(Array.isArray(t)?t:[t]).forEach(function(t){(r[t]||(r[t]=[])).push(n),i.deferredEvents[t]&&(i.deferredEvents[t].forEach(function(t){n.apply(null,t)}),i.deferredEvents[t]=[])})},t.prototype.off=function(t,i){var r=this;(Array.isArray(t)?t:[t]).forEach(function(t){var n=r.events[t];n&&n.splice(n.indexOf(i),1)})},t.prototype.emit=function(t){for(var n=this,i=[],r=arguments.length-1;0<r--;)i[r]=arguments[r+1];var e=this.activeEvents;!!e.hasOwnProperty(t)&&e[t]||(e[t]=!0,(this.events[t]||[]).forEach(function(t){return t.apply(n,i)}),e[t]=!1)},t.prototype.deferredEmit=function(t){for(var n,i=[],r=arguments.length-1;0<r--;)i[r]=arguments[r+1];var e=this.deferredEvents;(n=this).emit.apply(n,[t].concat(i)),(e[t]||(e[t]=[])).push(i)},t.prototype.setOptions=function(t){this.setState(t)},t.prototype.resize=function(t){this.setOptions({width:t})},t.prototype.reset=function(){this.colors.forEach(function(t){return t.reset()}),this.setState({colors:this.colors})},t.prototype.onMount=function(t){this.el=t,this.deferredEmit("mount",this)},t.prototype.onColorChange=function(t,n){this.setState({color:this.color}),this.inputActive&&(this.inputActive=!1,this.emit("input:change",t,n)),this.emit("color:change",t,n)},t.prototype.emitInputEvent=function(t,n){0===t?this.emit("input:start",this.color,n):1===t?this.emit("input:move",this.color,n):2===t&&this.emit("input:end",this.color,n)},t.prototype.render=function(t,e){var u=this,n=e.layout;return Array.isArray(n)||(n=[{component:wt},{component:pt}],e.transparency&&n.push({component:pt,options:{sliderType:"alpha"}})),h("div",{class:"IroColorPicker",id:e.id,style:{display:e.display}},n.map(function(t,n){var i=t.component,r=t.options;return h(i,Object.assign({},e,r,{ref:void 0,onInput:u.emitInputEvent.bind(u),parent:u,index:n}))}))},t}(I);kt.defaultProps=Object.assign({},{width:300,height:300,color:"#fff",colors:[],padding:6,layoutDirection:"vertical",borderColor:"#fff",borderWidth:0,handleRadius:8,activeHandleRadius:null,handleSvg:null,handleProps:{x:0,y:0},wheelLightness:!0,wheelAngle:0,wheelDirection:"anticlockwise",sliderSize:null,sliderMargin:12,boxHeight:null},{colors:[],display:"block",id:null,layout:"default",margin:null});var mt,xt,jt,Mt,Ot=(It.prototype=(mt=kt).prototype,Object.assign(It,mt),It.I=mt,It);function It(n,t){var i,r=document.createElement("div");function e(){var t=n instanceof Element?n:document.querySelector(n);t.appendChild(i.base),i.onMount(t)}return function(t,n,i){var r,e,u;m.i&&m.i(t,n),e=(r=i===o)?null:i&&i.n||n.n,t=h(O,null,[t]),u=[],k(n,r?n.n=t:(i||n).n=t,e||x,x,void 0!==n.ownerSVGElement,i&&!r?[i]:e?null:j.slice.call(n.childNodes),u,!1,i||x,r),d(u,t)}(h(mt,Object.assign({},{ref:function(t){return i=t}},t)),r),"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e),i}return(jt=xt=xt||{}).version="5.5.2",jt.Color=V,jt.ColorPicker=Ot,(Mt=jt.ui||(jt.ui={})).h=h,Mt.ComponentBase=gt,Mt.Handle=bt,Mt.Slider=pt,Mt.Wheel=wt,Mt.Box=yt,xt});
//==================================================
// text pts
//let textpts = new Array(7.29, 61.86,7.29, 51.87,7.29, 41.87,7.29, 31.86,7.29, 21.86,7.29, 11.85,7.29, 1.85,9.42, -6.00,19.42, -6.00,29.38, -5.17,38.77, -1.85,46.54, 4.36,52.13, 12.60,55.07, 22.13,55.31, 32.10,52.80, 41.74,47.59, 50.23,40.21, 56.95,31.03, 60.74,21.09, 61.66,11.09, 61.85,110.26, 53.31,103.20, 60.17,93.60, 62.70,83.80, 61.25,76.02, 55.15,72.05, 46.06,72.03, 36.12,76.03, 27.05,83.80, 20.92,93.59, 19.45,103.00, 22.51,109.59, 29.86,111.35, 39.18,101.35, 39.18,91.35, 39.18,81.34, 39.18,71.65, 39.48,73.09, 49.31,78.48, 57.63,87.22, 62.22,97.15, 62.16,106.18, 58.09,127.19, 51.78,132.41, 59.89,141.81, 62.76,150.93, 59.21,154.82, 50.34,149.84, 42.26,140.55, 38.53,132.10, 33.53,132.16, 24.18,140.68, 19.52,149.87, 22.68,148.84, 21.76,139.37, 19.60,131.44, 25.17,132.76, 34.40,141.54, 39.00,150.71, 42.89,154.70, 51.55,149.90, 59.96,140.48, 62.65,131.38, 58.97,178.86, 5.52,178.86, 61.86,178.77, 51.95,178.77, 41.95,178.77, 31.95,178.77, 21.95,178.86, 28.52,178.86, 38.52,178.86, 48.52,178.86, 58.53,206.32, 67.72,210.06, 76.75,218.73, 81.40,228.60, 80.79,236.28, 74.73,239.18, 65.27,239.44, 55.27,232.22, 60.52,222.57, 62.75,213.05, 60.06,206.12, 53.01,203.03, 43.59,204.02, 33.69,209.15, 25.22,217.65, 20.19,227.57, 19.74,236.41, 24.13,239.44, 22.01,239.53, 25.22,239.53, 35.22,239.53, 45.22,239.53, 55.23,239.31, 65.22,236.49, 74.69,228.86, 80.84,218.97, 81.55,210.23, 77.06,206.25, 68.10,267.44, 61.86,267.35, 51.95,267.35, 41.95,267.35, 31.95,267.35, 21.95,268.38, 25.27,276.49, 19.79,286.34, 20.43,292.51, 27.81,293.63, 37.70,293.63, 47.71,293.63, 57.71,293.54, 56.10,293.54, 46.10,293.54, 36.11,291.86, 26.31,284.61, 20.00,274.77, 20.40,267.45, 26.93,267.44, 36.93,267.44, 46.94,267.44, 56.93,41.76, 101.38,34.69, 94.51,25.14, 91.93,15.61, 94.48,9.03, 101.80,8.63, 111.56,15.20, 118.85,23.93, 123.74,32.80, 128.35,41.13, 133.84,45.07, 142.75,42.20, 152.14,34.74, 158.67,25.23, 161.46,15.47, 159.80,7.64, 153.72,4.74, 148.74,10.67, 156.67,19.58, 161.00,29.48, 160.67,38.31, 156.13,44.20, 148.19,44.07, 138.39,37.38, 131.19,28.65, 126.33,19.77, 121.73,11.56, 116.06,7.83, 107.10,11.29, 97.94,19.59, 92.61,29.47, 92.31,38.24, 96.88,100.54, 152.05,93.48, 158.91,83.88, 161.44,74.08, 159.99,66.30, 153.89,62.33, 144.80,62.31, 134.86,66.31, 125.79,74.08, 119.66,83.87, 118.19,93.28, 121.25,99.87, 128.60,101.63, 137.92,91.63, 137.92,81.63, 137.92,71.62, 137.92,61.93, 138.22,63.37, 148.05,68.76, 156.37,77.50, 160.96,87.43, 160.90,96.46, 156.83,154.10, 162.39,153.72, 153.75,146.04, 159.91,136.24, 161.42,126.90, 158.21,120.34, 150.81,117.79, 141.22,119.03, 131.35,124.42, 123.05,133.24, 118.60,143.17, 118.74,151.83, 123.49,154.10, 119.79,154.19, 124.93,154.19, 134.93,154.19, 144.94,154.19, 154.93,173.73, 150.52,178.95, 158.63,188.35, 161.50,197.47, 157.95,201.36, 149.08,196.38, 141.00,187.09, 137.27,178.64, 132.27,178.70, 122.92,187.22, 118.26,196.41, 121.42,195.38, 120.50,185.91, 118.34,177.98, 123.91,179.30, 133.14,188.08, 137.74,197.25, 141.63,201.24, 150.29,196.44, 158.70,187.02, 161.39,177.92, 157.71,239.34, 161.50,229.71, 159.23,222.08, 152.89,218.09, 143.82,218.54, 133.92,223.33, 125.23,231.47, 119.57,241.28, 118.19,250.74, 121.17,257.85, 128.06,261.10, 137.43,259.96, 147.28,254.56, 155.58,245.98, 160.55,281.12, 160.60,281.03, 150.69,281.03, 140.69,281.03, 130.69,281.03, 120.69,282.06, 124.01,290.17, 118.53,300.02, 119.17,306.19, 126.55,307.31, 136.44,307.31, 146.45,307.31, 156.45,307.22, 154.84,307.22, 144.84,307.22, 134.85,305.54, 125.05,298.29, 118.74,288.45, 119.14,281.13, 125.67,281.12, 135.67,281.12, 145.68,281.12, 155.67);let text2pointWidth = 302.57;let text2pointHeight = 168.39;
let textpts = new Array(7.29, 61.86,7.29, 58.52,7.29, 55.20,7.29, 51.87,7.29, 48.53,7.29, 45.19,7.29, 41.87,7.29, 38.53,7.29, 35.19,7.29, 31.86,7.29, 28.53,7.29, 25.20,7.29, 21.86,7.29, 18.52,7.29, 15.19,7.29, 11.85,7.29, 8.53,7.29, 5.19,7.29, 1.85,7.29, -1.47,7.29, -4.81,9.42, -6.00,12.77, -6.00,16.09, -6.00,19.42, -6.00,22.76, -5.92,26.08, -5.66,29.38, -5.17,32.63, -4.42,35.78, -3.33,38.77, -1.85,41.56, -0.05,44.16, 2.04,46.54, 4.36,48.69, 6.93,50.55, 9.67,52.13, 12.60,53.41, 15.69,54.40, 18.87,55.07, 22.13,55.45, 25.45,55.52, 28.77,55.31, 32.10,54.78, 35.38,53.94, 38.61,52.80, 41.74,51.35, 44.75,49.62, 47.58,47.59, 50.23,45.30, 52.66,42.85, 54.91,40.21, 56.95,37.36, 58.66,34.27, 59.91,31.03, 60.74,27.74, 61.23,24.42, 61.50,21.09, 61.66,17.77, 61.76,14.42, 61.82,11.09, 61.85,7.77, 61.86,110.26, 53.31,108.38, 56.03,105.98, 58.35,103.20, 60.17,100.12, 61.48,96.90, 62.31,93.60, 62.70,90.27, 62.72,86.97, 62.26,83.80, 61.25,80.87, 59.69,78.24, 57.62,76.02, 55.15,74.25, 52.33,72.92, 49.28,72.05, 46.06,71.62, 42.77,71.61, 39.42,72.03, 36.12,72.90, 32.91,74.25, 29.85,76.03, 27.05,78.26, 24.57,80.87, 22.51,83.80, 20.92,86.97, 19.90,90.26, 19.43,93.59, 19.45,96.88, 19.93,100.05, 20.94,103.00, 22.51,105.63, 24.56,107.85, 27.03,109.59, 29.86,110.84, 32.96,111.54, 36.20,111.35, 39.18,108.02, 39.18,104.68, 39.18,101.35, 39.18,98.02, 39.18,94.69, 39.18,91.35, 39.18,88.03, 39.18,84.68, 39.18,81.34, 39.18,78.02, 39.18,74.68, 39.18,71.65, 39.48,71.71, 42.81,72.18, 46.11,73.09, 49.31,74.44, 52.36,76.24, 55.16,78.48, 57.63,81.09, 59.68,84.03, 61.24,87.22, 62.22,90.52, 62.64,93.86, 62.60,97.15, 62.16,100.37, 61.29,103.41, 59.94,106.18, 58.09,108.55, 55.75,127.19, 51.78,128.20, 54.83,129.99, 57.62,132.41, 59.89,135.29, 61.56,138.48, 62.51,141.81, 62.76,145.10, 62.32,148.21, 61.11,150.93, 59.21,153.08, 56.68,154.44, 53.65,154.82, 50.34,154.24, 47.08,152.45, 44.29,149.84, 42.26,146.80, 40.85,143.69, 39.68,140.55, 38.53,137.43, 37.38,134.50, 35.80,132.10, 33.53,130.75, 30.49,130.80, 27.19,132.16, 24.18,134.52, 21.84,137.43, 20.25,140.68, 19.52,143.99, 19.69,147.11, 20.82,149.87, 22.68,151.99, 25.25,151.25, 24.04,148.84, 21.76,145.92, 20.16,142.69, 19.41,139.37, 19.60,136.23, 20.67,133.50, 22.56,131.44, 25.17,130.54, 28.37,130.93, 31.65,132.76, 34.40,135.39, 36.42,138.42, 37.79,141.54, 39.00,144.66, 40.16,147.79, 41.30,150.71, 42.89,153.07, 45.23,154.45, 48.24,154.70, 51.55,153.96, 54.78,152.29, 57.66,149.90, 59.96,147.00, 61.60,143.79, 62.49,140.48, 62.65,137.19, 62.13,134.09, 60.89,131.38, 58.97,129.21, 56.46,127.71, 53.49,178.86, 5.52,178.86, 61.86,178.77, 58.61,178.77, 55.28,178.77, 51.95,178.77, 48.62,178.77, 45.28,178.77, 41.95,178.77, 38.61,178.77, 35.29,178.77, 31.95,178.77, 28.62,178.77, 25.27,178.77, 21.95,178.86, 21.86,178.86, 25.19,178.86, 28.52,178.86, 31.86,178.86, 35.19,178.86, 38.52,178.86, 41.86,178.86, 45.19,178.86, 48.52,178.86, 51.85,178.86, 55.18,178.86, 58.53,178.86, 61.85,206.32, 67.72,206.82, 71.01,208.07, 74.07,210.06, 76.75,212.59, 78.90,215.54, 80.45,218.73, 81.40,222.03, 81.75,225.35, 81.55,228.60, 80.79,231.64, 79.42,234.25, 77.37,236.28, 74.73,237.78, 71.77,238.71, 68.56,239.18, 65.27,239.40, 61.94,239.44, 58.60,239.44, 55.27,237.63, 56.68,235.08, 58.81,232.22, 60.52,229.14, 61.79,225.89, 62.56,222.57, 62.75,219.25, 62.42,216.04, 61.53,213.05, 60.06,210.37, 58.11,208.03, 55.73,206.12, 53.01,204.63, 50.02,203.60, 46.87,203.03, 43.59,202.91, 40.25,203.23, 36.94,204.02, 33.69,205.28, 30.61,207.00, 27.76,209.15, 25.22,211.70, 23.07,214.56, 21.37,217.65, 20.19,220.93, 19.53,224.25, 19.39,227.57, 19.74,230.77, 20.65,233.75, 22.13,236.41, 24.13,238.71, 26.54,239.44, 25.34,239.44, 22.01,239.44, 18.67,239.53, 21.89,239.53, 25.22,239.53, 28.57,239.53, 31.89,239.53, 35.22,239.53, 38.56,239.53, 41.89,239.53, 45.22,239.53, 48.55,239.53, 51.89,239.53, 55.23,239.53, 58.56,239.50, 61.89,239.31, 65.22,238.89, 68.52,238.01, 71.74,236.49, 74.69,234.43, 77.32,231.84, 79.41,228.86, 80.84,225.62, 81.62,222.29, 81.84,218.97, 81.55,215.77, 80.67,212.80, 79.17,210.23, 77.06,208.20, 74.41,206.85, 71.39,206.25, 68.10,267.44, 61.86,267.35, 58.61,267.35, 55.28,267.35, 51.95,267.35, 48.62,267.35, 45.28,267.35, 41.95,267.35, 38.61,267.35, 35.29,267.35, 31.95,267.35, 28.62,267.35, 25.27,267.35, 21.95,267.44, 21.85,267.44, 25.19,268.38, 25.27,270.63, 22.81,273.38, 20.96,276.49, 19.79,279.80, 19.38,283.13, 19.60,286.34, 20.43,289.18, 22.14,291.23, 24.74,292.51, 27.81,293.24, 31.06,293.57, 34.37,293.63, 37.70,293.63, 41.04,293.63, 44.39,293.63, 47.71,293.63, 51.05,293.63, 54.38,293.63, 57.71,293.63, 61.05,293.54, 59.43,293.54, 56.10,293.54, 52.76,293.54, 49.43,293.54, 46.10,293.54, 42.76,293.54, 39.44,293.54, 36.11,293.36, 32.77,292.84, 29.48,291.86, 26.31,290.19, 23.42,287.69, 21.25,284.61, 20.00,281.32, 19.51,278.00, 19.59,274.77, 20.40,271.86, 22.01,269.39, 24.24,267.45, 26.93,267.44, 30.27,267.44, 33.61,267.44, 36.93,267.44, 40.27,267.44, 43.61,267.44, 46.94,267.44, 50.27,267.44, 53.61,267.44, 56.93,267.44, 60.27,41.76, 101.38,39.80, 98.72,37.44, 96.40,34.69, 94.51,31.67, 93.09,28.47, 92.21,25.14, 91.93,21.82, 92.20,18.61, 93.05,15.61, 94.48,12.92, 96.44,10.69, 98.91,9.03, 101.80,8.10, 104.99,7.96, 108.30,8.63, 111.56,10.21, 114.48,12.55, 116.84,15.20, 118.85,18.03, 120.64,20.96, 122.21,23.93, 123.74,26.88, 125.27,29.85, 126.82,32.80, 128.35,35.72, 129.97,38.54, 131.74,41.13, 133.84,43.19, 136.45,44.56, 139.48,45.07, 142.75,44.86, 146.07,43.87, 149.25,42.20, 152.14,40.06, 154.69,37.55, 156.87,34.74, 158.67,31.73, 160.06,28.54, 161.00,25.23, 161.46,21.91, 161.42,18.61, 160.88,15.47, 159.80,12.56, 158.21,9.93, 156.15,7.64, 153.72,5.76, 150.98,4.29, 147.99,4.74, 148.74,6.32, 151.66,8.30, 154.33,10.67, 156.67,13.38, 158.62,16.37, 160.08,19.58, 161.00,22.88, 161.39,26.21, 161.28,29.48, 160.67,32.62, 159.57,35.59, 158.04,38.31, 156.13,40.72, 153.83,42.73, 151.18,44.20, 148.19,44.93, 144.94,44.86, 141.62,44.07, 138.39,42.41, 135.51,40.04, 133.18,37.38, 131.19,34.55, 129.44,31.61, 127.87,28.65, 126.33,25.69, 124.79,22.73, 123.26,19.77, 121.73,16.88, 120.05,14.14, 118.18,11.56, 116.06,9.46, 113.48,8.20, 110.41,7.83, 107.10,8.24, 103.80,9.43, 100.69,11.29, 97.94,13.69, 95.63,16.49, 93.85,19.59, 92.61,22.84, 91.97,26.18, 91.86,29.47, 92.31,32.65, 93.33,35.61, 94.87,38.24, 96.88,40.47, 99.37,100.54, 152.05,98.66, 154.77,96.26, 157.09,93.48, 158.91,90.40, 160.22,87.18, 161.05,83.88, 161.44,80.55, 161.46,77.25, 161.00,74.08, 159.99,71.15, 158.43,68.52, 156.36,66.30, 153.89,64.53, 151.07,63.20, 148.02,62.33, 144.80,61.90, 141.51,61.89, 138.16,62.31, 134.86,63.18, 131.65,64.53, 128.59,66.31, 125.79,68.54, 123.31,71.15, 121.25,74.08, 119.66,77.25, 118.64,80.54, 118.17,83.87, 118.19,87.16, 118.67,90.33, 119.68,93.28, 121.25,95.91, 123.30,98.13, 125.77,99.87, 128.60,101.12, 131.70,101.82, 134.94,101.63, 137.92,98.30, 137.92,94.96, 137.92,91.63, 137.92,88.30, 137.92,84.97, 137.92,81.63, 137.92,78.31, 137.92,74.96, 137.92,71.62, 137.92,68.30, 137.92,64.96, 137.92,61.93, 138.22,61.99, 141.55,62.46, 144.85,63.37, 148.05,64.72, 151.10,66.52, 153.90,68.76, 156.37,71.37, 158.42,74.31, 159.98,77.50, 160.96,80.80, 161.38,84.14, 161.34,87.43, 160.90,90.65, 160.03,93.69, 158.68,96.46, 156.83,98.83, 154.49,154.10, 162.39,154.10, 159.07,154.10, 155.74,153.72, 153.75,151.60, 156.32,148.99, 158.37,146.04, 159.91,142.87, 160.95,139.58, 161.46,136.24, 161.42,132.97, 160.89,129.81, 159.82,126.90, 158.21,124.30, 156.13,122.08, 153.63,120.34, 150.81,119.03, 147.74,118.19, 144.51,117.79, 141.22,117.79, 137.88,118.18, 134.58,119.03, 131.35,120.35, 128.30,122.15, 125.50,124.42, 123.05,127.09, 121.05,130.05, 119.56,133.24, 118.60,136.55, 118.16,139.88, 118.19,143.17, 118.74,146.31, 119.81,149.25, 121.40,151.83, 123.49,153.98, 126.04,154.10, 123.11,154.10, 119.79,154.19, 118.26,154.19, 121.59,154.19, 124.93,154.19, 128.26,154.19, 131.61,154.19, 134.93,154.19, 138.27,154.19, 141.60,154.19, 144.94,154.19, 148.27,154.19, 151.59,154.19, 154.93,154.19, 158.27,154.19, 161.60,173.73, 150.52,174.74, 153.57,176.53, 156.36,178.95, 158.63,181.83, 160.30,185.02, 161.25,188.35, 161.50,191.64, 161.06,194.75, 159.85,197.47, 157.95,199.62, 155.42,200.98, 152.39,201.36, 149.08,200.78, 145.82,198.99, 143.03,196.38, 141.00,193.34, 139.59,190.23, 138.42,187.09, 137.27,183.97, 136.12,181.04, 134.54,178.64, 132.27,177.29, 129.23,177.34, 125.93,178.70, 122.92,181.06, 120.58,183.97, 118.99,187.22, 118.26,190.53, 118.43,193.65, 119.56,196.41, 121.42,198.53, 123.99,197.79, 122.78,195.38, 120.50,192.46, 118.90,189.23, 118.15,185.91, 118.34,182.77, 119.41,180.04, 121.30,177.98, 123.91,177.08, 127.11,177.47, 130.39,179.30, 133.14,181.93, 135.16,184.96, 136.53,188.08, 137.74,191.20, 138.90,194.33, 140.04,197.25, 141.63,199.61, 143.97,200.99, 146.98,201.24, 150.29,200.50, 153.52,198.83, 156.40,196.44, 158.70,193.54, 160.34,190.33, 161.23,187.02, 161.39,183.73, 160.87,180.63, 159.63,177.92, 157.71,175.75, 155.20,174.25, 152.23,239.34, 161.50,236.03, 161.25,232.79, 160.50,229.71, 159.23,226.85, 157.51,224.29, 155.39,222.08, 152.89,220.29, 150.10,218.94, 147.05,218.09, 143.82,217.76, 140.51,217.91, 137.19,218.54, 133.92,219.69, 130.79,221.30, 127.88,223.33, 125.23,225.74, 122.94,228.48, 121.03,231.47, 119.57,234.64, 118.61,237.95, 118.16,241.28, 118.19,244.58, 118.70,247.75, 119.69,250.74, 121.17,253.46, 123.08,255.85, 125.39,257.85, 128.06,259.43, 131.00,260.52, 134.15,261.10, 137.43,261.20, 140.75,260.83, 144.05,259.96, 147.28,258.60, 150.31,256.78, 153.10,254.56, 155.58,251.96, 157.68,249.09, 159.34,245.98, 160.55,242.73, 161.27,239.40, 161.50,281.12, 160.60,281.03, 157.35,281.03, 154.02,281.03, 150.69,281.03, 147.36,281.03, 144.02,281.03, 140.69,281.03, 137.35,281.03, 134.03,281.03, 130.69,281.03, 127.36,281.03, 124.01,281.03, 120.69,281.12, 120.59,281.12, 123.93,282.06, 124.01,284.31, 121.55,287.06, 119.70,290.17, 118.53,293.48, 118.12,296.81, 118.34,300.02, 119.17,302.86, 120.88,304.91, 123.48,306.19, 126.55,306.92, 129.80,307.25, 133.11,307.31, 136.44,307.31, 139.78,307.31, 143.13,307.31, 146.45,307.31, 149.79,307.31, 153.12,307.31, 156.45,307.31, 159.79,307.22, 158.17,307.22, 154.84,307.22, 151.50,307.22, 148.17,307.22, 144.84,307.22, 141.50,307.22, 138.18,307.22, 134.85,307.04, 131.51,306.52, 128.22,305.54, 125.05,303.87, 122.16,301.37, 119.99,298.29, 118.74,295.00, 118.25,291.68, 118.33,288.45, 119.14,285.54, 120.75,283.07, 122.98,281.13, 125.67,281.12, 129.01,281.12, 132.35,281.12, 135.67,281.12, 139.01,281.12, 142.35,281.12, 145.68,281.12, 149.01,281.12, 152.35,281.12, 155.67,281.12, 159.01);let text2pointWidth = 303.02;let text2pointHeight = 168.39;

//==================================================

//==================================================
//sfs
//pattern colour picker

// It's all sliders
const forcedsizeofcolourpicker = window.innerWidth * 0.5;
const forcedheightofcolourpicker = forcedsizeofcolourpicker / 10.0;
const colorPatternPicker = new iro.ColorPicker("#colourWheelPicker", {
	handleRadius: '5',
	width: forcedsizeofcolourpicker,
	color: "rgb(50, 0, 80)", // to do, pick from livery or first default
	borderWidth: 1,
	borderColor: "#fff",
	layout: [
	  {
		component: iro.ui.Slider,
		options: {
			height: 10,
		  sliderType: 'hue'
		}
	  },
	  {
		component: iro.ui.Slider,
		options: {
			height: 10,
		  sliderType: 'saturation'
		}
	  },
	  {
		component: iro.ui.Slider,
		options: {
			height: 10,
		  sliderType: 'value'
		}
	  },
	]
  });
  

colorPatternPicker.on('input:change', function(color) {

	var tmpcol = new THREE.Color(color.hexString);
	var tmpv4 = new THREE.Vector4(tmpcol.r,tmpcol.g,tmpcol.b,1.0);

	f1Gui.setBackgroundColourByID('coloursample',color.hexString);
	var currentLayer = f1Gui.currentPage-1;
	if(f1Gui.currentPage>1) currentLayer--;

	if(selectedChan==0) {
		f1Gui.setBackgroundColourByID('basepaintbutton',color.hexString);
	}
	else if(selectedChan==1) {
		f1Gui.setBackgroundColourByID('primarypaintbutton',color.hexString);
	}
	else if(selectedChan==2) {
		f1Gui.setBackgroundColourByID('secondarypaintbutton',color.hexString);
	}
	else if(selectedChan==3) { // tagstyle
		f1Gui.setBackgroundColourByID('tagstylepaintbutton',color.hexString);
	}
	else if(selectedChan==4) { // tag
		f1Gui.setBackgroundColourByID('tagpaintbutton',color.hexString);
	}
	else if(selectedChan==5) { // decal
		f1Gui.setBackgroundColourByID('decalpaintbutton',color.hexString);
	}


	if(selectedChan<3) { // pattern colour
		processJSON.liveryData['Layers'][currentLayer].Channels[selectedChan].tint = color.hexString;
	}
	else if(selectedChan<5) { // tag colour
		processJSON.liveryData['Layers'][currentLayer].Channels[selectedChan-3].tint = color.hexString;
	}
	else if(selectedChan==5) { // decal colour
		processJSON.liveryData['Layers'][currentLayer].Channels[0].tint = color.hexString;
	}

	switch(selectedChan) {
		case 0:
			f1Layers.mapUniforms.texture1TintChannel1.value = tmpv4;
			break;
		case 1:
			f1Layers.mapUniforms.texture1TintChannel2.value = tmpv4;
			break;
		case 2:
			f1Layers.mapUniforms.texture1TintChannel3.value = tmpv4;
			break;
		case 3: // tag style
			f1Layers.mapUniforms.tagStyleTint.value = tmpv4;
			break;
		case 4: // tag
			f1Layers.mapUniforms.tagTint.value = tmpv4;
			break;
		case 5: // decal
			f1Layers.mapUniforms.decalTint.value = tmpv4;
			break;
		default:
			alert("error in index of colour buttons in colorPatternPicker");
	  }
})	
//==================================================

//==================================================
function onloaded()
{
	if(userConsole==1) {
		document.getElementById('versionid').classList.add('console');
		document.getElementById('versionid').classList.add('console_button');	
	}
	// inline ar
	// createObserver();  // handles intersection observer behavior
	// dateCheck();  // sets today's date in the article
	//




	var loadedtime = new Date().getTime();
	var timeDiff = loadedtime - loadtime; //in ms

	// fade out loading splash
	document.getElementById('splashblock').classList.add('fadedout');
	
	// fade in intro page
	if(timeDiff >= 2500) { // already taken enough time loading...
		console.log(">> load time took = " + (timeDiff/1000) + " - so don't delay!");

		document.getElementById('welcomeblock').classList.remove('fadedout');
	}
	else {
		setTimeout( function() {
			console.log(">> load time took = " + (timeDiff/1000) + " - rather quick!");
			document.getElementById('welcomeblock').classList.remove('fadedout');
		}, 2500 - timeDiff); // ensure at least 2500 ms of load show
	}
	// waits for intro page ok button click....


}
//==================================================
var deb_specialPipelineToggle = true;
var deb_ribbonToggle = f1Ribbons.enabled;



function onConsole(_switch) {
	if(userConsole==0)
		return;

	const console = document.getElementById('console');
	if(_switch==0) {
		if(console.className == 'hidden') {
			// update values in sliders
			document.getElementById('c_tonemappingSliderTxt').innerHTML = 'toneMapping : ' + renderer.toneMappingExposure;
			const tmtype = renderer.toneMapping == 
				THREE.LinearToneMapping ? 'linear' : renderer.toneMapping == THREE.CineonToneMapping ? 'cineon'
				: 'aces';
			document.getElementById('c_tonemap').value = tmtype;

			if(document.getElementById('c_envstrength').value=="car")
				document.getElementById('c_envStrengthSliderTxt').innerHTML = 'envStrength : ' + f1Materials.envmapStrength;
				else if(document.getElementById('c_envstrength').value=="carstatic")
				document.getElementById('c_envStrengthSliderTxt').innerHTML = 'envStrength : ' + f1Materials.envstrBase;
			else 
				document.getElementById('c_envStrengthSliderTxt').innerHTML = 'envStrength : ' + f1Materials.envstrGar;

			
			
			console.classList.remove('hidden');
		}
		else
			console.classList.add('hidden');
	}
	else if(_switch==1) {
		deb_specialPipelineToggle=!deb_specialPipelineToggle;
	}
	else if(_switch==2) {
		deb_ribbonToggle=!deb_ribbonToggle;
		f1Ribbons.enabled =!f1Ribbons.enabled;
		f1Ribbons.root.visible=f1Ribbons.enabled;
	}
	else if(_switch==3) { // ribbon glow
		f1Ribbons.enableGlow = !f1Ribbons.enableGlow;


//		f1Ribbons.createBentMesh();
	}
}

document.getElementById('c_tonemappingSlider').oninput = function () {
	self.amount = this.value/10.0;// ((this.value / 100.0)*6.0) + 0.5;
	document.getElementById('c_tonemappingSliderTxt').innerHTML = 'toneMapping : ' + self.amount;
	// renderer.toneMapping = THREE.ACESFilmicToneMapping;// THREE.LinearToneMapping;
	renderer.toneMappingExposure = self.amount;
}



document.getElementById('c_envStrengthSlider').oninput = function () {
	self.amount = this.value/10.0;// ((this.value / 100.0)*6.0) + 0.5;
	document.getElementById('c_envStrengthSliderTxt').innerHTML = 'envStrength : ' + self.amount;
	if(document.getElementById('c_envstrength').value=="car")
		f1Materials.setEnvStrength(self.amount,f1CarHelmet,f1Garage,0);
	else
	if(document.getElementById('c_envstrength').value=="carstatic")
		f1Materials.setEnvStrength(self.amount * 150.0,f1CarHelmet,f1Garage,1);
	else
		f1Materials.setEnvStrength(self.amount,f1CarHelmet,f1Garage,2);
	
}
document.getElementById('c_lightsSlider').oninput = function () {
	self.amount = this.value/10.0;// ((this.value / 100.0)*6.0) + 0.5;
	document.getElementById('c_lightsSliderTxt').innerHTML = 'spots: ' + self.amount;
	mainLight.intensity = 0.6 * self.amount;
	mainLight2.intensity = 0.6 * self.amount;	
}
document.getElementById('c_lightsASlider').oninput = function () {
	self.amount = this.value/10.0;
	document.getElementById('c_lightsASliderTxt').innerHTML = 'ambient light: ' + self.amount;
	ambLight.intensity = 0.5 * self.amount;
}
document.getElementById('c_lightsDSlider').oninput = function () {
	self.amount = this.value/10.0;
	document.getElementById('c_lightsDSliderTxt').innerHTML = 'dir light: ' + self.amount;
	dirLight.intensity = 0.5 * self.amount;
//	dirLightFloor.intensity = 0.5 * self.amount;
}
document.getElementById('c_sfxSlider').oninput = function () {
	self.amount = this.value/10.0;
	document.getElementById('c_sfxSliderTxt').innerHTML = 'sfx bloom: ' + self.amount;

	f1SpecialFX.finalPass.uniforms.bloomAmount.value = self.amount;
}
// 
document.getElementById('c_envstrength').onchange = function () {
	console.log(this.value);
	if(this.value=="car")
		document.getElementById('c_envStrengthSliderTxt').innerHTML = 'envStrength : ' + f1Materials.envmapStrength;
	else if(this.value=="carstatic")
		document.getElementById('c_envStrengthSliderTxt').innerHTML = 'envStrength : ' + f1Materials.envstrBase;
	else 
		document.getElementById('c_envStrengthSliderTxt').innerHTML = 'envStrength : ' + f1Materials.envstrGar;

}



document.getElementById('c_tonemap').onchange = function () {
	console.log(this.value);
	if(this.value=="linear") {
		renderer.toneMapping = THREE.LinearToneMapping;
	}
	else if(this.value=="cineon") {
		renderer.toneMapping = THREE.CineonToneMapping;//ACESFilmicToneMapping;// THREE.LinearToneMapping;

	}
	else if(this.value=="aces") {
		renderer.toneMapping = THREE.ACESFilmicToneMapping;// THREE.LinearToneMapping;
	}
}


//==================================================
function expandDropdown(e) {
	const _self = document.getElementById(e);
	const classArray = _self.className.split(" ");
	var wasshrunk = false;
	classArray.forEach(element => {
		if(element=="shrunk") {
			wasshrunk=true;
		}
	});
	if(wasshrunk) {
		_self.classList.remove('shrunk');
	}
	else {
		_self.classList.add('shrunk');
	}
}


//==================================================
var minmaxmining = 0;
var minmaxtime = 0;
var minmaxdest = 1000;
var haveminimized = false;

function onMinMax() {
	// document.getElementById('minmax').classList.add('tomin');
	// document.getElementById('palette_tools').classList.add('tomin');
	
	// minmaxmining = 1;
	// return;

	if(haveminimized) {
		var posy = new THREE.Vector3(window.innerHeight - f1Gui.tabHeight,0,0);
		var top = f1Gui.bestToolPosY;
		console.log(">> top = " + top);
		document.getElementById('minmax').classList.remove('gg-chevron-rotated');
		

		new TWEEN.Tween(posy)
		.to(
			{
				x: top,
				y: 0,
				z: 0,
			},
			500
		)
		.onUpdate(function(d) {
			
	//		console.log("d="+d.x);
			document.querySelector(':root').style.setProperty('--toolsPosY', d.x+"px" );
			f1Gui.setRendererSize(window.innerWidth, d.x + f1Gui.tabHeight, renderer,camera);
		})
		.start()
	}
	else if(!haveminimized) {
		var posy = new THREE.Vector3(f1Gui.bestToolPosY,0,0);
		var top = window.innerHeight - f1Gui.tabHeight;
		console.log(">> top = " + top);
		document.getElementById('minmax').classList.add('gg-chevron-rotated');

		new TWEEN.Tween(posy)
		.to(
			{
				x: top,
				y: 0,
				z: 0,
			},
			500
		)
		.onUpdate(function(d) {
			
	//		console.log("d="+d.x);
			document.querySelector(':root').style.setProperty('--toolsPosY', d.x+"px" );
			f1Gui.setRendererSize(window.innerWidth, d.x + f1Gui.tabHeight, renderer,camera);

		})
		.start()
	}
	haveminimized=!haveminimized;
	// minmax(f1Gui.bestToolPosY);
}

//==================================================
function switchModel(_isHelmet) {
	if(isHelmet == _isHelmet) return;
	isHelmet = _isHelmet;
	processJSON.loadPatterns(isHelmet,userID,userName,userEmail,cookie_livery_value);

}
//==================================================
function seekPatternThumb(patternblock,layer) {
	var hasfound = false;
	var element;
	for(var i=0;i<patternblock.children.length;i++) {
		const id= patternblock.children[i].children[0].getAttribute('patternId');
		if(processJSON.liveryData['Layers'][layer].patternId == id){
			// matched!
			console.log("matched");
			hasfound=true;
			// patternThumbElement = patternblock.children[i].children[0];
			element = patternblock.children[i].children[0];
			break;
		}
	}

	if(!hasfound) {
		console.log(">> **** error finding matching pattern");
	}
	return element;
}
//==================================================
function introNextPage(nextPage) {
	if(nextPage==1) { // have clicked on first intro page Ok button ==> fade in tutorial page 1
		document.getElementById('welcomeblock').classList.add('fadedout');

		seekPatternThumb(document.getElementById('layer1patterns_ins'),0).click();
		// patternItems.layerNoneElements[0].click(); // force first empty pattern
		f1Gui.isAuto=false;

		// after 0.7s fade in the tutoral page 1
		setTimeout( function() {
			document.getElementById('tut1block').classList.remove('fadedout');
			document.getElementById('container').style.display ="block";
			
			// then fade in the 3D after 0.7
			setTimeout( function() {
				document.getElementById('container').classList.remove('fadedout');
			}, 700);
		}, 700);
	}
	else if(nextPage==2) { // have clicked on first tutorial page Next button ==> show tutorial page 2
		
		document.getElementById('tut1interior').classList.add('fadedout');
		document.getElementById('tut2block').classList.remove('fadedout');

		setTimeout( function() {
			document.getElementById('tut1block').classList.add('fadedout');
		}, 700);
	}
	else if(nextPage==3) { // let's go!

		seekPatternThumb(document.getElementById('layer1patterns_ins'),0).click();
		// patternItems.layerNoneElements[0].click(); // force first empty pattern

		document.getElementById('tut2block').classList.add('fadedout');

		// enable tools
		f1Gui.updateProgress(5,'activating');
		onPatternsTab();


		document.getElementById('palette_tools').classList.remove('disabledUserEvents');
	}

}
//==================================================

//==================================================

//==================================================
function initit()
{
	// update version
	document.getElementById('versionid').innerHTML=paintshopversion;

	// aws test
	//




	renderer = new THREE.WebGLRenderer(
		{ 
			alpha: true, 
			antialias: true,
			preserveDrawingBuffer: true,
			// premultipliedAlpha: false,
			premultipliedAlpha: true,

//			physicallyCorrectLights: true,
		});
	renderer.sortObjects = false;

	// shadow test
	// renderer.shadowMapEnabled = true;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	//
	// renderer.toneMapping = THREE.CineonToneMapping;//ACESFilmicToneMapping;// THREE.LinearToneMapping;
	// renderer.toneMappingExposure = 2.9;

	// renderer.toneMapping = THREE.ACESFilmicToneMapping;// THREE.LinearToneMapping;
	// renderer.toneMappingExposure = 0.85;

	// renderer.toneMapping = THREE.ACESFilmicToneMapping;// THREE.LinearToneMapping;
	// renderer.toneMappingExposure = 1.1;



	// a bit dark
	// renderer.toneMapping = THREE.LinearToneMapping;// THREE.LinearToneMapping;
	// renderer.toneMappingExposure = 1.4;



	// renderer.toneMapping = THREE.CineonToneMapping;//ACESFilmicToneMapping;// THREE.LinearToneMapping;
	// renderer.toneMappingExposure = 2.9;
	// renderer.toneMapping = THREE.CineonToneMapping;//ACESFilmicToneMapping;// THREE.LinearToneMapping;
	// renderer.toneMappingExposure = 2.9;// 2.7;

	// renderer.toneMapping = THREE.ACESFilmicToneMapping;// THREE.LinearToneMapping;
	// renderer.toneMappingExposure = 2.0;// 2.7;

	// lees settings
	renderer.toneMapping = THREE.LinearToneMapping;
	renderer.toneMappingExposure = 0.9;


	// document.getElementById('c_tonemap').value = "cineon";
	// document.getElementById('c_tonemappingSlider').value = 23.0;
	// f1Materials.setEnvStrength(4.9,f1CarHelmet,f1Garage,0); // car
	// f1Materials.setEnvStrength(5.0,f1CarHelmet,f1Garage,1); // car static
	// f1Materials.setEnvStrength(0.6,f1CarHelmet,f1Garage,2); // garage


}
//==================================================
function initScenes()
{
	// setTimeout(() => {

	// 	f1Materials.loadEnvMap(f1CarHelmet,f1Garage);

	// 	// const envmap = f1Materials.envMap;

	// 	// // just do an update of all the materials!
	// 	// f1CarHelmet.envMap = envmap;
	// 	// f1CarHelmet.theHelmetMaterial.envMap = envmap;
	// 	// f1CarHelmet.theBaseMaterial.envMap = envmap;
	// 	// f1Garage.garageMaterial.envMap = envmap;
	// 	// f1Garage.garageWall.material.envMap = envmap;

	// 	// f1CarHelmet.theHelmetMaterial.needsUpdate=true;
	// 	// f1CarHelmet.theBaseMaterial.needsUpdate=true;
	// 	// f1Garage.garageMaterial.needsUpdate=true;
	// 	// f1Garage.garageWall.material.needsUpdate=true;

	// }, 10000);

	if(!alreadyInitScenes) {
		alreadyInitScenes=true;
	}
	else {
//		f1CarHelmet.init(f1Materials,f1Layers, isHelmet, f1fnames, f1MetalRough,f1Gui,f1SpecialFX);
//		return;
		// while (sceneFX.children.length > 0) {
		// 	sceneFX.remove(sceneFX.children[0]);
		// }
		while (scene.children.length > 0) {
			scene.remove(scene.children[0]);
		}

	} 
		
	// var planeGeometry = new THREE.PlaneGeometry(renderSize,renderSize);
	// var planeGradientGeometry = new THREE.PlaneGeometry(renderSize,renderSize);
	
	// sceneFX = new THREE.Scene();
	// sceneFX.background = null;






	scene = new THREE.Scene();
	//scene.background = null;
	// scene.background =  new THREE.Color( 0xffd933 );
	scene.background =  new THREE.Color( 0x555555 );

	camera = new THREE.PerspectiveCamera( 45, renderSize / renderSize, 0.1, 900 );
	// camera.position.set(0,0, 120);
	camera.position.set(44,36, 90);


	
	camera.layers.enable(2);
	camera.layers.disable(3);

	scene.add(camera);
	// sceneFX.add(camera);

	threecanvasElement = canvas.appendChild(renderer.domElement);

	var gl = renderer.getContext("webgl", {premultipliedAlpha: true});//false});
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	// console.log(gl);







	//=====================
    // POST RENDER EFFECTS
	f1SpecialFX.setupBloom(scene, camera,renderer,renderSize,f1Garage);


/*



	fxComposer = new EffectComposer(renderer);
	// f1BloomPass = new F1BloomPass(new THREE.Vector2( 1024, 1024 ), 4.0, 0.3, 0.08);
	// f1BloomPass = new F1BloomPass(new THREE.Vector2( 1024, 1024 ), 3.0, 0.3, 0.08);
	//const f1BloomPass = new F1BloomPass(new THREE.Vector2( 1024, 1024 ), 3.0, 0.1, 0.08);
	const f1BloomPass = new UnrealBloomPass(new THREE.Vector2( 1024, 1024 ), 5.0, 0.15, 0.018);
	// const f1BloomPass = new BloomPass(new THREE.Vector2( 1024, 1024 ), 3.0, 0.1, 0.08);
	// const f1BloomPass = new BloomPass(3, 25, 5.0, 256);
	// f1BloomPass.blendMode = THREE.AdditiveBlending;
	f1BloomPass.renderToScreen = false;
	// f1BloomPass.renderToScreen = true;


	const renderPass = new RenderPass( scene, camera );
	fxComposer.addPass( renderPass );
	fxComposer.addPass( f1BloomPass );

	// const drawShader = new THREE.ShaderMaterial({
	// 	vertexShader:`
	// 	varying vec2 vUv;
	// 	uniform int renderMode;
	// 	uniform float fxAmount;

	// 	void main() {
	// 	  vUv = uv;
	// 	  vec3 pos = position;

	// 	  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
	// 	}
	//   `,
	// 	fragmentShader: `uniform float transparency;
	// 		uniform sampler2D tDiffuse;

	// 	varying vec2 vUv;

	// 	void main() {

	// 		vec4 texel = texture2D( tDiffuse, vUv );
	// 		//float tran = transparency;
	// 		float tran = 0.5 * texel.r;
	// 		vec3 col = vec3(texel.r,texel.r,texel.r);
			

	// 		vec3 luma = vec3(0.33, 0.33, 0.33);
	// 		float v = pow(dot( texel.rgb, luma ), 0.05); // the exponent can be parametrized to adjust brightness
	// 		gl_FragColor = vec4( col.rgb, texel.a*v*tran );
	// 	}`,
	// 	transparent: true,
	// 	blending: THREE.AdditiveBlending,
	// 	depthTest: true,
	// 	uniforms: {
	// 		transparency: { value: 1}, // can be parametrized as well
	// 	},
	// });

	const finalPass = new ShaderPass(
		new THREE.ShaderMaterial( {
			uniforms: {
				baseTexture: { value: null },
				bloomTexture: { value: fxComposer.renderTarget2.texture }
			},
			vertexShader: `
			varying vec2 vUv;

			void main() {

				vUv = uv;

				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}
			`,
			fragmentShader: `
			uniform sampler2D baseTexture;
			uniform sampler2D bloomTexture;

			varying vec2 vUv;

			void main() {

				gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

			}

			`,
			defines: {}
		} ), 'baseTexture'
	);
	finalPass.needsSwap = true;

	finalComposer = new EffectComposer( renderer );
	finalComposer.addPass( renderPass );
	finalComposer.addPass( finalPass );

	finalComposer.setSize(renderSize,renderSize);
	fxComposer.setSize(renderSize,renderSize);

	// const shaderPass = new ShaderPass(drawShader, "tDiffuse");
	// effectComposer.addPass( shaderPass );

*/


	// effectComposer = new EffectComposer(renderer, f1SpecialFX.bufferMapSceneTarget);
	// f1BloomPass = new F1BloomPass(new THREE.Vector2( 1024, 1024 ), 4.0, 0.3, 0.08);
	// // f1bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);

	// const renderPass = new RenderPass( scene, camera );
	// effectComposer.addPass( renderPass );
	
	// effectComposer.addPass( f1BloomPass );


	// effectComposer.addPass(f1BloomPass);

	/*
	fxRenderScene = new RenderPass( specialFXscene, camera );
	// fxRenderScene.clearColor = new THREE.Color(0, 0, 0);
	// fxRenderScene.clearAlpha = 0;
	// fxRenderScene.clear = false;

	fxComposer = new EffectComposer( renderer );
	*/




	// dotScreenPass_1 = new DotScreenPass(new THREE.Vector2(.5,.5),0, .1);
	// dotScreenPass_2 = new DotScreenPass(new THREE.Vector2(.5,.5),0, .1);

	
	// const HalftonePass_params_1 = {
	// 	shape: 1,
	// 	radius: 4,
	// 	rotateR: Math.PI / 12,
	// 	rotateB: Math.PI / 12 * 2,
	// 	rotateG: Math.PI / 12 * 3,
	// 	scatter: 0,
	// 	blending: 1,
	// 	blendingMode: 1,
	// 	greyscale: false,
	// 	disable: false
	// };	
	// HalftonePass_1 =  new HalftonePass(1024,1024,HalftonePass_params_1);
	// HalftonePass_2 =  new HalftonePass(1024,1024,HalftonePass_params_1);

	// bloomPass_1 = new BloomPass(3, 25, 5.0, 256);
	// bloomPass_2 = new BloomPass(3, 25, 5.0, 256);

	// UnrealBloomPass_1 = new UnrealBloomPass(new THREE.Vector2( 1024, 1024 ), 11.5, 0.4, 0.85);
	// UnrealBloomPass_2 = new UnrealBloomPass(new THREE.Vector2( 1024, 1024 ), 1.5, 0.4, 0.85);

//	f1BloomPass = new F1BloomPass(new THREE.Vector2( 1024, 1024 ), 5.5, 0.1, 0.85);
	// f1BloomPass = new F1BloomPass(new THREE.Vector2( 1024, 1024 ), 4.0, 0.3, 0.08);


	// AfterimagePass_1 = new AfterimagePass( 0.99);
	// AfterimagePass_2 = new AfterimagePass(0.99);
	// SobelOperatorShader_1 = new ShaderPass(SobelOperatorShader);
	// SobelOperatorShader_2 = new ShaderPass(SobelOperatorShader);
	// SobelOperatorShader_1.uniforms[ 'resolution' ].value.x = 512 * window.devicePixelRatio;
	// SobelOperatorShader_2.uniforms[ 'resolution' ].value.x = 512 * window.devicePixelRatio;
	// SobelOperatorShader_1.uniforms[ 'resolution' ].value.y = 512 * window.devicePixelRatio;
	// SobelOperatorShader_2.uniforms[ 'resolution' ].value.y = 512 * window.devicePixelRatio;

	// composer_1.addPass( renderPass_1 );
	// composer_1.addPass( savePass_1 );

	// fxRenderScene.renderToScreen = false;
	// f1BloomPass.renderToScreen = false;

	// fxComposer.addPass( fxRenderScene );
	// fxComposer.addPass( f1BloomPass );

	//

	//	glitchPass_2.enabled = false;

	// composer_2.addPass( renderPass_2 );
	// composer_2.addPass( savePass_2 );


	

	// layerTexture_2 = new THREE.TextureLoader().load( './assets/helmet/Helmet Triangulated_BaseColor.png' );

	//

/*
	fxUniforms = {
		texture1: { value: layerTexture_2 },
		texture2: { value: layerTexture_2 },
		fxTimer: { value: 0.0 },
		tint1: { value: new THREE.Vector3(1,1,1)},
	  };


	bufferFXMaterial = new THREE.ShaderMaterial({
		uniforms: fxUniforms,
		vertexShader: `
		  varying vec2 vUv;
		  uniform sampler2D texture2;
		  uniform float fxTimer;
		  varying float alphaamount;

		  void main() {
			vUv = uv;
			vUv.y = 1.0-vUv.y;
			vec3 pos = position;

			float amount = 1.0;
			if(fxTimer<=1.0) {
				amount = 1.0 - ( (fxTimer) / 1.0);
			}
			else if(fxTimer<2.0)
				amount = 0.0;
			else
				amount = 1.0;

			alphaamount = amount;
			amount = sin(amount) * 400.0;
			
			if(amount<0.5) amount = 0.5;

			vec3 norm = normal;
//			pos = pos + (vec3(norm.x,norm.y,norm.z) * amount);

			gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
		  }
		`,
		fragmentShader: `
		  uniform sampler2D texture1;
		  uniform sampler2D texture2;
		  uniform vec3 tint1;//,tint2,tint3;
		  varying vec2 vUv;
		  varying float alphaamount;

		  float hash( vec2 p ) {
			float h = dot(p,vec2(127.1,311.7));	
			return fract(sin(h)*43758.5453123);
		  }
		  float noise( in vec2 p ) {
			vec2 i = floor( p );
			vec2 f = fract( p );	
			vec2 u = f*f*(3.0-2.0*f);
			return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), 
							hash( i + vec2(1.0,0.0) ), u.x),
						mix( hash( i + vec2(0.0,1.0) ), 
							hash( i + vec2(1.0,1.0) ), u.x), u.y);
		  }

		  void main() {
			// vec2 inUv = vUv;
			// vec2 offset = vec2(0.05,0.05);
			// inUv = inUv + (offset * alphaamount * noise(inUv));
			// vec4 color1 = texture2D(texture1, inUv);
			// vec4 color2 = texture2D(texture2, inUv);
			vec4 color1 = texture2D(texture1, vUv);
			float tone1 = color1.r;
			float tone2 = color1.g;
			float tone3 = color1.b;

			// vec3 tint1c = vec3(1,0,0);
			vec3 tint1c = tint1;

			// vec4 c1 = vec4(tint1 * tone1,color1.a);
			// c1 = vec4(tint1,color1.a);
			vec4 c1 = vec4(tint1c.r * tone1,tint1c.g * tone1,tint1c.b * tone1,color1.a);
			//c1 = vec4(1.0,0.0,1.0,color1.a);
			//c1 = color1;

			if(color1.a!=0.0) {
				float alf = 1.0;
				if(alphaamount >= 0.7) {
					alf = 1.0 - ((alphaamount - 0.7) / 0.3);
				}
				c1.a = (alf) * c1.a;
			}

			gl_FragColor = c1;
		  }
		`,
		side: THREE.DoubleSide,
		depthWrite: true,
		opacity: 1,
		transparent: true,
		// castShadow: false,
	  });
*/
	f1CarHelmet.init(f1Materials,f1Layers, isHelmet, f1fnames, f1MetalRough,f1Gui,f1SpecialFX, f1Garage,f1Ribbons);

	// lights
	mainLight = createSpotLight(2.0*0.6);
	mainLight2 = createSpotLight(2.0*0.6);

	mainLight.position.set( 90, 100, 70 );
	mainLight2.position.set( -90, 100, 70 );

//	ambLight = new THREE.AmbientLight( 0xffff00,10.0 ); // soft white light
	ambLight = new THREE.AmbientLight( 0xffffff, 2.0*0.5 ); // soft white light

	dirLight = new THREE.DirectionalLight( 0xffffff, 2.0*0.5);
	dirLight.position.set( 0, 20, -50);
	dirLight.target = f1CarHelmet.theHelmet;


	scene.add(mainLight);
	scene.add(mainLight2);
	scene.add( ambLight );
	scene.add( dirLight );


	
	scene.add( f1Ribbons.getSceneObjects(f1Materials) );
//
	

	
	rootScene.add( f1CarHelmet.theHelmet );
	rootScene.add(f1Garage.garageRoot);
//	specialFXscene.add( theCarEffect );
	scene.add(rootScene);

	rootScene.position.set(0,-30,20);



	controls = new OrbitControls( camera, renderer.domElement );
	
	// controls.enablePan = false;
	controls.enablePan = true;



	// try dampening
	// controls.enableDamping=true;
	// controls.dampingFactor=0.05;
	controls.enableDamping=false;


	// limit mouse zoom
	if(!userConsole) {
		controls.minDistance = 34;// 70;
		controls.maxDistance = 155;
		controls.minPolarAngle = Math.PI / 6; // radians
		controls.maxPolarAngle = Math.PI / 2; // radians
	
	}

	// controls.maxDistance = 130;



	// controls.target = new THREE.Vector3(0,-8, 0);
	// controls.target = new THREE.Vector3(0,-8, -1); // good when tabs werent in the way
	controls.target = new THREE.Vector3(0,-8, 5); // with tabs infringing into 3d...
	keepControlsTarget = new THREE.Vector3(0,-8, 5);

	controls.addEventListener('end', () => {
		// console.log('stopped dragging!');
		timelastinteracted =  clock.getElapsedTime();
		interacting=false;
		controls.enablePan=true;

	});
	controls.addEventListener('start', () => {
		// console.log('start dragging!');
		timelastinteracted =  clock.getElapsedTime();
		interacting=true;
	});


	controls.addEventListener('change', () => {

		// console.log("azi " + controls.getAzimuthalAngle() + ", " + controls.getPolarAngle());
		// console.log("camera.position.y = " + camera.position.y);

		if(camera.position.y<-0.9) {
			// controls.enabled=false;
			// controls.enablePan=false;
			// const campos = camera.position;
			// camera.position.set(campos.x, -0.9, campos.z);
		}
		else {
			// controls.enablePan=true;
			// controls.enabled=true;

		}

			const distance = controls.getDistance();
		if ((isHelmet && distance < 170) || (!isHelmet && distance < 170)) {

			// const campos = camera.position;
			// console.log('camera:' + campos);

			// controls.setDistance(270);
			// controls.update();
		//   const tween = new TWEEN.Tween({ distance })
		// 	.to({ distance: 70 }, 500)
		// 	.easing(TWEEN.Easing.Quadratic.Out)
		// 	.onUpdate(() => {
		// 	  controls.setDistance(tween._object.distance);
		// 	})
		// 	.start();
		}
	  });


	controls.update();

	//


    setSize(window.innerWidth,window.innerHeight );

}

//==================================================
function createSpotLight(intensity) {

	var light = new THREE.PointLight(0xffffff, intensity);
//	var light = new THREE.SpotLight( 0xffffff, 0.60);// 0.6 );

	light.castShadow = true;
	light.shadow.radius = 8;
	light.shadow.bias = - 0.000222;// - 0.000222;
	return light;



	var spotLight = new THREE.SpotLight( 0xffffff, 0.60);// 0.6 );
	//	mainLight.target.set(0,0,0);
	spotLight.angle = Math.PI * 0.75;
	spotLight.castShadow = true;
	spotLight.shadow.camera.near = 0.5;
	spotLight.shadow.camera.far = 500;
	spotLight.shadow.bias = - 0.000222;// - 0.000222;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	return spotLight;
}


//==================================================
// function createGradientString(valfrom,valto)
// {
//     let colourstr = "linear-gradient(";
//     colourstr = colourstr + valfrom;
//     colourstr = colourstr + ",";
//     colourstr = colourstr + valto;
//     colourstr = colourstr + ")";

//     return colourstr;
// }

//==================================================
function setSize(w,h) {


	// set out gui
	f1Gui.setSize(w,h,renderer,camera,colorPatternPicker);


}

//==================================================

//==================================================
function getExtension(filename) {
	
	return filename.substring(filename.lastIndexOf('.')+1, filename.length).toLowerCase() || filename;
}
//==================================================

//=========================================================
function choosePattern(which, theLayer,thefile,thepatternelement) {

	if(theLayer==0)
		selectedBasePatternIndex = which;
	else if(theLayer==1)
		selectedTagIndex = which;
	else if(theLayer==2)
		selectedDecalIndex = which;

		
	patternItems.changePattern(which,thefile,
		f1Layers.mapUniforms,thepatternelement,
		processJSON.patternsData,processJSON.liveryData,theLayer,
		f1MetalRough.mapUniforms,f1Text,f1SpecialFX,f1Gui);



}

//=========================================================

function onPatternPicked(which,thefile,thepatternelement)
{
	console.log(">> pattern picked == current " + (selectedPatternIndex == which));
	if(selectedPatternIndex == which) {
		if(f1Gui.isAuto)
			f1Gui.isAuto = false;
		return;
	}
	selectedPatternIndex = which;//-1;
	var currentLayer = f1Gui.currentPage-1;
	if(f1Gui.currentPage>1) currentLayer--;

	if(currentLayer==0)
		document.getElementById('layer1patterns_ins').classList.add('disabledButton');
	else if(currentLayer==1)
		document.getElementById('layer2tags_ins').classList.add('disabledButton');
	else if(currentLayer==2)
		document.getElementById('layer3decals_ins').classList.add('disabledButton');

	choosePattern(which, currentLayer,thefile,thepatternelement);

	// start intro fx
	// disable pattern picker until texture loaded...

	// setTimeout( function() {
	
	// 	// if(currentLayer==1) { // tags
	// 	// 	// f1Text.tagPattern = patternItems.patternTexture;
	
	// 	// 	f1Text.composite();
	
	// 	//  	f1Layers.mapUniforms.texture2Tag.value = f1Text.tagPattern;
	// 	// 	f1MetalRough.mapUniforms.texture2Tag.value = f1Text.tagPattern;
	
	// 	// }
	
	
	
	// },150);

	if(f1Gui.isAuto)
;//		f1Gui.isAuto = false;
	else	{
		f1SpecialFX.mapUniforms.leadin.value = 1.0;
		console.log(">> lead in sfx");

		f1SpecialFX.startFX(350); // sfx lead in
	}



	// if(which!=-1)
	// 	selectedPatternElement = thepatternelement;
	// else 
	// 	selectedPatternElement = 0;

	// if(which==-1) { // deselected
	// 	if(selectedPatternElement!=0)
	// 		f1Gui.removeClassFromElement(selectedPatternElement,'patternSelected');
	// 		// selectedPatternElement.classList.remove('patternSelected');
	// 	selectedPatternElement = 0;
	// }
	// else if(which==1)
	selectedChan = -1;
	// f1Gui.addClassToElementByID('colourPickerContainer','coloursdisabled_wheel');
}
//==================================================
function onLaunchARButton() {
	doBuildBasemap=4; // bake final layer and save


	/*
	selectedChan = -1;
	doBuildBasemap=4; // bake final layer and save
	// patternItems.disableColourPickArea();

	// auto select correct pattern if previously set
	if(selectedPatternElement!=0)
		f1Gui.removeClassFromElement(selectedPatternElement,'patternSelected');
	*/
}
//==================================================
function backNextPage(backornext) {

	console.log('>>> BACK from page ' + f1Gui.currentPage + ' to page ' + (f1Gui.currentPage-1));
	if(f1Gui.currentPage==6) { // was in 8th AR for inline
		// window.XRIFrame.deregisterXRIFrame();
	}

	if(backornext == -1) { // back button
		f1Gui.changedPage(f1Gui.currentPage-1);
	}
	else if(backornext == 1) { // next button
		f1Gui.changedPage(f1Gui.currentPage+1);
	}
	var currentLayer = f1Gui.currentPage-1;
	if(f1Gui.currentPage>1) currentLayer--;
	if(currentLayer==1)  // tag
		f1Text.isActive = true;
	else
		f1Text.isActive = false;


}

//==================================================
// gui tabs
function onPatternsTab() {
	f1Gui.changedPage(1);
}
//==================================================
function onColoursTab() {
	f1Gui.changedPage(2);


	// start8thwallStuff();

}
//==================================================
function onTagTab() {
	f1Gui.changedPage(3);

}
//==================================================
function onDecalTab() {
	f1Gui.changedPage(4);
}

//==================================================
function onChangePaint(index) {
	selectedChan=index;

	var currentLayer = f1Gui.currentPage-1;
	if(f1Gui.currentPage>1) currentLayer--;


	// hide paint channel selector panel and show colour and material
	var col = f1Gui.getElementColour(index);
	document.getElementById('coloursample').style.backgroundColor = col;


	col = new THREE.Color(col).getHexString();
	colorPatternPicker.color.hexString = col;

	// set up which gloss type button
	var chan = selectedChan;
	if(currentLayer==1) // tag
		chan-=3;
	else if(currentLayer==2) // decal
		chan-=5;

	
	var metalroughtype = processJSON.liveryData['Layers'][currentLayer].Channels[chan].metalroughtype;
	if(metalroughtype==0) { // gloss
		document.getElementById('glossbutton').classList.add('nextButton');
		document.getElementById('mattebutton').classList.remove('nextButton');
		document.getElementById('metallicbutton').classList.remove('nextButton');
	}
	else if(metalroughtype==1) { // matte
		document.getElementById('glossbutton').classList.remove('nextButton');
		document.getElementById('mattebutton').classList.add('nextButton');
		document.getElementById('metallicbutton').classList.remove('nextButton');
	}
	else if(metalroughtype==2) { // metallic
		document.getElementById('glossbutton').classList.remove('nextButton');
		document.getElementById('mattebutton').classList.remove('nextButton');
		document.getElementById('metallicbutton').classList.add('nextButton');
	}



	// f1Gui.pickedChannelPaint(index);

	f1Gui.pickedChannelPaint(index);

	

}
//==================================================
function onPreselectedPaint() {

	// 
	f1SpecialFX.mapUniforms.leadin.value = 2.0;
	f1SpecialFX.startFX(500);
	// f1SpecialFX.finalPass.uniforms.amountBloom.value = 1.0;


	var which = selectedBasePatternIndex;
	var currentLayer = f1Gui.currentPage-1;
	if(f1Gui.currentPage>1) currentLayer--;

	var totChans = 1;	
	if(which==-1)
		console.log("no pattern so choose a colour for base");
	else
		totChans = processJSON.patternsData['Patterns'][which]['Channels'].length;


	for(var t=0;t<totChans;t++) {
		var c1;
		if(which==-1) // take colour from 1st pattern 1st channel
			c1 = processJSON.patternsData['Patterns'][0]['Channels'][0].defaultColour;
		else
			c1 = processJSON.patternsData['Patterns'][which]['Channels'][t].defaultColour;

		var defaultCol = new THREE.Color("rgb("+c1+")");
		var tmp1 = patternItems.rgbToHex(defaultCol.r*255.0,defaultCol.g*255.0,defaultCol.b*255.0);
		processJSON.liveryData['Layers'][currentLayer].Channels[t].tint = tmp1;


		if(t==0) // base paint
			document.getElementById('basepaintbutton').style.backgroundColor = tmp1;//"rgb(255,0,0)";
		else if(t==1) // primary paint
			document.getElementById('primarypaintbutton').style.backgroundColor = tmp1;//"rgb(255,0,0)";
		else if(t==2) // secondary paint
			document.getElementById('secondarypaintbutton').style.backgroundColor = tmp1;//"rgb(255,0,0)";

		var tmpv4 = new THREE.Vector4(defaultCol.r,defaultCol.g,defaultCol.b,1.0);
		if(t==0)
			f1Layers.mapUniforms.texture1TintChannel1.value = tmpv4;
		else if(t==1)
			f1Layers.mapUniforms.texture1TintChannel2.value = tmpv4;
		else if(t==2)
			f1Layers.mapUniforms.texture1TintChannel3.value = tmpv4;

	}

}
//==================================================
function float2int (value) {
    return value | 0;
}
//==================================================
function onRandomPaint() {
	var which = selectedBasePatternIndex;
	var currentLayer = f1Gui.currentPage-1;
	if(f1Gui.currentPage>1) currentLayer--;

	patternItems.useCustom = true; // now no longer reading defaults when changing patterns, will use custom
	// f1SpecialFX.finalPass.uniforms.amountBloom.value = 1.0;
	f1SpecialFX.mapUniforms.leadin.value = 2.0;
	f1SpecialFX.startFX(500);


	var totChans = 1;	
	if(which==-1)
		console.log("no pattern so choose a colour for base");
	else
		totChans = processJSON.patternsData['Patterns'][which]['Channels'].length;


	for(var t=0;t<totChans;t++) {
		var r = float2int(Math.random() * 255);
		var g = float2int(Math.random() * 255);
		var b = float2int(Math.random() * 255);
		var c1 = r + "," + g + "," + b;

		var glosstype = float2int(Math.random() * 3);
		var metal = 0;
		var rough = 0;
		if(glosstype==1) {
			metal=0;
			rough=1;
		}
		else if(glosstype==2) {
			metal=1;
			rough=0;
		}
		else {
			metal=1;
			rough=1;
		}


		
		var defaultCol = new THREE.Color("rgb("+c1+")");
		var tmp1 = patternItems.rgbToHex(defaultCol.r*255.0,defaultCol.g*255.0,defaultCol.b*255.0);
		processJSON.liveryData['Layers'][currentLayer].Channels[t].tint = tmp1;


		if(t==0) // base paint
			document.getElementById('basepaintbutton').style.backgroundColor = tmp1;//"rgb(255,0,0)";
		else if(t==1) // primary paint
			document.getElementById('primarypaintbutton').style.backgroundColor = tmp1;//"rgb(255,0,0)";
		else if(t==2) // secondary paint
			document.getElementById('secondarypaintbutton').style.backgroundColor = tmp1;//"rgb(255,0,0)";

		var tmpv4 = new THREE.Vector4(defaultCol.r,defaultCol.g,defaultCol.b,1.0);
		if(t==0) {
			f1Layers.mapUniforms.texture1TintChannel1.value = tmpv4;
			f1MetalRough.mapUniforms.baseChannel1Metal.value = metal;
			f1MetalRough.mapUniforms.baseChannel1Rough.value = rough;
		}
		else if(t==1) {
			f1Layers.mapUniforms.texture1TintChannel2.value = tmpv4;
			f1MetalRough.mapUniforms.baseChannel2Metal.value = metal;
			f1MetalRough.mapUniforms.baseChannel2Rough.value = rough;

		}
		else if(t==2) {
			f1Layers.mapUniforms.texture1TintChannel3.value = tmpv4;
			f1MetalRough.mapUniforms.baseChannel3Metal.value = metal;
			f1MetalRough.mapUniforms.baseChannel3Rough.value = rough;
		}
		processJSON.liveryData['Layers'][currentLayer].Channels[t].metalroughtype = glosstype;


		

	}
}


//==================================================
function onConfirm() {

	if(f1Gui.currentPage==5) { // final page so create map and launch AR
		doBuildBasemap=4; // generate and save the images
//		onLaunchARButton();
	}
	else {

		if(selectedChan<=2)
			patternItems.useCustom = true; // now no longer reading defaults when changing patterns, will use custom
		else if(selectedChan<=4)
			patternItems.useCustomTag = true;
		else if(selectedChan<=5)
			patternItems.useCustomDecal = true;
			

		f1Gui.confirm(selectedChan);
	}
}
//==================================================
function getDateTimeStampString() {
	
	const currentDate = new Date();
	const dateYear = currentDate.getFullYear();
	const dateMonth = currentDate.getMonth() + 1;
	const dateDay = currentDate.getDate();
	const dateHour = currentDate.getHours();
	const dateMins = currentDate.getMinutes();

	var datetimeStamp = dateYear;
	if(dateMonth<10) datetimeStamp = datetimeStamp + "0";
	datetimeStamp = datetimeStamp + dateMonth;
	if(dateDay<10) datetimeStamp = datetimeStamp + "0";
	datetimeStamp = datetimeStamp + dateDay + '_';
	if(dateHour<10) datetimeStamp = datetimeStamp + "0";
	datetimeStamp = datetimeStamp + dateHour;
	if(dateMins<10) datetimeStamp = datetimeStamp + "0";
	datetimeStamp = datetimeStamp + dateMins;


	return datetimeStamp;
}
//==================================================
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
//==================================================

function doSavePaintShop(_pixelBuffer,_dateTimeTypePrefix) {



	// const dataURL = renderer.domElement.toDataURL();
	/*
	var canvasTexture = new THREE.CanvasTexture( tmptexture.image );
	var canvas = document.createElement( 'canvas' );
	canvas.width = canvasTexture.image.width;
	canvas.height = canvasTexture.image.height;
	var context = canvas.getContext( '2d' );
	context.drawImage( canvasTexture.image, 0, 0 );
*/


	var canvas = document.createElement('canvas');
	canvas.width = renderSize;
	canvas.height = renderSize;
	var context = canvas.getContext('2d');
	var imageData = context.createImageData(renderSize, renderSize);
	imageData.data.set(_pixelBuffer);
	context.putImageData(imageData, 0, 0);


	var dataURL = canvas.toDataURL();
	const filename = userID + _dateTimeTypePrefix;
	
	console.log('>> file saving "' + filename + '"');

	// var data = document.getElementById('photoupload');
	// // let data = new FormData();
	// data.append('file', dataURL);
	// // data.append('userID',userID);
	// // data.append('datetime',datetimeStamp);
	// data.append('filename',filename + '_map.png');

	s3upload(dataURLtoBlob(dataURL),filename);
	canvas.remove();	// do we do this?

	return;
	
	let request = new XMLHttpRequest();
	request.open('POST', './upload.php', false); 	
	
	// request.open('POST', 'https://f1-paintshop.s3.eu-west-2.amazonaws.com/temp/upload.php', false); 	
	// https://f1-paintshop.s3.eu-west-2.amazonaws.com/temp/upload.php
//	s3://f1-paintshop/temp/

// const AWS = require('aws-sdk');

// // Replace ACCESS_KEY and SECRET_KEY with the IAM user's access key and secret key
// AWS.config.update({
//   accessKeyId: 'ACCESS_KEY',
//   secretAccessKey: 'SECRET_KEY'
// });

// // Create a new S3 client
// var s3 = new AWS.S3();

// // List the objects in your S3 bucket
// s3.listObjects({Bucket: 'my-bucket'}, function(err, data) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(data);
//   }
// });


		
	// upload progress event
	request.upload.addEventListener('progress', function(e) {
		let percent_complete = (e.loaded / e.total)*100;
		
		// percentage of upload completed
		console.log(percent_complete);
	});

	// AJAX request finished event
	request.addEventListener('load', function(e) {
		// HTTP status message
		console.log(request.status);

		// request.response will hold the response from the server
		console.log(request.response);




	});			
	
	request.send(data);



	/*
	// canvas screen grab
	// save screen grab of canvas to user's local device 
	let blob = renderer.domElement.toBlob(function(blob) {
		// blob ready, download it
		let link = document.createElement('a');
		link.setAttribute("download", 'myDesign.png');
	  
		link.setAttribute("href", URL.createObjectURL(blob));
		document.body.appendChild(link);

		link.click();
	  
		// delete the internal blob reference, to let the browser clear memory from it
		URL.revokeObjectURL(link.href);
		document.body.removeChild(link);	

	  }, 'image/png');
	  */
}
//==================================================
function onMaterialbutton(glosstype) {
	console.log(">> selectedChan = " + selectedChan);
	var currentLayer = f1Gui.currentPage-1;
	if(f1Gui.currentPage>1) currentLayer--;
	var chan = selectedChan;

	if(currentLayer==1) // tag
		chan-=3;
	else if(currentLayer==2) // decal
		chan-=5;

	processJSON.liveryData['Layers'][currentLayer].Channels[chan].metalroughtype = glosstype;
	setMaterial(glosstype,selectedChan);
}
//==================================================
function setMaterial(glosstype,theChan) {

	var metal = 1.0;
	var rough = 1.0;

	if(glosstype==0) { // glossy
		// metal = 1.0;
		// rough = 1.0;
		metal = 0.0;
		rough = 0.0;
		// f1CarHelmet.theHelmetMaterial.metalness = 0.5;
		// f1CarHelmet.theHelmetMaterial.roughness = 0.5;		
	}
	else if(glosstype==1) { // matt
		metal = 0.0;
		rough = 1.0;
		// f1CarHelmet.theHelmetMaterial.metalness = 0.0;
		// f1CarHelmet.theHelmetMaterial.roughness = 1.0;		
	}
	else if(glosstype==2) { // metallic
		metal = 1.0;
		rough = 0.0;
		// f1CarHelmet.theHelmetMaterial.metalness = 1.0;
		// f1CarHelmet.theHelmetMaterial.roughness = 0.0;		
	}

	if(theChan==0) {
		f1MetalRough.mapUniforms.baseChannel1Metal.value = metal;
		f1MetalRough.mapUniforms.baseChannel1Rough.value = rough;
	}
	else if(theChan==1) {
		f1MetalRough.mapUniforms.baseChannel2Metal.value = metal;
		f1MetalRough.mapUniforms.baseChannel2Rough.value = rough;
	}
	else if(theChan==2) {
		f1MetalRough.mapUniforms.baseChannel3Metal.value = metal;
		f1MetalRough.mapUniforms.baseChannel3Rough.value = rough;
	}
	// tag
	else if(theChan==3) { // tag style
		f1MetalRough.mapUniforms.tagChannel1Metal.value = metal;
		f1MetalRough.mapUniforms.tagChannel1Rough.value = rough;
	}
	else if(theChan==4) { // tag
		f1MetalRough.mapUniforms.tagChannel2Metal.value = metal;
		f1MetalRough.mapUniforms.tagChannel2Rough.value = rough;
	}
	// decal
	else if(theChan==5) { // decal
		f1MetalRough.mapUniforms.decalChannel1Metal.value = metal;
		f1MetalRough.mapUniforms.decalChannel1Rough.value = rough;
	}


	if(glosstype==0) { // gloss
		document.getElementById('glossbutton').classList.add('nextButton');
		document.getElementById('mattebutton').classList.remove('nextButton');
		document.getElementById('metallicbutton').classList.remove('nextButton');
	}
	else if(glosstype==1) { // matte
		document.getElementById('glossbutton').classList.remove('nextButton');
		document.getElementById('mattebutton').classList.add('nextButton');
		document.getElementById('metallicbutton').classList.remove('nextButton');
	}
	else if(glosstype==2) { // metallic
		document.getElementById('glossbutton').classList.remove('nextButton');
		document.getElementById('mattebutton').classList.remove('nextButton');
		document.getElementById('metallicbutton').classList.add('nextButton');
	}

}

//==================================================
function readMetalRoughBufferMapSceneTarget() {
	renderer.readRenderTargetPixels(f1MetalRough.bufferMapSceneTarget,0,0, renderSize,renderSize, pixelBufferRoughMetal);
	const tmptexture = new THREE.DataTexture( pixelBufferRoughMetal, renderSize, renderSize );
	tmptexture.flipY=true;
	tmptexture.needsUpdate = true;
	tmptexture.encoding = THREE.LinearEncoding;
	return tmptexture;
}

//==================================================
function readBufferMapSceneTarget() {
	renderer.readRenderTargetPixels(f1Layers.bufferMapSceneTarget,0,0, renderSize,renderSize, pixelBuffer);
	const tmptexture = new THREE.DataTexture( pixelBuffer, renderSize, renderSize );
	tmptexture.flipY=true;
	tmptexture.needsUpdate = true;
	tmptexture.encoding = THREE.LinearEncoding;
	return tmptexture;
}
//==================================================
function postRenderProcess() {
	var currentLayer = f1Gui.currentPage-1;
	if(f1Gui.currentPage>1) currentLayer--;

	/*
	if(doBuildBasemap==2) { 
		// stepping back through layers
		f1Layers.mapUniforms.texture1.value = f1Layers.baseLayer;	// revert to base layer as prime map
		f1Layers.mapUniforms.mixMode.value = 0; // start with no mix

		// if had choosen pattern for this layer then auto select it
		//if(	processJSON.liveryData[0][0]['Layers'][f1Layers.currentLayer].patternId != -1) {
		{
			var patternThumbElement = processJSON.layerPatternThumbElements[currentLayer];
			if(patternThumbElement!=0) {
				// 
				patternItems.useCustom = true;
				patternThumbElement.click();
			}
		}	
		doBuildBasemap = 0;
	}
	else if(doBuildBasemap==1) { 
		// forwards thru layers
		// grab pixels from layered map to create baked map of all proceeding
		// make layered map have new basemap
		f1Layers.mapUniforms.texture1.value = readBufferMapSceneTarget();
		f1Layers.mapUniforms.mixMode.value = 0;
		
		// do we need to auto select pattern as chosen previously
//		if(	processJSON.liveryData[0][0]['Layers'][f1Layers.currentLayer].patternId != -1) {
		{
			var patternThumbElement = processJSON.layerPatternThumbElements[currentLayer];
			if(patternThumbElement!=0) {
				patternItems.useCustom = true;
				patternThumbElement.click();
			}
		}	
		doBuildBasemap = 0;
	}
	else if(doBuildBasemap==3) { 
		// reset to beginning restart
		f1Layers.mapUniforms.texture1.value = f1Layers.baseLayer;
		f1Layers.mapUniforms.mixMode.value = 0;
		doBuildBasemap = 0;
	}
	else 
	*/
	
	
	if(doBuildBasemap==4) { 
		// build for ar
		// f1Layers.mapUniforms.texture1.value = readBufferMapSceneTarget();
		// f1Layers.mapUniforms.mixMode.value = 0;

		// f1Layers.mapUniforms.texture1.value = readBufferMapSceneTarget();
		var tmp = readBufferMapSceneTarget();
		var roughmetal = readMetalRoughBufferMapSceneTarget();

		doBuildBasemap = 0;

		const datetime = getDateTimeStampString();
		processJSON.liveryData['timestamp'] = datetime;
		doSavePaintShop(pixelBuffer, "_" + datetime +  "_map.png");
		doSavePaintShop(pixelBufferRoughMetal, "_" + datetime +  "_roughmetal.png");

		// save json record too
		var jsonfilename = userID + "_" + datetime +  "_livery.json";
		var liveryDataString = JSON.stringify( processJSON.liveryData);


		var blob = new Blob([liveryDataString],
			{ type: "text/plain;charset=utf-8" });

		// s3upload(dataURLtoBlob(blob),jsonfilename);
		s3upload(blob,jsonfilename);


		// markerless version
		// const thearlink = 'https://solarflarestudio.8thwall.app/f1paintshopar2-nom/?u=' + userID + '&d='+ datetime;// +'&m=c&t='+(new Date());

		// marker version
		// const thearlink = 'https://solarflarestudio.8thwall.app/f1testmarkerv4/?u=' + userID + '&d='+ datetime;// +'&m=c&t='+(new Date());
		
		// debug marker version
		// const thearlink = 'https://benedictsheehan-default-solarflarestudio.dev.8thwall.app/f1testmarkerv4/?u=' + userID + '&d='+ datetime;// +'&m=c&t='+(new Date());

		// markerless version debug
		// const thearlink = 'https://solarflarestudio.8thwall.app/f1paintshopar2-nom/?u=' + userID + '&d='+ datetime;// +'&m=c&t='+(new Date());
		
		// marker v5 version client test
		// const thearlink = 'https://https://solarflarestudio.8thwall.app/f1testmarkerv5/?u=' + userID + '&d='+ datetime;// +'&m=c&t='+(new Date());

		// marker v5 version client test
		// const thearlink = 'https://https://solarflarestudio.8thwall.app/f1testmarkerv5/?u=' + userID + '&d='+ datetime;// +'&m=c&t='+(new Date());

		// marker v6 version latest
		const thearlink = 'https://solarflarestudio.8thwall.app/f1testmarkerv6/?u=' + userID + '&d='+ datetime;// +'&m=c&t='+(new Date());
		// marker f1 fanzone ar version latest
		// const thearlink = 'https://solarflarestudio.8thwall.app/f1-fanzone-ar/?u=' + userID + '&d='+ datetime;// +'&m=c&t='+(new Date());
		

		console.log(">> AR url('" + thearlink + "')")
		

		document.getElementById('launchbuttonlink').href = new URL(thearlink);
		

		/* 
		//	iFrame inline 8th wall version of 8th wall 
		const iframe = document.getElementById(IFRAME_ID)
		iframe.setAttribute('src', thearlink)  // This is where the AR iframe's source is set.
		// todo test inline iframe on ios
		window.XRIFrame.registerXRIFrame(IFRAME_ID);
		*/

		// update cookie
		var d = new Date();
		d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // Expires in 1 year
		var expires = "expires=" + d.toUTCString();            
		var liveryDataString = JSON.stringify( processJSON.liveryData);
		document.cookie = 'F1Livery=' + liveryDataString + "; " + expires + "; path=/"; 



		f1Gui.showPage(6);



	}
}
//==================================
// function onLaunchAR() {
	

// 		// launch AR with unique user ID
// 		// var url = new URL('https://benedictsheehan-default-solarflarestudio.dev.8thwall.app/f1paintshopar2-nom/?u=' + userID + '&m=c&t='+(new Date()));

// 		var url = new URL('https://solarflarestudio.8thwall.app/f1paintshopar2-nom/?u=' + userID + '&m=c&t='+(new Date()));
		


// 		// url.search = new URLSearchParams({ p: plate, c: color });

// 		// to do launch ar
// 		// url.search = new URLSearchParams({ u: filename });
// //		window.open(url.toString(), '_blank').focus();

// 		let newTab = window.open();
// 		newTab.location.href = url;



// 		// go back to first patterns page?
// 		f1Gui.changedPage(1);
// }
//==================================
function renderpipeline() {


	if(deb_specialPipelineToggle) {
		specialrenderpipeline();
		return;
	}
	
	// if(f1SpecialFX.finalPass.uniforms.amountBloom.value!=0.0) {
	// 	 specialrenderpipeline();
	// 	 return;
	// }

	camera.layers.enableAll();
	if(!f1Ribbons.enabled)
		camera.layers.disable(3);

	// render the rough / metal map to offscreen
	renderer.setRenderTarget(f1MetalRough.bufferMapSceneTarget);
	renderer.render( f1MetalRough.bufferMapScene, f1MetalRough.bufferMapCamera );

	// render the main map layers to offscreen
	renderer.setRenderTarget(f1Layers.bufferMapSceneTarget);
	renderer.render( f1Layers.bufferMapScene, f1Layers.bufferMapCamera );

	// apply composited layers buffer as model map
	f1CarHelmet.theHelmetMaterial.map = f1Layers.bufferMapSceneTarget.texture;
	f1CarHelmet.theHelmetMaterial.needsUpdate = true;

	renderer.setRenderTarget(null);
	renderer.render(scene,camera);
}

//==================================
function specialrenderpipeline() {
	camera.layers.enableAll();
	camera.layers.disable(3);

	// render the rough / metal map to offscreen
	renderer.setRenderTarget(f1MetalRough.bufferMapSceneTarget);
	renderer.render( f1MetalRough.bufferMapScene, f1MetalRough.bufferMapCamera );

	// render the main map layers to offscreen
	renderer.setRenderTarget(f1Layers.bufferMapSceneTarget);
	renderer.render( f1Layers.bufferMapScene, f1Layers.bufferMapCamera );

	// apply composited layers buffer as model map
	f1CarHelmet.theHelmetMaterial.map = f1Layers.bufferMapSceneTarget.texture;
	f1CarHelmet.theHelmetMaterial.needsUpdate = true;

	//
	if(f1CarHelmet.specialFXMesh) {
		f1SpecialFX.mapUniforms.texture1Base.value = patternItems.patternTexture;

		f1SpecialFX.mapUniforms.layer.value = f1Gui.currentPage;
		var layer = 0;
		if(f1Gui.currentPage==3) {
			layer = 1;
		}
		else if(f1Gui.currentPage==4) {
			layer = 2;
		}

		const tint1 = f1Gui.hexToRgb(processJSON.liveryData['Layers'][layer].Channels[0].tint);
		const tint2 = f1Gui.hexToRgb(processJSON.liveryData['Layers'][layer].Channels[1].tint);
		const tint3 = f1Gui.hexToRgb(processJSON.liveryData['Layers'][layer].Channels[2].tint);
		f1SpecialFX.mapUniforms.chan1Colour.value = new THREE.Vector3(	tint1.r /= 255.0,tint1.g /= 255.0,tint1.b /= 255.0	);
		f1SpecialFX.mapUniforms.chan2Colour.value = new THREE.Vector3(	tint2.r /= 255.0,tint2.g /= 255.0,tint2.b /= 255.0	);
		f1SpecialFX.mapUniforms.chan3Colour.value = new THREE.Vector3(	tint3.r /= 255.0,tint3.g /= 255.0,tint3.b /= 255.0	);

		// console.log("***************** page===" + f1Gui.currentPage);

		f1SpecialFX.mapUniforms.fTime.value = f1SpecialFX.finalPass.uniforms.amountBloom.value;


		renderer.setRenderTarget(f1SpecialFX.bufferMapSceneTarget);
		renderer.render( f1SpecialFX.bufferMapScene, f1SpecialFX.bufferMapCamera );

		f1SpecialFX.plainMat.map = f1SpecialFX.bufferMapSceneTarget.texture;
		f1CarHelmet.specialFXMesh.material = f1SpecialFX.plainMat;

		if(!isHelmet)
			f1CarHelmet.baseFXMesh.material = f1SpecialFX.blackMat;


		f1CarHelmet.specialFXMesh.material.map = f1SpecialFX.bufferMapSceneTarget.texture;

	}
	scene.background =  new THREE.Color( 0x000000 );

	// camera.layers.set(2);
	// camera.layers.toggle( 2 );
	camera.layers.disable(1);
	f1SpecialFX.fxComposer.render();

	//
	if(f1CarHelmet.specialFXMesh) {
		if(!isHelmet)
			f1CarHelmet.baseFXMesh.material = f1SpecialFX.blackMat;
		f1CarHelmet.specialFXMesh.material = f1SpecialFX.blackMat;
		if(f1Ribbons.enabled)
			camera.layers.enable(3);
		f1SpecialFX.fxRibbonComposer.render();
		camera.layers.disable(3);

	}
	//
	camera.layers.enable(1);


	
	if(f1Garage.backgroundImage!=0)
		scene.background = f1Garage.backgroundImage;
	else
		scene.background =  new THREE.Color( 0x555555 );

//
	if(f1CarHelmet.specialFXMesh) {
		if(!isHelmet)
			f1CarHelmet.baseFXMesh.material = f1CarHelmet.theBaseMaterial;
		f1CarHelmet.specialFXMesh.material = f1CarHelmet.theHelmetMaterial;
	}

	camera.layers.enableAll();
	camera.layers.disable(3);



	f1SpecialFX.finalComposer.render();




}
//==================================================
function dolayerpattern(layer,patternblock) {
	var element;
	var index;
	for(var i=0;i<patternblock.children.length;i++) {
		const id= patternblock.children[i].children[0].getAttribute('patternId');
		if(processJSON.liveryData['Layers'][layer].patternId == id){
			element = patternblock.children[i].children[0];
			index=i;
			break;
		}
	}

	choosePattern(index, layer, processJSON.liveryData['Layers'][layer].filename, element);

}
//==================================================
function parseCookieLivery() {
	// set tag
	const tagtext = processJSON.liveryData.tagtext;
	document.getElementById('taginput').value = tagtext;

	// do tints and paint gloss type
	setMaterial(processJSON.liveryData['Layers'][0].Channels[0].metalroughtype,0);
	setMaterial(processJSON.liveryData['Layers'][0].Channels[1].metalroughtype,1);
	setMaterial(processJSON.liveryData['Layers'][0].Channels[2].metalroughtype,2);

	setMaterial(processJSON.liveryData['Layers'][1].Channels[0].metalroughtype,3);
	setMaterial(processJSON.liveryData['Layers'][1].Channels[1].metalroughtype,4);

	setMaterial(processJSON.liveryData['Layers'][2].Channels[0].metalroughtype,5);
	setMaterial(processJSON.liveryData['Layers'][2].Channels[1].metalroughtype,6);

	dolayerpattern(0,document.getElementById('layer1patterns_ins'));
	dolayerpattern(1,document.getElementById('layer2tags_ins'));
	dolayerpattern(2,document.getElementById('layer3decals_ins'));


	/*
	f1Gui.currentPage = 1;
	seekPatternThumb(document.getElementById('layer1patterns_ins'),0).click();
	setTimeout(function() {
		f1Gui.currentPage = 3;
		seekPatternThumb(document.getElementById('layer2tags_ins'),1).click();
	}, 1000);
	setTimeout(function() {
		f1Gui.currentPage = 4;
		seekPatternThumb(document.getElementById('layer3decals_ins'),2).click();
	}, 2000);
	*/


}
//==================================================
var nowallloaded=false;
function animate() 
{
	// if not loaded json yet
	if(processJSON.loadedLiveryJSON==0) {
		requestAnimationFrame( animate );
		return;
	}
	else if(processJSON.loadedLiveryJSON==1) {
		
		// clear all livery (and cookie livery)
		if(aUserParam==null) {
			processJSON.resetLiveryLayerPatterns();
		}
		if(cookie_livery_value!="") {
			parseCookieLivery();
		}
		else
			cookie_livery_value = document.cookie.replace(/(?:(?:^|.*;\s*)F1Livery\s*\=\s*([^;]*).*$)|^.*$/, "$1");



		f1Text.init(processJSON);
		// f1Text.setProcessJSON(processJSON);
		initScenes();
		// f1Gui.updateLayerLabel(f1Layers.currentLayer, processJSON.totLayers);

		processJSON.loadedLiveryJSON=2;
		
		
		requestAnimationFrame( animate );
		return;
	}
	if(!nowallloaded && f1Materials.alltexturesloaded) {
		nowallloaded=true;

		scene.background = f1Garage.backgroundImage;
	}
	//
	requestAnimationFrame( animate );

	// var mousedist = controls.getDistance () ;
	// console.log("<<>>> mousedis = " + mousedist);
	// if(mousedist <= 30.0) {
	// 		controls.minDistance = 70;
	// 		controls.update();
	// }

	




	renderer.setAnimationLoop( () => {

		// console.log("camera.position = " + camera.position.x + ", " + camera.position.y + ", " + camera.position.z);
		// console.log("controls.target = " + controls.target.x + ", " + controls.target.y + ", " + controls.target.z);
		// camera.position.set( 0, 20, 100 );

		// if(camera.position.y<-0.8) {
		// 	camera.position.y=-0.8;
		// }
		var elapsed = (clock.getElapsedTime() - timelastinteracted)/8.0;
		if(elapsed>1.0) elapsed = 1.0;
		if(!interacting && !userConsole)
			controls.target = controls.target.lerpVectors ( controls.target, keepControlsTarget, elapsed );

		if(f1Ribbons.enabled)
			f1Ribbons.update();
		controls.update();
		TWEEN.update();

		// f1Materials.ribbonMaterial.uniforms.time.value = clock.getElapsedTime()*1.0; // method with single shader
		// new buffergeom shader todo


		if(f1SpecialFX.finalPass.uniforms.amountBloom.value>0.0) {
			f1SpecialFX.timePassing();
			// f1SpecialFX.finalPass.uniforms.amountBloom.value -= 0.025;
			// if(f1SpecialFX.finalPass.uniforms.amountBloom.value < 0 )
			// 	f1SpecialFX.finalPass.uniforms.amountBloom.value = 0.0;
		}
		renderpipeline();
	} );






	if(doBuildBasemap!=0)
		postRenderProcess();

	
}
function addScript(src) {
	const script = document.createElement('script');

	// use local file
	// script.src = 'script.js';
	
	script.src = src;
//	  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js';
	
	script.async = true;
	
	// make code in script to be treated as JavaScript module
	// script.type = 'module';
	
	script.onload = () => {
	  console.log('Script loaded successfuly');
	};
	
	script.onerror = () => {
	  console.log('Error occurred while loading script');
	};
	
	document.body.appendChild(script);	
}

//==================================================
// AWS

//addScript('./f1aws_block.js');





const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const {
	fromCognitoIdentityPool,
  } = require("@aws-sdk/credential-provider-cognito-identity");
const { S3Client, PutObjectCommand, ListObjectsCommand, DeleteObjectCommand, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
  
  // Set the AWS Region
const REGION = "eu-west-2"; //REGION
  
  // Initialize the Amazon Cognito credentials provider
const s3 = new S3Client({
	region: REGION,
	credentials: fromCognitoIdentityPool({
	  client: new CognitoIdentityClient({ region: REGION }),
	  identityPoolId: "eu-west-2:cbf69f68-9773-42df-90ba-9f93aa42132b", // IDENTITY_POOL_ID
	}),
  });
  
const albumBucketName = "f1-fanzone-paintshop"; //BUCKET_NAME
const s3upload = async (datablob,filename) => {
	// const files = document.getElementById("photoupload").files;
	try {
	//   const albumPhotosKey = encodeURIComponent(albumName) + "/";
	  const albumPhotosKey = encodeURIComponent('userimages') + "/";

	  await s3.send(
		  new ListObjectsCommand({
			Prefix: albumPhotosKey,
			Bucket: albumBucketName
		  })
	  );
	  const file = datablob;// files[0];
	  const fileName = filename;// file.name;
	  const photoKey = albumPhotosKey + fileName;
	  const uploadParams = {
		Bucket: albumBucketName,
		Key: photoKey,
		Body: file
	};
	  try {
		await s3.send(new PutObjectCommand(uploadParams));
		console.log(">> Successfully uploaded images to aws server.");
	  } catch (err) {
		return 	console.log(">> There was an error uploading images to aws server: " + err.message);
			// alert("There was an error uploading your photo: ", err.message);
	  }
	} catch (err) {
	  if (!files.length) {
		return console.log(">> aws no files to upload?");
		//alert("Choose a file to upload first.");
	  }
	}
  };
  // Make addPhoto function available to the browser

//==================================================
window.s3upload  = s3upload;

window.addEventListener('resize', function(event) {
    setSize(window.innerWidth,window.innerHeight);
//    resizedWindow(event);
}, true);

initit();
animate();

//==
// The AR content to load in the iframe.
// const INNER_FRAME_URL = 'https://solarflarestudio.8thwall.app/f1testinline'
// const INNER_FRAME_URL = 'https://solarflarestudio.8thwall.app/f1paintshopar2-nom'



// User control elements for the iframe AR experience.
// const IFRAME_ID = 'my-iframe'  // iframe containing AR content.
const CONTROLS_ID = 'iframeControls'  // Top bar including Stop Button and Expand Button.
const START_BTN_ID = 'startBtn'  // Button to start AR.
const STOP_BTN_ID = 'stopBtn'  // Button to stop AR.
const LOGO_ID = 'poweredByLogo'  // Powered by 8th Wall logo
// Other UI elements
const DATE_ID = 'date'  // Displays today's date in the article.
// CSS classes for toggling appearance of elements when the iframe is full screen.
const FULLSCREEN_IFRAME_CLASS = 'fullscreen-iframe'
const FULLSCREEN_CONTROLS_CLASS = 'fullscreen-iframeControls'
const FULLSCREEN_EXPAND_BTN_CLASS = 'fullscreen-btn'
const FULLSCREEN_STOP_BTN_CLASS = 'hidden'
// Handles stop AR button behavior; also called when scrolled away from active AR iframe.
const stopAR = () => {
  // LEGACY METHOD ONLY: deregisters the XRIFrame
  // window.XRIFrame.deregisterXRIFrame()
  const controls = document.getElementById(CONTROLS_ID)
  controls.style.opacity = 1
  controls.classList.remove('fade-in')
  controls.classList.add('fade-out')
  const startBtn = document.getElementById(START_BTN_ID)
  startBtn.style.opacity = 0
  startBtn.style.display = 'block'
  startBtn.classList.remove('fade-out')
  startBtn.classList.add('fade-in')
  const poweredByLogo = document.getElementById(LOGO_ID)
  poweredByLogo.style.opacity = 0
  poweredByLogo.style.display = 'block'
  poweredByLogo.classList.remove('fade-out')
  poweredByLogo.classList.add('fade-in')
  // removes AR iframe's source to end AR session
  document.getElementById(IFRAME_ID).setAttribute('src', '')
  const styleCleanup = setTimeout(() => {
    startBtn.style.opacity = 1
    startBtn.classList.remove('fade-in')
    poweredByLogo.style.opacity = 1
    poweredByLogo.classList.remove('fade-in')
    controls.style.display = 'none'
    controls.style.opacity = 0
    controls.classList.remove('fade-out')
  }, 300)
  setTimeout(() => {
    clearTimeout(styleCleanup)
  }, 900)
}
// Create an interaction observer that stops AR when the user scrolls away from active AR session.
const createObserver = () => {
  let cameraActive
  const handleIntersect = (entries, observer) => {
    entries.forEach((entry) => {
      if (cameraActive && !entry.isIntersecting) {
        stopAR()
        cameraActive = false
      }
    })
  }
  window.addEventListener('message', (event) => {
    if (event.data === 'acceptedCamera') {
      cameraActive = true
    }
  })
  // How much of the iframe is still visible when scrolling away before stopping AR.
  const options = {threshold: 0.2}
  new IntersectionObserver(handleIntersect, options).observe(document.getElementById(IFRAME_ID))
}
// Sets today's date in the article
const dateCheck = () => {
  const date = new Date()
  document.getElementById(DATE_ID).innerHTML =
    `${date.toLocaleDateString('en-US', {month: 'long'})
    } ${date.toLocaleDateString('en-US', {day: 'numeric'})
    }, ${date.toLocaleDateString('en-US', {year: 'numeric'})}`
}
// Handles fullscreen button behavior
const toggleFullscreen = () => {
  document.getElementById(IFRAME_ID).classList.toggle(FULLSCREEN_IFRAME_CLASS)
  document.getElementById(CONTROLS_ID).classList.toggle(FULLSCREEN_CONTROLS_CLASS)
  document.getElementById(EXPAND_BTN_ID).classList.toggle(FULLSCREEN_EXPAND_BTN_CLASS)
  document.getElementById(STOP_BTN_ID).classList.toggle(FULLSCREEN_STOP_BTN_CLASS)
}
// Handles start AR button behavior.
const startAR = () => {
  // LEGACY METHOD ONLY: registers the XRIFrame by iframe ID 
  // window.XRIFrame.registerXRIFrame(IFRAME_ID)
  const iframe = document.getElementById(IFRAME_ID)
  const controls = document.getElementById(CONTROLS_ID)
  const startBtn = document.getElementById(START_BTN_ID)
  startBtn.classList.add('fade-out')
  const poweredByLogo = document.getElementById(LOGO_ID)
  poweredByLogo.classList.add('fade-out')
  // checks if camera has been accepted in iframe before displaying controls
  window.addEventListener('message', (event) => {
    if (event.data !== 'acceptedCamera') {
      return
    }
    controls.style.opacity = 0
    const styleCleanup = setTimeout(() => {
      startBtn.style.display = 'none'
      poweredByLogo.style.display = 'none'
      controls.style.display = 'block'
    }, 300)
    const uiFadeIn = setTimeout(() => {
      controls.classList.add('fade-in')
    }, 800)
    setTimeout(() => {
      clearTimeout(styleCleanup)
      clearTimeout(uiFadeIn)
    }, 900)
  })
//   iframe.setAttribute('src', INNER_FRAME_URL)  // This is where the AR iframe's source is set.
}

// Add event listeners and callbacks for the body DOM.
window.toggleFullscreen = toggleFullscreen
window.startAR = startAR
window.stopAR = stopAR
