(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const nd="169",hx=0,ff=1,dx=2,rm=1,sm=2,Ti=3,sr=0,mn=1,Xn=2,nr=0,Nr=1,Hr=2,pf=3,mf=4,fx=5,Pr=100,px=101,mx=102,gx=103,_x=104,xx=200,yx=201,vx=202,wx=203,$u=204,qu=205,Mx=206,Sx=207,bx=208,Ex=209,Tx=210,Ax=211,Rx=212,Px=213,Cx=214,Xu=0,Yu=1,Ku=2,Os=3,ju=4,Ju=5,Zu=6,Qu=7,id=0,Lx=1,Ix=2,ir=0,Dx=1,Ux=2,Nx=3,kx=4,zx=5,Ox=6,am=7,om=300,Fs=301,Bs=302,eh=303,th=304,al=306,nh=1e3,Ir=1001,ih=1002,Kn=1003,Fx=1004,_o=1005,ri=1006,Rl=1007,Dr=1008,Ni=1009,cm=1010,lm=1011,Ka=1012,rd=1013,Vr=1014,Ci=1015,io=1016,sd=1017,ad=1018,Hs=1020,um=35902,hm=1021,dm=1022,si=1023,fm=1024,pm=1025,Ds=1026,Vs=1027,mm=1028,od=1029,gm=1030,cd=1031,ld=1033,wc=33776,Mc=33777,Sc=33778,bc=33779,rh=35840,sh=35841,ah=35842,oh=35843,ch=36196,lh=37492,uh=37496,hh=37808,dh=37809,fh=37810,ph=37811,mh=37812,gh=37813,_h=37814,xh=37815,yh=37816,vh=37817,wh=37818,Mh=37819,Sh=37820,bh=37821,Ec=36492,Eh=36494,Th=36495,_m=36283,Ah=36284,Rh=36285,Ph=36286,Bx=3200,Hx=3201,xm=0,Vx=1,Ji="",ii="srgb",or="srgb-linear",ud="display-p3",ol="display-p3-linear",zc="linear",Mt="srgb",Oc="rec709",Fc="p3",jr=7680,gf=519,Gx=512,Wx=513,$x=514,ym=515,qx=516,Xx=517,Yx=518,Kx=519,Ch=35044,_f="300 es",Li=2e3,Bc=2001;class Ys{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const an=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Pl=Math.PI/180,Lh=180/Math.PI;function Di(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(an[i&255]+an[i>>8&255]+an[i>>16&255]+an[i>>24&255]+"-"+an[e&255]+an[e>>8&255]+"-"+an[e>>16&15|64]+an[e>>24&255]+"-"+an[t&63|128]+an[t>>8&255]+"-"+an[t>>16&255]+an[t>>24&255]+an[n&255]+an[n>>8&255]+an[n>>16&255]+an[n>>24&255]).toLowerCase()}function un(i,e,t){return Math.max(e,Math.min(t,i))}function jx(i,e){return(i%e+e)%e}function Cl(i,e,t){return(1-t)*i+t*e}function gi(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function _t(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class he{constructor(e=0,t=0){he.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(un(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*n-a*r+e.x,this.y=s*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class tt{constructor(e,t,n,r,s,a,o,c,l){tt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,c,l)}set(e,t,n,r,s,a,o,c,l){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=t,u[4]=s,u[5]=c,u[6]=n,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],u=n[4],d=n[7],f=n[2],h=n[5],g=n[8],_=r[0],p=r[3],m=r[6],v=r[1],x=r[4],w=r[7],M=r[2],E=r[5],T=r[8];return s[0]=a*_+o*v+c*M,s[3]=a*p+o*x+c*E,s[6]=a*m+o*w+c*T,s[1]=l*_+u*v+d*M,s[4]=l*p+u*x+d*E,s[7]=l*m+u*w+d*T,s[2]=f*_+h*v+g*M,s[5]=f*p+h*x+g*E,s[8]=f*m+h*w+g*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8];return t*a*u-t*o*l-n*s*u+n*o*c+r*s*l-r*a*c}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],d=u*a-o*l,f=o*c-u*s,h=l*s-a*c,g=t*d+n*f+r*h;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=d*_,e[1]=(r*l-u*n)*_,e[2]=(o*n-r*a)*_,e[3]=f*_,e[4]=(u*t-r*c)*_,e[5]=(r*s-o*t)*_,e[6]=h*_,e[7]=(n*c-l*t)*_,e[8]=(a*t-n*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-r*l,r*c,-r*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Ll.makeScale(e,t)),this}rotate(e){return this.premultiply(Ll.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ll.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<9;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ll=new tt;function vm(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Hc(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Jx(){const i=Hc("canvas");return i.style.display="block",i}const xf={};function Tc(i){i in xf||(xf[i]=!0,console.warn(i))}function Zx(i,e,t){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:n()}}setTimeout(s,t)})}function Qx(i){const e=i.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function ey(i){const e=i.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const yf=new tt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),vf=new tt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Js={[or]:{transfer:zc,primaries:Oc,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i,fromReference:i=>i},[ii]:{transfer:Mt,primaries:Oc,luminanceCoefficients:[.2126,.7152,.0722],toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[ol]:{transfer:zc,primaries:Fc,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.applyMatrix3(vf),fromReference:i=>i.applyMatrix3(yf)},[ud]:{transfer:Mt,primaries:Fc,luminanceCoefficients:[.2289,.6917,.0793],toReference:i=>i.convertSRGBToLinear().applyMatrix3(vf),fromReference:i=>i.applyMatrix3(yf).convertLinearToSRGB()}},ty=new Set([or,ol]),ft={enabled:!0,_workingColorSpace:or,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!ty.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const n=Js[e].toReference,r=Js[t].fromReference;return r(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return Js[i].primaries},getTransfer:function(i){return i===Ji?zc:Js[i].transfer},getLuminanceCoefficients:function(i,e=this._workingColorSpace){return i.fromArray(Js[e].luminanceCoefficients)}};function Us(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Il(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Jr;class ny{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Jr===void 0&&(Jr=Hc("canvas")),Jr.width=e.width,Jr.height=e.height;const n=Jr.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Jr}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Hc("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const r=n.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Us(s[a]/255)*255;return n.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Us(t[n]/255)*255):t[n]=Us(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let iy=0;class wm{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:iy++}),this.uuid=Di(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Dl(r[a].image)):s.push(Dl(r[a]))}else s=Dl(r);n.url=s}return t||(e.images[this.uuid]=n),n}}function Dl(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ny.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let ry=0;class gn extends Ys{constructor(e=gn.DEFAULT_IMAGE,t=gn.DEFAULT_MAPPING,n=Ir,r=Ir,s=ri,a=Dr,o=si,c=Ni,l=gn.DEFAULT_ANISOTROPY,u=Ji){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ry++}),this.uuid=Di(),this.name="",this.source=new wm(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new he(0,0),this.repeat=new he(1,1),this.center=new he(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new tt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==om)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case nh:e.x=e.x-Math.floor(e.x);break;case Ir:e.x=e.x<0?0:1;break;case ih:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case nh:e.y=e.y-Math.floor(e.y);break;case Ir:e.y=e.y<0?0:1;break;case ih:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}gn.DEFAULT_IMAGE=null;gn.DEFAULT_MAPPING=om;gn.DEFAULT_ANISOTROPY=1;class xt{constructor(e=0,t=0,n=0,r=1){xt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,s;const c=e.elements,l=c[0],u=c[4],d=c[8],f=c[1],h=c[5],g=c[9],_=c[2],p=c[6],m=c[10];if(Math.abs(u-f)<.01&&Math.abs(d-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+f)<.1&&Math.abs(d+_)<.1&&Math.abs(g+p)<.1&&Math.abs(l+h+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(l+1)/2,w=(h+1)/2,M=(m+1)/2,E=(u+f)/4,T=(d+_)/4,A=(g+p)/4;return x>w&&x>M?x<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(x),r=E/n,s=T/n):w>M?w<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(w),n=E/r,s=A/r):M<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(M),n=T/s,r=A/s),this.set(n,r,s,t),this}let v=Math.sqrt((p-g)*(p-g)+(d-_)*(d-_)+(f-u)*(f-u));return Math.abs(v)<.001&&(v=1),this.x=(p-g)/v,this.y=(d-_)/v,this.z=(f-u)/v,this.w=Math.acos((l+h+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class sy extends Ys{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new xt(0,0,e,t),this.scissorTest=!1,this.viewport=new xt(0,0,e,t);const r={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ri,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new gn(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,r=e.textures.length;n<r;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new wm(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Gr extends sy{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Mm extends gn{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Kn,this.minFilter=Kn,this.wrapR=Ir,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class ay extends gn{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Kn,this.minFilter=Kn,this.wrapR=Ir,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ks{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,s,a,o){let c=n[r+0],l=n[r+1],u=n[r+2],d=n[r+3];const f=s[a+0],h=s[a+1],g=s[a+2],_=s[a+3];if(o===0){e[t+0]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d;return}if(o===1){e[t+0]=f,e[t+1]=h,e[t+2]=g,e[t+3]=_;return}if(d!==_||c!==f||l!==h||u!==g){let p=1-o;const m=c*f+l*h+u*g+d*_,v=m>=0?1:-1,x=1-m*m;if(x>Number.EPSILON){const M=Math.sqrt(x),E=Math.atan2(M,m*v);p=Math.sin(p*E)/M,o=Math.sin(o*E)/M}const w=o*v;if(c=c*p+f*w,l=l*p+h*w,u=u*p+g*w,d=d*p+_*w,p===1-o){const M=1/Math.sqrt(c*c+l*l+u*u+d*d);c*=M,l*=M,u*=M,d*=M}}e[t]=c,e[t+1]=l,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,r,s,a){const o=n[r],c=n[r+1],l=n[r+2],u=n[r+3],d=s[a],f=s[a+1],h=s[a+2],g=s[a+3];return e[t]=o*g+u*d+c*h-l*f,e[t+1]=c*g+u*f+l*d-o*h,e[t+2]=l*g+u*h+o*f-c*d,e[t+3]=u*g-o*d-c*f-l*h,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),u=o(r/2),d=o(s/2),f=c(n/2),h=c(r/2),g=c(s/2);switch(a){case"XYZ":this._x=f*u*d+l*h*g,this._y=l*h*d-f*u*g,this._z=l*u*g+f*h*d,this._w=l*u*d-f*h*g;break;case"YXZ":this._x=f*u*d+l*h*g,this._y=l*h*d-f*u*g,this._z=l*u*g-f*h*d,this._w=l*u*d+f*h*g;break;case"ZXY":this._x=f*u*d-l*h*g,this._y=l*h*d+f*u*g,this._z=l*u*g+f*h*d,this._w=l*u*d-f*h*g;break;case"ZYX":this._x=f*u*d-l*h*g,this._y=l*h*d+f*u*g,this._z=l*u*g-f*h*d,this._w=l*u*d+f*h*g;break;case"YZX":this._x=f*u*d+l*h*g,this._y=l*h*d+f*u*g,this._z=l*u*g-f*h*d,this._w=l*u*d-f*h*g;break;case"XZY":this._x=f*u*d-l*h*g,this._y=l*h*d-f*u*g,this._z=l*u*g+f*h*d,this._w=l*u*d+f*h*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],r=t[4],s=t[8],a=t[1],o=t[5],c=t[9],l=t[2],u=t[6],d=t[10],f=n+o+d;if(f>0){const h=.5/Math.sqrt(f+1);this._w=.25/h,this._x=(u-c)*h,this._y=(s-l)*h,this._z=(a-r)*h}else if(n>o&&n>d){const h=2*Math.sqrt(1+n-o-d);this._w=(u-c)/h,this._x=.25*h,this._y=(r+a)/h,this._z=(s+l)/h}else if(o>d){const h=2*Math.sqrt(1+o-n-d);this._w=(s-l)/h,this._x=(r+a)/h,this._y=.25*h,this._z=(c+u)/h}else{const h=2*Math.sqrt(1+d-n-o);this._w=(a-r)/h,this._x=(s+l)/h,this._y=(c+u)/h,this._z=.25*h}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(un(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,r=e._y,s=e._z,a=e._w,o=t._x,c=t._y,l=t._z,u=t._w;return this._x=n*u+a*o+r*l-s*c,this._y=r*u+a*c+s*o-n*l,this._z=s*u+a*l+n*c-r*o,this._w=a*u-n*o-r*c-s*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+n*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;const c=1-o*o;if(c<=Number.EPSILON){const h=1-t;return this._w=h*a+t*this._w,this._x=h*n+t*this._x,this._y=h*r+t*this._y,this._z=h*s+t*this._z,this.normalize(),this}const l=Math.sqrt(c),u=Math.atan2(l,o),d=Math.sin((1-t)*u)/l,f=Math.sin(t*u)/l;return this._w=a*d+this._w*f,this._x=n*d+this._x*f,this._y=r*d+this._y*f,this._z=s*d+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(e=0,t=0,n=0){U.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(wf.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(wf.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*r,this.y=s[1]*t+s[4]*n+s[7]*r,this.z=s[2]*t+s[5]*n+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,r=this.z,s=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*r-o*n),u=2*(o*t-s*r),d=2*(s*n-a*t);return this.x=t+c*l+a*d-o*u,this.y=n+c*u+o*l-s*d,this.z=r+c*d+s*u-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*r,this.y=s[1]*t+s[5]*n+s[9]*r,this.z=s[2]*t+s[6]*n+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,r=e.y,s=e.z,a=t.x,o=t.y,c=t.z;return this.x=r*c-s*o,this.y=s*a-n*c,this.z=n*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ul.copy(this).projectOnVector(e),this.sub(Ul)}reflect(e){return this.sub(Ul.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(un(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ul=new U,wf=new Ks;class ro{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ei.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ei.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=ei.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,ei):ei.fromBufferAttribute(s,a),ei.applyMatrix4(e.matrixWorld),this.expandByPoint(ei);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),xo.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),xo.copy(n.boundingBox)),xo.applyMatrix4(e.matrixWorld),this.union(xo)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ei),ei.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Zs),yo.subVectors(this.max,Zs),Zr.subVectors(e.a,Zs),Qr.subVectors(e.b,Zs),es.subVectors(e.c,Zs),Fi.subVectors(Qr,Zr),Bi.subVectors(es,Qr),fr.subVectors(Zr,es);let t=[0,-Fi.z,Fi.y,0,-Bi.z,Bi.y,0,-fr.z,fr.y,Fi.z,0,-Fi.x,Bi.z,0,-Bi.x,fr.z,0,-fr.x,-Fi.y,Fi.x,0,-Bi.y,Bi.x,0,-fr.y,fr.x,0];return!Nl(t,Zr,Qr,es,yo)||(t=[1,0,0,0,1,0,0,0,1],!Nl(t,Zr,Qr,es,yo))?!1:(vo.crossVectors(Fi,Bi),t=[vo.x,vo.y,vo.z],Nl(t,Zr,Qr,es,yo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ei).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ei).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(vi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),vi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),vi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),vi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),vi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),vi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),vi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),vi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(vi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const vi=[new U,new U,new U,new U,new U,new U,new U,new U],ei=new U,xo=new ro,Zr=new U,Qr=new U,es=new U,Fi=new U,Bi=new U,fr=new U,Zs=new U,yo=new U,vo=new U,pr=new U;function Nl(i,e,t,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){pr.fromArray(i,s);const o=r.x*Math.abs(pr.x)+r.y*Math.abs(pr.y)+r.z*Math.abs(pr.z),c=e.dot(pr),l=t.dot(pr),u=n.dot(pr);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}const oy=new ro,Qs=new U,kl=new U;class cl{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):oy.setFromPoints(e).getCenter(n);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Qs.subVectors(e,this.center);const t=Qs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),r=(n-this.radius)*.5;this.center.addScaledVector(Qs,r/n),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(kl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Qs.copy(e.center).add(kl)),this.expandByPoint(Qs.copy(e.center).sub(kl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const wi=new U,zl=new U,wo=new U,Hi=new U,Ol=new U,Mo=new U,Fl=new U;class Sm{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,wi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=wi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(wi.copy(this.origin).addScaledVector(this.direction,t),wi.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){zl.copy(e).add(t).multiplyScalar(.5),wo.copy(t).sub(e).normalize(),Hi.copy(this.origin).sub(zl);const s=e.distanceTo(t)*.5,a=-this.direction.dot(wo),o=Hi.dot(this.direction),c=-Hi.dot(wo),l=Hi.lengthSq(),u=Math.abs(1-a*a);let d,f,h,g;if(u>0)if(d=a*c-o,f=a*o-c,g=s*u,d>=0)if(f>=-g)if(f<=g){const _=1/u;d*=_,f*=_,h=d*(d+a*f+2*o)+f*(a*d+f+2*c)+l}else f=s,d=Math.max(0,-(a*f+o)),h=-d*d+f*(f+2*c)+l;else f=-s,d=Math.max(0,-(a*f+o)),h=-d*d+f*(f+2*c)+l;else f<=-g?(d=Math.max(0,-(-a*s+o)),f=d>0?-s:Math.min(Math.max(-s,-c),s),h=-d*d+f*(f+2*c)+l):f<=g?(d=0,f=Math.min(Math.max(-s,-c),s),h=f*(f+2*c)+l):(d=Math.max(0,-(a*s+o)),f=d>0?s:Math.min(Math.max(-s,-c),s),h=-d*d+f*(f+2*c)+l);else f=a>0?-s:s,d=Math.max(0,-(a*f+o)),h=-d*d+f*(f+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(zl).addScaledVector(wo,f),h}intersectSphere(e,t){wi.subVectors(e.center,this.origin);const n=wi.dot(this.direction),r=wi.dot(wi)-n*n,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,s,a,o,c;const l=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,f=this.origin;return l>=0?(n=(e.min.x-f.x)*l,r=(e.max.x-f.x)*l):(n=(e.max.x-f.x)*l,r=(e.min.x-f.x)*l),u>=0?(s=(e.min.y-f.y)*u,a=(e.max.y-f.y)*u):(s=(e.max.y-f.y)*u,a=(e.min.y-f.y)*u),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),d>=0?(o=(e.min.z-f.z)*d,c=(e.max.z-f.z)*d):(o=(e.max.z-f.z)*d,c=(e.min.z-f.z)*d),n>c||o>r)||((o>n||n!==n)&&(n=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,wi)!==null}intersectTriangle(e,t,n,r,s){Ol.subVectors(t,e),Mo.subVectors(n,e),Fl.crossVectors(Ol,Mo);let a=this.direction.dot(Fl),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Hi.subVectors(this.origin,e);const c=o*this.direction.dot(Mo.crossVectors(Hi,Mo));if(c<0)return null;const l=o*this.direction.dot(Ol.cross(Hi));if(l<0||c+l>a)return null;const u=-o*Hi.dot(Fl);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class yt{constructor(e,t,n,r,s,a,o,c,l,u,d,f,h,g,_,p){yt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,s,a,o,c,l,u,d,f,h,g,_,p)}set(e,t,n,r,s,a,o,c,l,u,d,f,h,g,_,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=r,m[1]=s,m[5]=a,m[9]=o,m[13]=c,m[2]=l,m[6]=u,m[10]=d,m[14]=f,m[3]=h,m[7]=g,m[11]=_,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new yt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,r=1/ts.setFromMatrixColumn(e,0).length(),s=1/ts.setFromMatrixColumn(e,1).length(),a=1/ts.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,r=e.y,s=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(r),l=Math.sin(r),u=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const f=a*u,h=a*d,g=o*u,_=o*d;t[0]=c*u,t[4]=-c*d,t[8]=l,t[1]=h+g*l,t[5]=f-_*l,t[9]=-o*c,t[2]=_-f*l,t[6]=g+h*l,t[10]=a*c}else if(e.order==="YXZ"){const f=c*u,h=c*d,g=l*u,_=l*d;t[0]=f+_*o,t[4]=g*o-h,t[8]=a*l,t[1]=a*d,t[5]=a*u,t[9]=-o,t[2]=h*o-g,t[6]=_+f*o,t[10]=a*c}else if(e.order==="ZXY"){const f=c*u,h=c*d,g=l*u,_=l*d;t[0]=f-_*o,t[4]=-a*d,t[8]=g+h*o,t[1]=h+g*o,t[5]=a*u,t[9]=_-f*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const f=a*u,h=a*d,g=o*u,_=o*d;t[0]=c*u,t[4]=g*l-h,t[8]=f*l+_,t[1]=c*d,t[5]=_*l+f,t[9]=h*l-g,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const f=a*c,h=a*l,g=o*c,_=o*l;t[0]=c*u,t[4]=_-f*d,t[8]=g*d+h,t[1]=d,t[5]=a*u,t[9]=-o*u,t[2]=-l*u,t[6]=h*d+g,t[10]=f-_*d}else if(e.order==="XZY"){const f=a*c,h=a*l,g=o*c,_=o*l;t[0]=c*u,t[4]=-d,t[8]=l*u,t[1]=f*d+_,t[5]=a*u,t[9]=h*d-g,t[2]=g*d-h,t[6]=o*u,t[10]=_*d+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(cy,e,ly)}lookAt(e,t,n){const r=this.elements;return Ln.subVectors(e,t),Ln.lengthSq()===0&&(Ln.z=1),Ln.normalize(),Vi.crossVectors(n,Ln),Vi.lengthSq()===0&&(Math.abs(n.z)===1?Ln.x+=1e-4:Ln.z+=1e-4,Ln.normalize(),Vi.crossVectors(n,Ln)),Vi.normalize(),So.crossVectors(Ln,Vi),r[0]=Vi.x,r[4]=So.x,r[8]=Ln.x,r[1]=Vi.y,r[5]=So.y,r[9]=Ln.y,r[2]=Vi.z,r[6]=So.z,r[10]=Ln.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,r=t.elements,s=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],u=n[1],d=n[5],f=n[9],h=n[13],g=n[2],_=n[6],p=n[10],m=n[14],v=n[3],x=n[7],w=n[11],M=n[15],E=r[0],T=r[4],A=r[8],I=r[12],y=r[1],S=r[5],N=r[9],k=r[13],z=r[2],H=r[6],O=r[10],J=r[14],W=r[3],pe=r[7],ge=r[11],se=r[15];return s[0]=a*E+o*y+c*z+l*W,s[4]=a*T+o*S+c*H+l*pe,s[8]=a*A+o*N+c*O+l*ge,s[12]=a*I+o*k+c*J+l*se,s[1]=u*E+d*y+f*z+h*W,s[5]=u*T+d*S+f*H+h*pe,s[9]=u*A+d*N+f*O+h*ge,s[13]=u*I+d*k+f*J+h*se,s[2]=g*E+_*y+p*z+m*W,s[6]=g*T+_*S+p*H+m*pe,s[10]=g*A+_*N+p*O+m*ge,s[14]=g*I+_*k+p*J+m*se,s[3]=v*E+x*y+w*z+M*W,s[7]=v*T+x*S+w*H+M*pe,s[11]=v*A+x*N+w*O+M*ge,s[15]=v*I+x*k+w*J+M*se,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],r=e[8],s=e[12],a=e[1],o=e[5],c=e[9],l=e[13],u=e[2],d=e[6],f=e[10],h=e[14],g=e[3],_=e[7],p=e[11],m=e[15];return g*(+s*c*d-r*l*d-s*o*f+n*l*f+r*o*h-n*c*h)+_*(+t*c*h-t*l*f+s*a*f-r*a*h+r*l*u-s*c*u)+p*(+t*l*d-t*o*h-s*a*d+n*a*h+s*o*u-n*l*u)+m*(-r*o*u-t*c*d+t*o*f+r*a*d-n*a*f+n*c*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],l=e[7],u=e[8],d=e[9],f=e[10],h=e[11],g=e[12],_=e[13],p=e[14],m=e[15],v=d*p*l-_*f*l+_*c*h-o*p*h-d*c*m+o*f*m,x=g*f*l-u*p*l-g*c*h+a*p*h+u*c*m-a*f*m,w=u*_*l-g*d*l+g*o*h-a*_*h-u*o*m+a*d*m,M=g*d*c-u*_*c-g*o*f+a*_*f+u*o*p-a*d*p,E=t*v+n*x+r*w+s*M;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/E;return e[0]=v*T,e[1]=(_*f*s-d*p*s-_*r*h+n*p*h+d*r*m-n*f*m)*T,e[2]=(o*p*s-_*c*s+_*r*l-n*p*l-o*r*m+n*c*m)*T,e[3]=(d*c*s-o*f*s-d*r*l+n*f*l+o*r*h-n*c*h)*T,e[4]=x*T,e[5]=(u*p*s-g*f*s+g*r*h-t*p*h-u*r*m+t*f*m)*T,e[6]=(g*c*s-a*p*s-g*r*l+t*p*l+a*r*m-t*c*m)*T,e[7]=(a*f*s-u*c*s+u*r*l-t*f*l-a*r*h+t*c*h)*T,e[8]=w*T,e[9]=(g*d*s-u*_*s-g*n*h+t*_*h+u*n*m-t*d*m)*T,e[10]=(a*_*s-g*o*s+g*n*l-t*_*l-a*n*m+t*o*m)*T,e[11]=(u*o*s-a*d*s-u*n*l+t*d*l+a*n*h-t*o*h)*T,e[12]=M*T,e[13]=(u*_*r-g*d*r+g*n*f-t*_*f-u*n*p+t*d*p)*T,e[14]=(g*o*r-a*_*r-g*n*c+t*_*c+a*n*p-t*o*p)*T,e[15]=(a*d*r-u*o*r+u*n*c-t*d*c-a*n*f+t*o*f)*T,this}scale(e){const t=this.elements,n=e.x,r=e.y,s=e.z;return t[0]*=n,t[4]*=r,t[8]*=s,t[1]*=n,t[5]*=r,t[9]*=s,t[2]*=n,t[6]*=r,t[10]*=s,t[3]*=n,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),r=Math.sin(t),s=1-n,a=e.x,o=e.y,c=e.z,l=s*a,u=s*o;return this.set(l*a+n,l*o-r*c,l*c+r*o,0,l*o+r*c,u*o+n,u*c-r*a,0,l*c-r*o,u*c+r*a,s*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,s,a){return this.set(1,n,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){const r=this.elements,s=t._x,a=t._y,o=t._z,c=t._w,l=s+s,u=a+a,d=o+o,f=s*l,h=s*u,g=s*d,_=a*u,p=a*d,m=o*d,v=c*l,x=c*u,w=c*d,M=n.x,E=n.y,T=n.z;return r[0]=(1-(_+m))*M,r[1]=(h+w)*M,r[2]=(g-x)*M,r[3]=0,r[4]=(h-w)*E,r[5]=(1-(f+m))*E,r[6]=(p+v)*E,r[7]=0,r[8]=(g+x)*T,r[9]=(p-v)*T,r[10]=(1-(f+_))*T,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){const r=this.elements;let s=ts.set(r[0],r[1],r[2]).length();const a=ts.set(r[4],r[5],r[6]).length(),o=ts.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],ti.copy(this);const l=1/s,u=1/a,d=1/o;return ti.elements[0]*=l,ti.elements[1]*=l,ti.elements[2]*=l,ti.elements[4]*=u,ti.elements[5]*=u,ti.elements[6]*=u,ti.elements[8]*=d,ti.elements[9]*=d,ti.elements[10]*=d,t.setFromRotationMatrix(ti),n.x=s,n.y=a,n.z=o,this}makePerspective(e,t,n,r,s,a,o=Li){const c=this.elements,l=2*s/(t-e),u=2*s/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r);let h,g;if(o===Li)h=-(a+s)/(a-s),g=-2*a*s/(a-s);else if(o===Bc)h=-a/(a-s),g=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=h,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,s,a,o=Li){const c=this.elements,l=1/(t-e),u=1/(n-r),d=1/(a-s),f=(t+e)*l,h=(n+r)*u;let g,_;if(o===Li)g=(a+s)*d,_=-2*d;else if(o===Bc)g=s*d,_=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-f,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-h,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let r=0;r<16;r++)if(t[r]!==n[r])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const ts=new U,ti=new yt,cy=new U(0,0,0),ly=new U(1,1,1),Vi=new U,So=new U,Ln=new U,Mf=new yt,Sf=new Ks;class ci{constructor(e=0,t=0,n=0,r=ci.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],u=r[9],d=r[2],f=r[6],h=r[10];switch(t){case"XYZ":this._y=Math.asin(un(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,h),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(f,l),this._z=0);break;case"YXZ":this._x=Math.asin(-un(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,h),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(un(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-d,h),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-un(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(f,h),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(un(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,h));break;case"XZY":this._z=Math.asin(-un(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,h),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Mf.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Mf,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Sf.setFromEuler(this),this.setFromQuaternion(Sf,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ci.DEFAULT_ORDER="XYZ";class bm{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let uy=0;const bf=new U,ns=new Ks,Mi=new yt,bo=new U,ea=new U,hy=new U,dy=new Ks,Ef=new U(1,0,0),Tf=new U(0,1,0),Af=new U(0,0,1),Rf={type:"added"},fy={type:"removed"},is={type:"childadded",child:null},Bl={type:"childremoved",child:null};class Xt extends Ys{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:uy++}),this.uuid=Di(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Xt.DEFAULT_UP.clone();const e=new U,t=new ci,n=new Ks,r=new U(1,1,1);function s(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new yt},normalMatrix:{value:new tt}}),this.matrix=new yt,this.matrixWorld=new yt,this.matrixAutoUpdate=Xt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new bm,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ns.setFromAxisAngle(e,t),this.quaternion.multiply(ns),this}rotateOnWorldAxis(e,t){return ns.setFromAxisAngle(e,t),this.quaternion.premultiply(ns),this}rotateX(e){return this.rotateOnAxis(Ef,e)}rotateY(e){return this.rotateOnAxis(Tf,e)}rotateZ(e){return this.rotateOnAxis(Af,e)}translateOnAxis(e,t){return bf.copy(e).applyQuaternion(this.quaternion),this.position.add(bf.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ef,e)}translateY(e){return this.translateOnAxis(Tf,e)}translateZ(e){return this.translateOnAxis(Af,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Mi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?bo.copy(e):bo.set(e,t,n);const r=this.parent;this.updateWorldMatrix(!0,!1),ea.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Mi.lookAt(ea,bo,this.up):Mi.lookAt(bo,ea,this.up),this.quaternion.setFromRotationMatrix(Mi),r&&(Mi.extractRotation(r.matrixWorld),ns.setFromRotationMatrix(Mi),this.quaternion.premultiply(ns.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Rf),is.child=e,this.dispatchEvent(is),is.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(fy),Bl.child=e,this.dispatchEvent(Bl),Bl.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Mi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Mi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Mi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Rf),is.child=e,this.dispatchEvent(is),is.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ea,e,hy),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ea,dy,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const d=c[l];s(e.shapes,d)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(e.materials,this.material[c]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),u=a(e.images),d=a(e.shapes),f=a(e.skeletons),h=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),d.length>0&&(n.shapes=d),f.length>0&&(n.skeletons=f),h.length>0&&(n.animations=h),g.length>0&&(n.nodes=g)}return n.object=r,n;function a(o){const c=[];for(const l in o){const u=o[l];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const r=e.children[n];this.add(r.clone())}return this}}Xt.DEFAULT_UP=new U(0,1,0);Xt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ni=new U,Si=new U,Hl=new U,bi=new U,rs=new U,ss=new U,Pf=new U,Vl=new U,Gl=new U,Wl=new U,$l=new xt,ql=new xt,Xl=new xt;class Yn{constructor(e=new U,t=new U,n=new U){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),ni.subVectors(e,t),r.cross(ni);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,n,r,s){ni.subVectors(r,t),Si.subVectors(n,t),Hl.subVectors(e,t);const a=ni.dot(ni),o=ni.dot(Si),c=ni.dot(Hl),l=Si.dot(Si),u=Si.dot(Hl),d=a*l-o*o;if(d===0)return s.set(0,0,0),null;const f=1/d,h=(l*c-o*u)*f,g=(a*u-o*c)*f;return s.set(1-h-g,g,h)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,bi)===null?!1:bi.x>=0&&bi.y>=0&&bi.x+bi.y<=1}static getInterpolation(e,t,n,r,s,a,o,c){return this.getBarycoord(e,t,n,r,bi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,bi.x),c.addScaledVector(a,bi.y),c.addScaledVector(o,bi.z),c)}static getInterpolatedAttribute(e,t,n,r,s,a){return $l.setScalar(0),ql.setScalar(0),Xl.setScalar(0),$l.fromBufferAttribute(e,t),ql.fromBufferAttribute(e,n),Xl.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector($l,s.x),a.addScaledVector(ql,s.y),a.addScaledVector(Xl,s.z),a}static isFrontFacing(e,t,n,r){return ni.subVectors(n,t),Si.subVectors(e,t),ni.cross(Si).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ni.subVectors(this.c,this.b),Si.subVectors(this.a,this.b),ni.cross(Si).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Yn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Yn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,r,s){return Yn.getInterpolation(e,this.a,this.b,this.c,t,n,r,s)}containsPoint(e){return Yn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Yn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,r=this.b,s=this.c;let a,o;rs.subVectors(r,n),ss.subVectors(s,n),Vl.subVectors(e,n);const c=rs.dot(Vl),l=ss.dot(Vl);if(c<=0&&l<=0)return t.copy(n);Gl.subVectors(e,r);const u=rs.dot(Gl),d=ss.dot(Gl);if(u>=0&&d<=u)return t.copy(r);const f=c*d-u*l;if(f<=0&&c>=0&&u<=0)return a=c/(c-u),t.copy(n).addScaledVector(rs,a);Wl.subVectors(e,s);const h=rs.dot(Wl),g=ss.dot(Wl);if(g>=0&&h<=g)return t.copy(s);const _=h*l-c*g;if(_<=0&&l>=0&&g<=0)return o=l/(l-g),t.copy(n).addScaledVector(ss,o);const p=u*g-h*d;if(p<=0&&d-u>=0&&h-g>=0)return Pf.subVectors(s,r),o=(d-u)/(d-u+(h-g)),t.copy(r).addScaledVector(Pf,o);const m=1/(p+_+f);return a=_*m,o=f*m,t.copy(n).addScaledVector(rs,a).addScaledVector(ss,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Em={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gi={h:0,s:0,l:0},Eo={h:0,s:0,l:0};function Yl(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class be{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ii){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ft.toWorkingColorSpace(this,t),this}setRGB(e,t,n,r=ft.workingColorSpace){return this.r=e,this.g=t,this.b=n,ft.toWorkingColorSpace(this,r),this}setHSL(e,t,n,r=ft.workingColorSpace){if(e=jx(e,1),t=un(t,0,1),n=un(n,0,1),t===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+t):n+t-n*t,a=2*n-s;this.r=Yl(a,s,e+1/3),this.g=Yl(a,s,e),this.b=Yl(a,s,e-1/3)}return ft.toWorkingColorSpace(this,r),this}setStyle(e,t=ii){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ii){const n=Em[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Us(e.r),this.g=Us(e.g),this.b=Us(e.b),this}copyLinearToSRGB(e){return this.r=Il(e.r),this.g=Il(e.g),this.b=Il(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ii){return ft.fromWorkingColorSpace(on.copy(this),e),Math.round(un(on.r*255,0,255))*65536+Math.round(un(on.g*255,0,255))*256+Math.round(un(on.b*255,0,255))}getHexString(e=ii){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ft.workingColorSpace){ft.fromWorkingColorSpace(on.copy(this),t);const n=on.r,r=on.g,s=on.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let c,l;const u=(o+a)/2;if(o===a)c=0,l=0;else{const d=a-o;switch(l=u<=.5?d/(a+o):d/(2-a-o),a){case n:c=(r-s)/d+(r<s?6:0);break;case r:c=(s-n)/d+2;break;case s:c=(n-r)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=u,e}getRGB(e,t=ft.workingColorSpace){return ft.fromWorkingColorSpace(on.copy(this),t),e.r=on.r,e.g=on.g,e.b=on.b,e}getStyle(e=ii){ft.fromWorkingColorSpace(on.copy(this),e);const t=on.r,n=on.g,r=on.b;return e!==ii?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(e,t,n){return this.getHSL(Gi),this.setHSL(Gi.h+e,Gi.s+t,Gi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Gi),e.getHSL(Eo);const n=Cl(Gi.h,Eo.h,t),r=Cl(Gi.s,Eo.s,t),s=Cl(Gi.l,Eo.l,t);return this.setHSL(n,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*r,this.g=s[1]*t+s[4]*n+s[7]*r,this.b=s[2]*t+s[5]*n+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const on=new be;be.NAMES=Em;let py=0;class Yr extends Ys{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:py++}),this.uuid=Di(),this.name="",this.type="Material",this.blending=Nr,this.side=sr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=$u,this.blendDst=qu,this.blendEquation=Pr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new be(0,0,0),this.blendAlpha=0,this.depthFunc=Os,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=gf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=jr,this.stencilZFail=jr,this.stencilZPass=jr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Nr&&(n.blending=this.blending),this.side!==sr&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==$u&&(n.blendSrc=this.blendSrc),this.blendDst!==qu&&(n.blendDst=this.blendDst),this.blendEquation!==Pr&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Os&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==gf&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==jr&&(n.stencilFail=this.stencilFail),this.stencilZFail!==jr&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==jr&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const r=t.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class hn extends Yr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new be(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ci,this.combine=id,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ot=new U,To=new he;class lt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Ch,this.updateRanges=[],this.gpuType=Ci,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)To.fromBufferAttribute(this,t),To.applyMatrix3(e),this.setXY(t,To.x,To.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix3(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix4(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyNormalMatrix(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.transformDirection(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=gi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=_t(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=gi(t,this.array)),t}setX(e,t){return this.normalized&&(t=_t(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=gi(t,this.array)),t}setY(e,t){return this.normalized&&(t=_t(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=gi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=_t(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=gi(t,this.array)),t}setW(e,t){return this.normalized&&(t=_t(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=_t(t,this.array),n=_t(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=_t(t,this.array),n=_t(n,this.array),r=_t(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e*=this.itemSize,this.normalized&&(t=_t(t,this.array),n=_t(n,this.array),r=_t(r,this.array),s=_t(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ch&&(e.usage=this.usage),e}}class Tm extends lt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Am extends lt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Tt extends lt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let my=0;const Hn=new yt,Kl=new Xt,as=new U,In=new ro,ta=new ro,jt=new U;class Lt extends Ys{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:my++}),this.uuid=Di(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(vm(e)?Am:Tm)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new tt().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Hn.makeRotationFromQuaternion(e),this.applyMatrix4(Hn),this}rotateX(e){return Hn.makeRotationX(e),this.applyMatrix4(Hn),this}rotateY(e){return Hn.makeRotationY(e),this.applyMatrix4(Hn),this}rotateZ(e){return Hn.makeRotationZ(e),this.applyMatrix4(Hn),this}translate(e,t,n){return Hn.makeTranslation(e,t,n),this.applyMatrix4(Hn),this}scale(e,t,n){return Hn.makeScale(e,t,n),this.applyMatrix4(Hn),this}lookAt(e){return Kl.lookAt(e),Kl.updateMatrix(),this.applyMatrix4(Kl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(as).negate(),this.translate(as.x,as.y,as.z),this}setFromPoints(e){const t=[];for(let n=0,r=e.length;n<r;n++){const s=e[n];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Tt(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ro);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,r=t.length;n<r;n++){const s=t[n];In.setFromBufferAttribute(s),this.morphTargetsRelative?(jt.addVectors(this.boundingBox.min,In.min),this.boundingBox.expandByPoint(jt),jt.addVectors(this.boundingBox.max,In.max),this.boundingBox.expandByPoint(jt)):(this.boundingBox.expandByPoint(In.min),this.boundingBox.expandByPoint(In.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new cl);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(e){const n=this.boundingSphere.center;if(In.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];ta.setFromBufferAttribute(o),this.morphTargetsRelative?(jt.addVectors(In.min,ta.min),In.expandByPoint(jt),jt.addVectors(In.max,ta.max),In.expandByPoint(jt)):(In.expandByPoint(ta.min),In.expandByPoint(ta.max))}In.getCenter(n);let r=0;for(let s=0,a=e.count;s<a;s++)jt.fromBufferAttribute(e,s),r=Math.max(r,n.distanceToSquared(jt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)jt.fromBufferAttribute(o,l),c&&(as.fromBufferAttribute(e,l),jt.add(as)),r=Math.max(r,n.distanceToSquared(jt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new lt(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let A=0;A<n.count;A++)o[A]=new U,c[A]=new U;const l=new U,u=new U,d=new U,f=new he,h=new he,g=new he,_=new U,p=new U;function m(A,I,y){l.fromBufferAttribute(n,A),u.fromBufferAttribute(n,I),d.fromBufferAttribute(n,y),f.fromBufferAttribute(s,A),h.fromBufferAttribute(s,I),g.fromBufferAttribute(s,y),u.sub(l),d.sub(l),h.sub(f),g.sub(f);const S=1/(h.x*g.y-g.x*h.y);isFinite(S)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(d,-h.y).multiplyScalar(S),p.copy(d).multiplyScalar(h.x).addScaledVector(u,-g.x).multiplyScalar(S),o[A].add(_),o[I].add(_),o[y].add(_),c[A].add(p),c[I].add(p),c[y].add(p))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let A=0,I=v.length;A<I;++A){const y=v[A],S=y.start,N=y.count;for(let k=S,z=S+N;k<z;k+=3)m(e.getX(k+0),e.getX(k+1),e.getX(k+2))}const x=new U,w=new U,M=new U,E=new U;function T(A){M.fromBufferAttribute(r,A),E.copy(M);const I=o[A];x.copy(I),x.sub(M.multiplyScalar(M.dot(I))).normalize(),w.crossVectors(E,I);const S=w.dot(c[A])<0?-1:1;a.setXYZW(A,x.x,x.y,x.z,S)}for(let A=0,I=v.length;A<I;++A){const y=v[A],S=y.start,N=y.count;for(let k=S,z=S+N;k<z;k+=3)T(e.getX(k+0)),T(e.getX(k+1)),T(e.getX(k+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new lt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,h=n.count;f<h;f++)n.setXYZ(f,0,0,0);const r=new U,s=new U,a=new U,o=new U,c=new U,l=new U,u=new U,d=new U;if(e)for(let f=0,h=e.count;f<h;f+=3){const g=e.getX(f+0),_=e.getX(f+1),p=e.getX(f+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),a.fromBufferAttribute(t,p),u.subVectors(a,s),d.subVectors(r,s),u.cross(d),o.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,p),o.add(u),c.add(u),l.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let f=0,h=t.count;f<h;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),u.subVectors(a,s),d.subVectors(r,s),u.cross(d),n.setXYZ(f+0,u.x,u.y,u.z),n.setXYZ(f+1,u.x,u.y,u.z),n.setXYZ(f+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)jt.fromBufferAttribute(e,t),jt.normalize(),e.setXYZ(t,jt.x,jt.y,jt.z)}toNonIndexed(){function e(o,c){const l=o.array,u=o.itemSize,d=o.normalized,f=new l.constructor(c.length*u);let h=0,g=0;for(let _=0,p=c.length;_<p;_++){o.isInterleavedBufferAttribute?h=c[_]*o.data.stride+o.offset:h=c[_]*u;for(let m=0;m<u;m++)f[g++]=l[h++]}return new lt(f,u,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Lt,n=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=e(c,n);t.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let u=0,d=l.length;u<d;u++){const f=l[u],h=e(f,n);c.push(h)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let d=0,f=l.length;d<f;d++){const h=l[d];u.push(h.toJSON(e.data))}u.length>0&&(r[c]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const r=e.attributes;for(const l in r){const u=r[l];this.setAttribute(l,u.clone(t))}const s=e.morphAttributes;for(const l in s){const u=[],d=s[l];for(let f=0,h=d.length;f<h;f++)u.push(d[f].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,u=a.length;l<u;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Cf=new yt,mr=new Sm,Ao=new cl,Lf=new U,Ro=new U,Po=new U,Co=new U,jl=new U,Lo=new U,If=new U,Io=new U;class Et extends Xt{constructor(e=new Lt,t=new hn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Lo.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const u=o[c],d=s[c];u!==0&&(jl.fromBufferAttribute(d,e),a?Lo.addScaledVector(jl,u):Lo.addScaledVector(jl.sub(t),u))}t.add(Lo)}return t}raycast(e,t){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ao.copy(n.boundingSphere),Ao.applyMatrix4(s),mr.copy(e.ray).recast(e.near),!(Ao.containsPoint(mr.origin)===!1&&(mr.intersectSphere(Ao,Lf)===null||mr.origin.distanceToSquared(Lf)>(e.far-e.near)**2))&&(Cf.copy(s).invert(),mr.copy(e.ray).applyMatrix4(Cf),!(n.boundingBox!==null&&mr.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,mr)))}_computeIntersections(e,t,n){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,u=s.attributes.uv1,d=s.attributes.normal,f=s.groups,h=s.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const p=f[g],m=a[p.materialIndex],v=Math.max(p.start,h.start),x=Math.min(o.count,Math.min(p.start+p.count,h.start+h.count));for(let w=v,M=x;w<M;w+=3){const E=o.getX(w),T=o.getX(w+1),A=o.getX(w+2);r=Do(this,m,e,n,l,u,d,E,T,A),r&&(r.faceIndex=Math.floor(w/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const g=Math.max(0,h.start),_=Math.min(o.count,h.start+h.count);for(let p=g,m=_;p<m;p+=3){const v=o.getX(p),x=o.getX(p+1),w=o.getX(p+2);r=Do(this,a,e,n,l,u,d,v,x,w),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=f.length;g<_;g++){const p=f[g],m=a[p.materialIndex],v=Math.max(p.start,h.start),x=Math.min(c.count,Math.min(p.start+p.count,h.start+h.count));for(let w=v,M=x;w<M;w+=3){const E=w,T=w+1,A=w+2;r=Do(this,m,e,n,l,u,d,E,T,A),r&&(r.faceIndex=Math.floor(w/3),r.face.materialIndex=p.materialIndex,t.push(r))}}else{const g=Math.max(0,h.start),_=Math.min(c.count,h.start+h.count);for(let p=g,m=_;p<m;p+=3){const v=p,x=p+1,w=p+2;r=Do(this,a,e,n,l,u,d,v,x,w),r&&(r.faceIndex=Math.floor(p/3),t.push(r))}}}}function gy(i,e,t,n,r,s,a,o){let c;if(e.side===mn?c=n.intersectTriangle(a,s,r,!0,o):c=n.intersectTriangle(r,s,a,e.side===sr,o),c===null)return null;Io.copy(o),Io.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Io);return l<t.near||l>t.far?null:{distance:l,point:Io.clone(),object:i}}function Do(i,e,t,n,r,s,a,o,c,l){i.getVertexPosition(o,Ro),i.getVertexPosition(c,Po),i.getVertexPosition(l,Co);const u=gy(i,e,t,n,Ro,Po,Co,If);if(u){const d=new U;Yn.getBarycoord(If,Ro,Po,Co,d),r&&(u.uv=Yn.getInterpolatedAttribute(r,o,c,l,d,new he)),s&&(u.uv1=Yn.getInterpolatedAttribute(s,o,c,l,d,new he)),a&&(u.normal=Yn.getInterpolatedAttribute(a,o,c,l,d,new U),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new U,materialIndex:0};Yn.getNormal(Ro,Po,Co,f.normal),u.face=f,u.barycoord=d}return u}class _i extends Lt{constructor(e=1,t=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],u=[],d=[];let f=0,h=0;g("z","y","x",-1,-1,n,t,e,a,s,0),g("z","y","x",1,-1,n,t,-e,a,s,1),g("x","z","y",1,1,e,n,t,r,a,2),g("x","z","y",1,-1,e,n,-t,r,a,3),g("x","y","z",1,-1,e,t,n,r,s,4),g("x","y","z",-1,-1,e,t,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new Tt(l,3)),this.setAttribute("normal",new Tt(u,3)),this.setAttribute("uv",new Tt(d,2));function g(_,p,m,v,x,w,M,E,T,A,I){const y=w/T,S=M/A,N=w/2,k=M/2,z=E/2,H=T+1,O=A+1;let J=0,W=0;const pe=new U;for(let ge=0;ge<O;ge++){const se=ge*S-k;for(let De=0;De<H;De++){const Ze=De*y-N;pe[_]=Ze*v,pe[p]=se*x,pe[m]=z,l.push(pe.x,pe.y,pe.z),pe[_]=0,pe[p]=0,pe[m]=E>0?1:-1,u.push(pe.x,pe.y,pe.z),d.push(De/T),d.push(1-ge/A),J+=1}}for(let ge=0;ge<A;ge++)for(let se=0;se<T;se++){const De=f+se+H*ge,Ze=f+se+H*(ge+1),Z=f+(se+1)+H*(ge+1),Y=f+(se+1)+H*ge;c.push(De,Ze,Y),c.push(Ze,Z,Y),W+=6}o.addGroup(h,W,I),h+=W,f+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _i(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Gs(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const r=i[t][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=r.clone():Array.isArray(r)?e[t][n]=r.slice():e[t][n]=r}}return e}function pn(i){const e={};for(let t=0;t<i.length;t++){const n=Gs(i[t]);for(const r in n)e[r]=n[r]}return e}function _y(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Rm(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ft.workingColorSpace}const xy={clone:Gs,merge:pn};var yy=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,vy=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ki extends Yr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=yy,this.fragmentShader=vy,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Gs(e.uniforms),this.uniformsGroups=_y(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Pm extends Xt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new yt,this.projectionMatrix=new yt,this.projectionMatrixInverse=new yt,this.coordinateSystem=Li}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Wi=new U,Df=new he,Uf=new he;class zn extends Pm{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Lh*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Pl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Lh*2*Math.atan(Math.tan(Pl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Wi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Wi.x,Wi.y).multiplyScalar(-e/Wi.z),Wi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Wi.x,Wi.y).multiplyScalar(-e/Wi.z)}getViewSize(e,t){return this.getViewBounds(e,Df,Uf),t.subVectors(Uf,Df)}setViewOffset(e,t,n,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Pl*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,t-=a.offsetY*n/l,r*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const os=-90,cs=1;class wy extends Xt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new zn(os,cs,e,t);r.layers=this.layers,this.add(r);const s=new zn(os,cs,e,t);s.layers=this.layers,this.add(s);const a=new zn(os,cs,e,t);a.layers=this.layers,this.add(a);const o=new zn(os,cs,e,t);o.layers=this.layers,this.add(o);const c=new zn(os,cs,e,t);c.layers=this.layers,this.add(c);const l=new zn(os,cs,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,r,s,a,o,c]=t;for(const l of t)this.remove(l);if(e===Li)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Bc)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,u]=this.children,d=e.getRenderTarget(),f=e.getActiveCubeFace(),h=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,r),e.render(t,s),e.setRenderTarget(n,1,r),e.render(t,a),e.setRenderTarget(n,2,r),e.render(t,o),e.setRenderTarget(n,3,r),e.render(t,c),e.setRenderTarget(n,4,r),e.render(t,l),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,r),e.render(t,u),e.setRenderTarget(d,f,h),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Cm extends gn{constructor(e,t,n,r,s,a,o,c,l,u){e=e!==void 0?e:[],t=t!==void 0?t:Fs,super(e,t,n,r,s,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class My extends Gr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new Cm(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:ri}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new _i(5,5,5),s=new ki({name:"CubemapFromEquirect",uniforms:Gs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:mn,blending:nr});s.uniforms.tEquirect.value=t;const a=new Et(r,s),o=t.minFilter;return t.minFilter===Dr&&(t.minFilter=ri),new wy(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,n,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,r);e.setRenderTarget(s)}}const Jl=new U,Sy=new U,by=new tt;class br{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const r=Jl.subVectors(n,t).cross(Sy.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Jl),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(n,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||by.getNormalMatrix(e),r=this.coplanarPoint(Jl).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const gr=new cl,Uo=new U;class hd{constructor(e=new br,t=new br,n=new br,r=new br,s=new br,a=new br){this.planes=[e,t,n,r,s,a]}set(e,t,n,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Li){const n=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],c=r[3],l=r[4],u=r[5],d=r[6],f=r[7],h=r[8],g=r[9],_=r[10],p=r[11],m=r[12],v=r[13],x=r[14],w=r[15];if(n[0].setComponents(c-s,f-l,p-h,w-m).normalize(),n[1].setComponents(c+s,f+l,p+h,w+m).normalize(),n[2].setComponents(c+a,f+u,p+g,w+v).normalize(),n[3].setComponents(c-a,f-u,p-g,w-v).normalize(),n[4].setComponents(c-o,f-d,p-_,w-x).normalize(),t===Li)n[5].setComponents(c+o,f+d,p+_,w+x).normalize();else if(t===Bc)n[5].setComponents(o,d,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),gr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),gr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(gr)}intersectsSprite(e){return gr.center.set(0,0,0),gr.radius=.7071067811865476,gr.applyMatrix4(e.matrixWorld),this.intersectsSphere(gr)}intersectsSphere(e){const t=this.planes,n=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const r=t[n];if(Uo.x=r.normal.x>0?e.max.x:e.min.x,Uo.y=r.normal.y>0?e.max.y:e.min.y,Uo.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Uo)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Lm(){let i=null,e=!1,t=null,n=null;function r(s,a){t(s,a),n=i.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(r),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){i=s}}}function Ey(i){const e=new WeakMap;function t(o,c){const l=o.array,u=o.usage,d=l.byteLength,f=i.createBuffer();i.bindBuffer(c,f),i.bufferData(c,l,u),o.onUploadCallback();let h;if(l instanceof Float32Array)h=i.FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?h=i.HALF_FLOAT:h=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)h=i.SHORT;else if(l instanceof Uint32Array)h=i.UNSIGNED_INT;else if(l instanceof Int32Array)h=i.INT;else if(l instanceof Int8Array)h=i.BYTE;else if(l instanceof Uint8Array)h=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)h=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:f,type:h,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,c,l){const u=c.array,d=c.updateRanges;if(i.bindBuffer(l,o),d.length===0)i.bufferSubData(l,0,u);else{d.sort((h,g)=>h.start-g.start);let f=0;for(let h=1;h<d.length;h++){const g=d[f],_=d[h];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++f,d[f]=_)}d.length=f+1;for(let h=0,g=d.length;h<g;h++){const _=d[h];i.bufferSubData(l,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:r,remove:s,update:a}}class ll extends Lt{constructor(e=1,t=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(n),c=Math.floor(r),l=o+1,u=c+1,d=e/o,f=t/c,h=[],g=[],_=[],p=[];for(let m=0;m<u;m++){const v=m*f-a;for(let x=0;x<l;x++){const w=x*d-s;g.push(w,-v,0),_.push(0,0,1),p.push(x/o),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let v=0;v<o;v++){const x=v+l*m,w=v+l*(m+1),M=v+1+l*(m+1),E=v+1+l*m;h.push(x,w,E),h.push(w,M,E)}this.setIndex(h),this.setAttribute("position",new Tt(g,3)),this.setAttribute("normal",new Tt(_,3)),this.setAttribute("uv",new Tt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ll(e.width,e.height,e.widthSegments,e.heightSegments)}}var Ty=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ay=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Ry=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Py=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Cy=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ly=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Iy=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Dy=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Uy=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Ny=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ky=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,zy=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Oy=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Fy=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,By=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Hy=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Vy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Gy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Wy=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$y=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,qy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Xy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Yy=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Ky=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,jy=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Jy=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Zy=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Qy=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ev=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,tv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,nv="gl_FragColor = linearToOutputTexel( gl_FragColor );",iv=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,rv=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,sv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,av=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,ov=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,cv=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,lv=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,uv=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,hv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,dv=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,fv=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,pv=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,mv=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,gv=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,_v=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,xv=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,yv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,vv=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,wv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Mv=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Sv=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,bv=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Ev=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Tv=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Av=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Rv=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Pv=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Cv=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Lv=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Iv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Dv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Uv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Nv=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,kv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,zv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ov=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Fv=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Bv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Hv=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Vv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Gv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Wv=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,$v=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Xv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Yv=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Kv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,jv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Jv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Zv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Qv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,e1=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,t1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,n1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,i1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,r1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,s1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,a1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,o1=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,c1=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,l1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,u1=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,h1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,d1=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,f1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,p1=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,m1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,g1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,_1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,x1=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,y1=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,v1=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,w1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,M1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,S1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,b1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const E1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,T1=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,A1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,R1=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,P1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,C1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,L1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,I1=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,D1=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,U1=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,N1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,k1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,z1=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,O1=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,F1=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,B1=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,H1=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,V1=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,G1=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,W1=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$1=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,q1=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,X1=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Y1=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,K1=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,j1=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,J1=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Z1=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Q1=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,ew=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,tw=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,nw=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,iw=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,rw=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,et={alphahash_fragment:Ty,alphahash_pars_fragment:Ay,alphamap_fragment:Ry,alphamap_pars_fragment:Py,alphatest_fragment:Cy,alphatest_pars_fragment:Ly,aomap_fragment:Iy,aomap_pars_fragment:Dy,batching_pars_vertex:Uy,batching_vertex:Ny,begin_vertex:ky,beginnormal_vertex:zy,bsdfs:Oy,iridescence_fragment:Fy,bumpmap_pars_fragment:By,clipping_planes_fragment:Hy,clipping_planes_pars_fragment:Vy,clipping_planes_pars_vertex:Gy,clipping_planes_vertex:Wy,color_fragment:$y,color_pars_fragment:qy,color_pars_vertex:Xy,color_vertex:Yy,common:Ky,cube_uv_reflection_fragment:jy,defaultnormal_vertex:Jy,displacementmap_pars_vertex:Zy,displacementmap_vertex:Qy,emissivemap_fragment:ev,emissivemap_pars_fragment:tv,colorspace_fragment:nv,colorspace_pars_fragment:iv,envmap_fragment:rv,envmap_common_pars_fragment:sv,envmap_pars_fragment:av,envmap_pars_vertex:ov,envmap_physical_pars_fragment:xv,envmap_vertex:cv,fog_vertex:lv,fog_pars_vertex:uv,fog_fragment:hv,fog_pars_fragment:dv,gradientmap_pars_fragment:fv,lightmap_pars_fragment:pv,lights_lambert_fragment:mv,lights_lambert_pars_fragment:gv,lights_pars_begin:_v,lights_toon_fragment:yv,lights_toon_pars_fragment:vv,lights_phong_fragment:wv,lights_phong_pars_fragment:Mv,lights_physical_fragment:Sv,lights_physical_pars_fragment:bv,lights_fragment_begin:Ev,lights_fragment_maps:Tv,lights_fragment_end:Av,logdepthbuf_fragment:Rv,logdepthbuf_pars_fragment:Pv,logdepthbuf_pars_vertex:Cv,logdepthbuf_vertex:Lv,map_fragment:Iv,map_pars_fragment:Dv,map_particle_fragment:Uv,map_particle_pars_fragment:Nv,metalnessmap_fragment:kv,metalnessmap_pars_fragment:zv,morphinstance_vertex:Ov,morphcolor_vertex:Fv,morphnormal_vertex:Bv,morphtarget_pars_vertex:Hv,morphtarget_vertex:Vv,normal_fragment_begin:Gv,normal_fragment_maps:Wv,normal_pars_fragment:$v,normal_pars_vertex:qv,normal_vertex:Xv,normalmap_pars_fragment:Yv,clearcoat_normal_fragment_begin:Kv,clearcoat_normal_fragment_maps:jv,clearcoat_pars_fragment:Jv,iridescence_pars_fragment:Zv,opaque_fragment:Qv,packing:e1,premultiplied_alpha_fragment:t1,project_vertex:n1,dithering_fragment:i1,dithering_pars_fragment:r1,roughnessmap_fragment:s1,roughnessmap_pars_fragment:a1,shadowmap_pars_fragment:o1,shadowmap_pars_vertex:c1,shadowmap_vertex:l1,shadowmask_pars_fragment:u1,skinbase_vertex:h1,skinning_pars_vertex:d1,skinning_vertex:f1,skinnormal_vertex:p1,specularmap_fragment:m1,specularmap_pars_fragment:g1,tonemapping_fragment:_1,tonemapping_pars_fragment:x1,transmission_fragment:y1,transmission_pars_fragment:v1,uv_pars_fragment:w1,uv_pars_vertex:M1,uv_vertex:S1,worldpos_vertex:b1,background_vert:E1,background_frag:T1,backgroundCube_vert:A1,backgroundCube_frag:R1,cube_vert:P1,cube_frag:C1,depth_vert:L1,depth_frag:I1,distanceRGBA_vert:D1,distanceRGBA_frag:U1,equirect_vert:N1,equirect_frag:k1,linedashed_vert:z1,linedashed_frag:O1,meshbasic_vert:F1,meshbasic_frag:B1,meshlambert_vert:H1,meshlambert_frag:V1,meshmatcap_vert:G1,meshmatcap_frag:W1,meshnormal_vert:$1,meshnormal_frag:q1,meshphong_vert:X1,meshphong_frag:Y1,meshphysical_vert:K1,meshphysical_frag:j1,meshtoon_vert:J1,meshtoon_frag:Z1,points_vert:Q1,points_frag:ew,shadow_vert:tw,shadow_frag:nw,sprite_vert:iw,sprite_frag:rw},Se={common:{diffuse:{value:new be(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new tt}},envmap:{envMap:{value:null},envMapRotation:{value:new tt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new tt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new tt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new tt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new tt},normalScale:{value:new he(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new tt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new tt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new tt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new tt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new be(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new be(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0},uvTransform:{value:new tt}},sprite:{diffuse:{value:new be(16777215)},opacity:{value:1},center:{value:new he(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new tt},alphaMap:{value:null},alphaMapTransform:{value:new tt},alphaTest:{value:0}}},pi={basic:{uniforms:pn([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.fog]),vertexShader:et.meshbasic_vert,fragmentShader:et.meshbasic_frag},lambert:{uniforms:pn([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new be(0)}}]),vertexShader:et.meshlambert_vert,fragmentShader:et.meshlambert_frag},phong:{uniforms:pn([Se.common,Se.specularmap,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,Se.lights,{emissive:{value:new be(0)},specular:{value:new be(1118481)},shininess:{value:30}}]),vertexShader:et.meshphong_vert,fragmentShader:et.meshphong_frag},standard:{uniforms:pn([Se.common,Se.envmap,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.roughnessmap,Se.metalnessmap,Se.fog,Se.lights,{emissive:{value:new be(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:et.meshphysical_vert,fragmentShader:et.meshphysical_frag},toon:{uniforms:pn([Se.common,Se.aomap,Se.lightmap,Se.emissivemap,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.gradientmap,Se.fog,Se.lights,{emissive:{value:new be(0)}}]),vertexShader:et.meshtoon_vert,fragmentShader:et.meshtoon_frag},matcap:{uniforms:pn([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,Se.fog,{matcap:{value:null}}]),vertexShader:et.meshmatcap_vert,fragmentShader:et.meshmatcap_frag},points:{uniforms:pn([Se.points,Se.fog]),vertexShader:et.points_vert,fragmentShader:et.points_frag},dashed:{uniforms:pn([Se.common,Se.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:et.linedashed_vert,fragmentShader:et.linedashed_frag},depth:{uniforms:pn([Se.common,Se.displacementmap]),vertexShader:et.depth_vert,fragmentShader:et.depth_frag},normal:{uniforms:pn([Se.common,Se.bumpmap,Se.normalmap,Se.displacementmap,{opacity:{value:1}}]),vertexShader:et.meshnormal_vert,fragmentShader:et.meshnormal_frag},sprite:{uniforms:pn([Se.sprite,Se.fog]),vertexShader:et.sprite_vert,fragmentShader:et.sprite_frag},background:{uniforms:{uvTransform:{value:new tt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:et.background_vert,fragmentShader:et.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new tt}},vertexShader:et.backgroundCube_vert,fragmentShader:et.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:et.cube_vert,fragmentShader:et.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:et.equirect_vert,fragmentShader:et.equirect_frag},distanceRGBA:{uniforms:pn([Se.common,Se.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:et.distanceRGBA_vert,fragmentShader:et.distanceRGBA_frag},shadow:{uniforms:pn([Se.lights,Se.fog,{color:{value:new be(0)},opacity:{value:1}}]),vertexShader:et.shadow_vert,fragmentShader:et.shadow_frag}};pi.physical={uniforms:pn([pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new tt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new tt},clearcoatNormalScale:{value:new he(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new tt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new tt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new tt},sheen:{value:0},sheenColor:{value:new be(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new tt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new tt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new tt},transmissionSamplerSize:{value:new he},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new tt},attenuationDistance:{value:0},attenuationColor:{value:new be(0)},specularColor:{value:new be(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new tt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new tt},anisotropyVector:{value:new he},anisotropyMap:{value:null},anisotropyMapTransform:{value:new tt}}]),vertexShader:et.meshphysical_vert,fragmentShader:et.meshphysical_frag};const No={r:0,b:0,g:0},_r=new ci,sw=new yt;function aw(i,e,t,n,r,s,a){const o=new be(0);let c=s===!0?0:1,l,u,d=null,f=0,h=null;function g(v){let x=v.isScene===!0?v.background:null;return x&&x.isTexture&&(x=(v.backgroundBlurriness>0?t:e).get(x)),x}function _(v){let x=!1;const w=g(v);w===null?m(o,c):w&&w.isColor&&(m(w,1),x=!0);const M=i.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,a):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function p(v,x){const w=g(x);w&&(w.isCubeTexture||w.mapping===al)?(u===void 0&&(u=new Et(new _i(1,1,1),new ki({name:"BackgroundCubeMaterial",uniforms:Gs(pi.backgroundCube.uniforms),vertexShader:pi.backgroundCube.vertexShader,fragmentShader:pi.backgroundCube.fragmentShader,side:mn,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(M,E,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),_r.copy(x.backgroundRotation),_r.x*=-1,_r.y*=-1,_r.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(_r.y*=-1,_r.z*=-1),u.material.uniforms.envMap.value=w,u.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(sw.makeRotationFromEuler(_r)),u.material.toneMapped=ft.getTransfer(w.colorSpace)!==Mt,(d!==w||f!==w.version||h!==i.toneMapping)&&(u.material.needsUpdate=!0,d=w,f=w.version,h=i.toneMapping),u.layers.enableAll(),v.unshift(u,u.geometry,u.material,0,0,null)):w&&w.isTexture&&(l===void 0&&(l=new Et(new ll(2,2),new ki({name:"BackgroundMaterial",uniforms:Gs(pi.background.uniforms),vertexShader:pi.background.vertexShader,fragmentShader:pi.background.fragmentShader,side:sr,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=w,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=ft.getTransfer(w.colorSpace)!==Mt,w.matrixAutoUpdate===!0&&w.updateMatrix(),l.material.uniforms.uvTransform.value.copy(w.matrix),(d!==w||f!==w.version||h!==i.toneMapping)&&(l.material.needsUpdate=!0,d=w,f=w.version,h=i.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function m(v,x){v.getRGB(No,Rm(i)),n.buffers.color.setClear(No.r,No.g,No.b,x,a)}return{getClearColor:function(){return o},setClearColor:function(v,x=1){o.set(v),c=x,m(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(v){c=v,m(o,c)},render:_,addToRenderList:p}}function ow(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=f(null);let s=r,a=!1;function o(y,S,N,k,z){let H=!1;const O=d(k,N,S);s!==O&&(s=O,l(s.object)),H=h(y,k,N,z),H&&g(y,k,N,z),z!==null&&e.update(z,i.ELEMENT_ARRAY_BUFFER),(H||a)&&(a=!1,w(y,S,N,k),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function c(){return i.createVertexArray()}function l(y){return i.bindVertexArray(y)}function u(y){return i.deleteVertexArray(y)}function d(y,S,N){const k=N.wireframe===!0;let z=n[y.id];z===void 0&&(z={},n[y.id]=z);let H=z[S.id];H===void 0&&(H={},z[S.id]=H);let O=H[k];return O===void 0&&(O=f(c()),H[k]=O),O}function f(y){const S=[],N=[],k=[];for(let z=0;z<t;z++)S[z]=0,N[z]=0,k[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:S,enabledAttributes:N,attributeDivisors:k,object:y,attributes:{},index:null}}function h(y,S,N,k){const z=s.attributes,H=S.attributes;let O=0;const J=N.getAttributes();for(const W in J)if(J[W].location>=0){const ge=z[W];let se=H[W];if(se===void 0&&(W==="instanceMatrix"&&y.instanceMatrix&&(se=y.instanceMatrix),W==="instanceColor"&&y.instanceColor&&(se=y.instanceColor)),ge===void 0||ge.attribute!==se||se&&ge.data!==se.data)return!0;O++}return s.attributesNum!==O||s.index!==k}function g(y,S,N,k){const z={},H=S.attributes;let O=0;const J=N.getAttributes();for(const W in J)if(J[W].location>=0){let ge=H[W];ge===void 0&&(W==="instanceMatrix"&&y.instanceMatrix&&(ge=y.instanceMatrix),W==="instanceColor"&&y.instanceColor&&(ge=y.instanceColor));const se={};se.attribute=ge,ge&&ge.data&&(se.data=ge.data),z[W]=se,O++}s.attributes=z,s.attributesNum=O,s.index=k}function _(){const y=s.newAttributes;for(let S=0,N=y.length;S<N;S++)y[S]=0}function p(y){m(y,0)}function m(y,S){const N=s.newAttributes,k=s.enabledAttributes,z=s.attributeDivisors;N[y]=1,k[y]===0&&(i.enableVertexAttribArray(y),k[y]=1),z[y]!==S&&(i.vertexAttribDivisor(y,S),z[y]=S)}function v(){const y=s.newAttributes,S=s.enabledAttributes;for(let N=0,k=S.length;N<k;N++)S[N]!==y[N]&&(i.disableVertexAttribArray(N),S[N]=0)}function x(y,S,N,k,z,H,O){O===!0?i.vertexAttribIPointer(y,S,N,z,H):i.vertexAttribPointer(y,S,N,k,z,H)}function w(y,S,N,k){_();const z=k.attributes,H=N.getAttributes(),O=S.defaultAttributeValues;for(const J in H){const W=H[J];if(W.location>=0){let pe=z[J];if(pe===void 0&&(J==="instanceMatrix"&&y.instanceMatrix&&(pe=y.instanceMatrix),J==="instanceColor"&&y.instanceColor&&(pe=y.instanceColor)),pe!==void 0){const ge=pe.normalized,se=pe.itemSize,De=e.get(pe);if(De===void 0)continue;const Ze=De.buffer,Z=De.type,Y=De.bytesPerElement,le=Z===i.INT||Z===i.UNSIGNED_INT||pe.gpuType===rd;if(pe.isInterleavedBufferAttribute){const oe=pe.data,ze=oe.stride,Ue=pe.offset;if(oe.isInstancedInterleavedBuffer){for(let Ye=0;Ye<W.locationSize;Ye++)m(W.location+Ye,oe.meshPerAttribute);y.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let Ye=0;Ye<W.locationSize;Ye++)p(W.location+Ye);i.bindBuffer(i.ARRAY_BUFFER,Ze);for(let Ye=0;Ye<W.locationSize;Ye++)x(W.location+Ye,se/W.locationSize,Z,ge,ze*Y,(Ue+se/W.locationSize*Ye)*Y,le)}else{if(pe.isInstancedBufferAttribute){for(let oe=0;oe<W.locationSize;oe++)m(W.location+oe,pe.meshPerAttribute);y.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=pe.meshPerAttribute*pe.count)}else for(let oe=0;oe<W.locationSize;oe++)p(W.location+oe);i.bindBuffer(i.ARRAY_BUFFER,Ze);for(let oe=0;oe<W.locationSize;oe++)x(W.location+oe,se/W.locationSize,Z,ge,se*Y,se/W.locationSize*oe*Y,le)}}else if(O!==void 0){const ge=O[J];if(ge!==void 0)switch(ge.length){case 2:i.vertexAttrib2fv(W.location,ge);break;case 3:i.vertexAttrib3fv(W.location,ge);break;case 4:i.vertexAttrib4fv(W.location,ge);break;default:i.vertexAttrib1fv(W.location,ge)}}}}v()}function M(){A();for(const y in n){const S=n[y];for(const N in S){const k=S[N];for(const z in k)u(k[z].object),delete k[z];delete S[N]}delete n[y]}}function E(y){if(n[y.id]===void 0)return;const S=n[y.id];for(const N in S){const k=S[N];for(const z in k)u(k[z].object),delete k[z];delete S[N]}delete n[y.id]}function T(y){for(const S in n){const N=n[S];if(N[y.id]===void 0)continue;const k=N[y.id];for(const z in k)u(k[z].object),delete k[z];delete N[y.id]}}function A(){I(),a=!0,s!==r&&(s=r,l(s.object))}function I(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:A,resetDefaultState:I,dispose:M,releaseStatesOfGeometry:E,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:p,disableUnusedAttributes:v}}function cw(i,e,t){let n;function r(l){n=l}function s(l,u){i.drawArrays(n,l,u),t.update(u,n,1)}function a(l,u,d){d!==0&&(i.drawArraysInstanced(n,l,u,d),t.update(u,n,d))}function o(l,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,u,0,d);let h=0;for(let g=0;g<d;g++)h+=u[g];t.update(h,n,1)}function c(l,u,d,f){if(d===0)return;const h=e.get("WEBGL_multi_draw");if(h===null)for(let g=0;g<l.length;g++)a(l[g],u[g],f[g]);else{h.multiDrawArraysInstancedWEBGL(n,l,0,u,0,f,0,d);let g=0;for(let _=0;_<d;_++)g+=u[_];for(let _=0;_<f.length;_++)t.update(g,n,f[_])}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function lw(i,e,t,n){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");r=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(T){return!(T!==si&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(T){const A=T===io&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==Ni&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==Ci&&!A)}function c(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const u=c(l);u!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",u,"instead."),l=u);const d=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(f===!0){const T=e.get("EXT_clip_control");T.clipControlEXT(T.LOWER_LEFT_EXT,T.ZERO_TO_ONE_EXT)}const h=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),v=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),w=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),M=g>0,E=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:d,reverseDepthBuffer:f,maxTextures:h,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:v,maxVaryings:x,maxFragmentUniforms:w,vertexTextures:M,maxSamples:E}}function uw(i){const e=this;let t=null,n=0,r=!1,s=!1;const a=new br,o=new tt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,f){const h=d.length!==0||f||n!==0||r;return r=f,n=d.length,h},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,f){t=u(d,f,0)},this.setState=function(d,f,h){const g=d.clippingPlanes,_=d.clipIntersection,p=d.clipShadows,m=i.get(d);if(!r||g===null||g.length===0||s&&!p)s?u(null):l();else{const v=s?0:n,x=v*4;let w=m.clippingState||null;c.value=w,w=u(g,f,x,h);for(let M=0;M!==x;++M)w[M]=t[M];m.clippingState=w,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(d,f,h,g){const _=d!==null?d.length:0;let p=null;if(_!==0){if(p=c.value,g!==!0||p===null){const m=h+_*4,v=f.matrixWorldInverse;o.getNormalMatrix(v),(p===null||p.length<m)&&(p=new Float32Array(m));for(let x=0,w=h;x!==_;++x,w+=4)a.copy(d[x]).applyMatrix4(v,o),a.normal.toArray(p,w),p[w+3]=a.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,p}}function hw(i){let e=new WeakMap;function t(a,o){return o===eh?a.mapping=Fs:o===th&&(a.mapping=Bs),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===eh||o===th)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new My(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",r),t(l.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function s(){e=new WeakMap}return{get:n,dispose:s}}class Im extends Pm{constructor(e=-1,t=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-e,a=n+e,o=r+t,c=r-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Es=4,Nf=[.125,.215,.35,.446,.526,.582],Cr=20,Zl=new Im,kf=new be;let Ql=null,eu=0,tu=0,nu=!1;const Er=(1+Math.sqrt(5))/2,ls=1/Er,zf=[new U(-Er,ls,0),new U(Er,ls,0),new U(-ls,0,Er),new U(ls,0,Er),new U(0,Er,-ls),new U(0,Er,ls),new U(-1,1,-1),new U(1,1,-1),new U(-1,1,1),new U(1,1,1)];class Of{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,r=100){Ql=this._renderer.getRenderTarget(),eu=this._renderer.getActiveCubeFace(),tu=this._renderer.getActiveMipmapLevel(),nu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Hf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Ql,eu,tu),this._renderer.xr.enabled=nu,e.scissorTest=!1,ko(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Fs||e.mapping===Bs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Ql=this._renderer.getRenderTarget(),eu=this._renderer.getActiveCubeFace(),tu=this._renderer.getActiveMipmapLevel(),nu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:ri,minFilter:ri,generateMipmaps:!1,type:io,format:si,colorSpace:or,depthBuffer:!1},r=Ff(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ff(e,t,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=dw(s)),this._blurMaterial=fw(s,e,t)}return r}_compileMaterial(e){const t=new Et(this._lodPlanes[0],e);this._renderer.compile(t,Zl)}_sceneToCubeUV(e,t,n,r){const o=new zn(90,1,t,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(kf),u.toneMapping=ir,u.autoClear=!1;const h=new hn({name:"PMREM.Background",side:mn,depthWrite:!1,depthTest:!1}),g=new Et(new _i,h);let _=!1;const p=e.background;p?p.isColor&&(h.color.copy(p),e.background=null,_=!0):(h.color.copy(kf),_=!0);for(let m=0;m<6;m++){const v=m%3;v===0?(o.up.set(0,c[m],0),o.lookAt(l[m],0,0)):v===1?(o.up.set(0,0,c[m]),o.lookAt(0,l[m],0)):(o.up.set(0,c[m],0),o.lookAt(0,0,l[m]));const x=this._cubeSize;ko(r,v*x,m>2?x:0,x,x),u.setRenderTarget(r),_&&u.render(g,o),u.render(e,o)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=f,u.autoClear=d,e.background=p}_textureToCubeUV(e,t){const n=this._renderer,r=e.mapping===Fs||e.mapping===Bs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Hf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bf());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Et(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const c=this._cubeSize;ko(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,Zl)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=zf[(r-s-1)%zf.length];this._blur(e,s-1,s,a,o)}t.autoClear=n}_blur(e,t,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,r,"latitudinal",s),this._halfBlur(a,e,n,n,r,"longitudinal",s)}_halfBlur(e,t,n,r,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,d=new Et(this._lodPlanes[r],l),f=l.uniforms,h=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*h):2*Math.PI/(2*Cr-1),_=s/g,p=isFinite(s)?1+Math.floor(u*_):Cr;p>Cr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Cr}`);const m=[];let v=0;for(let T=0;T<Cr;++T){const A=T/_,I=Math.exp(-A*A/2);m.push(I),T===0?v+=I:T<p&&(v+=2*I)}for(let T=0;T<m.length;T++)m[T]=m[T]/v;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=m,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:x}=this;f.dTheta.value=g,f.mipInt.value=x-n;const w=this._sizeLods[r],M=3*w*(r>x-Es?r-x+Es:0),E=4*(this._cubeSize-w);ko(t,M,E,3*w,2*w),c.setRenderTarget(t),c.render(d,Zl)}}function dw(i){const e=[],t=[],n=[];let r=i;const s=i-Es+1+Nf.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);t.push(o);let c=1/o;a>i-Es?c=Nf[a-i+Es-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),u=-l,d=1+l,f=[u,u,d,u,d,d,u,u,d,d,u,d],h=6,g=6,_=3,p=2,m=1,v=new Float32Array(_*g*h),x=new Float32Array(p*g*h),w=new Float32Array(m*g*h);for(let E=0;E<h;E++){const T=E%3*2/3-1,A=E>2?0:-1,I=[T,A,0,T+2/3,A,0,T+2/3,A+1,0,T,A,0,T+2/3,A+1,0,T,A+1,0];v.set(I,_*g*E),x.set(f,p*g*E);const y=[E,E,E,E,E,E];w.set(y,m*g*E)}const M=new Lt;M.setAttribute("position",new lt(v,_)),M.setAttribute("uv",new lt(x,p)),M.setAttribute("faceIndex",new lt(w,m)),e.push(M),r>Es&&r--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Ff(i,e,t){const n=new Gr(i,e,t);return n.texture.mapping=al,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ko(i,e,t,n,r){i.viewport.set(e,t,n,r),i.scissor.set(e,t,n,r)}function fw(i,e,t){const n=new Float32Array(Cr),r=new U(0,1,0);return new ki({name:"SphericalGaussianBlur",defines:{n:Cr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:dd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:nr,depthTest:!1,depthWrite:!1})}function Bf(){return new ki({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:dd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:nr,depthTest:!1,depthWrite:!1})}function Hf(){return new ki({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:dd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:nr,depthTest:!1,depthWrite:!1})}function dd(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function pw(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===eh||c===th,u=c===Fs||c===Bs;if(l||u){let d=e.get(o);const f=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new Of(i)),d=l?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const h=o.image;return l&&h&&h.height>0||u&&h&&r(h)?(t===null&&(t=new Of(i)),d=l?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",s),d.texture):null}}}return o}function r(o){let c=0;const l=6;for(let u=0;u<l;u++)o[u]!==void 0&&c++;return c===l}function s(o){const c=o.target;c.removeEventListener("dispose",s);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function mw(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return e[n]=r,r}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const r=t(n);return r===null&&Tc("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function gw(i,e,t,n){const r={},s=new WeakMap;function a(d){const f=d.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);for(const g in f.morphAttributes){const _=f.morphAttributes[g];for(let p=0,m=_.length;p<m;p++)e.remove(_[p])}f.removeEventListener("dispose",a),delete r[f.id];const h=s.get(f);h&&(e.remove(h),s.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(d,f){return r[f.id]===!0||(f.addEventListener("dispose",a),r[f.id]=!0,t.memory.geometries++),f}function c(d){const f=d.attributes;for(const g in f)e.update(f[g],i.ARRAY_BUFFER);const h=d.morphAttributes;for(const g in h){const _=h[g];for(let p=0,m=_.length;p<m;p++)e.update(_[p],i.ARRAY_BUFFER)}}function l(d){const f=[],h=d.index,g=d.attributes.position;let _=0;if(h!==null){const v=h.array;_=h.version;for(let x=0,w=v.length;x<w;x+=3){const M=v[x+0],E=v[x+1],T=v[x+2];f.push(M,E,E,T,T,M)}}else if(g!==void 0){const v=g.array;_=g.version;for(let x=0,w=v.length/3-1;x<w;x+=3){const M=x+0,E=x+1,T=x+2;f.push(M,E,E,T,T,M)}}else return;const p=new(vm(f)?Am:Tm)(f,1);p.version=_;const m=s.get(d);m&&e.remove(m),s.set(d,p)}function u(d){const f=s.get(d);if(f){const h=d.index;h!==null&&f.version<h.version&&l(d)}else l(d);return s.get(d)}return{get:o,update:c,getWireframeAttribute:u}}function _w(i,e,t){let n;function r(f){n=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function c(f,h){i.drawElements(n,h,s,f*a),t.update(h,n,1)}function l(f,h,g){g!==0&&(i.drawElementsInstanced(n,h,s,f*a,g),t.update(h,n,g))}function u(f,h,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,s,f,0,g);let p=0;for(let m=0;m<g;m++)p+=h[m];t.update(p,n,1)}function d(f,h,g,_){if(g===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<f.length;m++)l(f[m]/a,h[m],_[m]);else{p.multiDrawElementsInstancedWEBGL(n,h,0,s,f,0,_,0,g);let m=0;for(let v=0;v<g;v++)m+=h[v];for(let v=0;v<_.length;v++)t.update(m,n,_[v])}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=u,this.renderMultiDrawInstances=d}function xw(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(s/3);break;case i.LINES:t.lines+=o*(s/2);break;case i.LINE_STRIP:t.lines+=o*(s-1);break;case i.LINE_LOOP:t.lines+=o*s;break;case i.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:n}}function yw(i,e,t){const n=new WeakMap,r=new xt;function s(a,o,c){const l=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=u!==void 0?u.length:0;let f=n.get(o);if(f===void 0||f.count!==d){let I=function(){T.dispose(),n.delete(o),o.removeEventListener("dispose",I)};f!==void 0&&f.texture.dispose();const h=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let x=0;h===!0&&(x=1),g===!0&&(x=2),_===!0&&(x=3);let w=o.attributes.position.count*x,M=1;w>e.maxTextureSize&&(M=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const E=new Float32Array(w*M*4*d),T=new Mm(E,w,M,d);T.type=Ci,T.needsUpdate=!0;const A=x*4;for(let y=0;y<d;y++){const S=p[y],N=m[y],k=v[y],z=w*M*4*y;for(let H=0;H<S.count;H++){const O=H*A;h===!0&&(r.fromBufferAttribute(S,H),E[z+O+0]=r.x,E[z+O+1]=r.y,E[z+O+2]=r.z,E[z+O+3]=0),g===!0&&(r.fromBufferAttribute(N,H),E[z+O+4]=r.x,E[z+O+5]=r.y,E[z+O+6]=r.z,E[z+O+7]=0),_===!0&&(r.fromBufferAttribute(k,H),E[z+O+8]=r.x,E[z+O+9]=r.y,E[z+O+10]=r.z,E[z+O+11]=k.itemSize===4?r.w:1)}}f={count:d,texture:T,size:new he(w,M)},n.set(o,f),o.addEventListener("dispose",I)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let h=0;for(let _=0;_<l.length;_++)h+=l[_];const g=o.morphTargetsRelative?1:1-h;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",f.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",f.size)}return{update:s}}function vw(i,e,t,n){let r=new WeakMap;function s(c){const l=n.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==l&&(e.update(d),r.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==l&&(f.update(),r.set(f,l))}return d}function a(){r=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:s,dispose:a}}class Dm extends gn{constructor(e,t,n,r,s,a,o,c,l,u=Ds){if(u!==Ds&&u!==Vs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Ds&&(n=Vr),n===void 0&&u===Vs&&(n=Hs),super(null,r,s,a,o,c,u,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:Kn,this.minFilter=c!==void 0?c:Kn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Um=new gn,Vf=new Dm(1,1),Nm=new Mm,km=new ay,zm=new Cm,Gf=[],Wf=[],$f=new Float32Array(16),qf=new Float32Array(9),Xf=new Float32Array(4);function js(i,e,t){const n=i[0];if(n<=0||n>0)return i;const r=e*t;let s=Gf[r];if(s===void 0&&(s=new Float32Array(r),Gf[r]=s),e!==0){n.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(s,o)}return s}function Yt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Kt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function ul(i,e){let t=Wf[e];t===void 0&&(t=new Int32Array(e),Wf[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function ww(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Mw(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;i.uniform2fv(this.addr,e),Kt(t,e)}}function Sw(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Yt(t,e))return;i.uniform3fv(this.addr,e),Kt(t,e)}}function bw(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;i.uniform4fv(this.addr,e),Kt(t,e)}}function Ew(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Yt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Kt(t,e)}else{if(Yt(t,n))return;Xf.set(n),i.uniformMatrix2fv(this.addr,!1,Xf),Kt(t,n)}}function Tw(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Yt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Kt(t,e)}else{if(Yt(t,n))return;qf.set(n),i.uniformMatrix3fv(this.addr,!1,qf),Kt(t,n)}}function Aw(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Yt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Kt(t,e)}else{if(Yt(t,n))return;$f.set(n),i.uniformMatrix4fv(this.addr,!1,$f),Kt(t,n)}}function Rw(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Pw(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;i.uniform2iv(this.addr,e),Kt(t,e)}}function Cw(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Yt(t,e))return;i.uniform3iv(this.addr,e),Kt(t,e)}}function Lw(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;i.uniform4iv(this.addr,e),Kt(t,e)}}function Iw(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Dw(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Yt(t,e))return;i.uniform2uiv(this.addr,e),Kt(t,e)}}function Uw(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Yt(t,e))return;i.uniform3uiv(this.addr,e),Kt(t,e)}}function Nw(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Yt(t,e))return;i.uniform4uiv(this.addr,e),Kt(t,e)}}function kw(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(Vf.compareFunction=ym,s=Vf):s=Um,t.setTexture2D(e||s,r)}function zw(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture3D(e||km,r)}function Ow(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTextureCube(e||zm,r)}function Fw(i,e,t){const n=this.cache,r=t.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),t.setTexture2DArray(e||Nm,r)}function Bw(i){switch(i){case 5126:return ww;case 35664:return Mw;case 35665:return Sw;case 35666:return bw;case 35674:return Ew;case 35675:return Tw;case 35676:return Aw;case 5124:case 35670:return Rw;case 35667:case 35671:return Pw;case 35668:case 35672:return Cw;case 35669:case 35673:return Lw;case 5125:return Iw;case 36294:return Dw;case 36295:return Uw;case 36296:return Nw;case 35678:case 36198:case 36298:case 36306:case 35682:return kw;case 35679:case 36299:case 36307:return zw;case 35680:case 36300:case 36308:case 36293:return Ow;case 36289:case 36303:case 36311:case 36292:return Fw}}function Hw(i,e){i.uniform1fv(this.addr,e)}function Vw(i,e){const t=js(e,this.size,2);i.uniform2fv(this.addr,t)}function Gw(i,e){const t=js(e,this.size,3);i.uniform3fv(this.addr,t)}function Ww(i,e){const t=js(e,this.size,4);i.uniform4fv(this.addr,t)}function $w(i,e){const t=js(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function qw(i,e){const t=js(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Xw(i,e){const t=js(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Yw(i,e){i.uniform1iv(this.addr,e)}function Kw(i,e){i.uniform2iv(this.addr,e)}function jw(i,e){i.uniform3iv(this.addr,e)}function Jw(i,e){i.uniform4iv(this.addr,e)}function Zw(i,e){i.uniform1uiv(this.addr,e)}function Qw(i,e){i.uniform2uiv(this.addr,e)}function eM(i,e){i.uniform3uiv(this.addr,e)}function tM(i,e){i.uniform4uiv(this.addr,e)}function nM(i,e,t){const n=this.cache,r=e.length,s=ul(t,r);Yt(n,s)||(i.uniform1iv(this.addr,s),Kt(n,s));for(let a=0;a!==r;++a)t.setTexture2D(e[a]||Um,s[a])}function iM(i,e,t){const n=this.cache,r=e.length,s=ul(t,r);Yt(n,s)||(i.uniform1iv(this.addr,s),Kt(n,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||km,s[a])}function rM(i,e,t){const n=this.cache,r=e.length,s=ul(t,r);Yt(n,s)||(i.uniform1iv(this.addr,s),Kt(n,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||zm,s[a])}function sM(i,e,t){const n=this.cache,r=e.length,s=ul(t,r);Yt(n,s)||(i.uniform1iv(this.addr,s),Kt(n,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||Nm,s[a])}function aM(i){switch(i){case 5126:return Hw;case 35664:return Vw;case 35665:return Gw;case 35666:return Ww;case 35674:return $w;case 35675:return qw;case 35676:return Xw;case 5124:case 35670:return Yw;case 35667:case 35671:return Kw;case 35668:case 35672:return jw;case 35669:case 35673:return Jw;case 5125:return Zw;case 36294:return Qw;case 36295:return eM;case 36296:return tM;case 35678:case 36198:case 36298:case 36306:case 35682:return nM;case 35679:case 36299:case 36307:return iM;case 35680:case 36300:case 36308:case 36293:return rM;case 36289:case 36303:case 36311:case 36292:return sM}}class oM{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Bw(t.type)}}class cM{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=aM(t.type)}}class lM{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],n)}}}const iu=/(\w+)(\])?(\[|\.)?/g;function Yf(i,e){i.seq.push(e),i.map[e.id]=e}function uM(i,e,t){const n=i.name,r=n.length;for(iu.lastIndex=0;;){const s=iu.exec(n),a=iu.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){Yf(t,l===void 0?new oM(o,i,e):new cM(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new lM(o),Yf(t,d)),t=d}}}class Ac{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=e.getActiveUniform(t,r),a=e.getUniformLocation(t,s.name);uM(s,a,this)}}setValue(e,t,n,r){const s=this.map[t];s!==void 0&&s.setValue(e,n,r)}setOptional(e,t,n){const r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,r)}}static seqWithValue(e,t){const n=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&n.push(a)}return n}}function Kf(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const hM=37297;let dM=0;function fM(i,e){const t=i.split(`
`),n=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}function pM(i){const e=ft.getPrimaries(ft.workingColorSpace),t=ft.getPrimaries(i);let n;switch(e===t?n="":e===Fc&&t===Oc?n="LinearDisplayP3ToLinearSRGB":e===Oc&&t===Fc&&(n="LinearSRGBToLinearDisplayP3"),i){case or:case ol:return[n,"LinearTransferOETF"];case ii:case ud:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function jf(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=i.getShaderInfoLog(e).trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+fM(i.getShaderSource(e),a)}else return r}function mM(i,e){const t=pM(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function gM(i,e){let t;switch(e){case Dx:t="Linear";break;case Ux:t="Reinhard";break;case Nx:t="Cineon";break;case kx:t="ACESFilmic";break;case Ox:t="AgX";break;case am:t="Neutral";break;case zx:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const zo=new U;function _M(){ft.getLuminanceCoefficients(zo);const i=zo.x.toFixed(4),e=zo.y.toFixed(4),t=zo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function xM(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Da).join(`
`)}function yM(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function vM(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(e,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Da(i){return i!==""}function Jf(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Zf(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const wM=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ih(i){return i.replace(wM,SM)}const MM=new Map;function SM(i,e){let t=et[e];if(t===void 0){const n=MM.get(e);if(n!==void 0)t=et[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ih(t)}const bM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qf(i){return i.replace(bM,EM)}function EM(i,e,t,n){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function ep(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function TM(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===rm?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===sm?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Ti&&(e="SHADOWMAP_TYPE_VSM"),e}function AM(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Fs:case Bs:e="ENVMAP_TYPE_CUBE";break;case al:e="ENVMAP_TYPE_CUBE_UV";break}return e}function RM(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Bs:e="ENVMAP_MODE_REFRACTION";break}return e}function PM(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case id:e="ENVMAP_BLENDING_MULTIPLY";break;case Lx:e="ENVMAP_BLENDING_MIX";break;case Ix:e="ENVMAP_BLENDING_ADD";break}return e}function CM(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function LM(i,e,t,n){const r=i.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=TM(t),l=AM(t),u=RM(t),d=PM(t),f=CM(t),h=xM(t),g=yM(s),_=r.createProgram();let p,m,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Da).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Da).join(`
`),m.length>0&&(m+=`
`)):(p=[ep(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Da).join(`
`),m=[ep(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ir?"#define TONE_MAPPING":"",t.toneMapping!==ir?et.tonemapping_pars_fragment:"",t.toneMapping!==ir?gM("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",et.colorspace_pars_fragment,mM("linearToOutputTexel",t.outputColorSpace),_M(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Da).join(`
`)),a=Ih(a),a=Jf(a,t),a=Zf(a,t),o=Ih(o),o=Jf(o,t),o=Zf(o,t),a=Qf(a),o=Qf(o),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,p=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===_f?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===_f?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const x=v+p+a,w=v+m+o,M=Kf(r,r.VERTEX_SHADER,x),E=Kf(r,r.FRAGMENT_SHADER,w);r.attachShader(_,M),r.attachShader(_,E),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function T(S){if(i.debug.checkShaderErrors){const N=r.getProgramInfoLog(_).trim(),k=r.getShaderInfoLog(M).trim(),z=r.getShaderInfoLog(E).trim();let H=!0,O=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,_,M,E);else{const J=jf(r,M,"vertex"),W=jf(r,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+S.name+`
Material Type: `+S.type+`

Program Info Log: `+N+`
`+J+`
`+W)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(k===""||z==="")&&(O=!1);O&&(S.diagnostics={runnable:H,programLog:N,vertexShader:{log:k,prefix:p},fragmentShader:{log:z,prefix:m}})}r.deleteShader(M),r.deleteShader(E),A=new Ac(r,_),I=vM(r,_)}let A;this.getUniforms=function(){return A===void 0&&T(this),A};let I;this.getAttributes=function(){return I===void 0&&T(this),I};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=r.getProgramParameter(_,hM)),y},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=dM++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=M,this.fragmentShader=E,this}let IM=0;class DM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new UM(e),t.set(e,n)),n}}class UM{constructor(e){this.id=IM++,this.code=e,this.usedTimes=0}}function NM(i,e,t,n,r,s,a){const o=new bm,c=new DM,l=new Set,u=[],d=r.logarithmicDepthBuffer,f=r.reverseDepthBuffer,h=r.vertexTextures;let g=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(y){return l.add(y),y===0?"uv":`uv${y}`}function m(y,S,N,k,z){const H=k.fog,O=z.geometry,J=y.isMeshStandardMaterial?k.environment:null,W=(y.isMeshStandardMaterial?t:e).get(y.envMap||J),pe=W&&W.mapping===al?W.image.height:null,ge=_[y.type];y.precision!==null&&(g=r.getMaxPrecision(y.precision),g!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",g,"instead."));const se=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,De=se!==void 0?se.length:0;let Ze=0;O.morphAttributes.position!==void 0&&(Ze=1),O.morphAttributes.normal!==void 0&&(Ze=2),O.morphAttributes.color!==void 0&&(Ze=3);let Z,Y,le,oe;if(ge){const vn=pi[ge];Z=vn.vertexShader,Y=vn.fragmentShader}else Z=y.vertexShader,Y=y.fragmentShader,c.update(y),le=c.getVertexShaderID(y),oe=c.getFragmentShaderID(y);const ze=i.getRenderTarget(),Ue=z.isInstancedMesh===!0,Ye=z.isBatchedMesh===!0,it=!!y.map,te=!!y.matcap,L=!!W,ye=!!y.aoMap,_e=!!y.lightMap,ce=!!y.bumpMap,ve=!!y.normalMap,Ge=!!y.displacementMap,Ae=!!y.emissiveMap,C=!!y.metalnessMap,b=!!y.roughnessMap,G=y.anisotropy>0,Q=y.clearcoat>0,ne=y.dispersion>0,ee=y.iridescence>0,Be=y.sheen>0,Me=y.transmission>0,Ce=G&&!!y.anisotropyMap,st=Q&&!!y.clearcoatMap,ue=Q&&!!y.clearcoatNormalMap,Le=Q&&!!y.clearcoatRoughnessMap,Ke=ee&&!!y.iridescenceMap,je=ee&&!!y.iridescenceThicknessMap,Ne=Be&&!!y.sheenColorMap,at=Be&&!!y.sheenRoughnessMap,Qe=!!y.specularMap,vt=!!y.specularColorMap,F=!!y.specularIntensityMap,Re=Me&&!!y.transmissionMap,j=Me&&!!y.thicknessMap,ie=!!y.gradientMap,Ee=!!y.alphaMap,Pe=y.alphaTest>0,ot=!!y.alphaHash,zt=!!y.extensions;let yn=ir;y.toneMapped&&(ze===null||ze.isXRRenderTarget===!0)&&(yn=i.toneMapping);const ut={shaderID:ge,shaderType:y.type,shaderName:y.name,vertexShader:Z,fragmentShader:Y,defines:y.defines,customVertexShaderID:le,customFragmentShaderID:oe,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:g,batching:Ye,batchingColor:Ye&&z._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&z.instanceColor!==null,instancingMorph:Ue&&z.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:ze===null?i.outputColorSpace:ze.isXRRenderTarget===!0?ze.texture.colorSpace:or,alphaToCoverage:!!y.alphaToCoverage,map:it,matcap:te,envMap:L,envMapMode:L&&W.mapping,envMapCubeUVHeight:pe,aoMap:ye,lightMap:_e,bumpMap:ce,normalMap:ve,displacementMap:h&&Ge,emissiveMap:Ae,normalMapObjectSpace:ve&&y.normalMapType===Vx,normalMapTangentSpace:ve&&y.normalMapType===xm,metalnessMap:C,roughnessMap:b,anisotropy:G,anisotropyMap:Ce,clearcoat:Q,clearcoatMap:st,clearcoatNormalMap:ue,clearcoatRoughnessMap:Le,dispersion:ne,iridescence:ee,iridescenceMap:Ke,iridescenceThicknessMap:je,sheen:Be,sheenColorMap:Ne,sheenRoughnessMap:at,specularMap:Qe,specularColorMap:vt,specularIntensityMap:F,transmission:Me,transmissionMap:Re,thicknessMap:j,gradientMap:ie,opaque:y.transparent===!1&&y.blending===Nr&&y.alphaToCoverage===!1,alphaMap:Ee,alphaTest:Pe,alphaHash:ot,combine:y.combine,mapUv:it&&p(y.map.channel),aoMapUv:ye&&p(y.aoMap.channel),lightMapUv:_e&&p(y.lightMap.channel),bumpMapUv:ce&&p(y.bumpMap.channel),normalMapUv:ve&&p(y.normalMap.channel),displacementMapUv:Ge&&p(y.displacementMap.channel),emissiveMapUv:Ae&&p(y.emissiveMap.channel),metalnessMapUv:C&&p(y.metalnessMap.channel),roughnessMapUv:b&&p(y.roughnessMap.channel),anisotropyMapUv:Ce&&p(y.anisotropyMap.channel),clearcoatMapUv:st&&p(y.clearcoatMap.channel),clearcoatNormalMapUv:ue&&p(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Le&&p(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Ke&&p(y.iridescenceMap.channel),iridescenceThicknessMapUv:je&&p(y.iridescenceThicknessMap.channel),sheenColorMapUv:Ne&&p(y.sheenColorMap.channel),sheenRoughnessMapUv:at&&p(y.sheenRoughnessMap.channel),specularMapUv:Qe&&p(y.specularMap.channel),specularColorMapUv:vt&&p(y.specularColorMap.channel),specularIntensityMapUv:F&&p(y.specularIntensityMap.channel),transmissionMapUv:Re&&p(y.transmissionMap.channel),thicknessMapUv:j&&p(y.thicknessMap.channel),alphaMapUv:Ee&&p(y.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(ve||G),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!O.attributes.uv&&(it||Ee),fog:!!H,useFog:y.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:f,skinning:z.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:De,morphTextureStride:Ze,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&N.length>0,shadowMapType:i.shadowMap.type,toneMapping:yn,decodeVideoTexture:it&&y.map.isVideoTexture===!0&&ft.getTransfer(y.map.colorSpace)===Mt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Xn,flipSided:y.side===mn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:zt&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(zt&&y.extensions.multiDraw===!0||Ye)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return ut.vertexUv1s=l.has(1),ut.vertexUv2s=l.has(2),ut.vertexUv3s=l.has(3),l.clear(),ut}function v(y){const S=[];if(y.shaderID?S.push(y.shaderID):(S.push(y.customVertexShaderID),S.push(y.customFragmentShaderID)),y.defines!==void 0)for(const N in y.defines)S.push(N),S.push(y.defines[N]);return y.isRawShaderMaterial===!1&&(x(S,y),w(S,y),S.push(i.outputColorSpace)),S.push(y.customProgramCacheKey),S.join()}function x(y,S){y.push(S.precision),y.push(S.outputColorSpace),y.push(S.envMapMode),y.push(S.envMapCubeUVHeight),y.push(S.mapUv),y.push(S.alphaMapUv),y.push(S.lightMapUv),y.push(S.aoMapUv),y.push(S.bumpMapUv),y.push(S.normalMapUv),y.push(S.displacementMapUv),y.push(S.emissiveMapUv),y.push(S.metalnessMapUv),y.push(S.roughnessMapUv),y.push(S.anisotropyMapUv),y.push(S.clearcoatMapUv),y.push(S.clearcoatNormalMapUv),y.push(S.clearcoatRoughnessMapUv),y.push(S.iridescenceMapUv),y.push(S.iridescenceThicknessMapUv),y.push(S.sheenColorMapUv),y.push(S.sheenRoughnessMapUv),y.push(S.specularMapUv),y.push(S.specularColorMapUv),y.push(S.specularIntensityMapUv),y.push(S.transmissionMapUv),y.push(S.thicknessMapUv),y.push(S.combine),y.push(S.fogExp2),y.push(S.sizeAttenuation),y.push(S.morphTargetsCount),y.push(S.morphAttributeCount),y.push(S.numDirLights),y.push(S.numPointLights),y.push(S.numSpotLights),y.push(S.numSpotLightMaps),y.push(S.numHemiLights),y.push(S.numRectAreaLights),y.push(S.numDirLightShadows),y.push(S.numPointLightShadows),y.push(S.numSpotLightShadows),y.push(S.numSpotLightShadowsWithMaps),y.push(S.numLightProbes),y.push(S.shadowMapType),y.push(S.toneMapping),y.push(S.numClippingPlanes),y.push(S.numClipIntersection),y.push(S.depthPacking)}function w(y,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),y.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reverseDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.alphaToCoverage&&o.enable(20),y.push(o.mask)}function M(y){const S=_[y.type];let N;if(S){const k=pi[S];N=xy.clone(k.uniforms)}else N=y.uniforms;return N}function E(y,S){let N;for(let k=0,z=u.length;k<z;k++){const H=u[k];if(H.cacheKey===S){N=H,++N.usedTimes;break}}return N===void 0&&(N=new LM(i,S,y,s),u.push(N)),N}function T(y){if(--y.usedTimes===0){const S=u.indexOf(y);u[S]=u[u.length-1],u.pop(),y.destroy()}}function A(y){c.remove(y)}function I(){c.dispose()}return{getParameters:m,getProgramCacheKey:v,getUniforms:M,acquireProgram:E,releaseProgram:T,releaseShaderCache:A,programs:u,dispose:I}}function kM(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,c){i.get(a)[o]=c}function s(){i=new WeakMap}return{has:e,get:t,remove:n,update:r,dispose:s}}function zM(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function tp(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function np(){const i=[];let e=0;const t=[],n=[],r=[];function s(){e=0,t.length=0,n.length=0,r.length=0}function a(d,f,h,g,_,p){let m=i[e];return m===void 0?(m={id:d.id,object:d,geometry:f,material:h,groupOrder:g,renderOrder:d.renderOrder,z:_,group:p},i[e]=m):(m.id=d.id,m.object=d,m.geometry=f,m.material=h,m.groupOrder=g,m.renderOrder=d.renderOrder,m.z=_,m.group=p),e++,m}function o(d,f,h,g,_,p){const m=a(d,f,h,g,_,p);h.transmission>0?n.push(m):h.transparent===!0?r.push(m):t.push(m)}function c(d,f,h,g,_,p){const m=a(d,f,h,g,_,p);h.transmission>0?n.unshift(m):h.transparent===!0?r.unshift(m):t.unshift(m)}function l(d,f){t.length>1&&t.sort(d||zM),n.length>1&&n.sort(f||tp),r.length>1&&r.sort(f||tp)}function u(){for(let d=e,f=i.length;d<f;d++){const h=i[d];if(h.id===null)break;h.id=null,h.object=null,h.geometry=null,h.material=null,h.group=null}}return{opaque:t,transmissive:n,transparent:r,init:s,push:o,unshift:c,finish:u,sort:l}}function OM(){let i=new WeakMap;function e(n,r){const s=i.get(n);let a;return s===void 0?(a=new np,i.set(n,[a])):r>=s.length?(a=new np,s.push(a)):a=s[r],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function FM(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new U,color:new be};break;case"SpotLight":t={position:new U,direction:new U,color:new be,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new U,color:new be,distance:0,decay:0};break;case"HemisphereLight":t={direction:new U,skyColor:new be,groundColor:new be};break;case"RectAreaLight":t={color:new be,position:new U,halfWidth:new U,halfHeight:new U};break}return i[e.id]=t,t}}}function BM(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new he,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let HM=0;function VM(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function GM(i){const e=new FM,t=BM(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new U);const r=new U,s=new yt,a=new yt;function o(l){let u=0,d=0,f=0;for(let I=0;I<9;I++)n.probe[I].set(0,0,0);let h=0,g=0,_=0,p=0,m=0,v=0,x=0,w=0,M=0,E=0,T=0;l.sort(VM);for(let I=0,y=l.length;I<y;I++){const S=l[I],N=S.color,k=S.intensity,z=S.distance,H=S.shadow&&S.shadow.map?S.shadow.map.texture:null;if(S.isAmbientLight)u+=N.r*k,d+=N.g*k,f+=N.b*k;else if(S.isLightProbe){for(let O=0;O<9;O++)n.probe[O].addScaledVector(S.sh.coefficients[O],k);T++}else if(S.isDirectionalLight){const O=e.get(S);if(O.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){const J=S.shadow,W=t.get(S);W.shadowIntensity=J.intensity,W.shadowBias=J.bias,W.shadowNormalBias=J.normalBias,W.shadowRadius=J.radius,W.shadowMapSize=J.mapSize,n.directionalShadow[h]=W,n.directionalShadowMap[h]=H,n.directionalShadowMatrix[h]=S.shadow.matrix,v++}n.directional[h]=O,h++}else if(S.isSpotLight){const O=e.get(S);O.position.setFromMatrixPosition(S.matrixWorld),O.color.copy(N).multiplyScalar(k),O.distance=z,O.coneCos=Math.cos(S.angle),O.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),O.decay=S.decay,n.spot[_]=O;const J=S.shadow;if(S.map&&(n.spotLightMap[M]=S.map,M++,J.updateMatrices(S),S.castShadow&&E++),n.spotLightMatrix[_]=J.matrix,S.castShadow){const W=t.get(S);W.shadowIntensity=J.intensity,W.shadowBias=J.bias,W.shadowNormalBias=J.normalBias,W.shadowRadius=J.radius,W.shadowMapSize=J.mapSize,n.spotShadow[_]=W,n.spotShadowMap[_]=H,w++}_++}else if(S.isRectAreaLight){const O=e.get(S);O.color.copy(N).multiplyScalar(k),O.halfWidth.set(S.width*.5,0,0),O.halfHeight.set(0,S.height*.5,0),n.rectArea[p]=O,p++}else if(S.isPointLight){const O=e.get(S);if(O.color.copy(S.color).multiplyScalar(S.intensity),O.distance=S.distance,O.decay=S.decay,S.castShadow){const J=S.shadow,W=t.get(S);W.shadowIntensity=J.intensity,W.shadowBias=J.bias,W.shadowNormalBias=J.normalBias,W.shadowRadius=J.radius,W.shadowMapSize=J.mapSize,W.shadowCameraNear=J.camera.near,W.shadowCameraFar=J.camera.far,n.pointShadow[g]=W,n.pointShadowMap[g]=H,n.pointShadowMatrix[g]=S.shadow.matrix,x++}n.point[g]=O,g++}else if(S.isHemisphereLight){const O=e.get(S);O.skyColor.copy(S.color).multiplyScalar(k),O.groundColor.copy(S.groundColor).multiplyScalar(k),n.hemi[m]=O,m++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Se.LTC_FLOAT_1,n.rectAreaLTC2=Se.LTC_FLOAT_2):(n.rectAreaLTC1=Se.LTC_HALF_1,n.rectAreaLTC2=Se.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=d,n.ambient[2]=f;const A=n.hash;(A.directionalLength!==h||A.pointLength!==g||A.spotLength!==_||A.rectAreaLength!==p||A.hemiLength!==m||A.numDirectionalShadows!==v||A.numPointShadows!==x||A.numSpotShadows!==w||A.numSpotMaps!==M||A.numLightProbes!==T)&&(n.directional.length=h,n.spot.length=_,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=v,n.directionalShadowMap.length=v,n.pointShadow.length=x,n.pointShadowMap.length=x,n.spotShadow.length=w,n.spotShadowMap.length=w,n.directionalShadowMatrix.length=v,n.pointShadowMatrix.length=x,n.spotLightMatrix.length=w+M-E,n.spotLightMap.length=M,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=T,A.directionalLength=h,A.pointLength=g,A.spotLength=_,A.rectAreaLength=p,A.hemiLength=m,A.numDirectionalShadows=v,A.numPointShadows=x,A.numSpotShadows=w,A.numSpotMaps=M,A.numLightProbes=T,n.version=HM++)}function c(l,u){let d=0,f=0,h=0,g=0,_=0;const p=u.matrixWorldInverse;for(let m=0,v=l.length;m<v;m++){const x=l[m];if(x.isDirectionalLight){const w=n.directional[d];w.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(p),d++}else if(x.isSpotLight){const w=n.spot[h];w.position.setFromMatrixPosition(x.matrixWorld),w.position.applyMatrix4(p),w.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(p),h++}else if(x.isRectAreaLight){const w=n.rectArea[g];w.position.setFromMatrixPosition(x.matrixWorld),w.position.applyMatrix4(p),a.identity(),s.copy(x.matrixWorld),s.premultiply(p),a.extractRotation(s),w.halfWidth.set(x.width*.5,0,0),w.halfHeight.set(0,x.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),g++}else if(x.isPointLight){const w=n.point[f];w.position.setFromMatrixPosition(x.matrixWorld),w.position.applyMatrix4(p),f++}else if(x.isHemisphereLight){const w=n.hemi[_];w.direction.setFromMatrixPosition(x.matrixWorld),w.direction.transformDirection(p),_++}}}return{setup:o,setupView:c,state:n}}function ip(i){const e=new GM(i),t=[],n=[];function r(u){l.camera=u,t.length=0,n.length=0}function s(u){t.push(u)}function a(u){n.push(u)}function o(){e.setup(t)}function c(u){e.setupView(t,u)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:l,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function WM(i){let e=new WeakMap;function t(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new ip(i),e.set(r,[o])):s>=a.length?(o=new ip(i),a.push(o)):o=a[s],o}function n(){e=new WeakMap}return{get:t,dispose:n}}class $M extends Yr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Bx,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class qM extends Yr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const XM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,YM=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function KM(i,e,t){let n=new hd;const r=new he,s=new he,a=new xt,o=new $M({depthPacking:Hx}),c=new qM,l={},u=t.maxTextureSize,d={[sr]:mn,[mn]:sr,[Xn]:Xn},f=new ki({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new he},radius:{value:4}},vertexShader:XM,fragmentShader:YM}),h=f.clone();h.defines.HORIZONTAL_PASS=1;const g=new Lt;g.setAttribute("position",new lt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Et(g,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=rm;let m=this.type;this.render=function(E,T,A){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||E.length===0)return;const I=i.getRenderTarget(),y=i.getActiveCubeFace(),S=i.getActiveMipmapLevel(),N=i.state;N.setBlending(nr),N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const k=m!==Ti&&this.type===Ti,z=m===Ti&&this.type!==Ti;for(let H=0,O=E.length;H<O;H++){const J=E[H],W=J.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;r.copy(W.mapSize);const pe=W.getFrameExtents();if(r.multiply(pe),s.copy(W.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/pe.x),r.x=s.x*pe.x,W.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/pe.y),r.y=s.y*pe.y,W.mapSize.y=s.y)),W.map===null||k===!0||z===!0){const se=this.type!==Ti?{minFilter:Kn,magFilter:Kn}:{};W.map!==null&&W.map.dispose(),W.map=new Gr(r.x,r.y,se),W.map.texture.name=J.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();const ge=W.getViewportCount();for(let se=0;se<ge;se++){const De=W.getViewport(se);a.set(s.x*De.x,s.y*De.y,s.x*De.z,s.y*De.w),N.viewport(a),W.updateMatrices(J,se),n=W.getFrustum(),w(T,A,W.camera,J,this.type)}W.isPointLightShadow!==!0&&this.type===Ti&&v(W,A),W.needsUpdate=!1}m=this.type,p.needsUpdate=!1,i.setRenderTarget(I,y,S)};function v(E,T){const A=e.update(_);f.defines.VSM_SAMPLES!==E.blurSamples&&(f.defines.VSM_SAMPLES=E.blurSamples,h.defines.VSM_SAMPLES=E.blurSamples,f.needsUpdate=!0,h.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Gr(r.x,r.y)),f.uniforms.shadow_pass.value=E.map.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(T,null,A,f,_,null),h.uniforms.shadow_pass.value=E.mapPass.texture,h.uniforms.resolution.value=E.mapSize,h.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(T,null,A,h,_,null)}function x(E,T,A,I){let y=null;const S=A.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(S!==void 0)y=S;else if(y=A.isPointLight===!0?c:o,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const N=y.uuid,k=T.uuid;let z=l[N];z===void 0&&(z={},l[N]=z);let H=z[k];H===void 0&&(H=y.clone(),z[k]=H,T.addEventListener("dispose",M)),y=H}if(y.visible=T.visible,y.wireframe=T.wireframe,I===Ti?y.side=T.shadowSide!==null?T.shadowSide:T.side:y.side=T.shadowSide!==null?T.shadowSide:d[T.side],y.alphaMap=T.alphaMap,y.alphaTest=T.alphaTest,y.map=T.map,y.clipShadows=T.clipShadows,y.clippingPlanes=T.clippingPlanes,y.clipIntersection=T.clipIntersection,y.displacementMap=T.displacementMap,y.displacementScale=T.displacementScale,y.displacementBias=T.displacementBias,y.wireframeLinewidth=T.wireframeLinewidth,y.linewidth=T.linewidth,A.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const N=i.properties.get(y);N.light=A}return y}function w(E,T,A,I,y){if(E.visible===!1)return;if(E.layers.test(T.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&y===Ti)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,E.matrixWorld);const k=e.update(E),z=E.material;if(Array.isArray(z)){const H=k.groups;for(let O=0,J=H.length;O<J;O++){const W=H[O],pe=z[W.materialIndex];if(pe&&pe.visible){const ge=x(E,pe,I,y);E.onBeforeShadow(i,E,T,A,k,ge,W),i.renderBufferDirect(A,null,k,ge,E,W),E.onAfterShadow(i,E,T,A,k,ge,W)}}}else if(z.visible){const H=x(E,z,I,y);E.onBeforeShadow(i,E,T,A,k,H,null),i.renderBufferDirect(A,null,k,H,E,null),E.onAfterShadow(i,E,T,A,k,H,null)}}const N=E.children;for(let k=0,z=N.length;k<z;k++)w(N[k],T,A,I,y)}function M(E){E.target.removeEventListener("dispose",M);for(const A in l){const I=l[A],y=E.target.uuid;y in I&&(I[y].dispose(),delete I[y])}}}const jM={[Xu]:Yu,[Ku]:Zu,[ju]:Qu,[Os]:Ju,[Yu]:Xu,[Zu]:Ku,[Qu]:ju,[Ju]:Os};function JM(i){function e(){let F=!1;const Re=new xt;let j=null;const ie=new xt(0,0,0,0);return{setMask:function(Ee){j!==Ee&&!F&&(i.colorMask(Ee,Ee,Ee,Ee),j=Ee)},setLocked:function(Ee){F=Ee},setClear:function(Ee,Pe,ot,zt,yn){yn===!0&&(Ee*=zt,Pe*=zt,ot*=zt),Re.set(Ee,Pe,ot,zt),ie.equals(Re)===!1&&(i.clearColor(Ee,Pe,ot,zt),ie.copy(Re))},reset:function(){F=!1,j=null,ie.set(-1,0,0,0)}}}function t(){let F=!1,Re=!1,j=null,ie=null,Ee=null;return{setReversed:function(Pe){Re=Pe},setTest:function(Pe){Pe?le(i.DEPTH_TEST):oe(i.DEPTH_TEST)},setMask:function(Pe){j!==Pe&&!F&&(i.depthMask(Pe),j=Pe)},setFunc:function(Pe){if(Re&&(Pe=jM[Pe]),ie!==Pe){switch(Pe){case Xu:i.depthFunc(i.NEVER);break;case Yu:i.depthFunc(i.ALWAYS);break;case Ku:i.depthFunc(i.LESS);break;case Os:i.depthFunc(i.LEQUAL);break;case ju:i.depthFunc(i.EQUAL);break;case Ju:i.depthFunc(i.GEQUAL);break;case Zu:i.depthFunc(i.GREATER);break;case Qu:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ie=Pe}},setLocked:function(Pe){F=Pe},setClear:function(Pe){Ee!==Pe&&(i.clearDepth(Pe),Ee=Pe)},reset:function(){F=!1,j=null,ie=null,Ee=null}}}function n(){let F=!1,Re=null,j=null,ie=null,Ee=null,Pe=null,ot=null,zt=null,yn=null;return{setTest:function(ut){F||(ut?le(i.STENCIL_TEST):oe(i.STENCIL_TEST))},setMask:function(ut){Re!==ut&&!F&&(i.stencilMask(ut),Re=ut)},setFunc:function(ut,vn,yi){(j!==ut||ie!==vn||Ee!==yi)&&(i.stencilFunc(ut,vn,yi),j=ut,ie=vn,Ee=yi)},setOp:function(ut,vn,yi){(Pe!==ut||ot!==vn||zt!==yi)&&(i.stencilOp(ut,vn,yi),Pe=ut,ot=vn,zt=yi)},setLocked:function(ut){F=ut},setClear:function(ut){yn!==ut&&(i.clearStencil(ut),yn=ut)},reset:function(){F=!1,Re=null,j=null,ie=null,Ee=null,Pe=null,ot=null,zt=null,yn=null}}}const r=new e,s=new t,a=new n,o=new WeakMap,c=new WeakMap;let l={},u={},d=new WeakMap,f=[],h=null,g=!1,_=null,p=null,m=null,v=null,x=null,w=null,M=null,E=new be(0,0,0),T=0,A=!1,I=null,y=null,S=null,N=null,k=null;const z=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,O=0;const J=i.getParameter(i.VERSION);J.indexOf("WebGL")!==-1?(O=parseFloat(/^WebGL (\d)/.exec(J)[1]),H=O>=1):J.indexOf("OpenGL ES")!==-1&&(O=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),H=O>=2);let W=null,pe={};const ge=i.getParameter(i.SCISSOR_BOX),se=i.getParameter(i.VIEWPORT),De=new xt().fromArray(ge),Ze=new xt().fromArray(se);function Z(F,Re,j,ie){const Ee=new Uint8Array(4),Pe=i.createTexture();i.bindTexture(F,Pe),i.texParameteri(F,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(F,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ot=0;ot<j;ot++)F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY?i.texImage3D(Re,0,i.RGBA,1,1,ie,0,i.RGBA,i.UNSIGNED_BYTE,Ee):i.texImage2D(Re+ot,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ee);return Pe}const Y={};Y[i.TEXTURE_2D]=Z(i.TEXTURE_2D,i.TEXTURE_2D,1),Y[i.TEXTURE_CUBE_MAP]=Z(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[i.TEXTURE_2D_ARRAY]=Z(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Y[i.TEXTURE_3D]=Z(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),a.setClear(0),le(i.DEPTH_TEST),s.setFunc(Os),_e(!1),ce(ff),le(i.CULL_FACE),L(nr);function le(F){l[F]!==!0&&(i.enable(F),l[F]=!0)}function oe(F){l[F]!==!1&&(i.disable(F),l[F]=!1)}function ze(F,Re){return u[F]!==Re?(i.bindFramebuffer(F,Re),u[F]=Re,F===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=Re),F===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=Re),!0):!1}function Ue(F,Re){let j=f,ie=!1;if(F){j=d.get(Re),j===void 0&&(j=[],d.set(Re,j));const Ee=F.textures;if(j.length!==Ee.length||j[0]!==i.COLOR_ATTACHMENT0){for(let Pe=0,ot=Ee.length;Pe<ot;Pe++)j[Pe]=i.COLOR_ATTACHMENT0+Pe;j.length=Ee.length,ie=!0}}else j[0]!==i.BACK&&(j[0]=i.BACK,ie=!0);ie&&i.drawBuffers(j)}function Ye(F){return h!==F?(i.useProgram(F),h=F,!0):!1}const it={[Pr]:i.FUNC_ADD,[px]:i.FUNC_SUBTRACT,[mx]:i.FUNC_REVERSE_SUBTRACT};it[gx]=i.MIN,it[_x]=i.MAX;const te={[xx]:i.ZERO,[yx]:i.ONE,[vx]:i.SRC_COLOR,[$u]:i.SRC_ALPHA,[Tx]:i.SRC_ALPHA_SATURATE,[bx]:i.DST_COLOR,[Mx]:i.DST_ALPHA,[wx]:i.ONE_MINUS_SRC_COLOR,[qu]:i.ONE_MINUS_SRC_ALPHA,[Ex]:i.ONE_MINUS_DST_COLOR,[Sx]:i.ONE_MINUS_DST_ALPHA,[Ax]:i.CONSTANT_COLOR,[Rx]:i.ONE_MINUS_CONSTANT_COLOR,[Px]:i.CONSTANT_ALPHA,[Cx]:i.ONE_MINUS_CONSTANT_ALPHA};function L(F,Re,j,ie,Ee,Pe,ot,zt,yn,ut){if(F===nr){g===!0&&(oe(i.BLEND),g=!1);return}if(g===!1&&(le(i.BLEND),g=!0),F!==fx){if(F!==_||ut!==A){if((p!==Pr||x!==Pr)&&(i.blendEquation(i.FUNC_ADD),p=Pr,x=Pr),ut)switch(F){case Nr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Hr:i.blendFunc(i.ONE,i.ONE);break;case pf:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case mf:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}else switch(F){case Nr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Hr:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case pf:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case mf:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",F);break}m=null,v=null,w=null,M=null,E.set(0,0,0),T=0,_=F,A=ut}return}Ee=Ee||Re,Pe=Pe||j,ot=ot||ie,(Re!==p||Ee!==x)&&(i.blendEquationSeparate(it[Re],it[Ee]),p=Re,x=Ee),(j!==m||ie!==v||Pe!==w||ot!==M)&&(i.blendFuncSeparate(te[j],te[ie],te[Pe],te[ot]),m=j,v=ie,w=Pe,M=ot),(zt.equals(E)===!1||yn!==T)&&(i.blendColor(zt.r,zt.g,zt.b,yn),E.copy(zt),T=yn),_=F,A=!1}function ye(F,Re){F.side===Xn?oe(i.CULL_FACE):le(i.CULL_FACE);let j=F.side===mn;Re&&(j=!j),_e(j),F.blending===Nr&&F.transparent===!1?L(nr):L(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),s.setFunc(F.depthFunc),s.setTest(F.depthTest),s.setMask(F.depthWrite),r.setMask(F.colorWrite);const ie=F.stencilWrite;a.setTest(ie),ie&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Ge(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?le(i.SAMPLE_ALPHA_TO_COVERAGE):oe(i.SAMPLE_ALPHA_TO_COVERAGE)}function _e(F){I!==F&&(F?i.frontFace(i.CW):i.frontFace(i.CCW),I=F)}function ce(F){F!==hx?(le(i.CULL_FACE),F!==y&&(F===ff?i.cullFace(i.BACK):F===dx?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):oe(i.CULL_FACE),y=F}function ve(F){F!==S&&(H&&i.lineWidth(F),S=F)}function Ge(F,Re,j){F?(le(i.POLYGON_OFFSET_FILL),(N!==Re||k!==j)&&(i.polygonOffset(Re,j),N=Re,k=j)):oe(i.POLYGON_OFFSET_FILL)}function Ae(F){F?le(i.SCISSOR_TEST):oe(i.SCISSOR_TEST)}function C(F){F===void 0&&(F=i.TEXTURE0+z-1),W!==F&&(i.activeTexture(F),W=F)}function b(F,Re,j){j===void 0&&(W===null?j=i.TEXTURE0+z-1:j=W);let ie=pe[j];ie===void 0&&(ie={type:void 0,texture:void 0},pe[j]=ie),(ie.type!==F||ie.texture!==Re)&&(W!==j&&(i.activeTexture(j),W=j),i.bindTexture(F,Re||Y[F]),ie.type=F,ie.texture=Re)}function G(){const F=pe[W];F!==void 0&&F.type!==void 0&&(i.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function Q(){try{i.compressedTexImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ne(){try{i.compressedTexImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ee(){try{i.texSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Be(){try{i.texSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Me(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ce(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function st(){try{i.texStorage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function ue(){try{i.texStorage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Le(){try{i.texImage2D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function Ke(){try{i.texImage3D.apply(i,arguments)}catch(F){console.error("THREE.WebGLState:",F)}}function je(F){De.equals(F)===!1&&(i.scissor(F.x,F.y,F.z,F.w),De.copy(F))}function Ne(F){Ze.equals(F)===!1&&(i.viewport(F.x,F.y,F.z,F.w),Ze.copy(F))}function at(F,Re){let j=c.get(Re);j===void 0&&(j=new WeakMap,c.set(Re,j));let ie=j.get(F);ie===void 0&&(ie=i.getUniformBlockIndex(Re,F.name),j.set(F,ie))}function Qe(F,Re){const ie=c.get(Re).get(F);o.get(Re)!==ie&&(i.uniformBlockBinding(Re,ie,F.__bindingPointIndex),o.set(Re,ie))}function vt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),l={},W=null,pe={},u={},d=new WeakMap,f=[],h=null,g=!1,_=null,p=null,m=null,v=null,x=null,w=null,M=null,E=new be(0,0,0),T=0,A=!1,I=null,y=null,S=null,N=null,k=null,De.set(0,0,i.canvas.width,i.canvas.height),Ze.set(0,0,i.canvas.width,i.canvas.height),r.reset(),s.reset(),a.reset()}return{buffers:{color:r,depth:s,stencil:a},enable:le,disable:oe,bindFramebuffer:ze,drawBuffers:Ue,useProgram:Ye,setBlending:L,setMaterial:ye,setFlipSided:_e,setCullFace:ce,setLineWidth:ve,setPolygonOffset:Ge,setScissorTest:Ae,activeTexture:C,bindTexture:b,unbindTexture:G,compressedTexImage2D:Q,compressedTexImage3D:ne,texImage2D:Le,texImage3D:Ke,updateUBOMapping:at,uniformBlockBinding:Qe,texStorage2D:st,texStorage3D:ue,texSubImage2D:ee,texSubImage3D:Be,compressedTexSubImage2D:Me,compressedTexSubImage3D:Ce,scissor:je,viewport:Ne,reset:vt}}function rp(i,e,t,n){const r=ZM(n);switch(t){case hm:return i*e;case fm:return i*e;case pm:return i*e*2;case mm:return i*e/r.components*r.byteLength;case od:return i*e/r.components*r.byteLength;case gm:return i*e*2/r.components*r.byteLength;case cd:return i*e*2/r.components*r.byteLength;case dm:return i*e*3/r.components*r.byteLength;case si:return i*e*4/r.components*r.byteLength;case ld:return i*e*4/r.components*r.byteLength;case wc:case Mc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Sc:case bc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case sh:case oh:return Math.max(i,16)*Math.max(e,8)/4;case rh:case ah:return Math.max(i,8)*Math.max(e,8)/2;case ch:case lh:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case uh:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case hh:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case dh:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case fh:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ph:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case mh:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case gh:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case _h:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case xh:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case yh:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case vh:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case wh:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Mh:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Sh:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case bh:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Ec:case Eh:case Th:return Math.ceil(i/4)*Math.ceil(e/4)*16;case _m:case Ah:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Rh:case Ph:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function ZM(i){switch(i){case Ni:case cm:return{byteLength:1,components:1};case Ka:case lm:case io:return{byteLength:2,components:1};case sd:case ad:return{byteLength:2,components:4};case Vr:case rd:case Ci:return{byteLength:4,components:1};case um:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function QM(i,e,t,n,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new he,u=new WeakMap;let d;const f=new WeakMap;let h=!1;try{h=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,b){return h?new OffscreenCanvas(C,b):Hc("canvas")}function _(C,b,G){let Q=1;const ne=Ae(C);if((ne.width>G||ne.height>G)&&(Q=G/Math.max(ne.width,ne.height)),Q<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const ee=Math.floor(Q*ne.width),Be=Math.floor(Q*ne.height);d===void 0&&(d=g(ee,Be));const Me=b?g(ee,Be):d;return Me.width=ee,Me.height=Be,Me.getContext("2d").drawImage(C,0,0,ee,Be),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+ee+"x"+Be+")."),Me}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),C;return C}function p(C){return C.generateMipmaps&&C.minFilter!==Kn&&C.minFilter!==ri}function m(C){i.generateMipmap(C)}function v(C,b,G,Q,ne=!1){if(C!==null){if(i[C]!==void 0)return i[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ee=b;if(b===i.RED&&(G===i.FLOAT&&(ee=i.R32F),G===i.HALF_FLOAT&&(ee=i.R16F),G===i.UNSIGNED_BYTE&&(ee=i.R8)),b===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(ee=i.R8UI),G===i.UNSIGNED_SHORT&&(ee=i.R16UI),G===i.UNSIGNED_INT&&(ee=i.R32UI),G===i.BYTE&&(ee=i.R8I),G===i.SHORT&&(ee=i.R16I),G===i.INT&&(ee=i.R32I)),b===i.RG&&(G===i.FLOAT&&(ee=i.RG32F),G===i.HALF_FLOAT&&(ee=i.RG16F),G===i.UNSIGNED_BYTE&&(ee=i.RG8)),b===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(ee=i.RG8UI),G===i.UNSIGNED_SHORT&&(ee=i.RG16UI),G===i.UNSIGNED_INT&&(ee=i.RG32UI),G===i.BYTE&&(ee=i.RG8I),G===i.SHORT&&(ee=i.RG16I),G===i.INT&&(ee=i.RG32I)),b===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(ee=i.RGB8UI),G===i.UNSIGNED_SHORT&&(ee=i.RGB16UI),G===i.UNSIGNED_INT&&(ee=i.RGB32UI),G===i.BYTE&&(ee=i.RGB8I),G===i.SHORT&&(ee=i.RGB16I),G===i.INT&&(ee=i.RGB32I)),b===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(ee=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(ee=i.RGBA16UI),G===i.UNSIGNED_INT&&(ee=i.RGBA32UI),G===i.BYTE&&(ee=i.RGBA8I),G===i.SHORT&&(ee=i.RGBA16I),G===i.INT&&(ee=i.RGBA32I)),b===i.RGB&&G===i.UNSIGNED_INT_5_9_9_9_REV&&(ee=i.RGB9_E5),b===i.RGBA){const Be=ne?zc:ft.getTransfer(Q);G===i.FLOAT&&(ee=i.RGBA32F),G===i.HALF_FLOAT&&(ee=i.RGBA16F),G===i.UNSIGNED_BYTE&&(ee=Be===Mt?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(ee=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(ee=i.RGB5_A1)}return(ee===i.R16F||ee===i.R32F||ee===i.RG16F||ee===i.RG32F||ee===i.RGBA16F||ee===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function x(C,b){let G;return C?b===null||b===Vr||b===Hs?G=i.DEPTH24_STENCIL8:b===Ci?G=i.DEPTH32F_STENCIL8:b===Ka&&(G=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Vr||b===Hs?G=i.DEPTH_COMPONENT24:b===Ci?G=i.DEPTH_COMPONENT32F:b===Ka&&(G=i.DEPTH_COMPONENT16),G}function w(C,b){return p(C)===!0||C.isFramebufferTexture&&C.minFilter!==Kn&&C.minFilter!==ri?Math.log2(Math.max(b.width,b.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?b.mipmaps.length:1}function M(C){const b=C.target;b.removeEventListener("dispose",M),T(b),b.isVideoTexture&&u.delete(b)}function E(C){const b=C.target;b.removeEventListener("dispose",E),I(b)}function T(C){const b=n.get(C);if(b.__webglInit===void 0)return;const G=C.source,Q=f.get(G);if(Q){const ne=Q[b.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&A(C),Object.keys(Q).length===0&&f.delete(G)}n.remove(C)}function A(C){const b=n.get(C);i.deleteTexture(b.__webglTexture);const G=C.source,Q=f.get(G);delete Q[b.__cacheKey],a.memory.textures--}function I(C){const b=n.get(C);if(C.depthTexture&&C.depthTexture.dispose(),C.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(b.__webglFramebuffer[Q]))for(let ne=0;ne<b.__webglFramebuffer[Q].length;ne++)i.deleteFramebuffer(b.__webglFramebuffer[Q][ne]);else i.deleteFramebuffer(b.__webglFramebuffer[Q]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[Q])}else{if(Array.isArray(b.__webglFramebuffer))for(let Q=0;Q<b.__webglFramebuffer.length;Q++)i.deleteFramebuffer(b.__webglFramebuffer[Q]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let Q=0;Q<b.__webglColorRenderbuffer.length;Q++)b.__webglColorRenderbuffer[Q]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[Q]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const G=C.textures;for(let Q=0,ne=G.length;Q<ne;Q++){const ee=n.get(G[Q]);ee.__webglTexture&&(i.deleteTexture(ee.__webglTexture),a.memory.textures--),n.remove(G[Q])}n.remove(C)}let y=0;function S(){y=0}function N(){const C=y;return C>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+r.maxTextures),y+=1,C}function k(C){const b=[];return b.push(C.wrapS),b.push(C.wrapT),b.push(C.wrapR||0),b.push(C.magFilter),b.push(C.minFilter),b.push(C.anisotropy),b.push(C.internalFormat),b.push(C.format),b.push(C.type),b.push(C.generateMipmaps),b.push(C.premultiplyAlpha),b.push(C.flipY),b.push(C.unpackAlignment),b.push(C.colorSpace),b.join()}function z(C,b){const G=n.get(C);if(C.isVideoTexture&&ve(C),C.isRenderTargetTexture===!1&&C.version>0&&G.__version!==C.version){const Q=C.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ze(G,C,b);return}}t.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+b)}function H(C,b){const G=n.get(C);if(C.version>0&&G.__version!==C.version){Ze(G,C,b);return}t.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+b)}function O(C,b){const G=n.get(C);if(C.version>0&&G.__version!==C.version){Ze(G,C,b);return}t.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+b)}function J(C,b){const G=n.get(C);if(C.version>0&&G.__version!==C.version){Z(G,C,b);return}t.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+b)}const W={[nh]:i.REPEAT,[Ir]:i.CLAMP_TO_EDGE,[ih]:i.MIRRORED_REPEAT},pe={[Kn]:i.NEAREST,[Fx]:i.NEAREST_MIPMAP_NEAREST,[_o]:i.NEAREST_MIPMAP_LINEAR,[ri]:i.LINEAR,[Rl]:i.LINEAR_MIPMAP_NEAREST,[Dr]:i.LINEAR_MIPMAP_LINEAR},ge={[Gx]:i.NEVER,[Kx]:i.ALWAYS,[Wx]:i.LESS,[ym]:i.LEQUAL,[$x]:i.EQUAL,[Yx]:i.GEQUAL,[qx]:i.GREATER,[Xx]:i.NOTEQUAL};function se(C,b){if(b.type===Ci&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===ri||b.magFilter===Rl||b.magFilter===_o||b.magFilter===Dr||b.minFilter===ri||b.minFilter===Rl||b.minFilter===_o||b.minFilter===Dr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,W[b.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,W[b.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,W[b.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,pe[b.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,pe[b.minFilter]),b.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,ge[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Kn||b.minFilter!==_o&&b.minFilter!==Dr||b.type===Ci&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const G=e.get("EXT_texture_filter_anisotropic");i.texParameterf(C,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,r.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function De(C,b){let G=!1;C.__webglInit===void 0&&(C.__webglInit=!0,b.addEventListener("dispose",M));const Q=b.source;let ne=f.get(Q);ne===void 0&&(ne={},f.set(Q,ne));const ee=k(b);if(ee!==C.__cacheKey){ne[ee]===void 0&&(ne[ee]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,G=!0),ne[ee].usedTimes++;const Be=ne[C.__cacheKey];Be!==void 0&&(ne[C.__cacheKey].usedTimes--,Be.usedTimes===0&&A(b)),C.__cacheKey=ee,C.__webglTexture=ne[ee].texture}return G}function Ze(C,b,G){let Q=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(Q=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(Q=i.TEXTURE_3D);const ne=De(C,b),ee=b.source;t.bindTexture(Q,C.__webglTexture,i.TEXTURE0+G);const Be=n.get(ee);if(ee.version!==Be.__version||ne===!0){t.activeTexture(i.TEXTURE0+G);const Me=ft.getPrimaries(ft.workingColorSpace),Ce=b.colorSpace===Ji?null:ft.getPrimaries(b.colorSpace),st=b.colorSpace===Ji||Me===Ce?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,st);let ue=_(b.image,!1,r.maxTextureSize);ue=Ge(b,ue);const Le=s.convert(b.format,b.colorSpace),Ke=s.convert(b.type);let je=v(b.internalFormat,Le,Ke,b.colorSpace,b.isVideoTexture);se(Q,b);let Ne;const at=b.mipmaps,Qe=b.isVideoTexture!==!0,vt=Be.__version===void 0||ne===!0,F=ee.dataReady,Re=w(b,ue);if(b.isDepthTexture)je=x(b.format===Vs,b.type),vt&&(Qe?t.texStorage2D(i.TEXTURE_2D,1,je,ue.width,ue.height):t.texImage2D(i.TEXTURE_2D,0,je,ue.width,ue.height,0,Le,Ke,null));else if(b.isDataTexture)if(at.length>0){Qe&&vt&&t.texStorage2D(i.TEXTURE_2D,Re,je,at[0].width,at[0].height);for(let j=0,ie=at.length;j<ie;j++)Ne=at[j],Qe?F&&t.texSubImage2D(i.TEXTURE_2D,j,0,0,Ne.width,Ne.height,Le,Ke,Ne.data):t.texImage2D(i.TEXTURE_2D,j,je,Ne.width,Ne.height,0,Le,Ke,Ne.data);b.generateMipmaps=!1}else Qe?(vt&&t.texStorage2D(i.TEXTURE_2D,Re,je,ue.width,ue.height),F&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ue.width,ue.height,Le,Ke,ue.data)):t.texImage2D(i.TEXTURE_2D,0,je,ue.width,ue.height,0,Le,Ke,ue.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Qe&&vt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Re,je,at[0].width,at[0].height,ue.depth);for(let j=0,ie=at.length;j<ie;j++)if(Ne=at[j],b.format!==si)if(Le!==null)if(Qe){if(F)if(b.layerUpdates.size>0){const Ee=rp(Ne.width,Ne.height,b.format,b.type);for(const Pe of b.layerUpdates){const ot=Ne.data.subarray(Pe*Ee/Ne.data.BYTES_PER_ELEMENT,(Pe+1)*Ee/Ne.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,Pe,Ne.width,Ne.height,1,Le,ot,0,0)}b.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,Ne.width,Ne.height,ue.depth,Le,Ne.data,0,0)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,j,je,Ne.width,Ne.height,ue.depth,0,Ne.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Qe?F&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,Ne.width,Ne.height,ue.depth,Le,Ke,Ne.data):t.texImage3D(i.TEXTURE_2D_ARRAY,j,je,Ne.width,Ne.height,ue.depth,0,Le,Ke,Ne.data)}else{Qe&&vt&&t.texStorage2D(i.TEXTURE_2D,Re,je,at[0].width,at[0].height);for(let j=0,ie=at.length;j<ie;j++)Ne=at[j],b.format!==si?Le!==null?Qe?F&&t.compressedTexSubImage2D(i.TEXTURE_2D,j,0,0,Ne.width,Ne.height,Le,Ne.data):t.compressedTexImage2D(i.TEXTURE_2D,j,je,Ne.width,Ne.height,0,Ne.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Qe?F&&t.texSubImage2D(i.TEXTURE_2D,j,0,0,Ne.width,Ne.height,Le,Ke,Ne.data):t.texImage2D(i.TEXTURE_2D,j,je,Ne.width,Ne.height,0,Le,Ke,Ne.data)}else if(b.isDataArrayTexture)if(Qe){if(vt&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Re,je,ue.width,ue.height,ue.depth),F)if(b.layerUpdates.size>0){const j=rp(ue.width,ue.height,b.format,b.type);for(const ie of b.layerUpdates){const Ee=ue.data.subarray(ie*j/ue.data.BYTES_PER_ELEMENT,(ie+1)*j/ue.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ie,ue.width,ue.height,1,Le,Ke,Ee)}b.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ue.width,ue.height,ue.depth,Le,Ke,ue.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,je,ue.width,ue.height,ue.depth,0,Le,Ke,ue.data);else if(b.isData3DTexture)Qe?(vt&&t.texStorage3D(i.TEXTURE_3D,Re,je,ue.width,ue.height,ue.depth),F&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ue.width,ue.height,ue.depth,Le,Ke,ue.data)):t.texImage3D(i.TEXTURE_3D,0,je,ue.width,ue.height,ue.depth,0,Le,Ke,ue.data);else if(b.isFramebufferTexture){if(vt)if(Qe)t.texStorage2D(i.TEXTURE_2D,Re,je,ue.width,ue.height);else{let j=ue.width,ie=ue.height;for(let Ee=0;Ee<Re;Ee++)t.texImage2D(i.TEXTURE_2D,Ee,je,j,ie,0,Le,Ke,null),j>>=1,ie>>=1}}else if(at.length>0){if(Qe&&vt){const j=Ae(at[0]);t.texStorage2D(i.TEXTURE_2D,Re,je,j.width,j.height)}for(let j=0,ie=at.length;j<ie;j++)Ne=at[j],Qe?F&&t.texSubImage2D(i.TEXTURE_2D,j,0,0,Le,Ke,Ne):t.texImage2D(i.TEXTURE_2D,j,je,Le,Ke,Ne);b.generateMipmaps=!1}else if(Qe){if(vt){const j=Ae(ue);t.texStorage2D(i.TEXTURE_2D,Re,je,j.width,j.height)}F&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,Le,Ke,ue)}else t.texImage2D(i.TEXTURE_2D,0,je,Le,Ke,ue);p(b)&&m(Q),Be.__version=ee.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function Z(C,b,G){if(b.image.length!==6)return;const Q=De(C,b),ne=b.source;t.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+G);const ee=n.get(ne);if(ne.version!==ee.__version||Q===!0){t.activeTexture(i.TEXTURE0+G);const Be=ft.getPrimaries(ft.workingColorSpace),Me=b.colorSpace===Ji?null:ft.getPrimaries(b.colorSpace),Ce=b.colorSpace===Ji||Be===Me?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce);const st=b.isCompressedTexture||b.image[0].isCompressedTexture,ue=b.image[0]&&b.image[0].isDataTexture,Le=[];for(let ie=0;ie<6;ie++)!st&&!ue?Le[ie]=_(b.image[ie],!0,r.maxCubemapSize):Le[ie]=ue?b.image[ie].image:b.image[ie],Le[ie]=Ge(b,Le[ie]);const Ke=Le[0],je=s.convert(b.format,b.colorSpace),Ne=s.convert(b.type),at=v(b.internalFormat,je,Ne,b.colorSpace),Qe=b.isVideoTexture!==!0,vt=ee.__version===void 0||Q===!0,F=ne.dataReady;let Re=w(b,Ke);se(i.TEXTURE_CUBE_MAP,b);let j;if(st){Qe&&vt&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Re,at,Ke.width,Ke.height);for(let ie=0;ie<6;ie++){j=Le[ie].mipmaps;for(let Ee=0;Ee<j.length;Ee++){const Pe=j[Ee];b.format!==si?je!==null?Qe?F&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ee,0,0,Pe.width,Pe.height,je,Pe.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ee,at,Pe.width,Pe.height,0,Pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Qe?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ee,0,0,Pe.width,Pe.height,je,Ne,Pe.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ee,at,Pe.width,Pe.height,0,je,Ne,Pe.data)}}}else{if(j=b.mipmaps,Qe&&vt){j.length>0&&Re++;const ie=Ae(Le[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Re,at,ie.width,ie.height)}for(let ie=0;ie<6;ie++)if(ue){Qe?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,Le[ie].width,Le[ie].height,je,Ne,Le[ie].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,at,Le[ie].width,Le[ie].height,0,je,Ne,Le[ie].data);for(let Ee=0;Ee<j.length;Ee++){const ot=j[Ee].image[ie].image;Qe?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ee+1,0,0,ot.width,ot.height,je,Ne,ot.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ee+1,at,ot.width,ot.height,0,je,Ne,ot.data)}}else{Qe?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,je,Ne,Le[ie]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,at,je,Ne,Le[ie]);for(let Ee=0;Ee<j.length;Ee++){const Pe=j[Ee];Qe?F&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ee+1,0,0,je,Ne,Pe.image[ie]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ie,Ee+1,at,je,Ne,Pe.image[ie])}}}p(b)&&m(i.TEXTURE_CUBE_MAP),ee.__version=ne.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function Y(C,b,G,Q,ne,ee){const Be=s.convert(G.format,G.colorSpace),Me=s.convert(G.type),Ce=v(G.internalFormat,Be,Me,G.colorSpace);if(!n.get(b).__hasExternalTextures){const ue=Math.max(1,b.width>>ee),Le=Math.max(1,b.height>>ee);ne===i.TEXTURE_3D||ne===i.TEXTURE_2D_ARRAY?t.texImage3D(ne,ee,Ce,ue,Le,b.depth,0,Be,Me,null):t.texImage2D(ne,ee,Ce,ue,Le,0,Be,Me,null)}t.bindFramebuffer(i.FRAMEBUFFER,C),ce(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Q,ne,n.get(G).__webglTexture,0,_e(b)):(ne===i.TEXTURE_2D||ne>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Q,ne,n.get(G).__webglTexture,ee),t.bindFramebuffer(i.FRAMEBUFFER,null)}function le(C,b,G){if(i.bindRenderbuffer(i.RENDERBUFFER,C),b.depthBuffer){const Q=b.depthTexture,ne=Q&&Q.isDepthTexture?Q.type:null,ee=x(b.stencilBuffer,ne),Be=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Me=_e(b);ce(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Me,ee,b.width,b.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,Me,ee,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,ee,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Be,i.RENDERBUFFER,C)}else{const Q=b.textures;for(let ne=0;ne<Q.length;ne++){const ee=Q[ne],Be=s.convert(ee.format,ee.colorSpace),Me=s.convert(ee.type),Ce=v(ee.internalFormat,Be,Me,ee.colorSpace),st=_e(b);G&&ce(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,st,Ce,b.width,b.height):ce(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,st,Ce,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,Ce,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function oe(C,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,C),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(b.depthTexture).__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),z(b.depthTexture,0);const Q=n.get(b.depthTexture).__webglTexture,ne=_e(b);if(b.depthTexture.format===Ds)ce(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0,ne):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Q,0);else if(b.depthTexture.format===Vs)ce(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0,ne):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function ze(C){const b=n.get(C),G=C.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==C.depthTexture){const Q=C.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),Q){const ne=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,Q.removeEventListener("dispose",ne)};Q.addEventListener("dispose",ne),b.__depthDisposeCallback=ne}b.__boundDepthTexture=Q}if(C.depthTexture&&!b.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");oe(b.__webglFramebuffer,C)}else if(G){b.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[Q]),b.__webglDepthbuffer[Q]===void 0)b.__webglDepthbuffer[Q]=i.createRenderbuffer(),le(b.__webglDepthbuffer[Q],C,!1);else{const ne=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ee=b.__webglDepthbuffer[Q];i.bindRenderbuffer(i.RENDERBUFFER,ee),i.framebufferRenderbuffer(i.FRAMEBUFFER,ne,i.RENDERBUFFER,ee)}}else if(t.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),le(b.__webglDepthbuffer,C,!1);else{const Q=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ne=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ne),i.framebufferRenderbuffer(i.FRAMEBUFFER,Q,i.RENDERBUFFER,ne)}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ue(C,b,G){const Q=n.get(C);b!==void 0&&Y(Q.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&ze(C)}function Ye(C){const b=C.texture,G=n.get(C),Q=n.get(b);C.addEventListener("dispose",E);const ne=C.textures,ee=C.isWebGLCubeRenderTarget===!0,Be=ne.length>1;if(Be||(Q.__webglTexture===void 0&&(Q.__webglTexture=i.createTexture()),Q.__version=b.version,a.memory.textures++),ee){G.__webglFramebuffer=[];for(let Me=0;Me<6;Me++)if(b.mipmaps&&b.mipmaps.length>0){G.__webglFramebuffer[Me]=[];for(let Ce=0;Ce<b.mipmaps.length;Ce++)G.__webglFramebuffer[Me][Ce]=i.createFramebuffer()}else G.__webglFramebuffer[Me]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){G.__webglFramebuffer=[];for(let Me=0;Me<b.mipmaps.length;Me++)G.__webglFramebuffer[Me]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(Be)for(let Me=0,Ce=ne.length;Me<Ce;Me++){const st=n.get(ne[Me]);st.__webglTexture===void 0&&(st.__webglTexture=i.createTexture(),a.memory.textures++)}if(C.samples>0&&ce(C)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let Me=0;Me<ne.length;Me++){const Ce=ne[Me];G.__webglColorRenderbuffer[Me]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[Me]);const st=s.convert(Ce.format,Ce.colorSpace),ue=s.convert(Ce.type),Le=v(Ce.internalFormat,st,ue,Ce.colorSpace,C.isXRRenderTarget===!0),Ke=_e(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ke,Le,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Me,i.RENDERBUFFER,G.__webglColorRenderbuffer[Me])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),le(G.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ee){t.bindTexture(i.TEXTURE_CUBE_MAP,Q.__webglTexture),se(i.TEXTURE_CUBE_MAP,b);for(let Me=0;Me<6;Me++)if(b.mipmaps&&b.mipmaps.length>0)for(let Ce=0;Ce<b.mipmaps.length;Ce++)Y(G.__webglFramebuffer[Me][Ce],C,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Me,Ce);else Y(G.__webglFramebuffer[Me],C,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Me,0);p(b)&&m(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Be){for(let Me=0,Ce=ne.length;Me<Ce;Me++){const st=ne[Me],ue=n.get(st);t.bindTexture(i.TEXTURE_2D,ue.__webglTexture),se(i.TEXTURE_2D,st),Y(G.__webglFramebuffer,C,st,i.COLOR_ATTACHMENT0+Me,i.TEXTURE_2D,0),p(st)&&m(i.TEXTURE_2D)}t.unbindTexture()}else{let Me=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(Me=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Me,Q.__webglTexture),se(Me,b),b.mipmaps&&b.mipmaps.length>0)for(let Ce=0;Ce<b.mipmaps.length;Ce++)Y(G.__webglFramebuffer[Ce],C,b,i.COLOR_ATTACHMENT0,Me,Ce);else Y(G.__webglFramebuffer,C,b,i.COLOR_ATTACHMENT0,Me,0);p(b)&&m(Me),t.unbindTexture()}C.depthBuffer&&ze(C)}function it(C){const b=C.textures;for(let G=0,Q=b.length;G<Q;G++){const ne=b[G];if(p(ne)){const ee=C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,Be=n.get(ne).__webglTexture;t.bindTexture(ee,Be),m(ee),t.unbindTexture()}}}const te=[],L=[];function ye(C){if(C.samples>0){if(ce(C)===!1){const b=C.textures,G=C.width,Q=C.height;let ne=i.COLOR_BUFFER_BIT;const ee=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Be=n.get(C),Me=b.length>1;if(Me)for(let Ce=0;Ce<b.length;Ce++)t.bindFramebuffer(i.FRAMEBUFFER,Be.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ce,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Be.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ce,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Be.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Be.__webglFramebuffer);for(let Ce=0;Ce<b.length;Ce++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(ne|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(ne|=i.STENCIL_BUFFER_BIT)),Me){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Be.__webglColorRenderbuffer[Ce]);const st=n.get(b[Ce]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,st,0)}i.blitFramebuffer(0,0,G,Q,0,0,G,Q,ne,i.NEAREST),c===!0&&(te.length=0,L.length=0,te.push(i.COLOR_ATTACHMENT0+Ce),C.depthBuffer&&C.resolveDepthBuffer===!1&&(te.push(ee),L.push(ee),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,L)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,te))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Me)for(let Ce=0;Ce<b.length;Ce++){t.bindFramebuffer(i.FRAMEBUFFER,Be.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ce,i.RENDERBUFFER,Be.__webglColorRenderbuffer[Ce]);const st=n.get(b[Ce]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Be.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ce,i.TEXTURE_2D,st,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Be.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){const b=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function _e(C){return Math.min(r.maxSamples,C.samples)}function ce(C){const b=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function ve(C){const b=a.render.frame;u.get(C)!==b&&(u.set(C,b),C.update())}function Ge(C,b){const G=C.colorSpace,Q=C.format,ne=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||G!==or&&G!==Ji&&(ft.getTransfer(G)===Mt?(Q!==si||ne!==Ni)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),b}function Ae(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=N,this.resetTextureUnits=S,this.setTexture2D=z,this.setTexture2DArray=H,this.setTexture3D=O,this.setTextureCube=J,this.rebindTextures=Ue,this.setupRenderTarget=Ye,this.updateRenderTargetMipmap=it,this.updateMultisampleRenderTarget=ye,this.setupDepthRenderbuffer=ze,this.setupFrameBufferTexture=Y,this.useMultisampledRTT=ce}function eS(i,e){function t(n,r=Ji){let s;const a=ft.getTransfer(r);if(n===Ni)return i.UNSIGNED_BYTE;if(n===sd)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ad)return i.UNSIGNED_SHORT_5_5_5_1;if(n===um)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===cm)return i.BYTE;if(n===lm)return i.SHORT;if(n===Ka)return i.UNSIGNED_SHORT;if(n===rd)return i.INT;if(n===Vr)return i.UNSIGNED_INT;if(n===Ci)return i.FLOAT;if(n===io)return i.HALF_FLOAT;if(n===hm)return i.ALPHA;if(n===dm)return i.RGB;if(n===si)return i.RGBA;if(n===fm)return i.LUMINANCE;if(n===pm)return i.LUMINANCE_ALPHA;if(n===Ds)return i.DEPTH_COMPONENT;if(n===Vs)return i.DEPTH_STENCIL;if(n===mm)return i.RED;if(n===od)return i.RED_INTEGER;if(n===gm)return i.RG;if(n===cd)return i.RG_INTEGER;if(n===ld)return i.RGBA_INTEGER;if(n===wc||n===Mc||n===Sc||n===bc)if(a===Mt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===wc)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Mc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Sc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===bc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===wc)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Mc)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Sc)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===bc)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===rh||n===sh||n===ah||n===oh)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===rh)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===sh)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ah)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===oh)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ch||n===lh||n===uh)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(n===ch||n===lh)return a===Mt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===uh)return a===Mt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===hh||n===dh||n===fh||n===ph||n===mh||n===gh||n===_h||n===xh||n===yh||n===vh||n===wh||n===Mh||n===Sh||n===bh)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(n===hh)return a===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===dh)return a===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===fh)return a===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ph)return a===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===mh)return a===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===gh)return a===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===_h)return a===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===xh)return a===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===yh)return a===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===vh)return a===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===wh)return a===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Mh)return a===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Sh)return a===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===bh)return a===Mt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ec||n===Eh||n===Th)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(n===Ec)return a===Mt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Eh)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Th)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===_m||n===Ah||n===Rh||n===Ph)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(n===Ec)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Ah)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Rh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ph)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Hs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class tS extends zn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Je extends Xt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const nS={type:"move"};class ru{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Je,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Je,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Je,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const _ of e.hand.values()){const p=t.getJointPose(_,n),m=this._getHandJoint(l,_);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const u=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],f=u.position.distanceTo(d.position),h=.02,g=.005;l.inputState.pinching&&f>h+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&f<=h-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(nS)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Je;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const iS=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,rS=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class sS{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const r=new gn,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new ki({vertexShader:iS,fragmentShader:rS,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Et(new ll(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class aS extends Ys{constructor(e,t){super();const n=this;let r=null,s=1,a=null,o="local-floor",c=1,l=null,u=null,d=null,f=null,h=null,g=null;const _=new sS,p=t.getContextAttributes();let m=null,v=null;const x=[],w=[],M=new he;let E=null;const T=new zn;T.layers.enable(1),T.viewport=new xt;const A=new zn;A.layers.enable(2),A.viewport=new xt;const I=[T,A],y=new tS;y.layers.enable(1),y.layers.enable(2);let S=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let Y=x[Z];return Y===void 0&&(Y=new ru,x[Z]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(Z){let Y=x[Z];return Y===void 0&&(Y=new ru,x[Z]=Y),Y.getGripSpace()},this.getHand=function(Z){let Y=x[Z];return Y===void 0&&(Y=new ru,x[Z]=Y),Y.getHandSpace()};function k(Z){const Y=w.indexOf(Z.inputSource);if(Y===-1)return;const le=x[Y];le!==void 0&&(le.update(Z.inputSource,Z.frame,l||a),le.dispatchEvent({type:Z.type,data:Z.inputSource}))}function z(){r.removeEventListener("select",k),r.removeEventListener("selectstart",k),r.removeEventListener("selectend",k),r.removeEventListener("squeeze",k),r.removeEventListener("squeezestart",k),r.removeEventListener("squeezeend",k),r.removeEventListener("end",z),r.removeEventListener("inputsourceschange",H);for(let Z=0;Z<x.length;Z++){const Y=w[Z];Y!==null&&(w[Z]=null,x[Z].disconnect(Y))}S=null,N=null,_.reset(),e.setRenderTarget(m),h=null,f=null,d=null,r=null,v=null,Ze.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(M.width,M.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){s=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return f!==null?f:h},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Z){if(r=Z,r!==null){if(m=e.getRenderTarget(),r.addEventListener("select",k),r.addEventListener("selectstart",k),r.addEventListener("selectend",k),r.addEventListener("squeeze",k),r.addEventListener("squeezestart",k),r.addEventListener("squeezeend",k),r.addEventListener("end",z),r.addEventListener("inputsourceschange",H),p.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(M),r.renderState.layers===void 0){const Y={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:s};h=new XRWebGLLayer(r,t,Y),r.updateRenderState({baseLayer:h}),e.setPixelRatio(1),e.setSize(h.framebufferWidth,h.framebufferHeight,!1),v=new Gr(h.framebufferWidth,h.framebufferHeight,{format:si,type:Ni,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil})}else{let Y=null,le=null,oe=null;p.depth&&(oe=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Y=p.stencil?Vs:Ds,le=p.stencil?Hs:Vr);const ze={colorFormat:t.RGBA8,depthFormat:oe,scaleFactor:s};d=new XRWebGLBinding(r,t),f=d.createProjectionLayer(ze),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),v=new Gr(f.textureWidth,f.textureHeight,{format:si,type:Ni,depthTexture:new Dm(f.textureWidth,f.textureHeight,le,void 0,void 0,void 0,void 0,void 0,void 0,Y),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),Ze.setContext(r),Ze.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function H(Z){for(let Y=0;Y<Z.removed.length;Y++){const le=Z.removed[Y],oe=w.indexOf(le);oe>=0&&(w[oe]=null,x[oe].disconnect(le))}for(let Y=0;Y<Z.added.length;Y++){const le=Z.added[Y];let oe=w.indexOf(le);if(oe===-1){for(let Ue=0;Ue<x.length;Ue++)if(Ue>=w.length){w.push(le),oe=Ue;break}else if(w[Ue]===null){w[Ue]=le,oe=Ue;break}if(oe===-1)break}const ze=x[oe];ze&&ze.connect(le)}}const O=new U,J=new U;function W(Z,Y,le){O.setFromMatrixPosition(Y.matrixWorld),J.setFromMatrixPosition(le.matrixWorld);const oe=O.distanceTo(J),ze=Y.projectionMatrix.elements,Ue=le.projectionMatrix.elements,Ye=ze[14]/(ze[10]-1),it=ze[14]/(ze[10]+1),te=(ze[9]+1)/ze[5],L=(ze[9]-1)/ze[5],ye=(ze[8]-1)/ze[0],_e=(Ue[8]+1)/Ue[0],ce=Ye*ye,ve=Ye*_e,Ge=oe/(-ye+_e),Ae=Ge*-ye;if(Y.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(Ae),Z.translateZ(Ge),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),ze[10]===-1)Z.projectionMatrix.copy(Y.projectionMatrix),Z.projectionMatrixInverse.copy(Y.projectionMatrixInverse);else{const C=Ye+Ge,b=it+Ge,G=ce-Ae,Q=ve+(oe-Ae),ne=te*it/b*C,ee=L*it/b*C;Z.projectionMatrix.makePerspective(G,Q,ne,ee,C,b),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function pe(Z,Y){Y===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(Y.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(r===null)return;let Y=Z.near,le=Z.far;_.texture!==null&&(_.depthNear>0&&(Y=_.depthNear),_.depthFar>0&&(le=_.depthFar)),y.near=A.near=T.near=Y,y.far=A.far=T.far=le,(S!==y.near||N!==y.far)&&(r.updateRenderState({depthNear:y.near,depthFar:y.far}),S=y.near,N=y.far);const oe=Z.parent,ze=y.cameras;pe(y,oe);for(let Ue=0;Ue<ze.length;Ue++)pe(ze[Ue],oe);ze.length===2?W(y,T,A):y.projectionMatrix.copy(T.projectionMatrix),ge(Z,y,oe)};function ge(Z,Y,le){le===null?Z.matrix.copy(Y.matrixWorld):(Z.matrix.copy(le.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(Y.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(Y.projectionMatrix),Z.projectionMatrixInverse.copy(Y.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Lh*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(f===null&&h===null))return c},this.setFoveation=function(Z){c=Z,f!==null&&(f.fixedFoveation=Z),h!==null&&h.fixedFoveation!==void 0&&(h.fixedFoveation=Z)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let se=null;function De(Z,Y){if(u=Y.getViewerPose(l||a),g=Y,u!==null){const le=u.views;h!==null&&(e.setRenderTargetFramebuffer(v,h.framebuffer),e.setRenderTarget(v));let oe=!1;le.length!==y.cameras.length&&(y.cameras.length=0,oe=!0);for(let Ue=0;Ue<le.length;Ue++){const Ye=le[Ue];let it=null;if(h!==null)it=h.getViewport(Ye);else{const L=d.getViewSubImage(f,Ye);it=L.viewport,Ue===0&&(e.setRenderTargetTextures(v,L.colorTexture,f.ignoreDepthValues?void 0:L.depthStencilTexture),e.setRenderTarget(v))}let te=I[Ue];te===void 0&&(te=new zn,te.layers.enable(Ue),te.viewport=new xt,I[Ue]=te),te.matrix.fromArray(Ye.transform.matrix),te.matrix.decompose(te.position,te.quaternion,te.scale),te.projectionMatrix.fromArray(Ye.projectionMatrix),te.projectionMatrixInverse.copy(te.projectionMatrix).invert(),te.viewport.set(it.x,it.y,it.width,it.height),Ue===0&&(y.matrix.copy(te.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),oe===!0&&y.cameras.push(te)}const ze=r.enabledFeatures;if(ze&&ze.includes("depth-sensing")){const Ue=d.getDepthInformation(le[0]);Ue&&Ue.isValid&&Ue.texture&&_.init(e,Ue,r.renderState)}}for(let le=0;le<x.length;le++){const oe=w[le],ze=x[le];oe!==null&&ze!==void 0&&ze.update(oe,Y,l||a)}se&&se(Z,Y),Y.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Y}),g=null}const Ze=new Lm;Ze.setAnimationLoop(De),this.setAnimationLoop=function(Z){se=Z},this.dispose=function(){}}}const xr=new ci,oS=new yt;function cS(i,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,Rm(i)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function r(p,m,v,x,w){m.isMeshBasicMaterial||m.isMeshLambertMaterial?s(p,m):m.isMeshToonMaterial?(s(p,m),d(p,m)):m.isMeshPhongMaterial?(s(p,m),u(p,m)):m.isMeshStandardMaterial?(s(p,m),f(p,m),m.isMeshPhysicalMaterial&&h(p,m,w)):m.isMeshMatcapMaterial?(s(p,m),g(p,m)):m.isMeshDepthMaterial?s(p,m):m.isMeshDistanceMaterial?(s(p,m),_(p,m)):m.isMeshNormalMaterial?s(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?c(p,m,v,x):m.isSpriteMaterial?l(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function s(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===mn&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===mn&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const v=e.get(m),x=v.envMap,w=v.envMapRotation;x&&(p.envMap.value=x,xr.copy(w),xr.x*=-1,xr.y*=-1,xr.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(xr.y*=-1,xr.z*=-1),p.envMapRotation.value.setFromMatrix4(oS.makeRotationFromEuler(xr)),p.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,v,x){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*v,p.scale.value=x*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function l(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function u(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function d(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function f(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function h(p,m,v){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===mn&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=v.texture,p.transmissionSamplerSize.value.set(v.width,v.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function _(p,m){const v=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(v.matrixWorld),p.nearDistance.value=v.shadow.camera.near,p.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function lS(i,e,t,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(v,x){const w=x.program;n.uniformBlockBinding(v,w)}function l(v,x){let w=r[v.id];w===void 0&&(g(v),w=u(v),r[v.id]=w,v.addEventListener("dispose",p));const M=x.program;n.updateUBOMapping(v,M);const E=e.render.frame;s[v.id]!==E&&(f(v),s[v.id]=E)}function u(v){const x=d();v.__bindingPointIndex=x;const w=i.createBuffer(),M=v.__size,E=v.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,M,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,x,w),w}function d(){for(let v=0;v<o;v++)if(a.indexOf(v)===-1)return a.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(v){const x=r[v.id],w=v.uniforms,M=v.__cache;i.bindBuffer(i.UNIFORM_BUFFER,x);for(let E=0,T=w.length;E<T;E++){const A=Array.isArray(w[E])?w[E]:[w[E]];for(let I=0,y=A.length;I<y;I++){const S=A[I];if(h(S,E,I,M)===!0){const N=S.__offset,k=Array.isArray(S.value)?S.value:[S.value];let z=0;for(let H=0;H<k.length;H++){const O=k[H],J=_(O);typeof O=="number"||typeof O=="boolean"?(S.__data[0]=O,i.bufferSubData(i.UNIFORM_BUFFER,N+z,S.__data)):O.isMatrix3?(S.__data[0]=O.elements[0],S.__data[1]=O.elements[1],S.__data[2]=O.elements[2],S.__data[3]=0,S.__data[4]=O.elements[3],S.__data[5]=O.elements[4],S.__data[6]=O.elements[5],S.__data[7]=0,S.__data[8]=O.elements[6],S.__data[9]=O.elements[7],S.__data[10]=O.elements[8],S.__data[11]=0):(O.toArray(S.__data,z),z+=J.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,N,S.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function h(v,x,w,M){const E=v.value,T=x+"_"+w;if(M[T]===void 0)return typeof E=="number"||typeof E=="boolean"?M[T]=E:M[T]=E.clone(),!0;{const A=M[T];if(typeof E=="number"||typeof E=="boolean"){if(A!==E)return M[T]=E,!0}else if(A.equals(E)===!1)return A.copy(E),!0}return!1}function g(v){const x=v.uniforms;let w=0;const M=16;for(let T=0,A=x.length;T<A;T++){const I=Array.isArray(x[T])?x[T]:[x[T]];for(let y=0,S=I.length;y<S;y++){const N=I[y],k=Array.isArray(N.value)?N.value:[N.value];for(let z=0,H=k.length;z<H;z++){const O=k[z],J=_(O),W=w%M,pe=W%J.boundary,ge=W+pe;w+=pe,ge!==0&&M-ge<J.storage&&(w+=M-ge),N.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=w,w+=J.storage}}}const E=w%M;return E>0&&(w+=M-E),v.__size=w,v.__cache={},this}function _(v){const x={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(x.boundary=4,x.storage=4):v.isVector2?(x.boundary=8,x.storage=8):v.isVector3||v.isColor?(x.boundary=16,x.storage=12):v.isVector4?(x.boundary=16,x.storage=16):v.isMatrix3?(x.boundary=48,x.storage=48):v.isMatrix4?(x.boundary=64,x.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),x}function p(v){const x=v.target;x.removeEventListener("dispose",p);const w=a.indexOf(x.__bindingPointIndex);a.splice(w,1),i.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function m(){for(const v in r)i.deleteBuffer(r[v]);a=[],r={},s={}}return{bind:c,update:l,dispose:m}}class uS{constructor(e={}){const{canvas:t=Jx(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const h=new Uint32Array(4),g=new Int32Array(4);let _=null,p=null;const m=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ii,this.toneMapping=ir,this.toneMappingExposure=1;const x=this;let w=!1,M=0,E=0,T=null,A=-1,I=null;const y=new xt,S=new xt;let N=null;const k=new be(0);let z=0,H=t.width,O=t.height,J=1,W=null,pe=null;const ge=new xt(0,0,H,O),se=new xt(0,0,H,O);let De=!1;const Ze=new hd;let Z=!1,Y=!1;const le=new yt,oe=new yt,ze=new U,Ue=new xt,Ye={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let it=!1;function te(){return T===null?J:1}let L=n;function ye(R,B){return t.getContext(R,B)}try{const R={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${nd}`),t.addEventListener("webglcontextlost",ie,!1),t.addEventListener("webglcontextrestored",Ee,!1),t.addEventListener("webglcontextcreationerror",Pe,!1),L===null){const B="webgl2";if(L=ye(B,R),L===null)throw ye(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let _e,ce,ve,Ge,Ae,C,b,G,Q,ne,ee,Be,Me,Ce,st,ue,Le,Ke,je,Ne,at,Qe,vt,F;function Re(){_e=new mw(L),_e.init(),Qe=new eS(L,_e),ce=new lw(L,_e,e,Qe),ve=new JM(L),ce.reverseDepthBuffer&&ve.buffers.depth.setReversed(!0),Ge=new xw(L),Ae=new kM,C=new QM(L,_e,ve,Ae,ce,Qe,Ge),b=new hw(x),G=new pw(x),Q=new Ey(L),vt=new ow(L,Q),ne=new gw(L,Q,Ge,vt),ee=new vw(L,ne,Q,Ge),je=new yw(L,ce,C),ue=new uw(Ae),Be=new NM(x,b,G,_e,ce,vt,ue),Me=new cS(x,Ae),Ce=new OM,st=new WM(_e),Ke=new aw(x,b,G,ve,ee,f,c),Le=new KM(x,ee,ce),F=new lS(L,Ge,ce,ve),Ne=new cw(L,_e,Ge),at=new _w(L,_e,Ge),Ge.programs=Be.programs,x.capabilities=ce,x.extensions=_e,x.properties=Ae,x.renderLists=Ce,x.shadowMap=Le,x.state=ve,x.info=Ge}Re();const j=new aS(x,L);this.xr=j,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const R=_e.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=_e.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(R){R!==void 0&&(J=R,this.setSize(H,O,!1))},this.getSize=function(R){return R.set(H,O)},this.setSize=function(R,B,q=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}H=R,O=B,t.width=Math.floor(R*J),t.height=Math.floor(B*J),q===!0&&(t.style.width=R+"px",t.style.height=B+"px"),this.setViewport(0,0,R,B)},this.getDrawingBufferSize=function(R){return R.set(H*J,O*J).floor()},this.setDrawingBufferSize=function(R,B,q){H=R,O=B,J=q,t.width=Math.floor(R*q),t.height=Math.floor(B*q),this.setViewport(0,0,R,B)},this.getCurrentViewport=function(R){return R.copy(y)},this.getViewport=function(R){return R.copy(ge)},this.setViewport=function(R,B,q,X){R.isVector4?ge.set(R.x,R.y,R.z,R.w):ge.set(R,B,q,X),ve.viewport(y.copy(ge).multiplyScalar(J).round())},this.getScissor=function(R){return R.copy(se)},this.setScissor=function(R,B,q,X){R.isVector4?se.set(R.x,R.y,R.z,R.w):se.set(R,B,q,X),ve.scissor(S.copy(se).multiplyScalar(J).round())},this.getScissorTest=function(){return De},this.setScissorTest=function(R){ve.setScissorTest(De=R)},this.setOpaqueSort=function(R){W=R},this.setTransparentSort=function(R){pe=R},this.getClearColor=function(R){return R.copy(Ke.getClearColor())},this.setClearColor=function(){Ke.setClearColor.apply(Ke,arguments)},this.getClearAlpha=function(){return Ke.getClearAlpha()},this.setClearAlpha=function(){Ke.setClearAlpha.apply(Ke,arguments)},this.clear=function(R=!0,B=!0,q=!0){let X=0;if(R){let V=!1;if(T!==null){const de=T.texture.format;V=de===ld||de===cd||de===od}if(V){const de=T.texture.type,Te=de===Ni||de===Vr||de===Ka||de===Hs||de===sd||de===ad,Oe=Ke.getClearColor(),He=Ke.getClearAlpha(),qe=Oe.r,Xe=Oe.g,Ve=Oe.b;Te?(h[0]=qe,h[1]=Xe,h[2]=Ve,h[3]=He,L.clearBufferuiv(L.COLOR,0,h)):(g[0]=qe,g[1]=Xe,g[2]=Ve,g[3]=He,L.clearBufferiv(L.COLOR,0,g))}else X|=L.COLOR_BUFFER_BIT}B&&(X|=L.DEPTH_BUFFER_BIT,L.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),q&&(X|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ie,!1),t.removeEventListener("webglcontextrestored",Ee,!1),t.removeEventListener("webglcontextcreationerror",Pe,!1),Ce.dispose(),st.dispose(),Ae.dispose(),b.dispose(),G.dispose(),ee.dispose(),vt.dispose(),F.dispose(),Be.dispose(),j.dispose(),j.removeEventListener("sessionstart",sf),j.removeEventListener("sessionend",af),dr.stop()};function ie(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Ee(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const R=Ge.autoReset,B=Le.enabled,q=Le.autoUpdate,X=Le.needsUpdate,V=Le.type;Re(),Ge.autoReset=R,Le.enabled=B,Le.autoUpdate=q,Le.needsUpdate=X,Le.type=V}function Pe(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function ot(R){const B=R.target;B.removeEventListener("dispose",ot),zt(B)}function zt(R){yn(R),Ae.remove(R)}function yn(R){const B=Ae.get(R).programs;B!==void 0&&(B.forEach(function(q){Be.releaseProgram(q)}),R.isShaderMaterial&&Be.releaseShaderCache(R))}this.renderBufferDirect=function(R,B,q,X,V,de){B===null&&(B=Ye);const Te=V.isMesh&&V.matrixWorld.determinant()<0,Oe=ox(R,B,q,X,V);ve.setMaterial(X,Te);let He=q.index,qe=1;if(X.wireframe===!0){if(He=ne.getWireframeAttribute(q),He===void 0)return;qe=2}const Xe=q.drawRange,Ve=q.attributes.position;let pt=Xe.start*qe,wt=(Xe.start+Xe.count)*qe;de!==null&&(pt=Math.max(pt,de.start*qe),wt=Math.min(wt,(de.start+de.count)*qe)),He!==null?(pt=Math.max(pt,0),wt=Math.min(wt,He.count)):Ve!=null&&(pt=Math.max(pt,0),wt=Math.min(wt,Ve.count));const It=wt-pt;if(It<0||It===1/0)return;vt.setup(V,X,Oe,q,He);let Pn,ht=Ne;if(He!==null&&(Pn=Q.get(He),ht=at,ht.setIndex(Pn)),V.isMesh)X.wireframe===!0?(ve.setLineWidth(X.wireframeLinewidth*te()),ht.setMode(L.LINES)):ht.setMode(L.TRIANGLES);else if(V.isLine){let We=X.linewidth;We===void 0&&(We=1),ve.setLineWidth(We*te()),V.isLineSegments?ht.setMode(L.LINES):V.isLineLoop?ht.setMode(L.LINE_LOOP):ht.setMode(L.LINE_STRIP)}else V.isPoints?ht.setMode(L.POINTS):V.isSprite&&ht.setMode(L.TRIANGLES);if(V.isBatchedMesh)if(V._multiDrawInstances!==null)ht.renderMultiDrawInstances(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount,V._multiDrawInstances);else if(_e.get("WEBGL_multi_draw"))ht.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const We=V._multiDrawStarts,en=V._multiDrawCounts,dt=V._multiDrawCount,Qn=He?Q.get(He).bytesPerElement:1,Kr=Ae.get(X).currentProgram.getUniforms();for(let Cn=0;Cn<dt;Cn++)Kr.setValue(L,"_gl_DrawID",Cn),ht.render(We[Cn]/Qn,en[Cn])}else if(V.isInstancedMesh)ht.renderInstances(pt,It,V.count);else if(q.isInstancedBufferGeometry){const We=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,en=Math.min(q.instanceCount,We);ht.renderInstances(pt,It,en)}else ht.render(pt,It)};function ut(R,B,q){R.transparent===!0&&R.side===Xn&&R.forceSinglePass===!1?(R.side=mn,R.needsUpdate=!0,go(R,B,q),R.side=sr,R.needsUpdate=!0,go(R,B,q),R.side=Xn):go(R,B,q)}this.compile=function(R,B,q=null){q===null&&(q=R),p=st.get(q),p.init(B),v.push(p),q.traverseVisible(function(V){V.isLight&&V.layers.test(B.layers)&&(p.pushLight(V),V.castShadow&&p.pushShadow(V))}),R!==q&&R.traverseVisible(function(V){V.isLight&&V.layers.test(B.layers)&&(p.pushLight(V),V.castShadow&&p.pushShadow(V))}),p.setupLights();const X=new Set;return R.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const de=V.material;if(de)if(Array.isArray(de))for(let Te=0;Te<de.length;Te++){const Oe=de[Te];ut(Oe,q,V),X.add(Oe)}else ut(de,q,V),X.add(de)}),v.pop(),p=null,X},this.compileAsync=function(R,B,q=null){const X=this.compile(R,B,q);return new Promise(V=>{function de(){if(X.forEach(function(Te){Ae.get(Te).currentProgram.isReady()&&X.delete(Te)}),X.size===0){V(R);return}setTimeout(de,10)}_e.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let vn=null;function yi(R){vn&&vn(R)}function sf(){dr.stop()}function af(){dr.start()}const dr=new Lm;dr.setAnimationLoop(yi),typeof self<"u"&&dr.setContext(self),this.setAnimationLoop=function(R){vn=R,j.setAnimationLoop(R),R===null?dr.stop():dr.start()},j.addEventListener("sessionstart",sf),j.addEventListener("sessionend",af),this.render=function(R,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(B),B=j.getCamera()),R.isScene===!0&&R.onBeforeRender(x,R,B,T),p=st.get(R,v.length),p.init(B),v.push(p),oe.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Ze.setFromProjectionMatrix(oe),Y=this.localClippingEnabled,Z=ue.init(this.clippingPlanes,Y),_=Ce.get(R,m.length),_.init(),m.push(_),j.enabled===!0&&j.isPresenting===!0){const de=x.xr.getDepthSensingMesh();de!==null&&bl(de,B,-1/0,x.sortObjects)}bl(R,B,0,x.sortObjects),_.finish(),x.sortObjects===!0&&_.sort(W,pe),it=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,it&&Ke.addToRenderList(_,R),this.info.render.frame++,Z===!0&&ue.beginShadows();const q=p.state.shadowsArray;Le.render(q,R,B),Z===!0&&ue.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=_.opaque,V=_.transmissive;if(p.setupLights(),B.isArrayCamera){const de=B.cameras;if(V.length>0)for(let Te=0,Oe=de.length;Te<Oe;Te++){const He=de[Te];cf(X,V,R,He)}it&&Ke.render(R);for(let Te=0,Oe=de.length;Te<Oe;Te++){const He=de[Te];of(_,R,He,He.viewport)}}else V.length>0&&cf(X,V,R,B),it&&Ke.render(R),of(_,R,B);T!==null&&(C.updateMultisampleRenderTarget(T),C.updateRenderTargetMipmap(T)),R.isScene===!0&&R.onAfterRender(x,R,B),vt.resetDefaultState(),A=-1,I=null,v.pop(),v.length>0?(p=v[v.length-1],Z===!0&&ue.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,m.pop(),m.length>0?_=m[m.length-1]:_=null};function bl(R,B,q,X){if(R.visible===!1)return;if(R.layers.test(B.layers)){if(R.isGroup)q=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(B);else if(R.isLight)p.pushLight(R),R.castShadow&&p.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||Ze.intersectsSprite(R)){X&&Ue.setFromMatrixPosition(R.matrixWorld).applyMatrix4(oe);const Te=ee.update(R),Oe=R.material;Oe.visible&&_.push(R,Te,Oe,q,Ue.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||Ze.intersectsObject(R))){const Te=ee.update(R),Oe=R.material;if(X&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Ue.copy(R.boundingSphere.center)):(Te.boundingSphere===null&&Te.computeBoundingSphere(),Ue.copy(Te.boundingSphere.center)),Ue.applyMatrix4(R.matrixWorld).applyMatrix4(oe)),Array.isArray(Oe)){const He=Te.groups;for(let qe=0,Xe=He.length;qe<Xe;qe++){const Ve=He[qe],pt=Oe[Ve.materialIndex];pt&&pt.visible&&_.push(R,Te,pt,q,Ue.z,Ve)}}else Oe.visible&&_.push(R,Te,Oe,q,Ue.z,null)}}const de=R.children;for(let Te=0,Oe=de.length;Te<Oe;Te++)bl(de[Te],B,q,X)}function of(R,B,q,X){const V=R.opaque,de=R.transmissive,Te=R.transparent;p.setupLightsView(q),Z===!0&&ue.setGlobalState(x.clippingPlanes,q),X&&ve.viewport(y.copy(X)),V.length>0&&mo(V,B,q),de.length>0&&mo(de,B,q),Te.length>0&&mo(Te,B,q),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function cf(R,B,q,X){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[X.id]===void 0&&(p.state.transmissionRenderTarget[X.id]=new Gr(1,1,{generateMipmaps:!0,type:_e.has("EXT_color_buffer_half_float")||_e.has("EXT_color_buffer_float")?io:Ni,minFilter:Dr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ft.workingColorSpace}));const de=p.state.transmissionRenderTarget[X.id],Te=X.viewport||y;de.setSize(Te.z,Te.w);const Oe=x.getRenderTarget();x.setRenderTarget(de),x.getClearColor(k),z=x.getClearAlpha(),z<1&&x.setClearColor(16777215,.5),x.clear(),it&&Ke.render(q);const He=x.toneMapping;x.toneMapping=ir;const qe=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),p.setupLightsView(X),Z===!0&&ue.setGlobalState(x.clippingPlanes,X),mo(R,q,X),C.updateMultisampleRenderTarget(de),C.updateRenderTargetMipmap(de),_e.has("WEBGL_multisampled_render_to_texture")===!1){let Xe=!1;for(let Ve=0,pt=B.length;Ve<pt;Ve++){const wt=B[Ve],It=wt.object,Pn=wt.geometry,ht=wt.material,We=wt.group;if(ht.side===Xn&&It.layers.test(X.layers)){const en=ht.side;ht.side=mn,ht.needsUpdate=!0,lf(It,q,X,Pn,ht,We),ht.side=en,ht.needsUpdate=!0,Xe=!0}}Xe===!0&&(C.updateMultisampleRenderTarget(de),C.updateRenderTargetMipmap(de))}x.setRenderTarget(Oe),x.setClearColor(k,z),qe!==void 0&&(X.viewport=qe),x.toneMapping=He}function mo(R,B,q){const X=B.isScene===!0?B.overrideMaterial:null;for(let V=0,de=R.length;V<de;V++){const Te=R[V],Oe=Te.object,He=Te.geometry,qe=X===null?Te.material:X,Xe=Te.group;Oe.layers.test(q.layers)&&lf(Oe,B,q,He,qe,Xe)}}function lf(R,B,q,X,V,de){R.onBeforeRender(x,B,q,X,V,de),R.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),V.onBeforeRender(x,B,q,X,R,de),V.transparent===!0&&V.side===Xn&&V.forceSinglePass===!1?(V.side=mn,V.needsUpdate=!0,x.renderBufferDirect(q,B,X,V,R,de),V.side=sr,V.needsUpdate=!0,x.renderBufferDirect(q,B,X,V,R,de),V.side=Xn):x.renderBufferDirect(q,B,X,V,R,de),R.onAfterRender(x,B,q,X,V,de)}function go(R,B,q){B.isScene!==!0&&(B=Ye);const X=Ae.get(R),V=p.state.lights,de=p.state.shadowsArray,Te=V.state.version,Oe=Be.getParameters(R,V.state,de,B,q),He=Be.getProgramCacheKey(Oe);let qe=X.programs;X.environment=R.isMeshStandardMaterial?B.environment:null,X.fog=B.fog,X.envMap=(R.isMeshStandardMaterial?G:b).get(R.envMap||X.environment),X.envMapRotation=X.environment!==null&&R.envMap===null?B.environmentRotation:R.envMapRotation,qe===void 0&&(R.addEventListener("dispose",ot),qe=new Map,X.programs=qe);let Xe=qe.get(He);if(Xe!==void 0){if(X.currentProgram===Xe&&X.lightsStateVersion===Te)return hf(R,Oe),Xe}else Oe.uniforms=Be.getUniforms(R),R.onBeforeCompile(Oe,x),Xe=Be.acquireProgram(Oe,He),qe.set(He,Xe),X.uniforms=Oe.uniforms;const Ve=X.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Ve.clippingPlanes=ue.uniform),hf(R,Oe),X.needsLights=lx(R),X.lightsStateVersion=Te,X.needsLights&&(Ve.ambientLightColor.value=V.state.ambient,Ve.lightProbe.value=V.state.probe,Ve.directionalLights.value=V.state.directional,Ve.directionalLightShadows.value=V.state.directionalShadow,Ve.spotLights.value=V.state.spot,Ve.spotLightShadows.value=V.state.spotShadow,Ve.rectAreaLights.value=V.state.rectArea,Ve.ltc_1.value=V.state.rectAreaLTC1,Ve.ltc_2.value=V.state.rectAreaLTC2,Ve.pointLights.value=V.state.point,Ve.pointLightShadows.value=V.state.pointShadow,Ve.hemisphereLights.value=V.state.hemi,Ve.directionalShadowMap.value=V.state.directionalShadowMap,Ve.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Ve.spotShadowMap.value=V.state.spotShadowMap,Ve.spotLightMatrix.value=V.state.spotLightMatrix,Ve.spotLightMap.value=V.state.spotLightMap,Ve.pointShadowMap.value=V.state.pointShadowMap,Ve.pointShadowMatrix.value=V.state.pointShadowMatrix),X.currentProgram=Xe,X.uniformsList=null,Xe}function uf(R){if(R.uniformsList===null){const B=R.currentProgram.getUniforms();R.uniformsList=Ac.seqWithValue(B.seq,R.uniforms)}return R.uniformsList}function hf(R,B){const q=Ae.get(R);q.outputColorSpace=B.outputColorSpace,q.batching=B.batching,q.batchingColor=B.batchingColor,q.instancing=B.instancing,q.instancingColor=B.instancingColor,q.instancingMorph=B.instancingMorph,q.skinning=B.skinning,q.morphTargets=B.morphTargets,q.morphNormals=B.morphNormals,q.morphColors=B.morphColors,q.morphTargetsCount=B.morphTargetsCount,q.numClippingPlanes=B.numClippingPlanes,q.numIntersection=B.numClipIntersection,q.vertexAlphas=B.vertexAlphas,q.vertexTangents=B.vertexTangents,q.toneMapping=B.toneMapping}function ox(R,B,q,X,V){B.isScene!==!0&&(B=Ye),C.resetTextureUnits();const de=B.fog,Te=X.isMeshStandardMaterial?B.environment:null,Oe=T===null?x.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:or,He=(X.isMeshStandardMaterial?G:b).get(X.envMap||Te),qe=X.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Xe=!!q.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ve=!!q.morphAttributes.position,pt=!!q.morphAttributes.normal,wt=!!q.morphAttributes.color;let It=ir;X.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(It=x.toneMapping);const Pn=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,ht=Pn!==void 0?Pn.length:0,We=Ae.get(X),en=p.state.lights;if(Z===!0&&(Y===!0||R!==I)){const Bn=R===I&&X.id===A;ue.setState(X,R,Bn)}let dt=!1;X.version===We.__version?(We.needsLights&&We.lightsStateVersion!==en.state.version||We.outputColorSpace!==Oe||V.isBatchedMesh&&We.batching===!1||!V.isBatchedMesh&&We.batching===!0||V.isBatchedMesh&&We.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&We.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&We.instancing===!1||!V.isInstancedMesh&&We.instancing===!0||V.isSkinnedMesh&&We.skinning===!1||!V.isSkinnedMesh&&We.skinning===!0||V.isInstancedMesh&&We.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&We.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&We.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&We.instancingMorph===!1&&V.morphTexture!==null||We.envMap!==He||X.fog===!0&&We.fog!==de||We.numClippingPlanes!==void 0&&(We.numClippingPlanes!==ue.numPlanes||We.numIntersection!==ue.numIntersection)||We.vertexAlphas!==qe||We.vertexTangents!==Xe||We.morphTargets!==Ve||We.morphNormals!==pt||We.morphColors!==wt||We.toneMapping!==It||We.morphTargetsCount!==ht)&&(dt=!0):(dt=!0,We.__version=X.version);let Qn=We.currentProgram;dt===!0&&(Qn=go(X,B,V));let Kr=!1,Cn=!1,El=!1;const kt=Qn.getUniforms(),Oi=We.uniforms;if(ve.useProgram(Qn.program)&&(Kr=!0,Cn=!0,El=!0),X.id!==A&&(A=X.id,Cn=!0),Kr||I!==R){ce.reverseDepthBuffer?(le.copy(R.projectionMatrix),Qx(le),ey(le),kt.setValue(L,"projectionMatrix",le)):kt.setValue(L,"projectionMatrix",R.projectionMatrix),kt.setValue(L,"viewMatrix",R.matrixWorldInverse);const Bn=kt.map.cameraPosition;Bn!==void 0&&Bn.setValue(L,ze.setFromMatrixPosition(R.matrixWorld)),ce.logarithmicDepthBuffer&&kt.setValue(L,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&kt.setValue(L,"isOrthographic",R.isOrthographicCamera===!0),I!==R&&(I=R,Cn=!0,El=!0)}if(V.isSkinnedMesh){kt.setOptional(L,V,"bindMatrix"),kt.setOptional(L,V,"bindMatrixInverse");const Bn=V.skeleton;Bn&&(Bn.boneTexture===null&&Bn.computeBoneTexture(),kt.setValue(L,"boneTexture",Bn.boneTexture,C))}V.isBatchedMesh&&(kt.setOptional(L,V,"batchingTexture"),kt.setValue(L,"batchingTexture",V._matricesTexture,C),kt.setOptional(L,V,"batchingIdTexture"),kt.setValue(L,"batchingIdTexture",V._indirectTexture,C),kt.setOptional(L,V,"batchingColorTexture"),V._colorsTexture!==null&&kt.setValue(L,"batchingColorTexture",V._colorsTexture,C));const Tl=q.morphAttributes;if((Tl.position!==void 0||Tl.normal!==void 0||Tl.color!==void 0)&&je.update(V,q,Qn),(Cn||We.receiveShadow!==V.receiveShadow)&&(We.receiveShadow=V.receiveShadow,kt.setValue(L,"receiveShadow",V.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(Oi.envMap.value=He,Oi.flipEnvMap.value=He.isCubeTexture&&He.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&B.environment!==null&&(Oi.envMapIntensity.value=B.environmentIntensity),Cn&&(kt.setValue(L,"toneMappingExposure",x.toneMappingExposure),We.needsLights&&cx(Oi,El),de&&X.fog===!0&&Me.refreshFogUniforms(Oi,de),Me.refreshMaterialUniforms(Oi,X,J,O,p.state.transmissionRenderTarget[R.id]),Ac.upload(L,uf(We),Oi,C)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Ac.upload(L,uf(We),Oi,C),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&kt.setValue(L,"center",V.center),kt.setValue(L,"modelViewMatrix",V.modelViewMatrix),kt.setValue(L,"normalMatrix",V.normalMatrix),kt.setValue(L,"modelMatrix",V.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const Bn=X.uniformsGroups;for(let Al=0,ux=Bn.length;Al<ux;Al++){const df=Bn[Al];F.update(df,Qn),F.bind(df,Qn)}}return Qn}function cx(R,B){R.ambientLightColor.needsUpdate=B,R.lightProbe.needsUpdate=B,R.directionalLights.needsUpdate=B,R.directionalLightShadows.needsUpdate=B,R.pointLights.needsUpdate=B,R.pointLightShadows.needsUpdate=B,R.spotLights.needsUpdate=B,R.spotLightShadows.needsUpdate=B,R.rectAreaLights.needsUpdate=B,R.hemisphereLights.needsUpdate=B}function lx(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return M},this.getActiveMipmapLevel=function(){return E},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(R,B,q){Ae.get(R.texture).__webglTexture=B,Ae.get(R.depthTexture).__webglTexture=q;const X=Ae.get(R);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=q===void 0,X.__autoAllocateDepthBuffer||_e.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(R,B){const q=Ae.get(R);q.__webglFramebuffer=B,q.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(R,B=0,q=0){T=R,M=B,E=q;let X=!0,V=null,de=!1,Te=!1;if(R){const He=Ae.get(R);if(He.__useDefaultFramebuffer!==void 0)ve.bindFramebuffer(L.FRAMEBUFFER,null),X=!1;else if(He.__webglFramebuffer===void 0)C.setupRenderTarget(R);else if(He.__hasExternalTextures)C.rebindTextures(R,Ae.get(R.texture).__webglTexture,Ae.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const Ve=R.depthTexture;if(He.__boundDepthTexture!==Ve){if(Ve!==null&&Ae.has(Ve)&&(R.width!==Ve.image.width||R.height!==Ve.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(R)}}const qe=R.texture;(qe.isData3DTexture||qe.isDataArrayTexture||qe.isCompressedArrayTexture)&&(Te=!0);const Xe=Ae.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(Xe[B])?V=Xe[B][q]:V=Xe[B],de=!0):R.samples>0&&C.useMultisampledRTT(R)===!1?V=Ae.get(R).__webglMultisampledFramebuffer:Array.isArray(Xe)?V=Xe[q]:V=Xe,y.copy(R.viewport),S.copy(R.scissor),N=R.scissorTest}else y.copy(ge).multiplyScalar(J).floor(),S.copy(se).multiplyScalar(J).floor(),N=De;if(ve.bindFramebuffer(L.FRAMEBUFFER,V)&&X&&ve.drawBuffers(R,V),ve.viewport(y),ve.scissor(S),ve.setScissorTest(N),de){const He=Ae.get(R.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+B,He.__webglTexture,q)}else if(Te){const He=Ae.get(R.texture),qe=B||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,He.__webglTexture,q||0,qe)}A=-1},this.readRenderTargetPixels=function(R,B,q,X,V,de,Te){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Oe=Ae.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Te!==void 0&&(Oe=Oe[Te]),Oe){ve.bindFramebuffer(L.FRAMEBUFFER,Oe);try{const He=R.texture,qe=He.format,Xe=He.type;if(!ce.textureFormatReadable(qe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ce.textureTypeReadable(Xe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=R.width-X&&q>=0&&q<=R.height-V&&L.readPixels(B,q,X,V,Qe.convert(qe),Qe.convert(Xe),de)}finally{const He=T!==null?Ae.get(T).__webglFramebuffer:null;ve.bindFramebuffer(L.FRAMEBUFFER,He)}}},this.readRenderTargetPixelsAsync=async function(R,B,q,X,V,de,Te){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Oe=Ae.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Te!==void 0&&(Oe=Oe[Te]),Oe){const He=R.texture,qe=He.format,Xe=He.type;if(!ce.textureFormatReadable(qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ce.textureTypeReadable(Xe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(B>=0&&B<=R.width-X&&q>=0&&q<=R.height-V){ve.bindFramebuffer(L.FRAMEBUFFER,Oe);const Ve=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Ve),L.bufferData(L.PIXEL_PACK_BUFFER,de.byteLength,L.STREAM_READ),L.readPixels(B,q,X,V,Qe.convert(qe),Qe.convert(Xe),0);const pt=T!==null?Ae.get(T).__webglFramebuffer:null;ve.bindFramebuffer(L.FRAMEBUFFER,pt);const wt=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Zx(L,wt,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Ve),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,de),L.deleteBuffer(Ve),L.deleteSync(wt),de}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(R,B=null,q=0){R.isTexture!==!0&&(Tc("WebGLRenderer: copyFramebufferToTexture function signature has changed."),B=arguments[0]||null,R=arguments[1]);const X=Math.pow(2,-q),V=Math.floor(R.image.width*X),de=Math.floor(R.image.height*X),Te=B!==null?B.x:0,Oe=B!==null?B.y:0;C.setTexture2D(R,0),L.copyTexSubImage2D(L.TEXTURE_2D,q,0,0,Te,Oe,V,de),ve.unbindTexture()},this.copyTextureToTexture=function(R,B,q=null,X=null,V=0){R.isTexture!==!0&&(Tc("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,R=arguments[1],B=arguments[2],V=arguments[3]||0,q=null);let de,Te,Oe,He,qe,Xe;q!==null?(de=q.max.x-q.min.x,Te=q.max.y-q.min.y,Oe=q.min.x,He=q.min.y):(de=R.image.width,Te=R.image.height,Oe=0,He=0),X!==null?(qe=X.x,Xe=X.y):(qe=0,Xe=0);const Ve=Qe.convert(B.format),pt=Qe.convert(B.type);C.setTexture2D(B,0),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,B.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,B.unpackAlignment);const wt=L.getParameter(L.UNPACK_ROW_LENGTH),It=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Pn=L.getParameter(L.UNPACK_SKIP_PIXELS),ht=L.getParameter(L.UNPACK_SKIP_ROWS),We=L.getParameter(L.UNPACK_SKIP_IMAGES),en=R.isCompressedTexture?R.mipmaps[V]:R.image;L.pixelStorei(L.UNPACK_ROW_LENGTH,en.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,en.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Oe),L.pixelStorei(L.UNPACK_SKIP_ROWS,He),R.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,V,qe,Xe,de,Te,Ve,pt,en.data):R.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,V,qe,Xe,en.width,en.height,Ve,en.data):L.texSubImage2D(L.TEXTURE_2D,V,qe,Xe,de,Te,Ve,pt,en),L.pixelStorei(L.UNPACK_ROW_LENGTH,wt),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,It),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Pn),L.pixelStorei(L.UNPACK_SKIP_ROWS,ht),L.pixelStorei(L.UNPACK_SKIP_IMAGES,We),V===0&&B.generateMipmaps&&L.generateMipmap(L.TEXTURE_2D),ve.unbindTexture()},this.copyTextureToTexture3D=function(R,B,q=null,X=null,V=0){R.isTexture!==!0&&(Tc("WebGLRenderer: copyTextureToTexture3D function signature has changed."),q=arguments[0]||null,X=arguments[1]||null,R=arguments[2],B=arguments[3],V=arguments[4]||0);let de,Te,Oe,He,qe,Xe,Ve,pt,wt;const It=R.isCompressedTexture?R.mipmaps[V]:R.image;q!==null?(de=q.max.x-q.min.x,Te=q.max.y-q.min.y,Oe=q.max.z-q.min.z,He=q.min.x,qe=q.min.y,Xe=q.min.z):(de=It.width,Te=It.height,Oe=It.depth,He=0,qe=0,Xe=0),X!==null?(Ve=X.x,pt=X.y,wt=X.z):(Ve=0,pt=0,wt=0);const Pn=Qe.convert(B.format),ht=Qe.convert(B.type);let We;if(B.isData3DTexture)C.setTexture3D(B,0),We=L.TEXTURE_3D;else if(B.isDataArrayTexture||B.isCompressedArrayTexture)C.setTexture2DArray(B,0),We=L.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,B.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,B.unpackAlignment);const en=L.getParameter(L.UNPACK_ROW_LENGTH),dt=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Qn=L.getParameter(L.UNPACK_SKIP_PIXELS),Kr=L.getParameter(L.UNPACK_SKIP_ROWS),Cn=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,It.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,It.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,He),L.pixelStorei(L.UNPACK_SKIP_ROWS,qe),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Xe),R.isDataTexture||R.isData3DTexture?L.texSubImage3D(We,V,Ve,pt,wt,de,Te,Oe,Pn,ht,It.data):B.isCompressedArrayTexture?L.compressedTexSubImage3D(We,V,Ve,pt,wt,de,Te,Oe,Pn,It.data):L.texSubImage3D(We,V,Ve,pt,wt,de,Te,Oe,Pn,ht,It),L.pixelStorei(L.UNPACK_ROW_LENGTH,en),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,dt),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Qn),L.pixelStorei(L.UNPACK_SKIP_ROWS,Kr),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Cn),V===0&&B.generateMipmaps&&L.generateMipmap(We),ve.unbindTexture()},this.initRenderTarget=function(R){Ae.get(R).__webglFramebuffer===void 0&&C.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?C.setTextureCube(R,0):R.isData3DTexture?C.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?C.setTexture2DArray(R,0):C.setTexture2D(R,0),ve.unbindTexture()},this.resetState=function(){M=0,E=0,T=null,ve.reset(),vt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Li}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===ud?"display-p3":"srgb",t.unpackColorSpace=ft.workingColorSpace===ol?"display-p3":"srgb"}}class fd{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new be(e),this.near=t,this.far=n}clone(){return new fd(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class hS extends Xt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ci,this.environmentIntensity=1,this.environmentRotation=new ci,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class dS{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ch,this.updateRanges=[],this.version=0,this.uuid=Di()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Di()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Di()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const fn=new U;class Vc{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)fn.fromBufferAttribute(this,t),fn.applyMatrix4(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)fn.fromBufferAttribute(this,t),fn.applyNormalMatrix(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)fn.fromBufferAttribute(this,t),fn.transformDirection(e),this.setXYZ(t,fn.x,fn.y,fn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=gi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=_t(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=_t(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=_t(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=_t(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=_t(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=gi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=gi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=gi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=gi(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=_t(t,this.array),n=_t(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=_t(t,this.array),n=_t(n,this.array),r=_t(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=_t(t,this.array),n=_t(n,this.array),r=_t(r,this.array),s=_t(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new lt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Vc(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class pd extends Yr{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new be(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let us;const na=new U,hs=new U,ds=new U,fs=new he,ia=new he,Om=new yt,Oo=new U,ra=new U,Fo=new U,sp=new he,su=new he,ap=new he;class Fm extends Xt{constructor(e=new pd){if(super(),this.isSprite=!0,this.type="Sprite",us===void 0){us=new Lt;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new dS(t,5);us.setIndex([0,1,2,0,2,3]),us.setAttribute("position",new Vc(n,3,0,!1)),us.setAttribute("uv",new Vc(n,2,3,!1))}this.geometry=us,this.material=e,this.center=new he(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),hs.setFromMatrixScale(this.matrixWorld),Om.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),ds.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&hs.multiplyScalar(-ds.z);const n=this.material.rotation;let r,s;n!==0&&(s=Math.cos(n),r=Math.sin(n));const a=this.center;Bo(Oo.set(-.5,-.5,0),ds,a,hs,r,s),Bo(ra.set(.5,-.5,0),ds,a,hs,r,s),Bo(Fo.set(.5,.5,0),ds,a,hs,r,s),sp.set(0,0),su.set(1,0),ap.set(1,1);let o=e.ray.intersectTriangle(Oo,ra,Fo,!1,na);if(o===null&&(Bo(ra.set(-.5,.5,0),ds,a,hs,r,s),su.set(0,1),o=e.ray.intersectTriangle(Oo,Fo,ra,!1,na),o===null))return;const c=e.ray.origin.distanceTo(na);c<e.near||c>e.far||t.push({distance:c,point:na.clone(),uv:Yn.getInterpolation(na,Oo,ra,Fo,sp,su,ap,new he),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Bo(i,e,t,n,r,s){fs.subVectors(i,t).addScalar(.5).multiply(n),r!==void 0?(ia.x=s*fs.x-r*fs.y,ia.y=r*fs.x+s*fs.y):ia.copy(fs),i.copy(e),i.x+=ia.x,i.y+=ia.y,i.applyMatrix4(Om)}class md extends Yr{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new be(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const op=new yt,Dh=new Sm,Ho=new cl,Vo=new U;class gd extends Xt{constructor(e=new Lt,t=new md){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ho.copy(n.boundingSphere),Ho.applyMatrix4(r),Ho.radius+=s,e.ray.intersectsSphere(Ho)===!1)return;op.copy(r).invert(),Dh.copy(e.ray).applyMatrix4(op);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=n.index,d=n.attributes.position;if(l!==null){const f=Math.max(0,a.start),h=Math.min(l.count,a.start+a.count);for(let g=f,_=h;g<_;g++){const p=l.getX(g);Vo.fromBufferAttribute(d,p),cp(Vo,p,c,r,e,t,this)}}else{const f=Math.max(0,a.start),h=Math.min(d.count,a.start+a.count);for(let g=f,_=h;g<_;g++)Vo.fromBufferAttribute(d,g),cp(Vo,g,c,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const r=t[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function cp(i,e,t,n,r,s,a){const o=Dh.distanceSqToPoint(i);if(o<t){const c=new U;Dh.closestPointToPoint(i,c),c.applyMatrix4(n);const l=r.ray.origin.distanceTo(c);if(l<r.near||l>r.far)return;s.push({distance:l,distanceToRay:Math.sqrt(o),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class fS extends gn{constructor(e,t,n,r,s,a,o,c,l){super(e,t,n,r,s,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class xi{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,r=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),s+=n.distanceTo(r),t.push(s),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let r=0;const s=n.length;let a;t?a=t:a=e*n[s-1];let o=0,c=s-1,l;for(;o<=c;)if(r=Math.floor(o+(c-o)/2),l=n[r]-a,l<0)o=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,n[r]===a)return r/(s-1);const u=n[r],f=n[r+1]-u,h=(a-u)/f;return(r+h)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const a=this.getPoint(r),o=this.getPoint(s),c=t||(a.isVector2?new he:new U);return c.copy(o).sub(a).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new U,r=[],s=[],a=[],o=new U,c=new yt;for(let h=0;h<=e;h++){const g=h/e;r[h]=this.getTangentAt(g,new U)}s[0]=new U,a[0]=new U;let l=Number.MAX_VALUE;const u=Math.abs(r[0].x),d=Math.abs(r[0].y),f=Math.abs(r[0].z);u<=l&&(l=u,n.set(1,0,0)),d<=l&&(l=d,n.set(0,1,0)),f<=l&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let h=1;h<=e;h++){if(s[h]=s[h-1].clone(),a[h]=a[h-1].clone(),o.crossVectors(r[h-1],r[h]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(un(r[h-1].dot(r[h]),-1,1));s[h].applyMatrix4(c.makeRotationAxis(o,g))}a[h].crossVectors(r[h],s[h])}if(t===!0){let h=Math.acos(un(s[0].dot(s[e]),-1,1));h/=e,r[0].dot(o.crossVectors(s[0],s[e]))>0&&(h=-h);for(let g=1;g<=e;g++)s[g].applyMatrix4(c.makeRotationAxis(r[g],h*g)),a[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class _d extends xi{constructor(e=0,t=0,n=1,r=1,s=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(e,t=new he){const n=t,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(a?s=0:s=r),this.aClockwise===!0&&!a&&(s===r?s=-r:s=s-r);const o=this.aStartAngle+e*s;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),d=Math.sin(this.aRotation),f=c-this.aX,h=l-this.aY;c=f*u-h*d+this.aX,l=f*d+h*u+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class pS extends _d{constructor(e,t,n,r,s,a){super(e,t,n,n,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function xd(){let i=0,e=0,t=0,n=0;function r(s,a,o,c){i=s,e=o,t=-3*s+3*a-2*o-c,n=2*s-2*a+o+c}return{initCatmullRom:function(s,a,o,c,l){r(a,o,l*(o-s),l*(c-a))},initNonuniformCatmullRom:function(s,a,o,c,l,u,d){let f=(a-s)/l-(o-s)/(l+u)+(o-a)/u,h=(o-a)/u-(c-a)/(u+d)+(c-o)/d;f*=u,h*=u,r(a,o,f,h)},calc:function(s){const a=s*s,o=a*s;return i+e*s+t*a+n*o}}}const Go=new U,au=new xd,ou=new xd,cu=new xd;class mS extends xi{constructor(e=[],t=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new U){const n=t,r=this.points,s=r.length,a=(s-(this.closed?0:1))*e;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:c===0&&o===s-1&&(o=s-2,c=1);let l,u;this.closed||o>0?l=r[(o-1)%s]:(Go.subVectors(r[0],r[1]).add(r[0]),l=Go);const d=r[o%s],f=r[(o+1)%s];if(this.closed||o+2<s?u=r[(o+2)%s]:(Go.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=Go),this.curveType==="centripetal"||this.curveType==="chordal"){const h=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(d),h),_=Math.pow(d.distanceToSquared(f),h),p=Math.pow(f.distanceToSquared(u),h);_<1e-4&&(_=1),g<1e-4&&(g=_),p<1e-4&&(p=_),au.initNonuniformCatmullRom(l.x,d.x,f.x,u.x,g,_,p),ou.initNonuniformCatmullRom(l.y,d.y,f.y,u.y,g,_,p),cu.initNonuniformCatmullRom(l.z,d.z,f.z,u.z,g,_,p)}else this.curveType==="catmullrom"&&(au.initCatmullRom(l.x,d.x,f.x,u.x,this.tension),ou.initCatmullRom(l.y,d.y,f.y,u.y,this.tension),cu.initCatmullRom(l.z,d.z,f.z,u.z,this.tension));return n.set(au.calc(c),ou.calc(c),cu.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(new U().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function lp(i,e,t,n,r){const s=(n-e)*.5,a=(r-t)*.5,o=i*i,c=i*o;return(2*t-2*n+s+a)*c+(-3*t+3*n-2*s-a)*o+s*i+t}function gS(i,e){const t=1-i;return t*t*e}function _S(i,e){return 2*(1-i)*i*e}function xS(i,e){return i*i*e}function Oa(i,e,t,n){return gS(i,e)+_S(i,t)+xS(i,n)}function yS(i,e){const t=1-i;return t*t*t*e}function vS(i,e){const t=1-i;return 3*t*t*i*e}function wS(i,e){return 3*(1-i)*i*i*e}function MS(i,e){return i*i*i*e}function Fa(i,e,t,n,r){return yS(i,e)+vS(i,t)+wS(i,n)+MS(i,r)}class Bm extends xi{constructor(e=new he,t=new he,n=new he,r=new he){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new he){const n=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Fa(e,r.x,s.x,a.x,o.x),Fa(e,r.y,s.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class SS extends xi{constructor(e=new U,t=new U,n=new U,r=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new U){const n=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Fa(e,r.x,s.x,a.x,o.x),Fa(e,r.y,s.y,a.y,o.y),Fa(e,r.z,s.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Hm extends xi{constructor(e=new he,t=new he){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new he){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new he){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class bS extends xi{constructor(e=new U,t=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new U){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new U){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Vm extends xi{constructor(e=new he,t=new he,n=new he){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new he){const n=t,r=this.v0,s=this.v1,a=this.v2;return n.set(Oa(e,r.x,s.x,a.x),Oa(e,r.y,s.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ES extends xi{constructor(e=new U,t=new U,n=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new U){const n=t,r=this.v0,s=this.v1,a=this.v2;return n.set(Oa(e,r.x,s.x,a.x),Oa(e,r.y,s.y,a.y),Oa(e,r.z,s.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Gm extends xi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new he){const n=t,r=this.points,s=(r.length-1)*e,a=Math.floor(s),o=s-a,c=r[a===0?a:a-1],l=r[a],u=r[a>r.length-2?r.length-1:a+1],d=r[a>r.length-3?r.length-1:a+2];return n.set(lp(o,c.x,l.x,u.x,d.x),lp(o,c.y,l.y,u.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const r=e.points[t];this.points.push(new he().fromArray(r))}return this}}var Uh=Object.freeze({__proto__:null,ArcCurve:pS,CatmullRomCurve3:mS,CubicBezierCurve:Bm,CubicBezierCurve3:SS,EllipseCurve:_d,LineCurve:Hm,LineCurve3:bS,QuadraticBezierCurve:Vm,QuadraticBezierCurve3:ES,SplineCurve:Gm});class TS extends xi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Uh[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=n){const a=r[s]-n,o=this.curves[s],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let r=0,s=this.curves;r<s.length;r++){const a=s[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,c=a.getPoints(o);for(let l=0;l<c.length;l++){const u=c[l];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const r=e.curves[t];this.curves.push(new Uh[r.type]().fromJSON(r))}return this}}class up extends TS{constructor(e){super(),this.type="Path",this.currentPoint=new he,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new Hm(this.currentPoint.clone(),new he(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){const s=new Vm(this.currentPoint.clone(),new he(e,t),new he(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,s,a){const o=new Bm(this.currentPoint.clone(),new he(e,t),new he(n,r),new he(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new Gm(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,s,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+o,t+c,n,r,s,a),this}absarc(e,t,n,r,s,a){return this.absellipse(e,t,n,n,r,s,a),this}ellipse(e,t,n,r,s,a,o,c){const l=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+l,t+u,n,r,s,a,o,c),this}absellipse(e,t,n,r,s,a,o,c){const l=new _d(e,t,n,r,s,a,o,c);if(this.curves.length>0){const d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);const u=l.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class On extends Lt{constructor(e=1,t=1,n=1,r=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const u=[],d=[],f=[],h=[];let g=0;const _=[],p=n/2;let m=0;v(),a===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(u),this.setAttribute("position",new Tt(d,3)),this.setAttribute("normal",new Tt(f,3)),this.setAttribute("uv",new Tt(h,2));function v(){const w=new U,M=new U;let E=0;const T=(t-e)/n;for(let A=0;A<=s;A++){const I=[],y=A/s,S=y*(t-e)+e;for(let N=0;N<=r;N++){const k=N/r,z=k*c+o,H=Math.sin(z),O=Math.cos(z);M.x=S*H,M.y=-y*n+p,M.z=S*O,d.push(M.x,M.y,M.z),w.set(H,T,O).normalize(),f.push(w.x,w.y,w.z),h.push(k,1-y),I.push(g++)}_.push(I)}for(let A=0;A<r;A++)for(let I=0;I<s;I++){const y=_[I][A],S=_[I+1][A],N=_[I+1][A+1],k=_[I][A+1];e>0&&(u.push(y,S,k),E+=3),t>0&&(u.push(S,N,k),E+=3)}l.addGroup(m,E,0),m+=E}function x(w){const M=g,E=new he,T=new U;let A=0;const I=w===!0?e:t,y=w===!0?1:-1;for(let N=1;N<=r;N++)d.push(0,p*y,0),f.push(0,y,0),h.push(.5,.5),g++;const S=g;for(let N=0;N<=r;N++){const z=N/r*c+o,H=Math.cos(z),O=Math.sin(z);T.x=I*O,T.y=p*y,T.z=I*H,d.push(T.x,T.y,T.z),f.push(0,y,0),E.x=H*.5+.5,E.y=O*.5*y+.5,h.push(E.x,E.y),g++}for(let N=0;N<r;N++){const k=M+N,z=S+N;w===!0?u.push(z,z+1,k):u.push(z+1,z,k),A+=3}l.addGroup(m,A,w===!0?1:2),m+=A}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new On(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Zn extends On{constructor(e=1,t=1,n=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Zn(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class yd extends Lt{constructor(e=[],t=[],n=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:r};const s=[],a=[];o(r),l(n),u(),this.setAttribute("position",new Tt(s,3)),this.setAttribute("normal",new Tt(s.slice(),3)),this.setAttribute("uv",new Tt(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const x=new U,w=new U,M=new U;for(let E=0;E<t.length;E+=3)h(t[E+0],x),h(t[E+1],w),h(t[E+2],M),c(x,w,M,v)}function c(v,x,w,M){const E=M+1,T=[];for(let A=0;A<=E;A++){T[A]=[];const I=v.clone().lerp(w,A/E),y=x.clone().lerp(w,A/E),S=E-A;for(let N=0;N<=S;N++)N===0&&A===E?T[A][N]=I:T[A][N]=I.clone().lerp(y,N/S)}for(let A=0;A<E;A++)for(let I=0;I<2*(E-A)-1;I++){const y=Math.floor(I/2);I%2===0?(f(T[A][y+1]),f(T[A+1][y]),f(T[A][y])):(f(T[A][y+1]),f(T[A+1][y+1]),f(T[A+1][y]))}}function l(v){const x=new U;for(let w=0;w<s.length;w+=3)x.x=s[w+0],x.y=s[w+1],x.z=s[w+2],x.normalize().multiplyScalar(v),s[w+0]=x.x,s[w+1]=x.y,s[w+2]=x.z}function u(){const v=new U;for(let x=0;x<s.length;x+=3){v.x=s[x+0],v.y=s[x+1],v.z=s[x+2];const w=p(v)/2/Math.PI+.5,M=m(v)/Math.PI+.5;a.push(w,1-M)}g(),d()}function d(){for(let v=0;v<a.length;v+=6){const x=a[v+0],w=a[v+2],M=a[v+4],E=Math.max(x,w,M),T=Math.min(x,w,M);E>.9&&T<.1&&(x<.2&&(a[v+0]+=1),w<.2&&(a[v+2]+=1),M<.2&&(a[v+4]+=1))}}function f(v){s.push(v.x,v.y,v.z)}function h(v,x){const w=v*3;x.x=e[w+0],x.y=e[w+1],x.z=e[w+2]}function g(){const v=new U,x=new U,w=new U,M=new U,E=new he,T=new he,A=new he;for(let I=0,y=0;I<s.length;I+=9,y+=6){v.set(s[I+0],s[I+1],s[I+2]),x.set(s[I+3],s[I+4],s[I+5]),w.set(s[I+6],s[I+7],s[I+8]),E.set(a[y+0],a[y+1]),T.set(a[y+2],a[y+3]),A.set(a[y+4],a[y+5]),M.copy(v).add(x).add(w).divideScalar(3);const S=p(M);_(E,y+0,v,S),_(T,y+2,x,S),_(A,y+4,w,S)}}function _(v,x,w,M){M<0&&v.x===1&&(a[x]=v.x-1),w.x===0&&w.z===0&&(a[x]=M/2/Math.PI+.5)}function p(v){return Math.atan2(v.z,-v.x)}function m(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new yd(e.vertices,e.indices,e.radius,e.details)}}class Wm extends up{constructor(e){super(e),this.uuid=Di(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const r=e.holes[t];this.holes.push(new up().fromJSON(r))}return this}}const AS={triangulate:function(i,e,t=2){const n=e&&e.length,r=n?e[0]*t:i.length;let s=$m(i,0,r,t,!0);const a=[];if(!s||s.next===s.prev)return a;let o,c,l,u,d,f,h;if(n&&(s=IS(i,e,s,t)),i.length>80*t){o=l=i[0],c=u=i[1];for(let g=t;g<r;g+=t)d=i[g],f=i[g+1],d<o&&(o=d),f<c&&(c=f),d>l&&(l=d),f>u&&(u=f);h=Math.max(l-o,u-c),h=h!==0?32767/h:0}return ja(s,a,t,o,c,h,0),a}};function $m(i,e,t,n,r){let s,a;if(r===GS(i,e,t,n)>0)for(s=e;s<t;s+=n)a=hp(s,i[s],i[s+1],a);else for(s=t-n;s>=e;s-=n)a=hp(s,i[s],i[s+1],a);return a&&hl(a,a.next)&&(Za(a),a=a.next),a}function Wr(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(hl(t,t.next)||Ct(t.prev,t,t.next)===0)){if(Za(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function ja(i,e,t,n,r,s,a){if(!i)return;!a&&s&&zS(i,n,r,s);let o=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,s?PS(i,n,r,s):RS(i)){e.push(c.i/t|0),e.push(i.i/t|0),e.push(l.i/t|0),Za(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=CS(Wr(i),e,t),ja(i,e,t,n,r,s,2)):a===2&&LS(i,e,t,n,r,s):ja(Wr(i),e,t,n,r,s,1);break}}}function RS(i){const e=i.prev,t=i,n=i.next;if(Ct(e,t,n)>=0)return!1;const r=e.x,s=t.x,a=n.x,o=e.y,c=t.y,l=n.y,u=r<s?r<a?r:a:s<a?s:a,d=o<c?o<l?o:l:c<l?c:l,f=r>s?r>a?r:a:s>a?s:a,h=o>c?o>l?o:l:c>l?c:l;let g=n.next;for(;g!==e;){if(g.x>=u&&g.x<=f&&g.y>=d&&g.y<=h&&Ts(r,o,s,c,a,l,g.x,g.y)&&Ct(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function PS(i,e,t,n){const r=i.prev,s=i,a=i.next;if(Ct(r,s,a)>=0)return!1;const o=r.x,c=s.x,l=a.x,u=r.y,d=s.y,f=a.y,h=o<c?o<l?o:l:c<l?c:l,g=u<d?u<f?u:f:d<f?d:f,_=o>c?o>l?o:l:c>l?c:l,p=u>d?u>f?u:f:d>f?d:f,m=Nh(h,g,e,t,n),v=Nh(_,p,e,t,n);let x=i.prevZ,w=i.nextZ;for(;x&&x.z>=m&&w&&w.z<=v;){if(x.x>=h&&x.x<=_&&x.y>=g&&x.y<=p&&x!==r&&x!==a&&Ts(o,u,c,d,l,f,x.x,x.y)&&Ct(x.prev,x,x.next)>=0||(x=x.prevZ,w.x>=h&&w.x<=_&&w.y>=g&&w.y<=p&&w!==r&&w!==a&&Ts(o,u,c,d,l,f,w.x,w.y)&&Ct(w.prev,w,w.next)>=0))return!1;w=w.nextZ}for(;x&&x.z>=m;){if(x.x>=h&&x.x<=_&&x.y>=g&&x.y<=p&&x!==r&&x!==a&&Ts(o,u,c,d,l,f,x.x,x.y)&&Ct(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;w&&w.z<=v;){if(w.x>=h&&w.x<=_&&w.y>=g&&w.y<=p&&w!==r&&w!==a&&Ts(o,u,c,d,l,f,w.x,w.y)&&Ct(w.prev,w,w.next)>=0)return!1;w=w.nextZ}return!0}function CS(i,e,t){let n=i;do{const r=n.prev,s=n.next.next;!hl(r,s)&&qm(r,n,n.next,s)&&Ja(r,s)&&Ja(s,r)&&(e.push(r.i/t|0),e.push(n.i/t|0),e.push(s.i/t|0),Za(n),Za(n.next),n=i=s),n=n.next}while(n!==i);return Wr(n)}function LS(i,e,t,n,r,s){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&BS(a,o)){let c=Xm(a,o);a=Wr(a,a.next),c=Wr(c,c.next),ja(a,e,t,n,r,s,0),ja(c,e,t,n,r,s,0);return}o=o.next}a=a.next}while(a!==i)}function IS(i,e,t,n){const r=[];let s,a,o,c,l;for(s=0,a=e.length;s<a;s++)o=e[s]*n,c=s<a-1?e[s+1]*n:i.length,l=$m(i,o,c,n,!1),l===l.next&&(l.steiner=!0),r.push(FS(l));for(r.sort(DS),s=0;s<r.length;s++)t=US(r[s],t);return t}function DS(i,e){return i.x-e.x}function US(i,e){const t=NS(i,e);if(!t)return e;const n=Xm(t,i);return Wr(n,n.next),Wr(t,t.next)}function NS(i,e){let t=e,n=-1/0,r;const s=i.x,a=i.y;do{if(a<=t.y&&a>=t.next.y&&t.next.y!==t.y){const f=t.x+(a-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=s&&f>n&&(n=f,r=t.x<t.next.x?t:t.next,f===s))return r}t=t.next}while(t!==e);if(!r)return null;const o=r,c=r.x,l=r.y;let u=1/0,d;t=r;do s>=t.x&&t.x>=c&&s!==t.x&&Ts(a<l?s:n,a,c,l,a<l?n:s,a,t.x,t.y)&&(d=Math.abs(a-t.y)/(s-t.x),Ja(t,i)&&(d<u||d===u&&(t.x>r.x||t.x===r.x&&kS(r,t)))&&(r=t,u=d)),t=t.next;while(t!==o);return r}function kS(i,e){return Ct(i.prev,i,e.prev)<0&&Ct(e.next,i,i.next)<0}function zS(i,e,t,n){let r=i;do r.z===0&&(r.z=Nh(r.x,r.y,e,t,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,OS(r)}function OS(i){let e,t,n,r,s,a,o,c,l=1;do{for(t=i,i=null,s=null,a=0;t;){for(a++,n=t,o=0,e=0;e<l&&(o++,n=n.nextZ,!!n);e++);for(c=l;o>0||c>0&&n;)o!==0&&(c===0||!n||t.z<=n.z)?(r=t,t=t.nextZ,o--):(r=n,n=n.nextZ,c--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;t=n}s.nextZ=null,l*=2}while(a>1);return i}function Nh(i,e,t,n,r){return i=(i-t)*r|0,e=(e-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function FS(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Ts(i,e,t,n,r,s,a,o){return(r-a)*(e-o)>=(i-a)*(s-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(r-a)*(n-o)}function BS(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!HS(i,e)&&(Ja(i,e)&&Ja(e,i)&&VS(i,e)&&(Ct(i.prev,i,e.prev)||Ct(i,e.prev,e))||hl(i,e)&&Ct(i.prev,i,i.next)>0&&Ct(e.prev,e,e.next)>0)}function Ct(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function hl(i,e){return i.x===e.x&&i.y===e.y}function qm(i,e,t,n){const r=$o(Ct(i,e,t)),s=$o(Ct(i,e,n)),a=$o(Ct(t,n,i)),o=$o(Ct(t,n,e));return!!(r!==s&&a!==o||r===0&&Wo(i,t,e)||s===0&&Wo(i,n,e)||a===0&&Wo(t,i,n)||o===0&&Wo(t,e,n))}function Wo(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function $o(i){return i>0?1:i<0?-1:0}function HS(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&qm(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function Ja(i,e){return Ct(i.prev,i,i.next)<0?Ct(i,e,i.next)>=0&&Ct(i,i.prev,e)>=0:Ct(i,e,i.prev)<0||Ct(i,i.next,e)<0}function VS(i,e){let t=i,n=!1;const r=(i.x+e.x)/2,s=(i.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Xm(i,e){const t=new kh(i.i,i.x,i.y),n=new kh(e.i,e.x,e.y),r=i.next,s=e.prev;return i.next=e,e.prev=i,t.next=r,r.prev=t,n.next=t,t.prev=n,s.next=n,n.prev=s,n}function hp(i,e,t,n){const r=new kh(i,e,t);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function Za(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function kh(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function GS(i,e,t,n){let r=0;for(let s=e,a=t-n;s<t;s+=n)r+=(i[a]-i[s])*(i[s+1]+i[a+1]),a=s;return r}class Ba{static area(e){const t=e.length;let n=0;for(let r=t-1,s=0;s<t;r=s++)n+=e[r].x*e[s].y-e[s].x*e[r].y;return n*.5}static isClockWise(e){return Ba.area(e)<0}static triangulateShape(e,t){const n=[],r=[],s=[];dp(e),fp(n,e);let a=e.length;t.forEach(dp);for(let c=0;c<t.length;c++)r.push(a),a+=t[c].length,fp(n,t[c]);const o=AS.triangulate(n,r);for(let c=0;c<o.length;c+=3)s.push(o.slice(c,c+3));return s}}function dp(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function fp(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class vd extends Lt{constructor(e=new Wm([new he(.5,.5),new he(-.5,.5),new he(-.5,-.5),new he(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,r=[],s=[];for(let o=0,c=e.length;o<c;o++){const l=e[o];a(l)}this.setAttribute("position",new Tt(r,3)),this.setAttribute("uv",new Tt(s,2)),this.computeVertexNormals();function a(o){const c=[],l=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,d=t.depth!==void 0?t.depth:1;let f=t.bevelEnabled!==void 0?t.bevelEnabled:!0,h=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:h-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3;const m=t.extrudePath,v=t.UVGenerator!==void 0?t.UVGenerator:WS;let x,w=!1,M,E,T,A;m&&(x=m.getSpacedPoints(u),w=!0,f=!1,M=m.computeFrenetFrames(u,!1),E=new U,T=new U,A=new U),f||(p=0,h=0,g=0,_=0);const I=o.extractPoints(l);let y=I.shape;const S=I.holes;if(!Ba.isClockWise(y)){y=y.reverse();for(let te=0,L=S.length;te<L;te++){const ye=S[te];Ba.isClockWise(ye)&&(S[te]=ye.reverse())}}const k=Ba.triangulateShape(y,S),z=y;for(let te=0,L=S.length;te<L;te++){const ye=S[te];y=y.concat(ye)}function H(te,L,ye){return L||console.error("THREE.ExtrudeGeometry: vec does not exist"),te.clone().addScaledVector(L,ye)}const O=y.length,J=k.length;function W(te,L,ye){let _e,ce,ve;const Ge=te.x-L.x,Ae=te.y-L.y,C=ye.x-te.x,b=ye.y-te.y,G=Ge*Ge+Ae*Ae,Q=Ge*b-Ae*C;if(Math.abs(Q)>Number.EPSILON){const ne=Math.sqrt(G),ee=Math.sqrt(C*C+b*b),Be=L.x-Ae/ne,Me=L.y+Ge/ne,Ce=ye.x-b/ee,st=ye.y+C/ee,ue=((Ce-Be)*b-(st-Me)*C)/(Ge*b-Ae*C);_e=Be+Ge*ue-te.x,ce=Me+Ae*ue-te.y;const Le=_e*_e+ce*ce;if(Le<=2)return new he(_e,ce);ve=Math.sqrt(Le/2)}else{let ne=!1;Ge>Number.EPSILON?C>Number.EPSILON&&(ne=!0):Ge<-Number.EPSILON?C<-Number.EPSILON&&(ne=!0):Math.sign(Ae)===Math.sign(b)&&(ne=!0),ne?(_e=-Ae,ce=Ge,ve=Math.sqrt(G)):(_e=Ge,ce=Ae,ve=Math.sqrt(G/2))}return new he(_e/ve,ce/ve)}const pe=[];for(let te=0,L=z.length,ye=L-1,_e=te+1;te<L;te++,ye++,_e++)ye===L&&(ye=0),_e===L&&(_e=0),pe[te]=W(z[te],z[ye],z[_e]);const ge=[];let se,De=pe.concat();for(let te=0,L=S.length;te<L;te++){const ye=S[te];se=[];for(let _e=0,ce=ye.length,ve=ce-1,Ge=_e+1;_e<ce;_e++,ve++,Ge++)ve===ce&&(ve=0),Ge===ce&&(Ge=0),se[_e]=W(ye[_e],ye[ve],ye[Ge]);ge.push(se),De=De.concat(se)}for(let te=0;te<p;te++){const L=te/p,ye=h*Math.cos(L*Math.PI/2),_e=g*Math.sin(L*Math.PI/2)+_;for(let ce=0,ve=z.length;ce<ve;ce++){const Ge=H(z[ce],pe[ce],_e);oe(Ge.x,Ge.y,-ye)}for(let ce=0,ve=S.length;ce<ve;ce++){const Ge=S[ce];se=ge[ce];for(let Ae=0,C=Ge.length;Ae<C;Ae++){const b=H(Ge[Ae],se[Ae],_e);oe(b.x,b.y,-ye)}}}const Ze=g+_;for(let te=0;te<O;te++){const L=f?H(y[te],De[te],Ze):y[te];w?(T.copy(M.normals[0]).multiplyScalar(L.x),E.copy(M.binormals[0]).multiplyScalar(L.y),A.copy(x[0]).add(T).add(E),oe(A.x,A.y,A.z)):oe(L.x,L.y,0)}for(let te=1;te<=u;te++)for(let L=0;L<O;L++){const ye=f?H(y[L],De[L],Ze):y[L];w?(T.copy(M.normals[te]).multiplyScalar(ye.x),E.copy(M.binormals[te]).multiplyScalar(ye.y),A.copy(x[te]).add(T).add(E),oe(A.x,A.y,A.z)):oe(ye.x,ye.y,d/u*te)}for(let te=p-1;te>=0;te--){const L=te/p,ye=h*Math.cos(L*Math.PI/2),_e=g*Math.sin(L*Math.PI/2)+_;for(let ce=0,ve=z.length;ce<ve;ce++){const Ge=H(z[ce],pe[ce],_e);oe(Ge.x,Ge.y,d+ye)}for(let ce=0,ve=S.length;ce<ve;ce++){const Ge=S[ce];se=ge[ce];for(let Ae=0,C=Ge.length;Ae<C;Ae++){const b=H(Ge[Ae],se[Ae],_e);w?oe(b.x,b.y+x[u-1].y,x[u-1].x+ye):oe(b.x,b.y,d+ye)}}}Z(),Y();function Z(){const te=r.length/3;if(f){let L=0,ye=O*L;for(let _e=0;_e<J;_e++){const ce=k[_e];ze(ce[2]+ye,ce[1]+ye,ce[0]+ye)}L=u+p*2,ye=O*L;for(let _e=0;_e<J;_e++){const ce=k[_e];ze(ce[0]+ye,ce[1]+ye,ce[2]+ye)}}else{for(let L=0;L<J;L++){const ye=k[L];ze(ye[2],ye[1],ye[0])}for(let L=0;L<J;L++){const ye=k[L];ze(ye[0]+O*u,ye[1]+O*u,ye[2]+O*u)}}n.addGroup(te,r.length/3-te,0)}function Y(){const te=r.length/3;let L=0;le(z,L),L+=z.length;for(let ye=0,_e=S.length;ye<_e;ye++){const ce=S[ye];le(ce,L),L+=ce.length}n.addGroup(te,r.length/3-te,1)}function le(te,L){let ye=te.length;for(;--ye>=0;){const _e=ye;let ce=ye-1;ce<0&&(ce=te.length-1);for(let ve=0,Ge=u+p*2;ve<Ge;ve++){const Ae=O*ve,C=O*(ve+1),b=L+_e+Ae,G=L+ce+Ae,Q=L+ce+C,ne=L+_e+C;Ue(b,G,Q,ne)}}}function oe(te,L,ye){c.push(te),c.push(L),c.push(ye)}function ze(te,L,ye){Ye(te),Ye(L),Ye(ye);const _e=r.length/3,ce=v.generateTopUV(n,r,_e-3,_e-2,_e-1);it(ce[0]),it(ce[1]),it(ce[2])}function Ue(te,L,ye,_e){Ye(te),Ye(L),Ye(_e),Ye(L),Ye(ye),Ye(_e);const ce=r.length/3,ve=v.generateSideWallUV(n,r,ce-6,ce-3,ce-2,ce-1);it(ve[0]),it(ve[1]),it(ve[3]),it(ve[1]),it(ve[2]),it(ve[3])}function Ye(te){r.push(c[te*3+0]),r.push(c[te*3+1]),r.push(c[te*3+2])}function it(te){s.push(te.x),s.push(te.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return $S(t,n,e)}static fromJSON(e,t){const n=[];for(let s=0,a=e.shapes.length;s<a;s++){const o=t[e.shapes[s]];n.push(o)}const r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new Uh[r.type]().fromJSON(r)),new vd(n,e.options)}}const WS={generateTopUV:function(i,e,t,n,r){const s=e[t*3],a=e[t*3+1],o=e[n*3],c=e[n*3+1],l=e[r*3],u=e[r*3+1];return[new he(s,a),new he(o,c),new he(l,u)]},generateSideWallUV:function(i,e,t,n,r,s){const a=e[t*3],o=e[t*3+1],c=e[t*3+2],l=e[n*3],u=e[n*3+1],d=e[n*3+2],f=e[r*3],h=e[r*3+1],g=e[r*3+2],_=e[s*3],p=e[s*3+1],m=e[s*3+2];return Math.abs(o-u)<Math.abs(a-l)?[new he(a,1-c),new he(l,1-d),new he(f,1-g),new he(_,1-m)]:[new he(o,1-c),new he(u,1-d),new he(h,1-g),new he(p,1-m)]}};function $S(i,e,t){if(t.shapes=[],Array.isArray(i))for(let n=0,r=i.length;n<r;n++){const s=i[n];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class cr extends yd{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new cr(e.radius,e.detail)}}class Jt extends Lt{constructor(e=1,t=32,n=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const u=[],d=new U,f=new U,h=[],g=[],_=[],p=[];for(let m=0;m<=n;m++){const v=[],x=m/n;let w=0;m===0&&a===0?w=.5/t:m===n&&c===Math.PI&&(w=-.5/t);for(let M=0;M<=t;M++){const E=M/t;d.x=-e*Math.cos(r+E*s)*Math.sin(a+x*o),d.y=e*Math.cos(a+x*o),d.z=e*Math.sin(r+E*s)*Math.sin(a+x*o),g.push(d.x,d.y,d.z),f.copy(d).normalize(),_.push(f.x,f.y,f.z),p.push(E+w,1-x),v.push(l++)}u.push(v)}for(let m=0;m<n;m++)for(let v=0;v<t;v++){const x=u[m][v+1],w=u[m][v],M=u[m+1][v],E=u[m+1][v+1];(m!==0||a>0)&&h.push(x,w,E),(m!==n-1||c<Math.PI)&&h.push(w,M,E)}this.setIndex(h),this.setAttribute("position",new Tt(g,3)),this.setAttribute("normal",new Tt(_,3)),this.setAttribute("uv",new Tt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Jt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class wd extends Lt{constructor(e=1,t=.4,n=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:s},n=Math.floor(n),r=Math.floor(r);const a=[],o=[],c=[],l=[],u=new U,d=new U,f=new U;for(let h=0;h<=n;h++)for(let g=0;g<=r;g++){const _=g/r*s,p=h/n*Math.PI*2;d.x=(e+t*Math.cos(p))*Math.cos(_),d.y=(e+t*Math.cos(p))*Math.sin(_),d.z=t*Math.sin(p),o.push(d.x,d.y,d.z),u.x=e*Math.cos(_),u.y=e*Math.sin(_),f.subVectors(d,u).normalize(),c.push(f.x,f.y,f.z),l.push(g/r),l.push(h/n)}for(let h=1;h<=n;h++)for(let g=1;g<=r;g++){const _=(r+1)*h+g-1,p=(r+1)*(h-1)+g-1,m=(r+1)*(h-1)+g,v=(r+1)*h+g;a.push(_,p,v),a.push(p,m,v)}this.setIndex(a),this.setAttribute("position",new Tt(o,3)),this.setAttribute("normal",new Tt(c,3)),this.setAttribute("uv",new Tt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wd(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class $r extends Yr{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new be(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new be(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xm,this.normalScale=new he(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ci,this.combine=id,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Md extends Xt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new be(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class qS extends Md{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Xt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new be(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const lu=new yt,pp=new U,mp=new U;class Ym{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new he(512,512),this.map=null,this.mapPass=null,this.matrix=new yt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new hd,this._frameExtents=new he(1,1),this._viewportCount=1,this._viewports=[new xt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;pp.setFromMatrixPosition(e.matrixWorld),t.position.copy(pp),mp.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(mp),t.updateMatrixWorld(),lu.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(lu),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(lu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const gp=new yt,sa=new U,uu=new U;class XS extends Ym{constructor(){super(new zn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new he(4,2),this._viewportCount=6,this._viewports=[new xt(2,1,1,1),new xt(0,1,1,1),new xt(3,1,1,1),new xt(1,1,1,1),new xt(3,0,1,1),new xt(1,0,1,1)],this._cubeDirections=[new U(1,0,0),new U(-1,0,0),new U(0,0,1),new U(0,0,-1),new U(0,1,0),new U(0,-1,0)],this._cubeUps=[new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,1,0),new U(0,0,1),new U(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,r=this.matrix,s=e.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),sa.setFromMatrixPosition(e.matrixWorld),n.position.copy(sa),uu.copy(n.position),uu.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(uu),n.updateMatrixWorld(),r.makeTranslation(-sa.x,-sa.y,-sa.z),gp.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(gp)}}class Km extends Md{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new XS}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class YS extends Ym{constructor(){super(new Im(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class KS extends Md{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Xt.DEFAULT_UP),this.updateMatrix(),this.target=new Xt,this.shadow=new YS}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class jS{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=_p(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=_p();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function _p(){return performance.now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:nd}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=nd);function jm(i){return Math.sin(i*.045)*5}const $e={playerSpawn:{x:-5,z:4},hovel:{x:-9,z:2,rotY:0},hovelFloor:{halfX:1.9,halfZ:1.65},campfire:{x:-4.6,z:6.2},questBoard:{x:4,z:-2,rotY:-Math.PI/2},tome:{x:-3.2,z:-5.5,rotY:Math.PI/4},charter:{x:1.2,z:.4,rotY:-.9},exchequer:{x:6.5,z:3,rotY:Math.PI+.15},cart:{x:3.2,z:8.5,rotY:Math.PI/2+.15},dummy:{x:-8.5,z:9.5},granary:{x:11,z:11,rotY:-Math.PI/5},miller:{x:9,z:9.3,rotY:2.44},dirtPatches:[{x:-4.6,z:6.2,r:2.6},{x:-7,z:3,r:3.2},{x:-9,z:2,r:2.6},{x:-8.5,z:9.5,r:2.2},{x:6.2,z:3,r:2.6},{x:2.9,z:8.6,r:2.6},{x:11,z:11,r:4.2}]};function Jm(i,e=!1){const t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),r=new Set(Object.keys(i[0].morphAttributes)),s={},a={},o=i[0].morphTargetsRelative,c=new Lt;let l=0;for(let u=0;u<i.length;++u){const d=i[u];let f=0;if(t!==(d.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const h in d.attributes){if(!n.has(h))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+h+'" attribute exists among all geometries, or in none of them.'),null;s[h]===void 0&&(s[h]=[]),s[h].push(d.attributes[h]),f++}if(f!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==d.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const h in d.morphAttributes){if(!r.has(h))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[h]===void 0&&(a[h]=[]),a[h].push(d.morphAttributes[h])}if(e){let h;if(t)h=d.index.count;else if(d.attributes.position!==void 0)h=d.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(l,h,u),l+=h}}if(t){let u=0;const d=[];for(let f=0;f<i.length;++f){const h=i[f].index;for(let g=0;g<h.count;++g)d.push(h.getX(g)+u);u+=i[f].attributes.position.count}c.setIndex(d)}for(const u in s){const d=xp(s[u]);if(!d)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,d)}for(const u in a){const d=a[u][0].length;if(d===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let f=0;f<d;++f){const h=[];for(let _=0;_<a[u].length;++_)h.push(a[u][_][f]);const g=xp(h);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(g)}}return c}function xp(i){let e,t,n,r=-1,s=0;for(let l=0;l<i.length;++l){const u=i[l];if(e===void 0&&(e=u.array.constructor),e!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=u.itemSize),t!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(r===-1&&(r=u.gpuType),r!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;s+=u.count*t}const a=new e(s),o=new lt(a,t,n);let c=0;for(let l=0;l<i.length;++l){const u=i[l];if(u.isInterleavedBufferAttribute){const d=c/t;for(let f=0,h=u.count;f<h;f++)for(let g=0;g<t;g++){const _=u.getComponent(f,g);o.setComponent(f+d,g,_)}}else a.set(u.array,c);c+=u.count*t}return r!==void 0&&(o.gpuType=r),o}function Tn(i){let e=i>>>0;return function(){e|=0,e=e+1831565813|0;let n=Math.imul(e^e>>>15,1|e);return n=n+Math.imul(n^n>>>7,61|n)^n,((n^n>>>14)>>>0)/4294967296}}function Pt(i,e,t){const n=Math.min(1,Math.max(0,(i-e)/(t-e)));return n*n*(3-2*n)}function dn(i,e){let t=Math.imul(i,374761393)^Math.imul(e,668265263);return t=Math.imul(t^t>>>13,1274126177),((t^t>>>16)>>>0)/4294967296}function JS(i,e){const t=Math.floor(i),n=Math.floor(e),r=i-t,s=e-n,a=r*r*(3-2*r),o=s*s*(3-2*s),c=dn(t,n),l=dn(t+1,n),u=dn(t,n+1),d=dn(t+1,n+1);return c+(l-c)*a+(u-c)*o+(c-l-u+d)*a*o}function qr(i,e,t=3){let n=0,r=.5,s=0;for(let a=0;a<t;a++)n+=JS(i,e)*r,s+=r,i=i*2.03+11.7,e=e*2.03-4.3,r*=.5;return n/s}const hu=new Map;function ZS(i){if(!hu.has(i)){const e=new $r({color:i,flatShading:!0});e.userData.shared=!0,hu.set(i,e)}return hu.get(i)}function $(i,e,{x:t=0,y:n=0,z:r=0,rx:s=0,ry:a=0,rz:o=0,shadow:c=!0,keep:l=!1}={}){const u=new Et(i,ZS(e));return u.position.set(t,n,r),u.rotation.set(s,a,o),c&&(u.castShadow=!0,u.receiveShadow=!0),l&&(u.userData.keep=!0),u}function Ie(i,e){const t=Math.min(255,Math.round((i>>16&255)*e)),n=Math.min(255,Math.round((i>>8&255)*e)),r=Math.min(255,Math.round((i&255)*e));return t<<16|n<<8|r}const QS=new $r({vertexColors:!0,flatShading:!0});function eb(i){return i.isMesh&&i.visible&&!i.userData.keep&&i.children.length===0&&i.material.userData.shared===!0}function Rn(i){const e=[],t=[];for(const n of[...i.children])if(eb(n)){n.updateMatrix();const r=n.geometry.index?n.geometry.toNonIndexed():n.geometry.clone();r.attributes.normal||r.computeVertexNormals(),r.applyMatrix4(n.matrix);for(const s of Object.keys(r.attributes))s!=="position"&&s!=="normal"&&r.deleteAttribute(s);nb(r,n.material.color),(n.castShadow?e:t).push(r),i.remove(n)}else n.isGroup&&Rn(n);for(const[n,r]of[[e,!0],[t,!1]]){if(!n.length)continue;const s=new Et(Jm(n,!1),QS);s.castShadow=r,s.receiveShadow=r,i.add(s)}return i}const tb=new hn({color:16732217}),qo=new WeakMap;function Zm(i,e=90){const t=qo.get(i);if(t){clearTimeout(t.timeout),t.timeout=setTimeout(()=>{for(const[s,a]of t.restore)s.material=a;qo.delete(i)},e);return}const n=[];i.traverse(s=>{s.isMesh&&(n.push([s,s.material]),s.material=tb)});const r=setTimeout(()=>{for(const[s,a]of n)s.material=a;qo.delete(i)},e);qo.set(i,{timeout:r,restore:n})}function nb(i,e){const t=e.isColor?e:new be(e),n=i.attributes.position.count,r=new Float32Array(n*3);for(let s=0;s<n;s++)r[s*3]=t.r,r[s*3+1]=t.g,r[s*3+2]=t.b;return i.setAttribute("color",new lt(r,3)),i}function lr(i){const e=i.index?i.toNonIndexed():i;for(const t of Object.keys(e.attributes))t!=="position"&&e.deleteAttribute(t);return e}const Qi=new be;function ur(i,e){const t=i.attributes.position,n=new Float32Array(t.count*3);for(let r=0;r<t.count;r+=3){const s=t.getX(r),a=t.getY(r),o=t.getZ(r),c=t.getX(r+1),l=t.getY(r+1),u=t.getZ(r+1),d=t.getX(r+2),f=t.getY(r+2),h=t.getZ(r+2),g=c-s,_=l-a,p=u-o,m=d-s,v=f-a,x=h-o,w=_*x-p*v,M=p*m-g*x,E=g*v-_*m,T=Math.hypot(w,M,E)||1;e((s+c+d)/3,(a+l+f)/3,(o+u+h)/3,M/T,Qi,w/T,E/T);for(let A=0;A<3;A++)n[(r+A)*3]=Qi.r,n[(r+A)*3+1]=Qi.g,n[(r+A)*3+2]=Qi.b}return i.setAttribute("color",new lt(n,3)),i}function Sd(i,e){const t=i.attributes.position,n=new Float32Array(t.count*3);for(let r=0;r<t.count;r++)e(t.getX(r),t.getY(r),t.getZ(r),Qi),n[r*3]=Qi.r,n[r*3+1]=Qi.g,n[r*3+2]=Qi.b;return i.setAttribute("color",new lt(n,3)),i}function hr(i,e){const t=i.attributes.position,n=new Float32Array(t.count);for(let r=0;r<t.count;r++)n[r]=e(t.getX(r),t.getY(r),t.getZ(r));return i.setAttribute("sway",new lt(n,1)),i}function so(i,e,t=0){const n=i.attributes.position;for(let r=0;r<n.count;r++){const s=n.getX(r),a=n.getY(r),o=n.getZ(r),c=Math.round(s*1e3)+t*7919,l=Math.round(a*1e3),u=Math.round(o*1e3);n.setXYZ(r,s+(dn(c+l*31,u)-.5)*2*e,a+(dn(l+u*17,c+5)-.5)*2*e,o+(dn(u+c*13,l+9)-.5)*2*e)}return i}function Gc(i,e,t,n,r=.16){const s=[],a=n()*Math.PI*2;for(let l=0;l<t;l++){const u=a+l/t*Math.PI*2,d=i*(1+(n()-.5)*2*r);s.push([Math.cos(u)*d,(n()-.5)*e*.14,Math.sin(u)*d])}const o=[];for(let l=0;l<t;l++){const u=s[l],d=s[(l+1)%t];o.push(0,e,0,d[0],d[1],d[2],u[0],u[1],u[2]),o.push(0,e*.16,0,u[0],u[1],u[2],d[0],d[1],d[2])}const c=new Lt;return c.setAttribute("position",new Tt(o,3)),c}function Qa({sway:i=!1}={}){const e=[],t=new yt,n=new Ks,r=new ci,s=new U,a=new U;return{add(o,{x:c=0,y:l=0,z:u=0,rx:d=0,ry:f=0,rz:h=0,s:g=1,sy:_=g}={}){r.set(d,f,h,"YXZ"),n.setFromEuler(r),t.compose(s.set(c,l,u),n,a.set(g,_,g)),o.applyMatrix4(t),i&&!o.attributes.sway&&hr(o,()=>0),e.push(o)},get count(){return e.length},build(o,{cast:c=!0,receive:l=!0}={}){const u=Jm(e,!1);u.computeVertexNormals();const d=new Et(u,o);return d.castShadow=c,d.receiveShadow=l,d}}}function Nt(i,e){const t=Math.sin(i*.055)*Math.cos(e*.047)*1.7+Math.sin(i*.021+1.7)*1.3+Math.cos(e*.018+.6)*1.1,n=Math.hypot(i,e),r=.08+.92*Pt(n,16,44),s=.3+.7*Pt(Math.abs(i-jm(e)),2.2,7.5),a=Math.sin(i*.6)*Math.cos(e*.55)*.06+Math.sin(i*1.3+e*.7)*.045;return t*r*s+a}function Ws(i,e){return Math.abs(i-jm(e))}function Qm(i,e){const t=Nt(i,e),n=Math.hypot(i,e);if(n<92)return t;const r=Pt(n,92,250)*(9+17*qr(i*.011+40.3,e*.011-7.1,3)),s=Pt(n,300,430)*(26+105*Math.pow(qr(i*.0065-13.2,e*.0065+29.6,3),1.4));return t+r+s}const ib=new be(5999678),rb=new be(8430924),sb=new be(11577694),ab=new be(4945208),ob=new be(4679738),cb=new be(8749196),lb=new be(9204307),ub=new be(7231808),hb=new be(11047276);function eg(i,e,t){const n=qr(i*.045+3.7,e*.045-1.9,3),r=qr(i*.21+31.4,e*.21+7.7,2);return t.copy(ib).lerp(rb,Pt(n,.32,.68)),t.lerp(sb,Pt(r,.56,.86)*.55),t.lerp(ab,Pt(r,.44,.16)*.5),t}function Tr(i,e){const t=$e.hovelFloor;if(Math.abs(i-$e.hovel.x)<t.halfX&&Math.abs(e-$e.hovel.z)<t.halfZ)return 1;const n=(qr(i*.55+9.1,e*.55+4.3,2)-.5)*.9;let r=1-Pt(Ws(i,e)+n,1.8,3.3);for(const s of $e.dirtPatches){const a=Math.hypot(i-s.x,e-s.z)+n*.6;r=Math.max(r,1-Pt(a,s.r*.6,s.r*1.4))}return r}const du=new be;function db(i,e,t){const n=Math.hypot(i,e);eg(i,e,t),t.lerp(ob,Pt(n,74,104)*.8),n>280&&t.lerp(cb,Pt(n,300,400));const r=Tr(i,e)*(1-Pt(n,110,160));if(r>0){const s=qr(i*.7,e*.7+50,2);du.copy(lb).lerp(ub,s*.8),du.lerp(hb,(1-Pt(Ws(i,e),.2,1.5))*.55),t.lerp(du,r)}return t}const Ns=86,mi=(()=>{const i=[];let e=Ns,t=1.3;for(;e<450;)e+=t,i.push(e),t*=1.28;const n=[];for(let r=-Ns;r<=Ns;r++)n.push(r);return[...i.map(r=>-r).reverse(),...n,...i]})(),Ft=mi.length,tg=(i,e)=>dn(i*7+3,e*13+1)>.5;let Xo=null;function ng(){if(Xo)return Xo;const i=new Float32Array(Ft*Ft),e=new Float32Array(Ft*Ft),t=new Float32Array(Ft*Ft);for(let n=0;n<Ft;n++)for(let r=0;r<Ft;r++){let s=mi[r],a=mi[n];Math.abs(s)<Ns&&Math.abs(a)<Ns&&(s+=(dn(r*3+11,n*5+2)-.5)*.62,a+=(dn(r*9+4,n*2+17)-.5)*.62);const o=n*Ft+r;i[o]=s,t[o]=a,e[o]=Qm(s,a)}return Xo={xs:i,ys:e,zs:t},Xo}function yp(i){let e=0,t=Ft-2;for(;e<t;){const n=e+t+1>>1;mi[n]<=i?e=n:t=n-1}return e}function fb(i,e){if(Math.max(Math.abs(i),Math.abs(e))<=Ns)return Qm(i,e);const{ys:t}=ng(),n=yp(i),r=yp(e),s=Math.min(1,Math.max(0,(i-mi[n])/(mi[n+1]-mi[n]))),a=Math.min(1,Math.max(0,(e-mi[r])/(mi[r+1]-mi[r]))),o=t[r*Ft+n],c=t[r*Ft+n+1],l=t[(r+1)*Ft+n],u=t[(r+1)*Ft+n+1];return tg(n,r)?a>=s?o+a*(l-o)+s*(u-l):o+s*(c-o)+a*(u-c):s+a<=1?o+s*(c-o)+a*(l-o):u+(1-s)*(l-u)+(1-a)*(c-u)}function pb(){const{xs:i,ys:e,zs:t}=ng(),n=(Ft-1)*(Ft-1),r=new Float32Array(n*18),s=new Float32Array(n*18),a=new be;let o=0;function c(f,h,g){const _=(i[f]+i[h]+i[g])/3,p=(t[f]+t[h]+t[g])/3;db(_,p,a);const m=1+(dn(Math.round(_*31),Math.round(p*31))-.5)*.085;for(const v of[f,h,g])r[o]=i[v],r[o+1]=e[v],r[o+2]=t[v],s[o]=a.r*m,s[o+1]=a.g*m,s[o+2]=a.b*m,o+=3}for(let f=0;f<Ft-1;f++)for(let h=0;h<Ft-1;h++){const g=f*Ft+h,_=g+1,p=g+Ft,m=p+1;tg(h,f)?(c(g,p,m),c(g,m,_)):(c(g,p,_),c(_,p,m))}const l=new Lt;l.setAttribute("position",new lt(r,3)),l.setAttribute("color",new lt(s,3)),l.computeVertexNormals();const u=new $r({vertexColors:!0,flatShading:!0}),d=new Et(l,u);return d.receiveShadow=!0,d.name="terrain",d}function ig(i,e=128){const t=document.createElement("canvas");t.width=t.height=e;const n=t.getContext("2d"),r=e/2,s=n.createRadialGradient(r,r,0,r,r,r);for(const[o,c]of i)s.addColorStop(o,c);n.fillStyle=s,n.fillRect(0,0,e,e);const a=new fS(t);return a.colorSpace=ii,a}let fu=null;function dl(){return fu||(fu=ig([[0,"rgba(255,255,255,1)"],[.35,"rgba(255,255,255,0.55)"],[.7,"rgba(255,255,255,0.12)"],[1,"rgba(255,255,255,0)"]])),fu}function fl(i,e,t=1){const n=new Fm(new pd({map:dl(),color:i,opacity:t,blending:Hr,depthWrite:!1,transparent:!0,fog:!1}));return n.scale.set(e,e,1),n}const zh=new U(38,30,-22),Ur=zh.clone().normalize(),mb=new be(5145538),gb=new be(9682140),vp=new be(15851709),_b=new be(16764810),xb=new be(14468252),yb=12899036,wp=400;function vb(){const i=new Je,e=new Jt(wp,48,28),t=e.attributes.position,n=new Float32Array(t.count*3),r=new be,s=new U;for(let u=0;u<t.count;u++){s.fromBufferAttribute(t,u).normalize();const d=s.y;d>=0?r.copy(vp).lerp(gb,Pt(d,0,.3)).lerp(mb,Pt(d,.22,.95)):r.copy(vp).lerp(xb,Math.min(1,-d*4));const f=Math.max(0,s.dot(Ur));r.lerp(_b,Math.pow(f,3)*.6*(1-Math.max(0,d)*.45)),n[u*3]=r.r,n[u*3+1]=r.g,n[u*3+2]=r.b}e.setAttribute("color",new lt(n,3));const a=new Et(e,new hn({vertexColors:!0,side:mn,fog:!1,depthWrite:!1,depthTest:!1}));a.renderOrder=-10,a.frustumCulled=!1,i.add(a);const o=Ur.clone().multiplyScalar(wp*.94),c=fl(16767392,300,.5);c.position.copy(o);const l=new Fm(new pd({map:ig([[0,"rgba(255,250,232,1)"],[.42,"rgba(255,244,214,1)"],[.5,"rgba(255,226,170,0.55)"],[.75,"rgba(255,205,130,0.12)"],[1,"rgba(255,200,120,0)"]]),blending:Hr,depthWrite:!1,transparent:!0,fog:!1}));return l.scale.set(64,64,1),l.position.copy(o),i.add(c,l),i}const wb=new be(16774108),Mb=new be(15984342),Sb=new be(13486300);function bb(){const i=Tn(4242),e=Qa(),t=new U;let n=0,r=0;for(;n<17&&r++<80;){const a=i()*Math.PI*2,o=180+i()*150,c=58+i()*62,l=Math.cos(a)*o,u=Math.sin(a)*o;if(t.set(l,c,u).normalize().dot(Ur)>.95)continue;const d=i()*Math.PI,f=26+i()*36,h=4+Math.floor(i()*4);for(let g=0;g<h;g++){const _=g/(h-1)-.5,p=(9+i()*7)*(1-Math.abs(_)*.95),m=lr(new cr(p,1));so(m,p*.13,n*16+g);const v=m.attributes.position;for(let x=0;x<v.count;x++)v.getY(x)<-p*.3&&v.setY(x,-p*.3);e.add(m,{x:l+Math.cos(d)*_*f+(i()-.5)*4,y:c+p*.35+(i()-.5)*3,z:u+Math.sin(d)*_*f+(i()-.5)*4,ry:i()*Math.PI*2,s:1,sy:.62}),ur(m,(x,w,M,E,T,A,I)=>{const y=A*Ur.x+E*Ur.y+I*Ur.z;T.copy(Sb).lerp(Mb,Pt(E,-.5,.6)).lerp(wb,Pt(y,.1,.9))})}n++}const s=e.build(new hn({vertexColors:!0,fog:!1}),{cast:!1,receive:!1});return s.name="clouds",s}function Eb(i){i.fog=new fd(yb,45,560);const e=new qS(13624310,11111520,1.55);i.add(e);const t=new KS(16769194,3);t.position.copy(zh),t.castShadow=!0,t.shadow.mapSize.set(2048,2048);const n=40;t.shadow.camera.left=-n,t.shadow.camera.right=n,t.shadow.camera.top=n,t.shadow.camera.bottom=-n,t.shadow.camera.near=1,t.shadow.camera.far=150,t.shadow.bias=-5e-4,t.shadow.normalBias=.035,i.add(t),i.add(t.target);const r=n*2/t.shadow.mapSize.x,s=Ur.clone().negate(),a=new U().crossVectors(s,new U(0,1,0)).normalize(),o=new U().crossVectors(a,s).normalize(),c=new U;function l(u){const d=Math.round(u.dot(a)/r)*r,f=Math.round(u.dot(o)/r)*r;c.copy(a).multiplyScalar(d).addScaledVector(o,f).addScaledVector(s,u.dot(s)),t.target.position.copy(c),t.position.copy(c).add(zh)}return{sun:t,hemi:e,followShadow:l}}const rg={value:0},Tb=`
attribute float sway;
uniform float uWindTime;
uniform float uWindAmp;
`,Ab=`
vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
{
	float gust = sin( uWindTime * 1.6 + mvPosition.x * 0.31 + mvPosition.z * 0.23 ) * 0.55
		+ sin( uWindTime * 2.9 + mvPosition.x * 0.83 - mvPosition.z * 0.57 ) * 0.25
		+ sin( uWindTime * 0.6 + mvPosition.x * 0.05 + mvPosition.z * 0.07 ) * 0.45;
	float push = gust * sway * uWindAmp;
	mvPosition.x += push;
	mvPosition.z += push * 0.55;
}
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;
`;function Oh(i,e,{upNormals:t=!1}={}){return i.onBeforeCompile=n=>{n.uniforms.uWindTime=rg,n.uniforms.uWindAmp={value:e},n.vertexShader=n.vertexShader.replace("#include <common>","#include <common>"+Tb).replace("#include <project_vertex>",Ab),t&&(n.vertexShader=n.vertexShader.replace("#include <beginnormal_vertex>","vec3 objectNormal = vec3( 0.0, 1.0, 0.0 );"),n.fragmentShader=n.fragmentShader.replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
	normal = normalize( vNormal );`))},i.customProgramCacheKey=()=>`wind:${t}`,i}const mt=i=>new be(i),Wc=[mt(8019266),mt(8808266),mt(7230781)],Rb=mt(14209213),Pb=mt(4011566),Mp=[[mt(2708015),mt(5209918)],[mt(3103798),mt(6130758)],[mt(2641983),mt(4881756)],[mt(4481326),mt(8229701)]],Sp=[[mt(3959603),mt(8234054)],[mt(4748854),mt(9678927)],[mt(5601327),mt(10925398)]],Fh=[[mt(10119720),mt(14461508)],[mt(9194788),mt(13664314)]],Cb=[mt(8033087),mt(13027164)],$c=[mt(9407362),mt(8289140),mt(10064511)],Lb=mt(7044938);function Ib(){const i=Tn(1337),e=[],t=[];let n=0,r=0;for(;n<42&&r++<400;){const s=i()*Math.PI*2,a=21+i()*52,o=Math.cos(s)*a,c=Math.sin(s)*a;if(Ws(o,c)<6)continue;const l=.8+i()*.9,u=i()*Math.PI*2;for(let d=0;d<9;d++)i();e.push({x:o,z:c,s:l,ry:u}),n++}for(n=0,r=0;n<16&&r++<300;){const s=i()*Math.PI*2,a=9+i()*48,o=Math.cos(s)*a,c=Math.sin(s)*a;if(Ws(o,c)<3.5||Math.hypot(o+6,c-5)<6)continue;const l=.35+i()*.75,u=.65+i()*.3,d=Math.floor(i()*$c.length),f=i()*Math.PI*2;t.push({x:o,z:c,s:l,squash:u,hue:d,ry:f}),n++}return{trees:e,rocks:t}}const Db=[{x:-15.5,z:8.5,s:1.85,ry:.6,kind:"oak"},{x:11.5,z:-17.5,s:1.45,ry:2.1,kind:"oak"},{x:-8.2,z:-11.6,s:1.25,ry:4,kind:"birch"},{x:-9.6,z:-12.9,s:1,ry:1.2,kind:"birch"}],bd=i=>(e,t)=>Math.pow(Math.max(0,t)/i,1.7);function sg(i,e,{height:t,top:n,base:r,lean:s,bark:a,sway:o}){const c=lr(new On(n,r,t,6,2));c.translate(0,t/2,0),ur(c,(l,u,d,f,h)=>h.copy(a).multiplyScalar(.86+dn(Math.round(l*90+u*37),Math.round(d*90))*.28)),c.rotateZ(s),hr(c,o),i.add(c,e)}function bp(i,e,t,n,{boughs:r=5,spokes:s=7,trunk:a=!0}={}){const[o,c]=Mp[Math.floor(e()*Mp.length)],l=5+e()*1.3,u=1.25+e()*.4,d=1.3+e()*.6,f={x:t.x,y:n,z:t.z,ry:t.ry,s:t.s},h=bd(l),g=(e()-.5)*.07;a&&sg(i,f,{height:l*.7,top:.06,base:.2,lean:g,bark:Wc[Math.floor(e()*Wc.length)],sway:h});const _=(l-d)/r*1.8;let p=d;for(let m=0;m<r;m++){const v=m/(r-1),x=u*(1-v*.8),w=_*(1-v*.12),M=Gc(x,w,s,e),E=.92+e()*.16;Sd(M,(T,A,I,y)=>{y.copy(o).multiplyScalar(.8).lerp(c,Pt(Math.hypot(T,I)/x,.2,1)*(.55+v*.35)),y.multiplyScalar(E)}),M.rotateX((e()-.5)*.14),M.rotateZ((e()-.5)*.14+g),M.translate((e()-.5)*.14,p,(e()-.5)*.14),hr(M,h),i.add(M,f),p+=w*.5}}function Bh(i,e,t,{x:n,y:r,z:s,r:a,shade:o,light:c,sway:l,detail:u=1,seed:d}){const f=lr(new cr(a,u));so(f,a*.14,d),f.scale(1,.84,1),f.translate(n,r,s),ur(f,(h,g,_,p,m)=>{const v=dn(Math.round(h*53+d),Math.round(_*53+g*29))*.22;m.copy(o).lerp(c,Math.min(1,Pt(p,-.35,.85)*.85+v))}),hr(f,l),i.add(f,t)}function Ep(i,e,t,n,{detail:r=1,blobs:s=0,trunk:a=!0}={}){const[o,c]=e()<.2?Fh[Math.floor(e()*Fh.length)]:Sp[Math.floor(e()*Sp.length)],l=1.9+e()*.7,u=l+2.9,d={x:t.x,y:n,z:t.z,ry:t.ry,s:t.s},f=bd(u),h=Wc[Math.floor(e()*Wc.length)],g=(e()-.5)*.1;a&&sg(i,d,{height:l+.9,top:.14,base:.28,lean:g,bark:h,sway:f});const _=s||4+Math.floor(e()*3),p=Math.round(t.x*7+t.z*13);for(let m=0;m<_;m++){const v=m/_*Math.PI*2+e()*.6,x=.75+e()*.45;if(r&&m%2===0){const w=lr(new On(.05,.1,1.5,5));w.translate(0,.75,0),w.rotateZ(-.75),w.rotateY(-v),w.translate(0,l+.2,0),ur(w,(M,E,T,A,I)=>I.copy(h).multiplyScalar(.95)),hr(w,f),i.add(w,d)}Bh(i,e,d,{x:Math.cos(v)*x,y:l+1.15+e()*.5,z:Math.sin(v)*x,r:1+e()*.4,shade:o,light:c,sway:f,detail:r,seed:p+m})}Bh(i,e,d,{x:0,y:l+2,z:0,r:1.15+e()*.3,shade:o,light:c,sway:f,detail:r,seed:p+9})}function Ub(i,e,t,n){const[r,s]=e()<.3?Fh[0]:Cb,a=3+e()*.8,o=a+1.9,c={x:t.x,y:n,z:t.z,ry:t.ry,s:t.s},l=bd(o),u=lr(new On(.06,.12,a+.6,6,5));u.translate(0,(a+.6)/2,0),ur(u,(f,h,g,_,p)=>{const m=dn(Math.round(f*71+h*43),Math.round(g*71+t.x*3));p.copy(m>.8?Pb:Rb).multiplyScalar(.92+m*.1)}),u.rotateZ((e()-.5)*.12),hr(u,l),i.add(u,c);const d=Math.round(t.x*11+t.z*5);for(let f=0;f<4;f++){const h=e()*Math.PI*2,g=f===3?0:.35+e()*.35;Bh(i,e,c,{x:Math.cos(h)*g,y:a+.2+f*.5,z:Math.sin(h)*g,r:.62+e()*.28,shade:r,light:s,sway:l,seed:d+f})}}function Nb(i,e,t){const n=lr(new cr(t.s,1));so(n,t.s*.17,Math.round(t.x*9+t.z*5)),n.scale(1,t.squash,1);const r=$c[t.hue],s=e()<.6;ur(n,(a,o,c,l,u)=>{u.copy(r).multiplyScalar(.84+dn(Math.round(a*61),Math.round(c*61+o*23))*.3),s&&l>.5&&u.lerp(Lb,Pt(l,.5,.9)*.6)}),i.add(n,{x:t.x,y:Nt(t.x,t.z)+t.s*.12,z:t.z,ry:t.ry})}function Tp(i,e,t,n,r){const s=lr(new cr(r,0));so(s,r*.2,Math.round(t*17+n*29)),s.scale(1,.6,1);const a=$c[Math.floor(e()*$c.length)],o=.8+e()*.3;ur(s,(c,l,u,d,f)=>f.copy(a).multiplyScalar(o*(.9+d*.12))),i.add(s,{x:t,y:Nt(t,n)+r*.15,z:n,ry:e()*Math.PI*2})}function kb(){const{trees:i,rocks:e}=Ib(),t=[];for(const p of i)t.push({x:p.x,z:p.z,r:.45*p.s});for(const p of e)p.s>.55&&t.push({x:p.x,z:p.z,r:p.s*.85});const n=Tn(7331);for(const p of i){const m=n();p.kind=m<.55?"pine":m<.86?"oak":"birch"}const r=(p,m,v)=>{for(const x of i)if(Math.hypot(p-x.x,m-x.z)<v)return!1;for(const x of e)if(Math.hypot(p-x.x,m-x.z)<v)return!1;return!0};for(const p of Db)i.push({...p}),t.push({x:p.x,z:p.z,r:.45*p.s});const s=Tn(9001);let a=0,o=0;for(;a<46&&o++<3e3;){const p=s()*Math.PI*2,m=40+s()*37,v=Math.cos(p)*m,x=Math.sin(p)*m;if(Ws(v,x)<6.5||!r(v,x,3.4))continue;const w=s(),M={x:v,z:x,s:.85+s()*.95,ry:s()*Math.PI*2,kind:w<.6?"pine":w<.88?"oak":"birch"};i.push(M),t.push({x:v,z:x,r:.45*M.s}),a++}const c=Qa({sway:!0}),l=Qa({sway:!0}),u=Tn(555);for(const p of i){const m=Nt(p.x,p.z)-.08;p.kind==="oak"?Ep(c,u,p,m):p.kind==="birch"?Ub(c,u,p,m):bp(c,u,p,m)}for(const p of e){Nb(c,u,p);const m=1+Math.floor(u()*3);for(let v=0;v<m;v++){const x=u()*Math.PI*2,w=p.s*(.95+u()*.5);Tp(c,u,p.x+Math.cos(x)*w,p.z+Math.sin(x)*w,p.s*(.14+u()*.16))}}for(let p=0;p<150;p++){const m=-72+u()*144,v=u()<.5?-1:1,x=5*Math.sin(m*.045)+v*(1.5+u()*2.2);Tp(c,u,x,m,.05+u()*.1)}const d=Tn(31337),f=(p,m,v,x,w)=>{let M=0,E=0;for(;M<p&&E++<p*8;){const T=d()*Math.PI*2,A=Math.sqrt(m*m+d()*(v*v-m*m)),I=Math.cos(T)*A,y=Math.sin(T)*A;if(Ws(I,y)<7)continue;const S={x:I,z:y,s:w.s0+d()*w.s1,ry:d()*Math.PI*2},N=fb(I,y)-.1;d()<w.oaks?Ep(x,d,S,N,w.oak):bp(x,d,S,N,w.pine),M++}};f(330,80.5,106,c,{s0:1,s1:1,oaks:.3,oak:{detail:0,blobs:3},pine:{boughs:4,spokes:6}}),f(950,106,255,l,{s0:1.6,s1:1.5,oaks:.25,oak:{detail:0,blobs:2,trunk:!1},pine:{boughs:3,spokes:5,trunk:!1}});const h=Oh(new $r({vertexColors:!0,flatShading:!0}),.085),g=c.build(h);g.name="scatter";const _=l.build(h,{cast:!1,receive:!1});return _.name="forest",{meshes:[g,_],colliders:t,trees:i,rocks:e}}const Ut=i=>new be(i);function zb(i){const e=$e,t=e.cart.rotY,n=[{x:e.campfire.x,z:e.campfire.z,r:1.3},{x:e.questBoard.x,z:e.questBoard.z,r:1.2},{x:e.tome.x,z:e.tome.z,r:.85},{x:e.charter.x,z:e.charter.z,r:.5},{x:e.exchequer.x,z:e.exchequer.z,r:2},{x:e.dummy.x,z:e.dummy.z,r:.75},{x:e.miller.x,z:e.miller.z,r:.8},{x:e.cart.x,z:e.cart.z,r:2},{x:e.cart.x+1.9*Math.cos(t),z:e.cart.z-1.9*Math.sin(t),r:1}];for(const s of i.trees)n.push({x:s.x,z:s.z,r:.45*s.s+.12});for(const s of i.rocks)n.push({x:s.x,z:s.z,r:s.s*.95});const r=e.hovelFloor;return(s,a,o=0)=>{if(Math.abs(s-e.hovel.x)<r.halfX+o&&Math.abs(a-e.hovel.z)<r.halfZ+o)return!0;for(const c of n){const l=s-c.x,u=a-c.z,d=c.r+o;if(l*l+u*u<d*d)return!0}return!1}}function Ap(i,{blades:e,height:t,width:n,splay:r,bend:s=0}){const a=[],o=[],c=[],l=[.6,.64,.56],u=[.9,.95,.78],d=s?[1.32,1.22,.82]:[1.2,1.26,.92];for(let f=0;f<e;f++){const h=f/e*Math.PI*2+i()*.9,g=t*(.6+i()*.6),_=n*(.8+i()*.5),p=Math.cos(h),m=Math.sin(h),v=-m,x=p,w=.02+i()*.05,M=w+g*r*(.5+i()),E=g/t;if(!s)a.push(p*w-v*_,-.03,m*w-x*_,p*w+v*_,-.03,m*w+x*_,p*M,g,m*M),o.push(...l,...l,...d),c.push(0,0,E);else{const T=g*.55,A=w+(M-w)*.3,I=_*.6,y=[p*w-v*_,-.03,m*w-x*_],S=[p*w+v*_,-.03,m*w+x*_],N=[p*A-v*I,T,m*A-x*I],k=[p*A+v*I,T,m*A+x*I],z=[p*M*(1+s),g,m*M*(1+s)];a.push(...y,...S,...k,...y,...k,...N,...N,...k,...z),o.push(...l,...l,...u,...l,...u,...u,...u,...u,...d),c.push(0,0,E*.4,0,E*.4,E*.4,E*.4,E*.4,E)}}return{position:a,color:o,sway:c}}const Ob=Ut(11904867),Rp=36;function Pp(i,e,t){const n=new Map;for(const s of t){const a=Math.floor(s.x/Rp)+","+Math.floor(s.z/Rp);n.has(a)||n.set(a,[]),n.get(a).push(s)}const r=new Je;for(const s of n.values())r.add(Fb(i,e,s));return r}function Fb(i,e,t){const n=i.sway.length,r=new Float32Array(t.length*n*3),s=new Float32Array(t.length*n*3),a=new Float32Array(t.length*n),o=new be;t.forEach((u,d)=>{const f=Math.cos(u.ry),h=Math.sin(u.ry),g=Nt(u.x,u.z);eg(u.x,u.z,o).lerp(Ob,u.dry).multiplyScalar(u.tone);for(let _=0;_<n;_++){const p=i.position[_*3]*u.size,m=i.position[_*3+1]*u.size*u.tall,v=i.position[_*3+2]*u.size,x=(d*n+_)*3;r[x]=u.x+p*f+v*h,r[x+1]=g+m,r[x+2]=u.z-p*h+v*f,s[x]=i.color[_*3]*o.r,s[x+1]=i.color[_*3+1]*o.g,s[x+2]=i.color[_*3+2]*o.b,a[d*n+_]=i.sway[_]}});const c=new Lt;c.setAttribute("position",new lt(r,3)),c.setAttribute("color",new lt(s,3)),c.setAttribute("sway",new lt(a,1));const l=new Et(c,e);return l.receiveShadow=!0,l}const Cp=[[Ut(16183780),Ut(15317306)],[Ut(15911996),Ut(13799204)],[Ut(13584946),Ut(3810332)],[Ut(7636182),Ut(4148366)],[Ut(14454699),Ut(15914378)],[Ut(10585292),Ut(15260064)]],Ei=Ut(6261308);function Bb(i,[e,t]){const n=[],r=[],s=[],a=.2+i()*.2,c=(i()-.5)*.12,l=(i()-.5)*.12;n.push(-.012,0,0,.012,0,0,c,a,l),r.push(Ei.r*.7,Ei.g*.7,Ei.b*.7,Ei.r*.7,Ei.g*.7,Ei.b*.7,Ei.r,Ei.g,Ei.b),s.push(0,0,.8);const u=.05+i()*.035,d=i()*Math.PI*2;for(let h=0;h<5;h++){const g=d+h/5*Math.PI*2,_=d+(h+.72)/5*Math.PI*2;n.push(c,a+.012,l,c+Math.cos(g)*u,a-.006,l+Math.sin(g)*u,c+Math.cos(_)*u,a-.006,l+Math.sin(_)*u),r.push(t.r,t.g,t.b,e.r,e.g,e.b,e.r,e.g,e.b),s.push(.8,.8,.8)}const f=new Lt;return f.setAttribute("position",new Tt(n,3)),f.setAttribute("color",new Tt(r,3)),f.setAttribute("sway",new Tt(s,1)),f}const Lp=[[Ut(3498031),Ut(7313985)],[Ut(4155956),Ut(8824906)],[Ut(5073452),Ut(10070097)]],Ip=[Ut(4025139),Ut(8365640)];function Hb(i,e,t,n,r){const[s,a]=Lp[Math.floor(e()*Lp.length)],o=Nt(t,n),c=2+Math.floor(e()*2);for(let l=0;l<c;l++){const u=r*(.55+e()*.45),d=lr(new cr(u,1));so(d,u*.16,Math.round(t*13+n*7+l)),d.scale(1,.78,1);const f=(e()-.5)*r*1.1,h=(e()-.5)*r*1.1;d.translate(f,u*.5,h),ur(d,(g,_,p,m,v)=>{const x=dn(Math.round(g*67+t),Math.round(p*67+_*31))*.25;v.copy(s).lerp(a,Math.min(1,Pt(m,-.3,.85)*.8+x))}),hr(d,(g,_)=>Math.min(1,Math.max(0,_)/(r*1.4))*.5),i.add(d,{x:t,y:o,z:n,ry:e()*Math.PI*2})}}function Dp(i,e,t,n,r){const s=Gc(r,r*.42,7,e,.22);s.rotateX(Math.PI),s.translate(0,r*.42,0);const a=.9+e()*.2;Sd(s,(o,c,l,u)=>{u.copy(Ip[0]).lerp(Ip[1],Pt(Math.hypot(o,l)/r,.2,1)).multiplyScalar(a)}),hr(s,(o,c,l)=>Math.hypot(o,l)/r*.45),i.add(s,{x:t,y:Nt(t,n)-.02,z:n,ry:e()*Math.PI*2})}function Vb(i){const e=new Je;e.name="flora";const t=zb(i),n=Tn(2718),r=Oh(new $r({vertexColors:!0,side:Xn}),.11,{upNormals:!0}),s=Oh(new $r({vertexColors:!0,flatShading:!0}),.07),a=[];for(let h=0;h<9e4&&a.length<9500;h++){const g=n()*Math.PI*2,_=Math.sqrt(n())*72,p=Math.cos(g)*_,m=Math.sin(g)*_;if(n()>1-Pt(_,20,70)*.84)continue;const v=Tr(p,m);n()<v*1.3||t(p,m)||a.push({x:p,z:m,ry:n()*Math.PI*2,size:.8+n()*.6,tall:.75+n()*.6,dry:Math.min(1,v*1.6)*.7,tone:.9+n()*.2})}e.add(Pp(Ap(n,{blades:5,height:.34,width:.05,splay:.42}),r,a));const o=[];for(let h=0;h<4e4&&o.length<1700;h++){const g=n()*Math.PI*2,_=19+Math.sqrt(n())*55,p=Math.cos(g)*_,m=Math.sin(g)*_,v=qr(p*.07+100.5,m*.07-60.2,2);n()>Pt(v,.5,.72)||Tr(p,m)>.04||t(p,m,.25)||o.push({x:p,z:m,ry:n()*Math.PI*2,size:.85+n()*.5,tall:.8+n()*.5,dry:.25+n()*.3,tone:.95+n()*.15})}e.add(Pp(Ap(n,{blades:5,height:.78,width:.045,splay:.3,bend:.5}),r,o));const c=Qa({sway:!0}),l=(h,g,_,p,m)=>{for(let v=0;v<p;v++){const x=n()*Math.PI*2,w=Math.sqrt(n())*m,M=h+Math.cos(x)*w,E=g+Math.sin(x)*w;if(Tr(M,E)>.25||t(M,E))continue;const T=.85+n()*.6;c.add(Bb(n,Cp[_]),{x:M,y:Nt(M,E),z:E,ry:n()*Math.PI*2,s:T})}},u=[];for(let h=0;h<62;h++){const g=n()*Math.PI*2,_=7+Math.sqrt(n())*55,p=Math.cos(g)*_,m=Math.sin(g)*_;l(p,m,Math.floor(n()*Cp.length),7+Math.floor(n()*12),1+n()*1.8),Tr(p,m)<.1&&!t(p,m,1)&&u.push({x:p,z:m})}e.userData.patches=u;for(let h=0;h<70;h++){const g=n()*Math.PI*2,_=Math.sqrt(n())*22;l(Math.cos(g)*_,Math.sin(g)*_,h%2,2,.5)}e.add(c.build(r,{cast:!1}));const d=Qa({sway:!0});for(const h of i.trees){const g=.45*h.s+.5;if(n()<.5){const p=n()*Math.PI*2,m=g+n()*.9,v=h.x+Math.cos(p)*m,x=h.z+Math.sin(p)*m;Tr(v,x)<.2&&Hb(d,n,v,x,.42+n()*.3)}const _=Math.floor(n()*4);for(let p=0;p<_;p++){const m=n()*Math.PI*2,v=g+n()*1.6,x=h.x+Math.cos(m)*v,w=h.z+Math.sin(m)*v;Tr(x,w)<.2&&!t(x,w)&&Dp(d,n,x,w,.32+n()*.25)}}for(const h of i.rocks)if(n()<.55){const g=n()*Math.PI*2,_=h.s*1.05+.2;Dp(d,n,h.x+Math.cos(g)*_,h.z+Math.sin(g)*_,.3+n()*.2)}const f=d.build(s);return f.name="undergrowth",e.add(f),e}const Gb=`
attribute float size;
attribute float alpha;
attribute vec3 tint;
uniform float uPx; // half the drawing-buffer height: world size → pixels
varying float vAlpha;
varying vec3 vTint;
void main() {
	vAlpha = alpha;
	vTint = tint;
	vec4 mv = modelViewMatrix * vec4( position, 1.0 );
	gl_Position = projectionMatrix * mv;
	gl_PointSize = size * uPx * projectionMatrix[ 1 ][ 1 ] / max( 0.1, - mv.z );
}
`,Wb=`
uniform sampler2D uMap;
varying float vAlpha;
varying vec3 vTint;
void main() {
	float a = texture2D( uMap, gl_PointCoord ).a * vAlpha;
	if ( a < 0.004 ) discard;
	gl_FragColor = vec4( vTint, a );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}
`,$b=new he;function ag({max:i,additive:e=!1}){const t=new Float32Array(i*3),n=new Float32Array(i),r=new Float32Array(i),s=new Float32Array(i*3),a=[];for(let h=0;h<i;h++)a.push({alive:!1}),t[h*3+1]=-999;const o=new Lt;o.setAttribute("position",new lt(t,3)),o.setAttribute("size",new lt(n,1)),o.setAttribute("alpha",new lt(r,1)),o.setAttribute("tint",new lt(s,3));const c=new ki({uniforms:{uMap:{value:dl()},uPx:{value:400}},vertexShader:Gb,fragmentShader:Wb,transparent:!0,depthWrite:!1,blending:e?Hr:Nr}),l=new gd(o,c);l.frustumCulled=!1,l.onBeforeRender=h=>{c.uniforms.uPx.value=h.getDrawingBufferSize($b).y*.5};let u=0;function d(h){const g=a[u];u=(u+1)%i,Object.assign(g,{rise:0,drag:0},h,{alive:!0,age:0})}function f(h){for(let g=0;g<i;g++){const _=a[g];if(!_.alive)continue;_.age+=h;const p=_.age/_.life;if(p>=1){_.alive=!1,r[g]=0,t[g*3+1]=-999;continue}_.vy+=_.rise*h;const m=Math.max(0,1-_.drag*h);_.vx*=m,_.vz*=m,_.x+=_.vx*h,_.y+=_.vy*h,_.z+=_.vz*h,t[g*3]=_.x,t[g*3+1]=_.y,t[g*3+2]=_.z,n[g]=_.size0+(_.size1-_.size0)*p,r[g]=_.alpha*Math.min(1,p/.12)*(1-Math.max(0,(p-.45)/.55)),s[g*3]=_.from.r+(_.to.r-_.from.r)*p,s[g*3+1]=_.from.g+(_.to.g-_.from.g)*p,s[g*3+2]=_.from.b+(_.to.b-_.from.b)*p}o.attributes.position.needsUpdate=!0,o.attributes.size.needsUpdate=!0,o.attributes.alpha.needsUpdate=!0,o.attributes.tint.needsUpdate=!0}return{points:l,spawn:d,update:f}}const qb=new be(6972251),Xb=new be(11906982);function Up(i,e){const t=new Float32Array(i*18),n=new Lt;n.setAttribute("position",new lt(t,3));const r=new Et(n,e);return r.frustumCulled=!1,{mesh:r,geo:n,place(s,a,o,c,l,u,d,f,h){const g=s*18,_=a+l*d,p=c+u*d,m=a-l*d,v=c-u*d,x=-u*f,w=l*f,M=a-l*d*.3,E=c-u*d*.3;t[g]=_,t[g+1]=o,t[g+2]=p,t[g+3]=m,t[g+4]=o,t[g+5]=v,t[g+6]=M-x,t[g+7]=o+h,t[g+8]=E-w,t[g+9]=m,t[g+10]=o,t[g+11]=v,t[g+12]=_,t[g+13]=o,t[g+14]=p,t[g+15]=M+x,t[g+16]=o+h,t[g+17]=E+w}}}function Yb({smokeAt:i,flowerSpots:e}){const t=new Je;t.name="ambient";const n=Tn(8128);let r=0;const s=ag({max:30});t.add(s.points);let a=0;const o=110,c=18,l=6,u=new Float32Array(o*3),d=new Float32Array(o*3),f=[];for(let T=0;T<o;T++)u[T*3]=(n()-.5)*c,u[T*3+1]=n()*l,u[T*3+2]=(n()-.5)*c,f.push({phase:n()*6.28,speed:.6+n()*1.2,drift:.5+n()});const h=new Lt;h.setAttribute("position",new lt(u,3)),h.setAttribute("color",new lt(d,3));const g=new gd(h,new md({size:.055,map:dl(),vertexColors:!0,transparent:!0,blending:Hr,depthWrite:!1,fog:!1}));g.frustumCulled=!1,t.add(g);const _=[];for(let T=0;T<6;T++)_.push({cx:(n()-.5)*70,cz:(n()-.5)*70,r:22+n()*42,h:24+n()*18,w:(.05+n()*.05)*(n()<.5?-1:1),phase:n()*6.28});const p=Up(_.length,new hn({color:3091766,side:Xn}));t.add(p.mesh);const m=[16052194,15780154,15241786,11125480],x=e.filter(T=>Math.hypot(T.x,T.z)<30).slice(0,9).map(T=>({x:T.x,z:T.z,phase:n()*6.28,speed:.7+n()*.5,reach:1.1+n()*.9})),w=Up(Math.max(1,x.length),new hn({vertexColors:!0,side:Xn})),M=new Float32Array(Math.max(1,x.length)*18);x.forEach((T,A)=>{const I=new be(m[A%m.length]);for(let y=0;y<6;y++)M.set([I.r,I.g,I.b],A*18+y*3)}),w.geo.setAttribute("color",new lt(M,3)),t.add(w.mesh);function E(T,A){for(r+=T,a+=T*3;a>=1;)a-=1,s.spawn({x:i.x+(Math.random()-.5)*.2,y:i.y,z:i.z+(Math.random()-.5)*.15,vx:.2+Math.random()*.2,vy:.5+Math.random()*.25,vz:.08+Math.random()*.12,life:4.5+Math.random()*2,size0:.3,size1:1.7,alpha:.24,from:qb,to:Xb});s.update(T);const I=A.position.x,y=A.position.y,S=A.position.z;for(let N=0;N<o;N++){const k=f[N],z=N*3;let H=u[z]+(.22*k.drift+Math.sin(r*.5+k.phase)*.08)*T,O=u[z+1]+Math.sin(r*k.speed+k.phase)*.12*T,J=u[z+2]+(.1*k.drift+Math.cos(r*.4+k.phase)*.08)*T;H-I>c/2?H-=c:H-I<-c/2&&(H+=c),J-S>c/2?J-=c:J-S<-c/2&&(J+=c),O-y>l/2?O-=l:O-y<-l/2&&(O+=l),u[z]=H,u[z+1]=O,u[z+2]=J;const W=.12+.34*Math.max(0,Math.sin(r*k.speed*1.7+k.phase));d[z]=W,d[z+1]=W*.93,d[z+2]=W*.74}h.attributes.position.needsUpdate=!0,h.attributes.color.needsUpdate=!0,_.forEach((N,k)=>{const z=N.phase+N.w*r,H=Math.sign(N.w);p.place(k,N.cx+Math.cos(z)*N.r,N.h+Math.sin(r*.3+N.phase)*1.5,N.cz+Math.sin(z)*N.r,-Math.sin(z)*H,Math.cos(z)*H,.34,1,Math.sin(r*3.2+N.phase)*.36+.1)}),p.geo.attributes.position.needsUpdate=!0,x.forEach((N,k)=>{const z=N.phase+r*N.speed,H=N.x+Math.sin(z)*N.reach+Math.sin(z*2.3)*.4,O=N.z+Math.cos(z*.8)*N.reach+Math.cos(z*1.9)*.4,J=Math.cos(z)*N.reach+Math.cos(z*2.3)*.92,W=-Math.sin(z*.8)*N.reach*.8-Math.sin(z*1.9)*.76,pe=Math.hypot(J,W)||1,ge=Nt(H,O)+.55+Math.sin(z*3.1)*.22;w.place(k,H,ge,O,J/pe,W/pe,.035,.085,Math.abs(Math.sin(r*13+N.phase))*.085)}),w.geo.attributes.position.needsUpdate=!0}return{group:t,update:E}}const we=5192229,Bt=7689782,Rt=9728842,og=12097359,Xr=10123838,Np=13348965,rr=9276034,$s=7828589,Ui=13149018,Ed=15128238,Ha=15722184,qc=7027238,$i=12428924,At=3815999,er=3812380,kr=12100986,Kb=2365970,D=(i,e,t)=>new _i(i,e,t),xe=(i,e,t,n=7)=>new On(i,e,t,n);function cg(i,e,{length:t,halfZ:n,eaveY:r,peakY:s,over:a=.33,x:o=0,thick:c=.17}){const l=Math.atan2(s-r,n),u=Math.sin(l),d=Math.cos(l),f=n/d+a,h=(p,m)=>({y:s-u*p+d*m,z:d*p+u*m});for(const p of[-1,1]){const m=(x,w,M,E,T,A=c)=>{const I=h((w+M)/2,E+A/2);i.add($(D(x,A,M-w),T,{x:o,y:I.y,z:p*I.z,rx:p*l}))};m(t+.1,f*.56,f,0,Ie(Xr,.95+e()*.1)),m(t+.04,f*.26,f*.64,.05,Ie(og,.95+e()*.1)),m(t,-.03,f*.34,.1,Ie(Np,.94+e()*.08));const v=Math.round(t/.3);for(let x=0;x<v;x++){const w=.14+e()*.17,M=h(f+w/2-.06,c*.42);i.add($(D(.22+e()*.12,c*.8,w),Ie(Xr,.84+e()*.22),{x:o-t/2+(x+.5)*(t/v)+(e()-.5)*.08,y:M.y,z:p*M.z,rx:p*(l+.1+e()*.16)}))}for(const x of[-1,1]){const w=h(f/2-.02,.1);i.add($(D(.05,.19,f+.05),we,{x:o+x*(t/2-.03),y:w.y,z:p*w.z,rx:p*l}))}}const g=s+d*(.1+c)+.02;i.add($(xe(.16,.16,t+.08,6),Ie(Np,1.03),{x:o,y:g-.03,rz:Math.PI/2}));const _=Math.max(2,Math.round(t/.8));for(let p=0;p<_;p++){const m=o-t/2+(p+.5)*(t/_);for(const v of[-1,1])i.add($(D(.035,.035,.62),we,{x:m+v*.03,y:g+.05,rx:v*(l+.3)}))}return{pitch:l,spot:h}}function Xc(i,e,t,n){const r=new Wm;r.moveTo(-i,e),r.lineTo(i,e),r.lineTo(0,t),r.closePath();const s=new vd(r,{depth:n,bevelEnabled:!1});return s.rotateY(-Math.PI/2),s}function tr(i,e,{axis:t,at:n,from:r,to:s,y0:a,y1:o,color:c,thick:l=.04,width:u=.27}){let d=r;for(;d<s-.03;){let f=u*(.8+e()*.4);s-d-f<.1&&(f=s-d);const h=Ie(c,.86+e()*.26),g=d+f/2,_=(a+o)/2;i.add(t==="z"?$(D(f-.014,o-a,l),h,{x:g,y:_,z:n}):$(D(l,o-a,f-.014),h,{x:n,y:_,z:g})),d+=f}}function Yo(i,e,{axis:t,at:n,from:r,to:s,top:a=.24,depth:o=.14}){let c=r;for(;c<s-.05;){let l=.28+e()*.3;s-c-l<.14&&(l=s-c);const u=a+(e()-.5)*.1,d=Ie(e()<.5?rr:$s,.9+e()*.2),f=o*(.85+e()*.35),h=c+l/2,g={y:u-.25,ry:(e()-.5)*.07};i.add(t==="z"?$(D(l-.03,.5,f),d,{x:h,z:n,...g}):$(D(f,.5,l-.03),d,{x:n,z:h,...g})),c+=l}}function lg(i,{x:e,y:t,z:n,width:r,rows:s,gap:a=.08}){for(let o=0;o<s;o++)i.add($(D(r*(o===s-1?.6:1),.018,.012),er,{x:e+(o%2?.02:-.02),y:t-o*a,z:n,rz:o%2?-.04:.03,shadow:!1}))}function As(i,{x:e,y:t=0,z:n,r=.3,color:s=Ui,lean:a=0}){const o=$(new Jt(r,7,5),s,{x:e,y:t+r*.72,z:n,rz:a});o.scale.set(1,.85,.88),i.add(o),i.add($(xe(r*.22,r*.34,r*.34,6),Ie(s,.9),{x:e-Math.sin(a)*r*.9,y:t+r*1.5,z:n,rz:a})),i.add($(xe(r*.26,r*.26,r*.07,6),kr,{x:e-Math.sin(a)*r*.8,y:t+r*1.38,z:n,rz:a}))}function Td({skin:i,brow:e=4862496,r:t=.13}){const n=new Je;n.add($(new Jt(t,8,6),i,{})),n.add($(D(.055,.045,.045),Ie(i,.93),{x:t*.97,y:-.012,shadow:!1}));for(const r of[-1,1])n.add($(D(.02,.03,.028),Kb,{x:t*.9,y:.03,z:r*.05,shadow:!1})),n.add($(D(.02,.012,.05),e,{x:t*.92,y:.058,z:r*.05,rx:r*.18,shadow:!1})),n.add($(D(.03,.045,.02),Ie(i,.9),{y:-.005,z:r*t*.97,shadow:!1}));return n}function qs({sleeve:i,skin:e,w:t=.06,len:n=.36,x:r=0,y:s=0,z:a=0,rx:o=0,rz:c=0}){const l=new Je;return l.position.set(r,s,a),l.rotation.set(o,0,c),l.add($(D(t,n,t),i,{})),l.add($(D(t*1.15,.035,t*1.15),Ie(i,.78),{y:n/2-.02})),l.add($(D(t*.95,.07,t*.95),e,{y:n/2+.03})),l}function Ad(i,{robe:e,belt:t=qc,x:n=0,z:r=0,girth:s=1,front:a=[1,0]}){const[o,c]=a;i.add($(xe(.17*s,.245*s,.95,8),e,{x:n,y:.32,z:r})),i.add($(xe(.232*s,.238*s,.07,8),Ie(e,.78),{x:n,y:.06,z:r})),i.add($(xe(.188*s,.188*s,.06,8),t,{x:n,y:.66,z:r}));for(const l of[-1,1])i.add($(o?D(.13,.07,.08):D(.08,.07,.13),4010279,{x:n+o*.21*s-c*l*.08,y:.025,z:r+c*.21*s+o*l*.08}))}const Rd={halfX:1.7,halfZ:1.45,wallT:.12,door:{z0:-.97,z1:-.07,h:1.62,openAngle:1.9},bed:{x:-1.05,z:.55,topY:.46},wake:{x:-.3,z:-.6},hearth:{x:.3,z:.45,r:.55},chest:{x0:-1.28,x1:-.62,z0:-1.21,z1:-.79,lidHinge:.23,openAngle:-1.7},table:{x:1,z:.95,r:.5},ledger:{x:.85,z:-1.1},ceilY:1.85,smoke:{x:.3,y:3.12,z:.48},barrel:{x:1.1,z:1.75,r:.38},woodpile:{x0:-1.45,x1:.52,z0:-2.02,z1:-1.45}},kp=7035460,zp=10247740,jb=7305790;function Jb(){const i=new Je,e=Rd,t=Tn(101),n=(y,S,N)=>{const k=$(y,S,N);return i.add(k),k},r=(y,S,N,k,z,H,O)=>n(D(y,S,N),Ie(we,.9+t()*.22),{x:k,y:z,z:H,...O}),s=e.halfX-e.wallT/2,a=e.halfZ-e.wallT/2,o=(y,S)=>D(y,2.3,S);n(o(e.wallT,2.9),$i,{x:-s,y:.85}),n(o(3.4,e.wallT),Ie($i,.97),{y:.85,z:a}),n(o(3.4,e.wallT),Ie($i,1.03),{y:.85,z:-a}),n(o(e.wallT,e.halfZ+e.door.z0),$i,{x:s,y:.85,z:(e.door.z0-e.halfZ)/2}),n(o(e.wallT,e.halfZ-e.door.z1),$i,{x:s,y:.85,z:(e.door.z1+e.halfZ)/2}),n(D(e.wallT,2-e.door.h,1.1),$i,{x:s,y:(2+e.door.h)/2,z:(e.door.z0+e.door.z1)/2}),n(Xc(e.halfZ,2,3.12,e.wallT),Ie($i,.98),{x:e.halfX}),n(Xc(e.halfZ,2,3.12,e.wallT),Ie($i,.98),{x:-1.7+e.wallT});for(const y of[-1,1])for(const S of[-1,1])r(.17,2.36,.17,y*1.665,.85,S*1.415);for(const y of[-1,1]){const S=y*1.475;r(3.2,.14,.07,0,.38,S),r(3.2,.12,.07,0,1.93,S),r(.13,1.44,.07,-.57,1.15,S),r(.13,1.44,.07,.57,1.15,S),r(1,.09,.06,0,1.2,S),r(.09,.95,.06,-1.33,.86,S,{rz:.58}),r(.09,.95,.06,1.33,.86,S,{rz:-.58}),Yo(i,t,{axis:"z",at:y*1.52,from:-1.78,to:1.78})}r(.07,.14,2.7,-1.725,.38,0),r(.07,.12,2.7,-1.725,1.93,0),r(.07,1.44,.13,-1.725,1.15,-.45),r(.07,1.44,.13,-1.725,1.15,.45),r(.06,.09,.78,-1.725,1.2,0),r(.06,.9,.09,-1.725,.86,-1.02,{rx:-.55}),r(.06,.9,.09,-1.725,.86,1.02,{rx:.55}),r(.07,1.08,.12,-1.725,2.5,0),Yo(i,t,{axis:"x",at:-1.77,from:-1.52,to:1.52});const c=(e.door.z0+e.door.z1)/2;r(.07,.12,2.7,1.725,1.93,0),r(.08,1.74,.11,1.725,.85,e.door.z0-.055),r(.08,1.74,.11,1.725,.85,e.door.z1+.055),r(.08,.13,1.14,1.725,1.7,c),r(.07,.14,1.25,1.725,.38,.7),r(.07,1.08,.12,1.725,2.5,0),Yo(i,t,{axis:"x",at:1.77,from:.06,to:1.52}),Yo(i,t,{axis:"x",at:1.77,from:-1.52,to:-1.08}),n(D(.42,.3,1),Ie(rr,1.05),{x:1.93,y:-.135,z:c}),n(D(.05,.5,.36),Rt,{x:1.735,y:.78,z:.78,rx:.07}),n(D(.8,.14,.05),Rt,{x:-.4,y:1.56,z:1.492,rz:-.1}),n(D(.5,.42,.03),6112816,{x:1.05,y:1.57,z:-1.462});for(const y of[1.44,1.57,1.7])n(D(.5,.035,.02),9071429,{x:1.05,y,z:-1.482,shadow:!1});for(const y of[.9,1.05,1.2])n(D(.03,.42,.016),8019259,{x:y,y:1.57,z:-1.474,shadow:!1});const l=cg(i,t,{length:4.1,halfZ:e.halfZ,eaveY:2,peakY:2.98}),u=l.spot(.32,.28);n(D(.36,.03,.26),2300434,{x:e.smoke.x,y:u.y,z:u.z,rx:l.pitch,shadow:!1});const d=l.spot(.32,.5);n(D(.52,.04,.4),Ie(Xr,.9),{x:e.smoke.x,y:d.y,z:d.z,rx:l.pitch});for(const y of[-.22,.22])n(D(.03,.24,.03),we,{x:e.smoke.x+y,y:(u.y+d.y)/2,z:(u.z+d.z)/2});r(3.16,.1,.12,0,2,-.7),r(3.16,.1,.12,0,2,.7),r(3.2,.1,.1,0,2.9,0);const f=l.spot(.9,-.05);for(const y of[-1.15,-.38,.38,1.15])for(const S of[-1,1])r(.07,.09,1.74,y,f.y,S*f.z,{rx:S*l.pitch});n(D(.06,e.door.h,.1),we,{x:1.66,y:e.door.h/2,z:e.door.z1+.04}),n(D(.06,e.door.h,.1),we,{x:1.66,y:e.door.h/2,z:e.door.z0-.04});const h=new Je;h.position.set(s,0,e.door.z0);const g=e.door.z1-e.door.z0-.06,_=e.door.h-.08,p=g/2+.02;for(let y=0;y<4;y++){const S=g/4;h.add($(D(.06,_,S-.012),Ie(Bt,.82+t()*.28),{y:_/2+.02,z:.02+S*(y+.5)}))}h.add($(D(.035,.11,g-.04),we,{x:.045,y:1.2,z:p})),h.add($(D(.035,.11,g-.04),we,{x:.045,y:.42,z:p})),h.add($(D(.03,.09,1),we,{x:.044,y:.81,z:p,rx:-.76})),h.add($(D(.02,.05,.3),At,{x:.066,y:1.2,z:.17,shadow:!1})),h.add($(D(.02,.05,.3),At,{x:.066,y:.42,z:.17,shadow:!1})),h.add($(D(.04,.1,.035),At,{x:.07,y:.86,z:g-.08})),i.add(h);const m=$(D(.012,_-.04,g-.03),8006176,{x:.036,y:_/2+.02,z:p,keep:!0});m.visible=!1,h.add(m);const v=new Et(D(.08,.42,.42),new hn({color:4860950}));v.position.set(1.71,1.35,.74),i.add(v),r(.06,.07,.58,1.742,1.595,.74),r(.06,.44,.07,1.742,1.35,.485),r(.06,.44,.07,1.742,1.35,.995),n(D(.14,.05,.62),Rt,{x:1.77,y:1.115,z:.74}),n(D(.03,.44,.14),Ie(Bt,1.08),{x:1.745,y:1.35,z:1.1}),n(D(.03,.44,.14),Ie(Bt,.94),{x:1.745,y:1.35,z:1.245});for(const y of[1.23,1.47])n(D(.035,.05,.3),we,{x:1.762,y,z:1.172,shadow:!1});n(xe(.32,.36,.78,9),Rt,{x:e.barrel.x,y:.39,z:e.barrel.z}),n(xe(.37,.37,.07,9),At,{x:e.barrel.x,y:.2,z:e.barrel.z}),n(xe(.345,.345,.07,9),At,{x:e.barrel.x,y:.6,z:e.barrel.z}),n(xe(.31,.31,.035,9),we,{x:e.barrel.x+.05,y:.8,z:e.barrel.z-.03,rz:.06});for(let y=0;y<3;y++)for(let S=0;S<6-y;S++){const N=.075+t()*.02,k=-1.3+y*.095+S*.19,z=.08+y*.15;n(xe(N,N,.5,6),Ie(Bt,.8+t()*.3),{x:k,y:z,z:-1.74,rx:Math.PI/2}),n(xe(N*.82,N*.82,.012,6),Ie(Rt,1.12),{x:k,y:z,z:-1.992,rx:Math.PI/2,shadow:!1})}n(xe(.2,.23,.44,8),Ie(Bt,.9),{x:.24,y:.2,z:-1.76}),n(D(.035,.52,.035),Rt,{x:.33,y:.62,z:-1.76,rz:-.55}),n(D(.15,.1,.03),At,{x:.2,y:.47,z:-1.76,rz:-.55});const x=new Je;x.add($(D(.03,.38,.38),11454159,{x:1.76,y:1.35,z:.74,shadow:!1})),x.add($(D(.02,.4,.035),we,{x:1.78,y:1.35,z:.74})),x.add($(D(.02,.035,.4),we,{x:1.78,y:1.35,z:.74})),x.visible=!1,i.add(x);const w=new Je;w.add($(D(.18,.03,.03),we,{x:1.78,y:1.9,z:.12})),w.add($(D(.02,.1,.02),At,{x:1.86,y:1.84,z:.12,shadow:!1})),w.add($(D(.11,.15,.11),At,{x:1.86,y:1.71,z:.12}));const M=new Et(D(.055,.08,.055),new hn({color:16766574}));M.position.set(1.86,1.71,.12),w.add(M);const E=fl(16762982,.7,.55);E.position.set(1.9,1.71,.12),w.add(E),w.visible=!1,i.add(w);const T=new Je;T.add($(D(1.5,.16,.85),4863524,{x:-.5,y:.02,z:2.05}));for(const y of[1.78,2.06,2.34])T.add($(D(1.4,.05,.12),3943196,{x:-.5,y:.1,z:y,shadow:!1}));for(const[y,S]of[[-1.05,1.85],[-.55,1.88],[-.05,1.83],[-1,2.28],[-.5,2.3],[0,2.26]])T.add($(new Jt(.095,6,5),7305790,{x:y,y:.14,z:S})),T.add($(new Jt(.06,5,4),9083474,{x:y,y:.19,z:S,shadow:!1}));T.add($(new Zn(.05,.16,5),5603133,{x:-.28,y:.18,z:2.07})),T.add($(new Zn(.05,.14,5),5603133,{x:-.75,y:.17,z:2.05})),T.visible=!1,i.add(T);const A=Zb(i),I={door:m,window:x,lantern:w,garden:T,...A.upgrades};return Rn(i),{group:i,doorPivot:h,chestLid:A.chestLid,upgrades:I,hearth:A.hearth}}function Zb(i,e){const t=Rd,n=(A,I,y)=>i.add($(A,I,y)),r=t.bed.x,s=t.bed.z;n(D(.9,.12,1.5),we,{x:r,y:.26,z:s});for(const[A,I]of[[-.38,-.66],[.38,-.66],[-.38,.66],[.38,.66]])n(D(.09,.26,.09),we,{x:r+A,y:.13,z:s+I});n(D(.8,.14,1.4),Ui,{x:r,y:.39,z:s}),n(D(.82,.06,.85),kp,{x:r,y:.47,z:s+.25}),n(D(.82,.062,.1),Ie(kp,1.25),{x:r,y:.471,z:s-.13,shadow:!1}),n(D(.55,.1,.3),13351310,{x:r,y:.49,z:s-.5});for(const[A,I]of[[.42,-.3],[-.44,.1],[.43,.5]])n(D(.06,.03,.2),Ie(Ui,1.1),{x:r+A,y:.35,z:s+I,ry:.4,shadow:!1});const a=t.hearth.x,o=t.hearth.z;n(xe(.34,.38,.06,9),4866618,{x:a,y:.03,z:o,shadow:!1});for(let A=0;A<7;A++){const I=A/7*Math.PI*2+.4;n(D(.16,.14,.16),Ie(rr,.9+A%3*.08),{x:a+Math.cos(I)*.42,y:.07,z:o+Math.sin(I)*.42,ry:I})}const c=new Et(xe(.18,.22,.05,7),new hn({color:14248490}));c.position.set(a,.06,o),i.add(c),n(D(.4,.09,.1),2892828,{x:a,y:.1,z:o,ry:.5}),n(D(.36,.09,.1),2892828,{x:a,y:.1,z:o,ry:-.7});const l=new Je;l.position.set(a,.1,o);const u=new Et(new Zn(.1,.32,6),new hn({color:16743718}));u.position.y=.16;const d=new Et(new Zn(.055,.2,5),new hn({color:16766574}));d.position.y=.12,l.add(u,d),i.add(l);const f=fl(16747066,1.5,.4);f.position.set(a,.35,o),i.add(f);const h=new Km(16751189,2.2,4.5,2);h.position.set(a,.8,o),i.add(h);for(let A=0;A<3;A++){const I=A/3*Math.PI*2+.9,y=$(D(.035,1.02,.035),we,{x:a+Math.cos(I)*.19,y:.5,z:o+Math.sin(I)*.19});y.rotation.set(-Math.sin(I)*.36,0,Math.cos(I)*.36),i.add(y)}n(D(.015,.3,.015),At,{x:a,y:.78,z:o,shadow:!1}),n(xe(.13,.1,.15,7),3092275,{x:a,y:.57,z:o}),n(xe(.14,.14,.025,7),4013378,{x:a,y:.65,z:o});const g=t.table.x,_=t.table.z;n(D(.85,.07,.55),Bt,{x:g,y:.62,z:_});for(const[A,I]of[[-.34,-.2],[.34,-.2],[-.34,.2],[.34,.2]])n(D(.07,.6,.07),we,{x:g+A,y:.3,z:_+I});n(xe(.1,.07,.08,7),9071167,{x:g-.15,y:.7,z:_});const p=$(new Jt(.09,6,5),11105854,{x:g+.16,y:.69,z:_+.08});p.scale.set(1.25,.6,.9),i.add(p),n(xe(.035,.03,.09,6),Rt,{x:g+.05,y:.7,z:_-.14}),n(xe(.16,.16,.06,7),Rt,{x:.45,y:.38,z:1.05}),n(xe(.05,.07,.36,6),we,{x:.45,y:.18,z:1.05});const m=(t.chest.x0+t.chest.x1)/2,v=(t.chest.z0+t.chest.z1)/2;n(D(.66,.34,.42),Bt,{x:m,y:.17,z:v}),n(D(.58,.01,.34),2760728,{x:m,y:.345,z:v,shadow:!1}),n(D(.08,.36,.48),At,{x:m-.2,y:.15,z:v}),n(D(.08,.36,.48),At,{x:m+.2,y:.15,z:v}),n(D(.3,.05,.22),8022608,{x:m-.1,y:.36,z:v,ry:.08,shadow:!1}),n(D(.28,.03,.2),Ie(8022608,1.15),{x:m-.11,y:.395,z:v+.01,ry:.05,shadow:!1}),n(new Jt(.06,6,5),qc,{x:m+.16,y:.38,z:v-.05,shadow:!1}),n(D(.12,.025,.04),$s,{x:m+.15,y:.36,z:v+.1,ry:-.5,shadow:!1});const x=new Je;x.position.set(m,.34,v-t.chest.lidHinge),x.add($(D(.7,.1,.46),we,{y:.05,z:.23})),x.add($(D(.08,.12,.48),At,{x:-.2,y:.05,z:.23})),x.add($(D(.08,.12,.48),At,{x:.2,y:.05,z:.23})),x.add($(D(.07,.09,.03),11570511,{y:-.03,z:.465,shadow:!1})),i.add(x),n(D(.55,.62,.04),we,{x:t.ledger.x,y:1.25,z:-1.31}),n(D(.42,.5,.02),Ed,{x:t.ledger.x,y:1.24,z:-1.285,shadow:!1});for(let A=0;A<5;A++)n(D(.28,.018,.012),er,{x:t.ledger.x+(A%2?.02:-.02),y:1.42-A*.08,z:-1.272,rz:A%2?-.05:.04,shadow:!1});n(D(1.1,.05,.26),Rt,{x:-.2,y:1.28,z:-1.18}),n(D(.05,.18,.2),we,{x:-.6,y:1.18,z:-1.2}),n(D(.05,.18,.2),we,{x:.2,y:1.18,z:-1.2}),n(xe(.09,.11,.2,7),zp,{x:-.5,y:1.41,z:-1.18}),n(xe(.08,.1,.18,7),zp,{x:-.18,y:1.4,z:-1.18}),n(xe(.07,.1,.24,7),8810842,{x:.1,y:1.43,z:-1.18});for(const A of[.1,.65]){n(D(.015,.14,.015),4862496,{x:A,y:1.89,z:-.7,shadow:!1}),n(xe(.03,.03,.03,5),kr,{x:A,y:1.81,z:-.7,shadow:!1});for(const[I,y,S]of[[0,0,0],[.03,.01,.35],[-.03,.015,-.35],[.005,-.03,.15]])n(new Zn(.035,.2,4),Ie(jb,.85+Math.abs(S)*.6),{x:A+I,y:1.7,z:-.7+y,rx:Math.PI,rz:S})}for(const[A,I]of[[.07,.22],[.07,.38],[.18,.3]])n(xe(.06,.06,.5,5),we,{x:1.3,y:A,z:I,rz:Math.PI/2});n(D(.06,.04,.04),we,{x:1.55,y:1.55,z:.3}),n(D(.05,.62,.34),5917242,{x:1.535,y:1.22,z:.3,rx:.04}),n(D(.06,.16,.26),5062449,{x:1.53,y:1.47,z:.3});const w=new Et(D(.02,.38,.38),new hn({color:16248016}));w.position.set(1.572,1.35,.74),i.add(w),n(D(.03,.05,.5),we,{x:1.565,y:1.565,z:.74,shadow:!1}),n(D(.03,.05,.5),we,{x:1.565,y:1.135,z:.74,shadow:!1}),n(D(.03,.4,.05),we,{x:1.565,y:1.35,z:.525,shadow:!1}),n(D(.03,.4,.05),we,{x:1.565,y:1.35,z:.955,shadow:!1}),n(xe(.11,.09,.2,8),Rt,{x:1.38,y:.1,z:-1.16}),n(xe(.115,.115,.025,8),At,{x:1.38,y:.17,z:-1.16,shadow:!1});const M=new Je;M.add($(D(1,.035,.7),9058858,{x:-.45,y:.06,z:-.15})),M.add($(D(1.04,.03,.1),7220256,{x:-.45,y:.062,z:.17})),M.add($(D(1.04,.03,.1),7220256,{x:-.45,y:.062,z:-.47})),M.add($(D(.5,.037,.3),13214298,{x:-.45,y:.062,z:-.15,ry:Math.PI/4,shadow:!1})),M.visible=!1,i.add(M);const E=new Je;E.add($(D(.26,.2,.03),we,{x:-.85,y:1.68,z:-1.31}));const T=$(new Jt(.07,6,5),7235166,{x:-.87,y:1.68,z:-1.27});return T.scale.set(1.4,1,1),E.add(T),E.add($(new Jt(.045,6,5),7235166,{x:-.75,y:1.7,z:-1.27})),E.add($(D(.14,.02,.02),11569802,{x:-1.02,y:1.66,z:-1.27,rz:.4})),E.visible=!1,i.add(E),{upgrades:{rug:M,trophy:E},hearth:{flames:l,glow:h,halo:f},chestLid:x}}function Qb(){const i=new Je,e=Tn(303),t=(r,s,a)=>i.add($(r,s,a));for(const r of[-.95,.95]){t(xe(.07,.09,2.4,6),we,{x:r,y:1.1,rz:r>0?.02:0});for(const s of[-1,1])t(D(.05,.75,.05),Ie(we,1.1),{x:r,y:.3,z:s*.2,rx:s*-.5})}for(let r=0;r<5;r++)t(D(2.1-e()*.04,.222,.08),Ie(Bt,.86+e()*.26),{y:.99+r*.23});t(D(2.3,.1,.16),we,{y:2.12}),t(D(2.16,.07,.11),we,{y:.85});for(const r of[-1,1])t(D(2.5,.05,.36),Ie(Xr,r>0?1:.9),{y:2.27,z:r*.14,rx:r*.5});t(D(2.54,.06,.07),we,{y:2.36});const n=[{x:-.58,y:1.6,s:.42,r:.06},{x:.08,y:1.42,s:.5,r:-.04},{x:.68,y:1.62,s:.36,r:.1},{x:-.62,y:1.1,s:.3,r:-.08},{x:.66,y:1.13,s:.34,r:.05}];for(const r of n)t(D(r.s,r.s*1.25,.02),Ie(Ed,.94+e()*.1),{x:r.x,y:r.y,z:.055,rz:r.r,shadow:!1}),lg(i,{x:r.x,y:r.y+r.s*.36,z:.07,width:r.s*.66,rows:4,gap:r.s*.2}),t(D(.03,.03,.03),At,{x:r.x,y:r.y+r.s*.56,z:.075,shadow:!1});return t(xe(.035,.035,.03,6),9053208,{x:.2,y:1.2,z:.08,rx:Math.PI/2,shadow:!1}),Rn(i)}function e2(){const i=new Je,e=(t,n,r)=>i.add($(t,n,r));return e(xe(.07,.09,2.3,6),we,{y:.75}),e(D(.2,.16,.16),rr,{x:.12,y:.03,z:.05,ry:.4}),e(D(.16,.13,.18),$s,{x:-.11,y:.02,z:-.06,ry:-.3}),e(D(.92,1.02,.07),Bt,{y:1.42}),e(D(1,.07,.1),we,{y:1.95}),e(D(1,.07,.1),we,{y:.89}),e(D(.07,1,.1),we,{x:-.47,y:1.42}),e(D(.07,1,.1),we,{x:.47,y:1.42}),e(D(1.1,.05,.28),Xr,{y:2.02,rx:.1}),e(D(.68,.82,.02),Ed,{y:1.42,z:.045,rz:.03,shadow:!1}),e(D(.4,.05,.012),er,{y:1.76,z:.062,rz:.03,shadow:!1}),lg(i,{x:0,y:1.64,z:.062,width:.46,rows:5,gap:.1}),e(D(.05,.14,.012),8006176,{x:.17,y:1.14,z:.06,shadow:!1}),e(xe(.05,.05,.02,7),9053208,{x:.17,y:1.08,z:.066,rx:Math.PI/2,shadow:!1}),Rn(i)}function t2(){const i=new Je,e=(t,n,r)=>i.add($(t,n,r));e(xe(.5,.56,.16,8),$s,{y:.05}),e(xe(.4,.46,.12,8),rr,{y:.18}),e(xe(.27,.36,.72,8),rr,{y:.6}),e(xe(.4,.28,.12,8),Ie(rr,1.06),{y:1.02}),e(xe(.44,.44,.07,8),$s,{y:1.1}),e(D(.46,.05,.62),Ha,{x:-.22,y:1.2,rz:.2}),e(D(.46,.05,.62),Ha,{x:.22,y:1.2,rz:-.2}),e(D(.5,.04,.68),qc,{x:-.24,y:1.155,rz:.2}),e(D(.5,.04,.68),qc,{x:.24,y:1.155,rz:-.2}),e(D(.3,.012,.56),Ie(Ha,1.04),{x:.13,y:1.27,rz:-.55,shadow:!1});for(const t of[-1,1])n2(i,t*.22,1.226,t*-.2);return e(D(.05,.045,.3),9053208,{y:1.23,z:.18,shadow:!1}),e(xe(.045,.055,.07,6),2762274,{x:.36,y:1.17,z:-.2}),e(D(.012,.3,.05),15327952,{x:.37,y:1.33,z:-.2,rz:-.35,rx:.2,shadow:!1}),Rn(i)}function n2(i,e,t,n){for(let r=0;r<5;r++)i.add($(D(.3,.006,.016),er,{x:e,y:t+.004,z:-.2+r*.09,rz:n,shadow:!1}))}function i2(){const i=new Je,e=Tn(404),t=(h,g,_)=>i.add($(h,g,_)),n=11570511,r=13214247,s=14208942,a=5267514,o=5003830,c=13608047;for(const[h,g]of[[.85,-1.25],[.85,1.25],[-.85,-1.25],[-.85,1.25]])t(xe(.09,.11,2.5,6),we,{x:h,y:.8,z:g});for(const h of[-1,1])t(D(.06,.55,.06),we,{x:.85,y:2.02,z:h*1.02,rx:h*.75});t(D(2.7,.14,3.1),Xr,{y:2.2,rz:.16}),t(D(1.5,.1,3.16),Ie(og,1.02),{x:.52,y:2.39,rz:.16}),t(D(.8,.09,3.2),13348965,{x:.95,y:2.53,rz:.16});for(let h=0;h<10;h++)t(D(.2+e()*.14,.1,.26+e()*.1),Ie(Xr,.84+e()*.2),{x:-1.4,y:1.96,z:-1.4+h*.31+(e()-.5)*.06,rz:.3+e()*.2});t(D(.16,.07,3.12),we,{x:1.3,y:2.41,rz:.16}),t(D(.12,.1,2.9),we,{x:.85,y:2.28});for(let h=0;h<9;h++)t(D(.02,.2+h%2*.04,.27),h%2?s:a,{x:.9,y:2.13-h%2*.02,z:-1.1+h*.275,shadow:!1});t(D(.06,1.2,2.6),Ie(we,.85),{x:-.93,y:.45}),tr(i,e,{axis:"x",at:-.89,from:-1.3,to:1.3,y0:-.15,y1:1.05,color:Bt}),tr(i,e,{axis:"x",at:-.97,from:-1.3,to:1.3,y0:-.15,y1:1.05,color:Bt}),t(D(1.6,.08,.08),Rt,{y:.95,z:1.25}),t(D(1.6,.08,.08),Rt,{y:.95,z:-1.25}),t(D(.5,1,2.26),Ie(we,.9),{x:.7,y:.4}),tr(i,e,{axis:"x",at:.965,from:-1.15,to:1.15,y0:-.1,y1:.9,color:Bt,width:.24}),t(D(.66,.07,2.44),Rt,{x:.7,y:.94}),t(D(.5,.02,1.46),s,{x:.7,y:.985,shadow:!1});for(let h=0;h<2;h++)for(let g=0;g<6;g++)(h+g)%2||t(D(.24,.015,.24),a,{x:.7+(h?.12:-.12),y:.992,z:-.6+g*.24,shadow:!1});t(xe(.02,.028,.32,5),n,{x:.7,y:1.16,z:-.5}),t(xe(.05,.06,.03,6),n,{x:.7,y:1.01,z:-.5}),t(D(.02,.02,.46),n,{x:.7,y:1.33,z:-.5});for(const h of[-1,1])t(D(.012,.1,.012),At,{x:.7,y:1.27,z:-.5+h*.22,shadow:!1}),t(xe(.07,.05,.025,7),n,{x:.7,y:1.21,z:-.5+h*.22});t(xe(.05,.05,.1,7),r,{x:.74,y:1.04,z:.28}),t(xe(.05,.05,.06,7),r,{x:.62,y:1.02,z:.38}),t(xe(.045,.045,.014,7),r,{x:.7,y:1,z:.14,shadow:!1}),t(xe(.045,.045,.014,7),r,{x:.81,y:1,z:.44,shadow:!1}),t(D(.22,.02,.3),Ha,{x:.66,y:1,z:.82,rz:.09}),t(D(.22,.02,.3),Ha,{x:.84,y:1,z:.82,rz:-.09}),t(xe(.03,.035,.05,6),2762274,{x:.56,y:1,z:1.02}),t(D(.01,.22,.035),15327952,{x:.57,y:1.12,z:1.02,rz:-.3,shadow:!1}),Ad(i,{robe:o,x:.05});const l=new Je;l.position.set(.05,.78,0),l.add($(xe(.15,.175,.34,8),o,{y:.12})),l.add($(xe(.1,.155,.06,8),Ie(o,.8),{y:.3}));const u=Td({skin:c,brow:5916210});u.position.set(0,.42,0),u.add($(xe(.14,.15,.11,8),s,{y:.07})),u.add($(D(.06,.12,.27),s,{x:-.07,y:0})),l.add(u);const d=qs({sleeve:o,skin:c,x:.2,y:.1,z:-.13,rz:-1.15}),f=qs({sleeve:o,skin:c,x:.2,y:.1,z:.13,rz:-1.15});return l.add(d,f),i.add(l),t(D(.52,.3,.36),Bt,{x:-.5,y:.15,z:.7}),t(D(.56,.09,.4),we,{x:-.5,y:.34,z:.7}),t(D(.07,.44,.42),At,{x:-.62,y:.17,z:.7}),t(D(.07,.44,.42),At,{x:-.38,y:.17,z:.7}),t(D(.09,.11,.04),n,{x:-.22,y:.2,z:.7,shadow:!1}),t(D(.015,.34,.015),At,{x:1.02,y:2.05,z:-.95,shadow:!1}),t(D(.04,.36,.5),we,{x:1.02,y:1.72,z:-.95}),t(xe(.11,.11,.05,9),r,{x:1.05,y:1.72,z:-.95,rz:Math.PI/2,shadow:!1}),t(xe(.11,.11,.05,9),r,{x:.99,y:1.72,z:-.95,rz:Math.PI/2,shadow:!1}),Rn(i),{group:i,sway:l,head:u,armR:d,armL:f}}function r2(){const i=new Je,e=Tn(202),t=(n,r,s)=>i.add($(n,r,s));for(const[n,r]of[[-1.3,-1],[1.3,-1],[-1.3,1],[1.3,1]])t(xe(.15,.24,.84,6),Ie(rr,.94+e()*.12),{x:n,y:.4,z:r}),t(xe(.4,.3,.13,8),Ie($s,.95+e()*.12),{x:n,y:.86,z:r});for(const n of[-1,1])t(D(3.6,.16,.2),we,{y:1.02,z:n});for(const n of[-1.6,-.8,0,.8,1.6])t(D(.14,.12,2.76),Ie(we,1.1),{x:n,y:1.1});t(D(3.3,1.76,2.5),Ie(we,.75),{y:2.03}),tr(i,e,{axis:"z",at:1.27,from:-1.66,to:1.66,y0:1.16,y1:2.9,color:Rt}),tr(i,e,{axis:"z",at:-1.27,from:-1.66,to:1.66,y0:1.16,y1:2.9,color:Rt}),tr(i,e,{axis:"x",at:1.67,from:-1.26,to:1.26,y0:1.16,y1:2.9,color:Rt}),tr(i,e,{axis:"x",at:-1.67,from:-1.26,to:1.26,y0:1.16,y1:2.9,color:Rt});for(const n of[-1,1])for(const r of[-1,1])t(D(.15,1.8,.15),we,{x:n*1.67,y:2.03,z:r*1.27});for(const n of[1.22,2.85])for(const r of[-1,1])t(D(3.36,.1,.05),we,{y:n,z:r*1.305}),t(D(.05,.1,2.56),we,{x:r*1.705,y:n});t(D(.7,.96,.05),we,{y:1.72,z:1.31});for(const n of[-.2,0,.2])t(D(.19,.84,.04),Ie(Bt,.9+e()*.2),{x:n,y:1.72,z:1.335});for(const n of[1.45,1.98])t(D(.58,.07,.03),we,{y:n,z:1.362,shadow:!1});t(D(.12,.04,.03),At,{x:.22,y:1.72,z:1.365,shadow:!1}),cg(i,e,{length:3.95,halfZ:1.3,eaveY:2.9,peakY:3.72}),t(Xc(1.3,2.9,3.86,.06),Bt,{x:1.7}),t(Xc(1.3,2.9,3.86,.06),Bt,{x:-1.64}),t(D(.04,.3,.3),2760728,{x:1.71,y:3.22,shadow:!1}),t(D(.95,.09,.09),we,{x:2.05,y:3.5}),t(D(.02,.85,.02),kr,{x:2.42,y:3.06,shadow:!1}),As(i,{x:2.42,y:2.35,z:0,r:.22,color:11899470}),t(D(.07,1.6,.07),we,{x:-.2,y:.8,z:1.62,rx:-.22}),t(D(.07,1.6,.07),we,{x:.2,y:.8,z:1.62,rx:-.22});for(let n=0;n<4;n++)t(D(.42,.05,.05),Rt,{y:.25+n*.36,z:1.74-n*.082});return As(i,{x:1.9,z:1.2,r:.38,color:Ui,lean:.25}),As(i,{x:2.38,z:.72,r:.33,color:11899470}),As(i,{x:1.55,z:1.75,r:.3,color:13480048,lean:-.3}),t(xe(.2,.15,.2,8),10123844,{x:2.2,y:.1,z:1.55}),t(xe(.18,.18,.03,8),14267734,{x:2.2,y:.2,z:1.55,shadow:!1}),i.add($(Gc(.75,.6,8,e,.2),Ie(Ui,1.05),{x:-2.05,y:-.05,z:-.7})),i.add($(Gc(.45,.36,7,e,.2),Ie(Ui,.95),{x:-1.75,y:-.04,z:-1.45})),Rn(i)}function s2(){const i=new Je,e=12563874,t=14208942,n=13608047,r=7035460,s=9406070;Ad(i,{robe:e,girth:1.06}),i.add($(D(.06,.56,.32),t,{x:.19,y:.36})),i.add($(D(.065,.05,.34),Ie(t,.85),{x:.2,y:.64}));const a=new Je;a.position.set(0,.78,0),a.add($(xe(.17,.19,.34,8),e,{y:.12})),a.add($(D(.05,.3,.3),t,{x:.165,y:.1}));const o=Td({skin:n,brow:s,r:.135});o.position.set(0,.43,0),o.add($(xe(.15,.165,.08,8),r,{y:.1})),o.add($(D(.14,.03,.14),r,{x:.13,y:.075,shadow:!1})),o.add($(D(.07,.09,.2),s,{x:.1,y:-.085})),o.add($(D(.05,.025,.13),s,{x:.125,y:-.04,shadow:!1})),a.add(o);const c=qs({sleeve:e,skin:n,w:.07,x:.16,y:.14,z:-.08,rx:1.25,rz:-.35}),l=qs({sleeve:e,skin:n,w:.07,x:.16,y:.1,z:.08,rx:-1.25,rz:-.35});a.add(c,l),i.add(a);const u=new Je;As(u,{x:.38,z:-.38,r:.25,color:14010792}),u.add($(D(.04,1.55,.04),we,{x:-.28,y:.74,z:.32,rz:.12})),u.add($(D(.035,.035,.2),we,{x:-.455,y:1.46,z:.32,rz:.12}));for(const d of[-.08,0,.08])u.add($(D(.025,.24,.025),we,{x:-.47,y:1.58,z:.32+d,rz:.12}));return Rn(i),Rn(u),{group:i,props:u,sway:a,head:o,armR:c,armL:l}}function a2(){const i=new Je;i.add($(xe(.09,.12,.9,6),we,{y:.45})),i.add($(D(.9,.07,.1),we,{y:.02,ry:.5})),i.add($(D(.9,.07,.1),we,{y:.03,ry:-1.07}));const e=new Je;e.position.y=.9;const t=new Je;t.rotation.y=.75,e.add(t);const n=13478494,r=(s,a,o)=>t.add($(s,a,o));r(xe(.3,.36,.85,8),Ui,{y:.42}),r(new Jt(.22,7,6),13807462,{y:1.05}),r(D(.09,.09,1.15),Bt,{y:.62}),r(xe(.32,.32,.05,8),kr,{y:.25}),r(xe(.34,.34,.05,8),kr,{y:.6}),r(xe(.16,.2,.08,7),kr,{y:.87});for(const s of[-1,1])r(D(.012,.07,.02),er,{x:.215,y:1.09,z:s*.08,rx:.78,shadow:!1}),r(D(.012,.07,.02),er,{x:.215,y:1.09,z:s*.08,rx:-.78,shadow:!1});r(D(.012,.018,.14),er,{x:.2,y:.98,shadow:!1});for(const s of[-.045,0,.045])r(D(.012,.04,.012),er,{x:.202,y:.98,z:s,shadow:!1});r(D(.02,.2,.22),Ie(n,.8),{x:.335,y:.42,z:.05,rx:.2});for(const s of[-1,1]){const a=$(new Zn(.09,.2,5),Ie(Ui,1.08),{y:.62,z:s*.64});a.rotation.x=s*-Math.PI/2,t.add(a)}return r(xe(.26,.26,.04,9),Ie(Bt,1.05),{x:.07,y:.6,z:-.5,rz:Math.PI/2}),r(xe(.07,.07,.06,7),At,{x:.09,y:.6,z:-.5,rz:Math.PI/2}),r(D(.012,.08,.46),9058858,{x:.092,y:.6,z:-.5,shadow:!1}),r(D(.012,.46,.08),9058858,{x:.092,y:.6,z:-.5,shadow:!1}),i.add(e),Rn(i),{group:i,pivot:e}}const o2=14208942,Op=10247740,aa=9075304,ps=6049861,oa=7224108,Ko=7624238,pu=13608047,Fp=9058858;function Bp(i,e,t,n){i.add($(new wd(.5,.055,5,12),we,{x:e,y:t,z:n}));for(let r=0;r<4;r++)i.add($(D(.05,.94,.05),Ie(Bt,.9),{x:e,y:t,z:n,rz:r*Math.PI/4}));i.add($(xe(.11,.11,.18,8),Rt,{x:e,y:t,z:n,rx:Math.PI/2})),i.add($(xe(.04,.04,.22,6),At,{x:e,y:t,z:n,rx:Math.PI/2}))}function c2(){const i=new Je,e=Tn(505),t=(h,g,_)=>i.add($(h,g,_));t(D(2,.12,1.25),Bt,{y:.82});for(const h of[-1,1])t(D(2,.3,.05),Ie(we,.9),{y:1.03,z:h*.6}),tr(i,e,{axis:"z",at:h*.635,from:-1,to:1,y0:.88,y1:1.18,color:Rt,thick:.03,width:.33}),t(D(2.06,.05,.09),we,{y:1.2,z:h*.62});t(D(.08,.34,1.25),Rt,{x:.98,y:1.05}),t(D(.08,.34,1.25),Rt,{x:-.98,y:1.05}),t(xe(.05,.05,1.7,6),we,{x:-.1,y:.55,rx:Math.PI/2}),Bp(i,-.1,.55,.82),Bp(i,-.1,.55,-.82),t(D(.07,.42,.07),we,{x:-.85,y:.5,rz:.12}),t(D(1.5,.06,.06),we,{x:1.6,y:.72,z:.4,rz:-.05}),t(D(1.5,.06,.06),we,{x:1.6,y:.72,z:-.4,rz:-.05});for(const[h,g]of[[-.95,-.58],[-.95,.58],[.5,-.58],[.5,.58]])t(D(.05,.75,.05),we,{x:h,y:1.32,z:g});for(let h=0;h<6;h++){const g=-1.095+.292*(h+.5),_=h%2?oa:o2;t(D(.292,.05,1.5),_,{x:g,y:1.74+(g+.22)*.05,rz:.05});for(const p of[-1,1])t(D(.292,.11,.025),Ie(_,.9),{x:g,y:1.68+(g+.22)*.05,z:p*.75,rz:.05,shadow:!1})}t(D(.4,.34,.4),Rt,{x:-.55,y:1.05,z:.25}),t(D(.42,.04,.42),we,{x:-.55,y:1.14,z:.25,shadow:!1}),t(D(.32,.26,.32),Rt,{x:-.5,y:1.01,z:-.32,ry:.4}),As(i,{x:.15,y:.86,z:.3,r:.24,color:Ui,lean:.2}),t(xe(.12,.12,.7,7),Fp,{x:.2,y:1,z:-.25,rx:Math.PI/2,ry:.2}),t(xe(.08,.08,.55,6),5003830,{x:.45,y:.97,z:-.2,rx:Math.PI/2,ry:-.15}),t(xe(.07,.07,.5,6),12163658,{x:.36,y:1.1,z:-.24,rx:Math.PI/2,ry:.05}),t(xe(.08,.1,.16,7),Op,{x:-1.06,y:1.12,z:.2}),t(xe(.07,.09,.14,7),Op,{x:-1.06,y:1.1,z:-.15}),t(xe(.17,.13,.1,8),10123844,{x:.68,y:.93,z:.28});for(const[h,g]of[[.63,.24],[.74,.3],[.68,.34]]){const _=$(new Jt(.07,6,5),11105854,{x:h,y:1,z:g});_.scale.set(1.2,.6,.9),i.add(_)}t(D(.015,.16,.015),At,{x:.5,y:1.56,z:-.66,shadow:!1}),t(D(.09,.13,.09),At,{x:.5,y:1.42,z:-.66});const n=new Et(D(.045,.07,.045),new hn({color:16766574}));n.position.set(.5,1.42,-.66),i.add(n),t(xe(.2,.22,.86,8),aa,{x:1.9,y:.86,rz:Math.PI/2}),t(D(.4,.05,.46),Fp,{x:1.85,y:1.07}),t(D(.05,.47,.47),ps,{x:2.14,y:.86,shadow:!1});for(const[h,g]of[[1.6,-.13],[1.6,.13],[2.2,-.13],[2.2,.13]])t(xe(.05,.036,.58,5),aa,{x:h,y:.3,z:g}),t(D(.09,.07,.1),ps,{x:h,y:.03,z:g});t(D(.18,.44,.17),aa,{x:2.38,y:1.12,rz:-.5}),t(D(.04,.4,.05),ps,{x:2.3,y:1.2,rz:-.5});const r=new Je;r.position.set(2.52,1.28,0),r.add($(D(.36,.17,.15),aa,{x:.12,y:-.04})),r.add($(D(.12,.14,.13),ps,{x:.3,y:-.06}));for(const h of[-1,1])r.add($(new Zn(.04,.24,5),ps,{x:-.02,y:.16,z:h*.06,rz:.25,rx:h*.25})),r.add($(D(.03,.03,.012),1840658,{x:.14,y:0,z:h*.078,shadow:!1}));i.add(r);const s=new Je;s.position.set(1.48,1,0),s.add($(D(.04,.34,.04),aa,{y:-.17})),s.add($(D(.07,.16,.07),ps,{y:-.4})),i.add(s);const a=-.3,o=-1.05;Ad(i,{robe:Ko,belt:we,x:a,z:o,front:[0,-1]}),t(D(.09,.12,.06),5914664,{x:a+.17,y:.58,z:o-.08});const c=new Je;c.position.set(a,.78,o),c.add($(xe(.15,.175,.34,8),Ko,{y:.12})),c.add($(xe(.12,.2,.12,8),oa,{y:.27}));const l=new Je;l.position.set(0,.42,0);const u=Td({skin:pu,brow:3811868});u.rotation.y=Math.PI/2,u.add($(new Zn(.175,.3,7),oa,{y:.2})),u.add($(D(.05,.04,.2),oa,{x:.14,y:.065,shadow:!1})),u.add($(D(.12,.22,.28),oa,{x:-.07,y:-.02})),u.add($(D(.05,.08,.16),3811868,{x:.1,y:-.09})),l.add(u),c.add(l);const d=qs({sleeve:Ko,skin:pu,x:-.05,y:.1,z:-.16,rz:.5}),f=qs({sleeve:Ko,skin:pu,x:.05,y:.1,z:.14,rz:-1});return c.add(d,f),i.add(c),t(D(.05,1.5,.05),we,{x:a-.45,y:.72,z:o+.1,rz:.18}),t(xe(.05,.05,.1,6),kr,{x:a-.56,y:1.3,z:o+.1,rz:.18}),Rn(i),{group:i,sway:c,head:l,armStaff:d,armCart:f,muleHead:r,muleTail:s}}function ug(i){for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return i}const Hp=.7;function l2({group:i,forward:e,terrainY:t,waypoints:n,speed:r=.55,notice:s=4,onMove:a}){let o=0;const c={x:n[0].x,z:n[0].z};let l=n[0].face,u=!0,d=4+Math.random()*6,f=0,h=0;function g(_,p,m){l+=ug(_-l)*(1-Math.exp(-p*m))}return{pose:()=>({x:c.x,z:c.z,bodyYaw:l}),idle:()=>u,update(_,p){const m=p&&Math.hypot(p.x-c.x,p.z-c.z)<s;let v=!1;if(u)g(n[o].face,_,3),m||(d-=_,d<=0&&(o=(o+1)%n.length,u=!1));else{const x=n[o],w=x.x-c.x,M=x.z-c.z,E=Math.hypot(w,M);if(g(Math.atan2(w,M),_,4),E<.08)u=!0,d=6+Math.random()*8;else if(!m){const T=Math.min(E,r*_);c.x+=w/E*T,c.z+=M/E*T,f+=_,v=!0}}h+=((v?1:0)-h)*(1-Math.exp(-_*6)),i.position.set(c.x,t(c.x,c.z)+Math.abs(Math.sin(f*5.5))*.03*h,c.z),i.rotation.y=l-e,i.rotation.z=Math.sin(f*5.5)*.045*h,a==null||a(c.x,c.z)}}}function mu({x:i,z:e,yaw:t,forward:n,sway:r,head:s,gestures:a=[],notice:o=4,stroll:c=null}){const l={x:i,z:e,bodyYaw:t+n},u=()=>c?c.pose():l,d=Math.cos(n),f=-Math.sin(n),h=r.position.y;let g=Math.abs(i*7.3+e*3.1)%Math.PI*2;const _=.9+Math.abs(i*13.7+e*5.3)%.5;let p=0,m=-1,v=!1,x=0,w=null,M=2+Math.random()*3;const E={onGreet:null,update(T,A){var k;g+=T,c==null||c.update(T,A);const I=u();r.rotation.x=Math.sin(g*_)*.045,r.rotation.z=Math.sin(g*_*.53+1.3)*.03,r.position.y=h+Math.sin(g*_)*.012;const y=A?Math.hypot(A.x-I.x,A.z-I.z):1/0;let S=0;y<o&&(S=ug(Math.atan2(A.x-I.x,A.z-I.z)-I.bodyYaw),S=Math.max(-Hp,Math.min(Hp,S)),v||(v=!0,m=0,(k=E.onGreet)==null||k.call(E))),p+=(S-p)*(1-Math.exp(-T*5)),s.rotation.y=p;let N=0;if(m>=0){m+=T;const z=Math.min(1,m/.9);N=Math.sin(z*Math.PI)*.28,z===1&&(m=-1)}if(s.rotation.x=d*N,s.rotation.z=f*N,w){w.t+=T;const z=Math.min(1,w.t/w.g.dur);w.g.apply(z),z===1&&(w.g.apply(0),w=null,M=6+Math.random()*8)}else a.length&&(!c||c.idle())&&(M-=T,M<=0&&(w={g:a[Math.floor(Math.random()*a.length)],t:0},x+=1))},at:()=>({x:u().x,z:u().z}),headYaw:()=>s.rotation.y,greetedYet:()=>v,gesturesPlayed:()=>x,swayX:()=>r.rotation.x};return E}const me={saveKey:"crownbound_save",saveVersion:8,xpPerLevel:100,ranks:[{title:"Peasant",totalLevels:4},{title:"Squire",totalLevels:12},{title:"Knight",totalLevels:25},{title:"Lord",totalLevels:45},{title:"King",totalLevels:70}],rewards:{daily:{xp:25,coins:10},weekly:{xp:100,coins:50},monthly:{xp:300,coins:150},ratCoins:2},stamina:{baseCap:60,questCap:120,attackCost:5,dodgeCost:8},sleep:{minHours:7,maxHours:13,wakeByHour:8,wisXp:10,coins:10,staminaBonus:10},shop:{marketWeekdays:[0,3,5],items:[{id:"cudgel",name:"an oaken cudgel",flavor:"Twice the argument of a stick.",price:300,category:"hand",once:!0,damage:2,tier:1},{id:"quarterstaff",name:"a quarterstaff",flavor:"Six feet of persuasion, squire-trained.",price:1e3,category:"hand",once:!0,damage:3,reach:.25,tier:2,minRank:"Squire"},{id:"rug",name:"a wool rug",flavor:"Dyed madder red. The floor forgives.",price:250,category:"home",once:!0},{id:"door",name:"door paint",flavor:"A door the color of oxblood says someone lives here on purpose.",price:300,category:"home",once:!0},{id:"window",name:"a glass pane",flavor:"Real glass, hauled from the city unbroken. Mostly.",price:400,category:"home",once:!0},{id:"garden",name:"a garden plot",flavor:"Seed, string, and somewhere for the mornings to go.",price:600,category:"home",once:!0},{id:"loaf",name:"a hearty loaf",flavor:"Warm bread mends what the road takes.",price:10,category:"comforts",once:!1},{id:"trophy",name:"a mounted rat",flavor:"Proof of bounties past, stuffed and staring.",price:60,category:"comforts",once:!0},{id:"lantern",name:"a candle lantern",flavor:"A little light for the doorpost.",price:120,category:"comforts",once:!0}]},sage:{model:"claude-haiku-4-5-20251001",maxTokens:16,timeoutMs:8e3},chronicler:{model:"claude-haiku-4-5-20251001",maxTokens:400,timeoutMs:3e4},mouse:{defaultFeel:"steady",feels:[{id:"gentle",name:"Gentle",sens:.0015},{id:"steady",name:"Steady",sens:.0024},{id:"swift",name:"Swift",sens:.0038}]},player:{maxHp:20,regenPerSecond:.35,regenDelay:5,walkSpeed:4.2,sprintMult:1.65,crouchMult:.45,turnLerp:12,jumpSpeed:6.8,gravity:28,landCrouchTime:.18,dodgeSpeed:9,dodgeDuration:.45,dodgeTapWindow:.25,attackDamage:1,attackRange:1.9,attackArcDeg:110,attackDuration:.34},dummy:{xpForHit(i){return i<10?2:i<25?1:0}},rats:{count:3,hp:3,speed:2.6,aggroRange:6,leashRange:14,biteRange:.9,biteDamage:1,biteCooldown:1.3,wanderRadius:5},campfireTiers:[{minStreak:30,name:"roaring"},{minStreak:7,name:"healthy"},{minStreak:1,name:"small"},{minStreak:0,name:"embers"}]};function u2(i){return me.campfireTiers.find(e=>i>=e.minStreak).name}function h2(i){let e=me.ranks[0].title;for(const t of me.ranks)i>=t.totalLevels&&(e=t.title);return e}const Vp={embers:{flame:0,light:.9,dist:4.5,rate:3},small:{flame:.55,light:4,dist:8,rate:8},healthy:{flame:1,light:8,dist:11,rate:14},roaring:{flame:1.45,light:14,dist:15,rate:24}},d2=.45,jo=60,f2=new be(14829594),Gp=new be(16747551),p2=new be(16766046),m2=new be(16773288);function g2(i,e,t){const n=new Zn(i,e,5);return n.translate(0,e/2,0),Sd(n,(r,s,a,o)=>{const c=s/e;t?o.copy(Gp).lerp(m2,Math.min(1,c*1.3)):o.copy(f2).lerp(Gp,Math.min(1,c*2)).lerp(p2,Math.max(0,c*2-1))}),n}function _2(){const i=new Je,e=Tn(606);for(let H=0;H<9;H++){const O=H/9*Math.PI*2+e()*.25,J=.14+e()*.09,W=$(new cr(J,0),Ie(H%2?8157810:9276034,.9+e()*.2),{x:Math.cos(O)*.64,y:J*.45,z:Math.sin(O)*.64,ry:e()*6,rx:e()*2});W.scale.y=.75,i.add(W)}i.add($(new On(.5,.56,.06,9),3814188,{y:.02,shadow:!1}));const t=(H,O=.16,J=Math.PI/2.3)=>$(new On(.07,.09,.95,6),Ie(4863271,.85+e()*.3),{y:O,rz:J,ry:H});i.add(t(.3),t(1.7),t(2.9),t(4.3,.3,.95),t(5.6,.3,.95));const n=new Et(new On(.24,.3,.07,7),new hn({color:14248490,fog:!1}));n.position.y=.07,i.add(n);const r=new hn({vertexColors:!0,fog:!1}),s=[],a=(H,O,J,W,pe=!1)=>{const ge=new Et(g2(H,O,pe),r);ge.position.set(J,.1,W),i.add(ge),s.push({mesh:ge,phase:e()*6.28,speed:7+e()*6})};a(.2,1,0,0,!0);for(let H=0;H<5;H++){const O=H/5*Math.PI*2+.5;a(.15+e()*.05,.55+e()*.3,Math.cos(O)*.17,Math.sin(O)*.17)}const o=fl(16751165,3,.4);o.position.y=.6,i.add(o);const c=new Km(16751165,4,8,2);c.position.set(0,.9,0),i.add(c);const l=new Float32Array(jo*3),u=new Float32Array(jo*3),d=[];for(let H=0;H<jo;H++)d.push({alive:!1,life:0,maxLife:1,vx:0,vy:0,vz:0,x:0,y:-99,z:0}),l[H*3+1]=-99;const f=new Lt;f.setAttribute("position",new lt(l,3)),f.setAttribute("color",new lt(u,3));const h=new md({size:.13,map:dl(),vertexColors:!0,transparent:!0,blending:Hr,depthWrite:!1,fog:!1}),g=new gd(f,h);g.frustumCulled=!1,i.add(g);const _=ag({max:26});i.add(_.points);const p=new be(5919564),m=new be(10722709),v=new be(16757053),x=new be(10039580),w=new be(0);let M=Vp.embers,E=0,T=0,A=0,I=1,y=1;function S(H,O=!0){M=Vp[u2(H)],y=O?1:d2}function N(){const H=d.find(W=>!W.alive);if(!H)return;H.alive=!0,H.life=0,H.maxLife=.9+Math.random()*1.3;const O=Math.random()*Math.PI*2,J=Math.random()*.25;H.x=Math.cos(O)*J,H.z=Math.sin(O)*J,H.y=.25+Math.random()*.3,H.vx=(Math.random()-.5)*.25,H.vz=(Math.random()-.5)*.25,H.vy=.8+Math.random()*.8+M.flame*.5}const k=new be;function z(H){A+=H,I+=(y-I)*(1-Math.exp(-H*2.5));const O=1+(1-I)*1.5,J=1+(Math.sin(A*12.7)*.07+Math.sin(A*31.1)*.05)*O,W=Math.max(M.flame*I*J,.001);for(const se of s){se.mesh.visible=M.flame>0;const De=Math.sin(A*se.speed+se.phase),Ze=1+De*.2+Math.sin(A*se.speed*2.3+se.phase)*.08*O;se.mesh.scale.set(W*(1-De*.1),W*Ze,W*(1+De*.1)),se.mesh.rotation.z=Math.sin(A*se.speed*.6+se.phase)*.14,se.mesh.rotation.x=Math.cos(A*se.speed*.45+se.phase)*.12}const pe=(1+(Math.sin(A*9.3)*.12+Math.sin(A*23.7)*.08)*O)*I;c.intensity=M.light*pe,c.distance=M.dist*(.7+.3*I);const ge=1.4+M.flame*2.2*I;for(o.scale.set(ge*(.94+pe*.06),ge*(.94+pe*.06),1),o.material.opacity=.22+.2*Math.min(1,pe),n.material.color.setRGB(.72+.14*pe,.36+.07*pe,.14),E+=H*M.rate*I;E>=1;)E-=1,N();for(let se=0;se<jo;se++){const De=d[se];De.alive&&(De.life+=H,De.life>=De.maxLife?(De.alive=!1,De.y=-99):(De.x+=De.vx*H,De.y+=De.vy*H,De.z+=De.vz*H,De.vx+=(Math.random()-.5)*H*1.5,De.vz+=(Math.random()-.5)*H*1.5)),l[se*3]=De.x,l[se*3+1]=De.y,l[se*3+2]=De.z;const Ze=De.alive?De.life/De.maxLife:1;k.copy(v).lerp(x,Math.min(1,Ze*1.4)),Ze>.6&&k.lerp(w,(Ze-.6)/.4),u[se*3]=k.r,u[se*3+1]=k.g,u[se*3+2]=k.b}for(f.attributes.position.needsUpdate=!0,f.attributes.color.needsUpdate=!0,T+=H*(1.2+M.flame*3.2)*(.5+.5*I);T>=1;)T-=1,_.spawn({x:(Math.random()-.5)*.25,y:.5+M.flame*I*.6,z:(Math.random()-.5)*.25,vx:.12+Math.random()*.16,vy:.55+Math.random()*.3,vz:.05+Math.random()*.1,life:3.2+Math.random()*1.6,size0:.3,size1:1.3+M.flame*.5,alpha:.2,from:p,to:m});_.update(H)}return Rn(i),S(0),{group:i,setStreak:S,update:z,getGutter:()=>y}}function x2(i,e=!1){const t=vb(),n=bb();i.add(t,n);const r=Eb(i);i.add(pb());const s=kb();i.add(...s.meshes);const a=Vb(s);i.add(a);const o=[...s.colliders];function c(Y,{x:le,z:oe,rotY:ze=0},Ue){return Y.position.set(le,Nt(le,oe),oe),Y.rotation.y=ze,i.add(Y),Ue&&o.push({x:le,z:oe,r:Ue}),Y}const l=Jb();c(l.group,$e.hovel);const u=l.upgrades;function d(Y){for(const[le,oe]of Object.entries(u))oe.visible=Y.includes(le)}c(Qb(),$e.questBoard,.8),c(t2(),$e.tome,.55),c(e2(),$e.charter,.35),c(r2(),$e.granary,2.5);const f=a2();c(f.group,$e.dummy,.5);const h=_2();c(h.group,$e.campfire,.7);const g=i2();c(g.group,$e.exchequer,1.35);const _=mu({x:$e.exchequer.x,z:$e.exchequer.z,yaw:$e.exchequer.rotY,forward:Math.PI/2,sway:g.sway,head:g.head,gestures:[{dur:1.8,apply:Y=>{g.armR.rotation.z=-1.15+Math.sin(Y*Math.PI*4)*.12*Math.sin(Y*Math.PI)}},{dur:1.5,apply:Y=>{g.armL.rotation.z=-1.15+Math.sin(Y*Math.PI)*.4}}]}),p=s2();c(p.group,$e.miller),c(p.props,$e.miller);const m={x:$e.miller.x,z:$e.miller.z,r:.4};o.push(m);const v=l2({group:p.group,forward:Math.PI/2,terrainY:Nt,waypoints:[{x:$e.miller.x,z:$e.miller.z,face:$e.miller.rotY+Math.PI/2},{x:8,z:11,face:Math.PI/2},{x:10.2,z:8.4,face:.3}],onMove:(Y,le)=>{m.x=Y,m.z=le}}),x=mu({x:$e.miller.x,z:$e.miller.z,yaw:$e.miller.rotY,forward:Math.PI/2,stroll:v,sway:p.sway,head:p.head,gestures:[{dur:1.6,apply:Y=>{p.armR.rotation.z=-.35-Math.sin(Y*Math.PI)*.85}},{dur:1.9,apply:Y=>{p.armL.rotation.x=-1.25+Math.sin(Y*Math.PI)*.75}}]});let w=null;if(e){const Y=c2();c(Y.group,$e.cart,1.5);const le=$e.cart.rotY;o.push({x:$e.cart.x+1.9*Math.cos(le),z:$e.cart.z-1.9*Math.sin(le),r:.9});const oe=mu({x:$e.cart.x+-.3*Math.cos(le)+-1.05*Math.sin(le),z:$e.cart.z- -.3*Math.sin(le)+-1.05*Math.cos(le),yaw:le,forward:Math.PI,sway:Y.sway,head:Y.head,gestures:[{dur:1.5,apply:Ue=>{Y.armCart.rotation.z=-1+Math.sin(Ue*Math.PI)*.45}},{dur:1.7,apply:Ue=>{Y.armStaff.rotation.z=.5+Math.sin(Ue*Math.PI)*.35}}]});let ze=$e.cart.x*5.1%Math.PI;w={chapman:oe,update(Ue,Ye){ze+=Ue,Y.muleHead.rotation.z=-.1+Math.sin(ze*.5)*.09,Y.muleTail.rotation.x=Math.sin(ze*2.1)*.3,oe.update(Ue,Ye)}}}const M=Rd,E=$e.hovel.x,T=$e.hovel.z,A=M.halfX-M.wallT,I=M.halfZ-M.wallT,y=(Y,le,oe,ze)=>({minX:E+Y,maxX:E+le,minZ:T+oe,maxZ:T+ze});o.push(y(-1.7,-A,-1.45,M.halfZ),y(-1.7,M.halfX,I,M.halfZ),y(-1.7,M.halfX,-1.45,-I),y(A,M.halfX,-1.45,M.door.z0),y(A,M.halfX,M.door.z1,M.halfZ),y(M.bed.x-.45,M.bed.x+.45,M.bed.z-.75,M.bed.z+.75),y(M.chest.x0,M.chest.x1,M.chest.z0,M.chest.z1),{x:E+M.hearth.x,z:T+M.hearth.z,r:M.hearth.r},{x:E+M.table.x,z:T+M.table.z,r:M.table.r},{x:E+M.barrel.x,z:T+M.barrel.z,r:M.barrel.r},y(M.woodpile.x0,M.woodpile.x1,M.woodpile.z0,M.woodpile.z1));const S=y(A,M.halfX,M.door.z0,M.door.z1);o.push(S);let N=!1,k=0;const z={x:E+M.halfX-M.wallT/2,z:T+(M.door.z0+M.door.z1)/2,radius:2.2,get isOpen(){return N},toggle(){return N=!N,N?o.splice(o.indexOf(S),1):o.push(S),N},update(Y){k+=((N?1:0)-k)*(1-Math.exp(-Y*7)),l.doorPivot.rotation.y=k*M.door.openAngle}};let H=!1,O=0;const J={get isOpen(){return H},toggle(){return H=!H,H},update(Y){O+=((H?1:0)-O)*(1-Math.exp(-Y*6)),l.chestLid.rotation.x=O*M.chest.openAngle}},W={minX:E-A,maxX:E+A,minZ:T-I,maxZ:T+I,ceilY:Nt(E,T)+M.ceilY},pe={x:E+M.wake.x,z:T+M.wake.z},ge={x:E+M.bed.x,z:T+M.bed.z,y:Nt(E,T)+M.bed.topY,facing:0},se=[{id:"board",label:"the Quest Board",x:$e.questBoard.x,z:$e.questBoard.z,radius:2.7},{id:"tome",label:"the Tome",x:$e.tome.x,z:$e.tome.z,radius:2.4},{id:"guide",label:"the Village Charter",x:$e.charter.x,z:$e.charter.z,radius:2.2},{id:"miller",label:"the miller",x:$e.miller.x,z:$e.miller.z,radius:2},{id:"bed",label:"your straw cot",x:E+M.bed.x,z:T+M.bed.z,radius:1.7,insideOnly:!0},{id:"ledger",label:"the sleep ledger",x:E+M.ledger.x,z:T+M.ledger.z,radius:1.5,insideOnly:!0},{id:"chest",get label(){return H?"close the chest":"open the chest"},x:E+(M.chest.x0+M.chest.x1)/2,z:T+(M.chest.z0+M.chest.z1)/2,radius:1.1,insideOnly:!0},{id:"treasury",label:"the Exchequer’s table",x:$e.exchequer.x+.9*Math.cos($e.exchequer.rotY),z:$e.exchequer.z-.9*Math.sin($e.exchequer.rotY),radius:2.2}];if(w){const Y=$e.cart.rotY,le=-.3,oe=-1.05;se.push({id:"shop",label:"the chapman’s cart",x:$e.cart.x+le*Math.cos(Y)+oe*Math.sin(Y),z:$e.cart.z-le*Math.sin(Y)+oe*Math.cos(Y),radius:2.4})}const De=Yb({smokeAt:{x:E+M.smoke.x,y:Nt(E,T)+M.smoke.y,z:T+M.smoke.z},flowerSpots:a.userData.patches});i.add(De.group);let Ze=0;function Z(Y,le,oe){Ze+=Y;const ze=1+Math.sin(Ze*11.3)*.08+Math.sin(Ze*27.1)*.05,Ue=l.hearth;Ue.flames.scale.set(ze,1+(ze-1)*2.5,ze),Ue.flames.rotation.y+=Y*1.1,Ue.glow.intensity=2.2*(1+(ze-1)*1.4),Ue.halo.material.opacity=.4*ze,rg.value+=Y,n.rotation.y+=Y*.0035,t.position.copy(oe.position),r.followShadow(le),De.update(Y,oe)}return{colliders:o,interactables:se,campfire:h,dummy:f,door:z,chest:J,exchequer:_,cart:w,miller:x,homeUpgrades:u,applyHomeUpgrades:d,hovelInterior:W,wakeSpot:pe,bedRest:ge,update:Z}}const gu=10125668,_u=8021584,xu=4874354,ca=14264439,la=4862496,y2=6115133,yu=4010279,vu=7027238,v2=8018485,w2=2365970,cn=(i,e,t)=>new _i(i,e,t),Vn=(i,e,t,n=6)=>new On(i,e,t,n);function ua(i,e){return i.scale.z=e,i}function M2(){const i=new Je,e=new Je;e.position.y=.6,i.add(e);const t=f=>{const h=new Je;return h.position.set(f,-.05,0),h.add($(Vn(.097,.076,.5),y2,{y:-.25})),h.add($(Vn(.086,.082,.16),yu,{y:-.46})),h.add($(Vn(.096,.09,.045),vu,{y:-.385})),h.add($(cn(.16,.09,.26),yu,{y:-.53,z:.035})),h.add($(cn(.14,.05,.08),Ie(yu,1.25),{y:-.5,z:.15,rx:.3})),e.add(h),h},n=t(-.12),r=t(.12),s=new Je;s.position.y=-.05,e.add(s),s.add(ua($(Vn(.225,.25,.46,8),gu,{y:.33}),.72)),s.add(ua($(Vn(.255,.305,.25,8),Ie(gu,.96),{y:0}),.74)),s.add(ua($(Vn(.26,.26,.065,8),vu,{y:.12}),.74)),s.add($(cn(.06,.07,.03),11570511,{y:.12,z:.19})),s.add($(cn(.1,.13,.07),Ie(vu,.85),{x:.2,y:.03,z:.09,rz:-.1})),s.add($(cn(.15,.13,.03),_u,{x:.09,y:.36,z:.158,rz:.2})),s.add(ua($(Vn(.19,.31,.17,8),xu,{y:.505}),.8)),s.add(ua($(Vn(.12,.19,.08,8),Ie(xu,.86),{y:.62}),.86)),s.add($(cn(.22,.13,.12),Ie(xu,.9),{y:.6,z:-.15,rx:-.25}));const a=f=>{const h=new Je;return h.position.set(f,.5,0),h.add($(Vn(.078,.062,.44),gu,{y:-.2})),h.add($(Vn(.068,.068,.04),_u,{y:-.41})),h.add($(cn(.1,.11,.1),ca,{y:-.49})),s.add(h),h},o=a(-.33),c=a(.33),l=$(Vn(.028,.036,.75),v2,{y:-.78,keep:!0});l.add($(cn(.14,.05,.08),_u,{y:.31})),c.add(l);const u=new Je;u.position.y=.62,s.add(u),u.add($(Vn(.07,.085,.1),Ie(ca,.92),{y:0}));const d=$(new Jt(.17,8,6),ca,{y:.17});d.scale.set(1,1.02,.96),u.add(d),u.add($(new Jt(.183,8,5,0,Math.PI*2,0,1.72),la,{y:.18,rx:-.5})),u.add($(cn(.25,.055,.06),la,{y:.275,z:.125,rx:.35})),u.add($(cn(.09,.05,.06),Ie(la,1.15),{x:-.05,y:.262,z:.14,rx:.3,rz:.25}));for(const f of[-1,1])u.add($(cn(.03,.1,.08),la,{x:f*.162,y:.19,z:.02})),u.add($(cn(.028,.06,.045),Ie(ca,.9),{x:f*.17,y:.15,z:0})),u.add($(cn(.036,.046,.02),w2,{x:f*.066,y:.187,z:.15,shadow:!1})),u.add($(cn(.058,.014,.02),la,{x:f*.066,y:.228,z:.152,rz:f*-.14,shadow:!1}));return u.add($(cn(.042,.058,.05),Ie(ca,.93),{y:.155,z:.17})),u.add($(cn(.062,.012,.02),9067076,{y:.1,z:.153,shadow:!1})),Rn(i),{group:i,roller:e,body:s,head:u,leftLeg:n,rightLeg:r,leftArm:o,rightArm:c,weapon:l}}const Dt=me.player,ha=.35,wu=78;function Wp(i,e,t){let n=(e-i)%(Math.PI*2);return n>Math.PI&&(n-=Math.PI*2),n<-Math.PI&&(n+=Math.PI*2),i+n*t}function S2(i,e){const t=M2();t.group.position.set(e.x,Nt(e.x,e.z),e.z),t.group.rotation.y=Math.PI/3,i.add(t.group);const n=new Set;let r=!0;const s={KeyW:[0,1],KeyS:[0,-1],KeyA:[-1,0],KeyD:[1,0]},a={};let o=null;window.addEventListener("keydown",p=>{if(r){if(!p.repeat&&s[p.code]){const m=performance.now();m-(a[p.code]||-1e9)<Dt.dodgeTapWindow*1e3&&(o=p.code),a[p.code]=m}n.add(p.code)}}),window.addEventListener("keyup",p=>n.delete(p.code)),window.addEventListener("blur",()=>n.clear());const c={mesh:t,pos:t.group.position,vel:new he(0,0),facing:t.group.rotation.y,mode:"normal",modeT:0,invulnerable:!1,vy:0,airborne:!1,landT:1/0,crouching:!1,crouch01:0,walkPhase:0,idleT:0,time:0,hp:Dt.maxHp,maxHp:Dt.maxHp,lastHurtAt:-99,onHpChange:()=>{},onDeath:()=>{},onHurt:()=>{},trySpend:()=>!0,onAttackSwing:null,onActionBlocked:()=>{},attackDamage:me.player.attackDamage,attackReach:me.player.attackRange,setWeaponTier(p){const m=[{scale:[1,1,1],color:8018485},{scale:[1.7,1.08,1.7],color:5914664},{scale:[1.3,1.55,1.3],color:10123848}],v=m[p]??m[0];t.weapon.scale.set(...v.scale),t.weapon.material=new $r({color:v.color,flatShading:!0})},setEnabled(p){r=p,p||(n.clear(),o=null)},isEnabled:()=>r};window.addEventListener("mousedown",p=>{!r||p.button!==0||document.pointerLockElement!==null&&l()});function l(){if(c.mode==="normal"){if(!c.trySpend(me.stamina.attackCost)){c.onActionBlocked();return}c.mode="attack",c.modeT=0,c.swungThisAttack=!1}}function u(){c.mode!=="normal"||c.airborne||(c.vy=Dt.jumpSpeed,c.airborne=!0)}function d(p){c.mode!=="sleep"&&(c.sleepTarget=p,c.mode="sleep",c.modeT=0,c.vel.set(0,0),c.vy=0,c.airborne=!1,c.invulnerable=!0)}function f(p){const m=t,v=c.sleepTarget,x=1-Math.exp(-p*6);c.pos.x+=(v.x-c.pos.x)*x,c.pos.z+=(v.z-c.pos.z)*x,c.pos.y=Nt(c.pos.x,c.pos.z),c.facing=Wp(c.facing,v.facing,x),m.group.rotation.y=c.facing;const w=Math.min(Math.max((c.modeT-.4)/.6,0),1),M=w*w*(3-2*w),E=M>=1?Math.sin(c.time*1.8)*.012:0;m.roller.rotation.x=-Math.PI/2*M,m.roller.position.y=.6+(v.y+.16-c.pos.y-.6)*M+E,m.weapon.visible=M<.5;const T=Math.hypot(v.x-c.pos.x,v.z-c.pos.z),A=Math.min(T*3,1)*(1-M);c.walkPhase+=p*7*A;const I=Math.sin(c.walkPhase)*.6*A;m.leftLeg.rotation.x=I-.05*M,m.rightLeg.rotation.x=-I-.05*M,m.leftArm.rotation.x=-I*.5+(-.25+E*2)*M,m.rightArm.rotation.x=I*.5+(-.25+E*2)*M,m.body.rotation.x=0,m.body.rotation.y=0}function h(p,m){if(!(c.mode!=="normal"||c.airborne)){if(!c.trySpend(me.stamina.dodgeCost)){c.onActionBlocked();return}c.mode="roll",c.modeT=0,c.invulnerable=!0,c.rollDir={x:p,z:m}}}function g(p){const m=c.pos;for(const x of p)if(x.r!==void 0){const w=m.x-x.x,M=m.z-x.z,E=x.r+ha,T=w*w+M*M;if(T<E*E&&T>1e-6){const A=Math.sqrt(T);m.x=x.x+w/A*E,m.z=x.z+M/A*E}}else{const w=x.minX-ha,M=x.maxX+ha,E=x.minZ-ha,T=x.maxZ+ha;if(m.x>w&&m.x<M&&m.z>E&&m.z<T){const A=m.x-w,I=M-m.x,y=m.z-E,S=T-m.z,N=Math.min(A,I,y,S);N===A?m.x=w:N===I?m.x=M:N===y?m.z=E:m.z=T}}const v=Math.hypot(m.x,m.z);v>wu&&(m.x*=wu/v,m.z*=wu/v)}function _(p,m,v){const x=t;if(c.mode==="roll"){const M=c.modeT/Dt.dodgeDuration;x.roller.rotation.x=M*Math.PI*2,x.leftLeg.rotation.x=-1.4,x.rightLeg.rotation.x=-1.4,x.leftArm.rotation.x=-1.2,x.rightArm.rotation.x=-1.2;return}x.roller.rotation.x=0,c.walkPhase+=p*m*(v?11:8),c.idleT+=p;const w=Math.sin(c.walkPhase)*.75*m;if(x.leftLeg.rotation.x=w,x.rightLeg.rotation.x=-w,x.leftArm.rotation.x=-w*.6+Math.sin(c.idleT*1.4)*.04,c.mode==="attack"){const M=Math.min(c.modeT/Dt.attackDuration,1),E=-2.3,T=.8,A=Math.min(M/.35,1),I=Math.max(0,(M-.35)/.65),y=1-Math.pow(1-I,3);x.rightArm.rotation.x=E*A+(T-E)*y,x.body.rotation.y=.35-y*.7}else x.rightArm.rotation.x=-w*.6-Math.sin(c.idleT*1.4)*.04,x.body.rotation.y=0;if(x.body.rotation.x=m*(v?.18:.1)+Math.sin(c.idleT*2.1)*.012,x.roller.position.y=.6+Math.abs(Math.sin(c.walkPhase))*.06*m,c.crouch01>.001){const M=c.crouch01;x.roller.position.y-=.2*M,x.leftLeg.rotation.x-=.9*M,x.rightLeg.rotation.x-=.9*M,x.body.rotation.x+=.3*M}if(c.airborne){const M=Math.max(c.vy/Dt.jumpSpeed,0);x.body.rotation.x+=.28*M,x.leftLeg.rotation.x=-.45,x.rightLeg.rotation.x=-.45}else if(c.landT<Dt.landCrouchTime){const M=1-c.landT/Dt.landCrouchTime;x.roller.position.y-=.14*M,x.leftLeg.rotation.x=-.65*M,x.rightLeg.rotation.x=-.65*M,x.body.rotation.x+=.18*M}}return c.takeDamage=function(m,v,x){if(c.invulnerable||c.hp<=0)return;c.hp=Math.max(0,c.hp-m),c.lastHurtAt=c.time;const w=c.pos.x-v,M=c.pos.z-x,E=Math.hypot(w,M)||1;c.vel.x+=w/E*5,c.vel.y+=M/E*5,Zm(t.group),c.onHurt(),c.onHpChange(c.hp,c.maxHp),c.hp===0&&c.onDeath()},c.respawn=function(m,v){c.pos.set(m,Nt(m,v),v),c.vel.set(0,0),c.vy=0,c.airborne=!1,c.hp=c.maxHp,c.mode="normal",c.invulnerable=!1,t.weapon.visible=!0,t.roller.rotation.x=0,c.onHpChange(c.hp,c.maxHp)},c.update=function(m,v,x){if(c.modeT+=m,c.time+=m,c.landT+=m,c.mode==="sleep"){f(m);return}c.hp>0&&c.hp<c.maxHp&&c.time-c.lastHurtAt>Dt.regenDelay&&(c.hp=Math.min(c.maxHp,c.hp+Dt.regenPerSecond*m),c.onHpChange(c.hp,c.maxHp));let w=0,M=0;n.has("KeyW")&&(M+=1),n.has("KeyS")&&(M-=1),n.has("KeyA")&&(w-=1),n.has("KeyD")&&(w+=1);const E=n.has("ShiftLeft")||n.has("ShiftRight");c.crouching=n.has("KeyC")&&c.mode==="normal"&&!c.airborne,c.crouch01+=((c.crouching?1:0)-c.crouch01)*(1-Math.exp(-m*12));const T=-Math.sin(v),A=-Math.cos(v),I=-A,y=T;let S=T*M+I*w,N=A*M+y*w;const k=Math.hypot(S,N);if(k>0&&(S/=k,N/=k),n.has("Space")&&r&&(n.delete("Space"),u()),o){const[J,W]=s[o];o=null,h(T*W+I*J,A*W+y*J)}let z=0;if(c.mode==="roll"&&(c.modeT>=Dt.dodgeDuration?(c.mode="normal",c.invulnerable=!1):c.vel.set(c.rollDir.x*Dt.dodgeSpeed,c.rollDir.z*Dt.dodgeSpeed)),c.mode==="attack"&&(!c.swungThisAttack&&c.modeT>=Dt.attackDuration*.55&&(c.swungThisAttack=!0,c.onAttackSwing&&c.onAttackSwing()),c.modeT>=Dt.attackDuration&&(c.mode="normal"),c.vel.multiplyScalar(Math.max(0,1-m*14))),c.mode==="normal"){const J=c.crouching?Dt.crouchMult:E?Dt.sprintMult:1;z=k>0?Dt.walkSpeed*J:0;const W=1-Math.exp(-m*10);c.vel.x+=(S*z-c.vel.x)*W,c.vel.y+=(N*z-c.vel.y)*W}c.pos.x+=c.vel.x*m,c.pos.z+=c.vel.y*m,g(x);const H=Nt(c.pos.x,c.pos.z);c.airborne?(c.vy-=Dt.gravity*m,c.pos.y+=c.vy*m,c.vy<=0&&c.pos.y<=H&&(c.pos.y=H,c.vy=0,c.airborne=!1,c.landT=0)):c.pos.y=H;const O=Math.hypot(c.vel.x,c.vel.y);if(O>.4&&c.mode!=="attack"){const J=Math.atan2(c.vel.x,c.vel.y);c.facing=Wp(c.facing,J,1-Math.exp(-m*Dt.turnLerp))}t.group.rotation.y=c.facing,_(m,Math.min(O/Dt.walkSpeed,1.3),E)},c.attack=l,c.startSleep=d,c.faceToward=function(m,v){c.facing=Math.atan2(m-c.pos.x,v-c.pos.z),t.group.rotation.y=c.facing},c}const hg="crownbound_mouse_feel";function Hh(i){return me.mouse.feels.find(e=>e.id===i)}let Pd=Hh(localStorage.getItem(hg))??Hh(me.mouse.defaultFeel);function $p(){return Pd.id}function b2(){return Pd.sens}function E2(i){const e=Hh(i);e&&(Pd=e,localStorage.setItem(hg,i))}const qp=-.08,Xp=1.2;function T2(i,e,t){let n=Math.PI,r=.38,s=6,a=!1,o=!1,c=!1,l=0,u=null;const d=5,f=new U;let h=!1,g=s;const _=new U,p=new U;let m=0,v=null,x=0;const w=1.8;function M(){if(t()||document.pointerLockElement===e)return;const A=e.requestPointerLock({unadjustedMovement:!0});A&&A.catch&&A.catch(()=>{const I=e.requestPointerLock();I&&I.catch&&I.catch(()=>{o=!0})})}e.addEventListener("click",M),document.addEventListener("pointerlockchange",()=>{document.pointerLockElement===e&&(o=!1)}),e.addEventListener("mousedown",A=>{A.button!==0||t()||document.pointerLockElement===e||(c=!0,l=0)}),window.addEventListener("mouseup",A=>{A.button!==0||!c||(c=!1,o&&l<d&&!t()&&u&&u())});const E=["KeyW","KeyA","KeyS","KeyD","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space","KeyC","ShiftLeft","ShiftRight"];window.addEventListener("keydown",A=>{E.includes(A.code)&&M()}),document.addEventListener("mousemove",A=>{if(document.pointerLockElement!==e){if(!c)return;l+=Math.abs(A.movementX)+Math.abs(A.movementY)}a=!0;const I=b2();n-=A.movementX*I,r+=A.movementY*I,r=Math.min(Xp,Math.max(qp,r))}),window.addEventListener("wheel",A=>{t()||(s=Math.min(10,Math.max(3,s+Math.sign(A.deltaY)*.7)))});function T(A,I){a||(n+=A*.12);const y=v&&I.x>v.minX&&I.x<v.maxX&&I.z>v.minZ&&I.z<v.maxZ;x+=((y?1:0)-x)*(1-Math.exp(-A*6)),h?f.lerp(I,1-Math.exp(-A*9)):(f.copy(I),h=!0),g+=(s-g)*(1-Math.exp(-A*9));const S=g+(Math.min(g,w)-g)*x,N=Math.cos(r);_.set(f.x+Math.sin(n)*N*S,f.y+1.4+Math.sin(r)*S,f.z+Math.cos(n)*N*S);const k=Nt(_.x,_.z)+.35;if(_.y<k&&(_.y=k),x>.001){const z=Math.min(_.y,v.ceilY),H=Math.min(Math.max(_.x,v.minX+.25),v.maxX-.25),O=Math.min(Math.max(_.z,v.minZ+.25),v.maxZ-.25);_.y+=(z-_.y)*x,_.x+=(H-_.x)*x,_.z+=(O-_.z)*x}i.position.copy(_),m>.002&&(i.position.x+=(Math.random()-.5)*m,i.position.y+=(Math.random()-.5)*m,m*=Math.exp(-A*7)),p.set(f.x,f.y+1.25,f.z),i.lookAt(p)}return{update:T,getYaw:()=>n,setInterior(A){v=A},setView(A,I,y){n=A,r=Math.min(Xp,Math.max(qp,I)),s=Math.min(14,Math.max(3,y)),g=s,a=!0},setOnTap(A){u=A},isLocked:()=>document.pointerLockElement===e,unlock:()=>{document.pointerLockElement===e&&document.exitPointerLock()},shake:A=>{m=Math.min(m+A,.5)}}}const yr=i=>document.getElementById(i);let Vh,Gh,dg,fg,Wh,pg,zr,Yp=null;function A2(){Vh=yr("hp-fill"),Gh=yr("stamina-fill"),dg=yr("coin-count"),fg=yr("hud-rank"),Wh=yr("streak-count"),pg=yr("flame-icon"),zr=yr("interact-prompt")}let Kp=-1,jp=-1,Jp=-1,Mu=null;function mg(i,e){const t=Math.round(Math.max(0,i/e*100));t!==Kp&&(Kp=t,Vh.style.width=`${t}%`,Vh.parentElement.classList.toggle("low",t>0&&t<=30))}function R2(i,e){i!==Jp&&(Jp=i,Gh.parentElement.classList.toggle("spent",i<me.stamina.attackCost));const t=Math.round(Math.max(0,i/e*100));t!==jp&&(jp=t,Gh.style.width=`${t}%`)}function P2(i){dg.textContent=String(i)}function C2(i){fg.textContent=i}function L2(i){if(Wh.textContent=String(i),pg.classList.toggle("dead",i===0),Mu!==null&&i>Mu){const e=Wh.parentElement;e.classList.remove("grew"),e.offsetWidth,e.classList.add("grew")}Mu=i}function gg(i){i!==Yp&&(Yp=i,i?(zr.innerHTML=i,zr.classList.remove("hidden")):zr.classList.add("hidden"))}function I2(i){if(!i){zr.style.visibility="hidden";return}zr.style.visibility="",zr.style.transform=`translate(-50%, -100%) translate(${Math.round(i[0])}px, ${Math.round(i[1])}px)`}function rn(i=new Date){const e=i.getFullYear(),t=String(i.getMonth()+1).padStart(2,"0"),n=String(i.getDate()).padStart(2,"0");return`${e}-${t}-${n}`}function _g(){const i=new Date;return i.setDate(i.getDate()-1),rn(i)}function eo(i=new Date){const e=new Date(i),t=(e.getDay()+6)%7;return e.setDate(e.getDate()-t),rn(e)}function pl(i=new Date){return`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,"0")}-01`}function xg(i=new Date){return`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,"0")}`}function D2(i=new Date){return xg(new Date(i.getFullYear(),i.getMonth()-1,1))}function Zp(i){const[e,t]=i.split("-").map(Number);return xg(new Date(e,t,1))}const Or={str:"Strength",agi:"Agility",wis:"Wisdom",inf:"Influence"};let ae=null;const yg=new Set;function _n(){return ae}function vg(i){yg.add(i)}function Ht(i){for(const e of yg)e(i,ae)}function sn(){localStorage.setItem(me.saveKey,JSON.stringify(ae))}function wg(){return JSON.stringify(ae,null,2)}function Mg(i){try{const e=JSON.parse(i);if(e&&typeof e=="object"&&typeof e.saveVersion=="number"&&e.stats&&e.quests)return e}catch{}return null}function U2(i){return Mg(i)!==null}function Sg(i){const e=Mg(i);if(!e)return!1;const t=localStorage.getItem(me.saveKey);return t&&localStorage.setItem(me.saveKey+"_prev",t),localStorage.setItem(me.saveKey,JSON.stringify(e)),!0}function Qp(i=new Date){const e=rn(i);return{saveVersion:me.saveVersion,createdAt:i.toISOString(),lastPlayedAt:i.toISOString(),lastQuestDate:null,rank:"Peasant",stats:{str:{level:1,xp:0},agi:{level:1,xp:0},wis:{level:1,xp:0},inf:{level:1,xp:0}},coins:0,treasury:{name:"",current:0,goal:1e4,pledge:0,rolls:[],conquered:[]},streak:{current:0,best:0},quests:{daily:{text:"",completed:!1,date:e},weekly:{text:"",completed:!1,weekStart:eo(i)},monthly:{text:"",completed:!1,monthStart:pl(i)},epic:{text:"",progressPct:0}},history:[],chronicle:[],daysPlayed:1,stamina:{current:me.stamina.baseCap,date:e},counters:{date:e,dummyHits:0,ratsKilled:0},sleep:{retiredAt:null,lastRewardDate:null,wellRestedDate:null,log:[]},shop:{owned:[]},coronationAt:null}}function N2(i){return i.saveVersion===1&&(i.quests.monthly={text:"",completed:!1,monthStart:pl()},i.saveVersion=2),i.saveVersion===2&&(i.saveVersion=3),i.saveVersion===3&&(i.saveVersion=4),i.saveVersion===4&&(i.saveVersion=5),i.saveVersion===5&&(i.saveVersion=6,delete i.quests.epic.deadline),i.saveVersion===6&&(i.saveVersion=7),i.saveVersion===7&&(i.saveVersion=8),i.sleep||(i.sleep={retiredAt:null,lastRewardDate:null,wellRestedDate:null}),i.sleep.log||(i.sleep.log=[]),i.chronicle||(i.chronicle=[]),i.shop||(i.shop={owned:[]}),"coronationAt"in i||(i.coronationAt=null),"name"in i.treasury||(i.treasury.name=""),"pledge"in i.treasury||(i.treasury.pledge=0),i.treasury.rolls||(i.treasury.rolls=[]),i.treasury.conquered||(i.treasury.conquered=[]),i}function bg(i,e=new Date){if(!i)return"none";const t=me.sleep,n=(e.getTime()-new Date(i).getTime())/36e5;return n<t.minHours?"pending":n>t.maxHours?"stale":e.getHours()<t.wakeByHour||e.getHours()===t.wakeByHour&&e.getMinutes()===0?"reward":"late"}function k2(){ae.sleep.retiredAt=new Date().toISOString(),sn()}function Eg(){const i=rn();if(ae.sleep.lastRewardDate===i)return!1;const e=me.sleep;return ae.sleep.lastRewardDate=i,ae.sleep.wellRestedDate=i,ae.coins+=e.coins,ae.stamina.current=Math.min(ae.stamina.current+e.staminaBonus,ml()),ae.history.push({date:i,questText:"Rose with the dawn, well-rested",statTrained:"wis",type:"sleep"}),ao("wis",e.wisXp),Ht("sleep"),!0}function z2(){const i=rn(),e=[];ae.counters.date!==i&&(ae.daysPlayed+=1,ae.counters={date:i,dummyHits:0,ratsKilled:0}),ae.quests.daily.date!==i&&(ae.quests.daily={text:"",completed:!1,date:i});const t=eo();ae.quests.weekly.weekStart!==t&&(ae.quests.weekly={text:"",completed:!1,weekStart:t});const n=pl();ae.quests.monthly.monthStart!==n&&(ae.quests.monthly={text:"",completed:!1,monthStart:n}),ae.streak.current>0&&ae.lastQuestDate!==i&&ae.lastQuestDate!==_g()&&(ae.streak.current=0,e.push({text:"The fire died in the night.",style:"grim"})),ae.stamina.date!==i&&(ae.stamina={current:ml(),date:i});const r=bg(ae.sleep.retiredAt);if(r!=="none"&&r!=="pending"&&(ae.sleep.log.push({bed:ae.sleep.retiredAt,wake:r==="stale"?null:new Date().toISOString(),verdict:r==="reward"?"dawn":r==="late"?"late":"unwitnessed"}),ae.sleep.retiredAt=null),r==="reward"&&Eg()){const s=me.sleep;e.push({text:`Well-Rested — a full night, up with the dawn. (+${s.wisXp} Wisdom XP, +${s.coins}c, +${s.staminaBonus} stamina)`,style:"gold"})}else r==="late"&&e.push({text:"You slept long past the dawn bell. No boon today.",style:"grim"});return e}function O2(){const i=localStorage.getItem(me.saveKey);let e=[];if(!i)ae=Qp(),e.push({text:"You wake in a humble clearing. The board awaits.",style:""}),e.push({text:"WASD walk · Shift run · Space jump · C crouch · Double-tap WASD roll · Click swing · E interact",style:""});else try{ae=N2(JSON.parse(i)),e=z2()}catch{ae=Qp(),e.push({text:"Your chronicle was illegible; a fresh page begins.",style:"grim"})}return ae.lastPlayedAt=new Date().toISOString(),sn(),{messages:e}}function F2(i){return me.xpPerLevel*ae.stats[i].level}function Tg(){return Object.values(ae.stats).reduce((i,e)=>i+e.level,0)}function ao(i,e){const t=ae.stats[i];t.xp+=e;const n=[];for(;t.xp>=me.xpPerLevel*t.level;)t.xp-=me.xpPerLevel*t.level,t.level+=1,n.push(t.level);ae.rank=h2(Tg());const r=ae.rank==="King"&&!ae.coronationAt;return r&&(ae.coronationAt=new Date().toISOString(),ae.history.push({date:rn(),questText:"The Coronation — crowned sovereign of the realm",statTrained:null,type:"coronation"})),sn(),Ht("stats"),r&&Ht("coronation"),n}function Ag(){const i=ae.quests.daily;return i.completed&&i.date===rn()}function ml(){const i=Ag()?me.stamina.questCap:me.stamina.baseCap,e=ae.sleep.wellRestedDate===rn()?me.sleep.staminaBonus:0;return i+e}function Rg(i){return ae.stamina.current<i?!1:(ae.stamina.current-=i,sn(),Ht("stamina"),!0)}function B2(i){const e=i.trim();e&&(ae.quests.daily={text:e,completed:!1,date:rn()},sn(),Ht("quests"))}function H2(i){const e=ae.quests.daily;if(!e.text||e.completed)return null;const t=rn();e.completed=!0,ae.lastQuestDate===_g()?ae.streak.current+=1:ae.lastQuestDate!==t&&(ae.streak.current=1),ae.streak.best=Math.max(ae.streak.best,ae.streak.current),ae.lastQuestDate=t,ae.coins+=me.rewards.daily.coins,ae.stamina={current:ml(),date:t},ae.history.push({date:t,questText:e.text,statTrained:i,type:"daily"});const n=ao(i,me.rewards.daily.xp);return Ht("quests"),{levelUps:n,xp:me.rewards.daily.xp,coins:me.rewards.daily.coins}}function V2(i){const e=i.trim();e&&(ae.quests.weekly={text:e,completed:!1,weekStart:eo()},sn(),Ht("quests"))}function G2(i){const e=ae.quests.weekly;if(!e.text||e.completed)return null;e.completed=!0,ae.coins+=me.rewards.weekly.coins,ae.history.push({date:rn(),questText:e.text,statTrained:i,type:"weekly"});const t=ao(i,me.rewards.weekly.xp);return Ht("quests"),{levelUps:t,xp:me.rewards.weekly.xp,coins:me.rewards.weekly.coins}}function W2(i){const e=i.trim();e&&(ae.quests.monthly={text:e,completed:!1,monthStart:pl()},sn(),Ht("quests"))}function $2(i){const e=ae.quests.monthly;if(!e.text||e.completed)return null;e.completed=!0,ae.coins+=me.rewards.monthly.coins,ae.history.push({date:rn(),questText:e.text,statTrained:i,type:"monthly"});const t=ao(i,me.rewards.monthly.xp);return Ht("quests"),{levelUps:t,xp:me.rewards.monthly.xp,coins:me.rewards.monthly.coins}}function q2(i){ae.quests.epic.text=i.trim(),sn(),Ht("quests")}function X2(i){const e=Math.max(0,Math.min(100,Math.round(i)));e!==ae.quests.epic.progressPct&&(ae.quests.epic.progressPct=e,ae.history.push({date:rn(),questText:ae.quests.epic.text,statTrained:null,type:"epic",progressPct:e}),sn(),Ht("quests"))}function e0(i){return me.ranks.findIndex(e=>e.title===i)}function Y2(i){return ae.shop.owned.includes(i)}function K2(i){const e=me.shop.items.find(t=>t.id===i);return e?e.once&&Y2(i)?{ok:!1,why:"owned"}:e.minRank&&e0(ae.rank)<e0(e.minRank)?{ok:!1,why:"rank"}:ae.coins<e.price?{ok:!1,why:"coins"}:(ae.coins-=e.price,e.once&&ae.shop.owned.push(i),ae.history.push({date:rn(),questText:`Bought ${e.name} from the chapman`,statTrained:null,type:"purchase"}),sn(),Ht("coins"),Ht("shop"),{ok:!0,item:e}):{ok:!1,why:"unknown"}}function j2(i,e){ae.treasury.current=Math.max(0,i),ae.treasury.goal=Math.max(0,e),sn(),Ht("treasury")}function Pg(i){ae.treasury.pledge=Math.max(0,Math.round(i)),sn(),Ht("treasury")}function Cg({earned:i,spent:e,saved:t},n){return n>0&&t>=n?"fat":i-e>=0?"held":"bled"}function gl(i=new Date){const e=D2(i);return ae.treasury.rolls.some(t=>t.month===e)?null:e}function Lg({earned:i,spent:e,saved:t,counted:n},r=new Date){const s=gl(r);if(!s)return null;const a=ae.treasury,o=a.rolls[a.rolls.length-1];if(o){let u=Zp(o.month);for(let d=0;u<s&&d<240;d++)a.rolls.push({month:u,verdict:"unreckoned"}),u=Zp(u)}const c={month:s,earned:Math.max(0,i),spent:Math.max(0,e),saved:Math.max(0,t),counted:Math.max(0,n),verdict:Cg({earned:i,spent:e,saved:t},a.pledge)};a.rolls.push(c),a.current=c.counted;let l=null;return a.goal>0&&a.current>=a.goal&&(l={name:a.name||"the unnamed hoard",goal:a.goal,conqueredAt:new Date().toISOString()},a.conquered.push(l),a.goal=0,a.name="",ae.history.push({date:rn(),questText:`${l.name} — the hoard reached ${l.goal.toLocaleString()}`,statTrained:null,type:"treasury"})),sn(),Ht("treasury"),{roll:c,conquered:l}}function Ig(i,e){ae.treasury.name=i.trim(),ae.treasury.goal=Math.max(1,Math.round(e)),sn(),Ht("treasury")}function t0(i,e){ae.chronicle.push({week:i,text:e,writtenAt:new Date().toISOString()}),sn(),Ht("chronicle")}function J2(){const i=me.dummy.xpForHit(ae.counters.dummyHits);return ae.counters.dummyHits+=1,sn(),i}function Z2(){return ae.counters.ratsKilled+=1,ae.coins+=me.rewards.ratCoins,sn(),Ht("coins"),me.rewards.ratCoins}const Q2=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],eE={embers:"cold embers",small:"a small flame",healthy:"a healthy fire",roaring:"a roaring blaze"};function tE(){const i=[...me.campfireTiers].sort((e,t)=>e.minStreak-t.minStreak);return i.map((e,t)=>{const n=i[t+1];return`<div class="kv"><span>${n?e.minStreak===n.minStreak-1?`${e.minStreak} day${e.minStreak===1?"":"s"}`:`${e.minStreak}–${n.minStreak-1} days`:`${e.minStreak}+ days`}</span><span class="v">${eE[e.name]??e.name}</span></div>`}).join("")}function nE(){const i=[];let e=0,t=me.dummy.xpForHit(0);for(let n=1;n<=500&&t>0;n++){const r=me.dummy.xpForHit(n);r!==t&&(i.push(`<div class="kv"><span>blows ${e+1}–${n}</span><span class="v">${t} Strength XP each</span></div>`),e=n,t=r)}return i.push('<div class="kv"><span>beyond that</span><span class="v">nothing till the morrow</span></div>'),i.join("")}function iE(i){const e=me.rewards,t=me.stamina,n=me.sleep,r=me.ranks[me.ranks.length-1],s=me.ranks.map((c,l)=>`<div class="kv"><span>${c.title}</span><span class="v">${l===0?"where all begin":`${c.totalLevels} virtue levels`}</span></div>`).join(""),a=[["W A S D","walk"],["Shift","sprint"],["Space","jump — the road is ever free"],["C (held)","crouch"],["double-tap a direction",`dodge-roll (${t.dodgeCost} stamina)`],["left click",`swing thy stick (${t.attackCost} stamina)`],["mouse &amp; wheel","turn the eye, draw it near"],["E","the one key — the nearest thing in reach answers"],["Esc","close a panel, free the mouse"]].map(([c,l])=>`<div class="kv"><span><b>${c}</b></span><span class="v">${l}</span></div>`).join(""),o=me.shop?`<div class="sheet-section">
        <h2>The Chapman&#8217;s Cart</h2>
        <p class="muted">A peddler parks by the path on ${me.shop.marketWeekdays.map(c=>Q2[c]).join(", ")}. He deals in comfort and swagger for coin — but virtue is not for sale,
        at any price. No XP, no streak, no stamina changes hands at his cart.</p>
      </div>`:"";i.innerHTML=`
    <div class="sheet-section">
      <p class="quest-text" style="text-align:center">Real life levels thee up;
      the game is where thou feelest it.</p>
      <p class="muted">Deeds are done out in the world — lifting, learning, building, saving —
      and logged at the Quest Board in thine own words. Nothing is verified. The realm trusts
      thy word, and is worth exactly what thy word is worth.</p>
    </div>
    <div class="sheet-section">
      <h2>The Law of the Land</h2>
      <p class="muted">Post a quest at the board in thine own words. Do the real deed under the
      real sky. Return, mark it complete, and name the virtue it trained — the reward lands there.
      The game never invents tasks for thee.</p>
    </div>
    <div class="sheet-section">
      <h2>Rewards of the Realm</h2>
      <div class="kv"><span>Daily Quest</span><span class="v">+${e.daily.xp} XP · +${e.daily.coins} coins · refills stamina · feeds the fire</span></div>
      <div class="kv"><span>Weekly Bounty</span><span class="v">+${e.weekly.xp} XP · +${e.weekly.coins} coins · resets Monday</span></div>
      <div class="kv"><span>Monthly Campaign</span><span class="v">+${e.monthly.xp} XP · +${e.monthly.coins} coins · resets the 1st</span></div>
      <div class="kv"><span>The Epic Quest</span><span class="v">the year&#8217;s great work, reckoned by thy hand</span></div>
    </div>
    <div class="sheet-section">
      <h2>The Four Virtues</h2>
      <p class="muted">Strength, Agility, Wisdom, Influence — each begins at level 1, and the next
      level always costs ${me.xpPerLevel} × thy current level in XP. Thy rank is the sum of
      all four, and the Coronation comes the moment the crown is earned:</p>
      ${s}
      <p class="muted">${r.title} at ${r.totalLevels} levels is the Coronation itself —
      not given, not scheduled. Earned.</p>
    </div>
    <div class="sheet-section">
      <h2>The Streak &amp; the Fire</h2>
      <p class="muted">Completing the daily quest claims the day. Miss a full day and the fire
      dies in the night — the streak returns to nought. Until today&#8217;s deed is done the flame
      gutters low, a living reminder; it swells the moment the deed is logged.</p>
      ${tE()}
    </div>
    <div class="sheet-section">
      <h2>Stamina</h2>
      <p class="muted">A daily pool spent only on arms — walking, sprinting and leaping are ever
      free. The cap stands at ${t.baseCap}; complete the daily quest and the pool refills, the cap
      rising to ${t.questCap} till nightfall. Spent dry, thy arms refuse until the board is answered.</p>
      <div class="kv"><span>a swing of the stick</span><span class="v">${t.attackCost} stamina</span></div>
      <div class="kv"><span>a dodge-roll</span><span class="v">${t.dodgeCost} stamina</span></div>
    </div>
    <div class="sheet-section">
      <h2>Arms &amp; the Yard</h2>
      <p class="muted">The training dummy pays a trickle of Strength for honest sweat,
      less with every blow:</p>
      ${nE()}
      <p class="muted" style="margin-top:8px">${me.rats.count} rats haunt the granary yard;
      the miller pays ${e.ratCoins} coins a tail, and the slain return on the morrow. Shouldst thou
      fall, thou wakest on thy cot at home, whole, having lost nothing but pride.</p>
    </div>
    <div class="sheet-section">
      <h2>Sleep &amp; the Dawn</h2>
      <p class="muted">E at thy cot mends thee whole and marks the night; next opening the game
      marks the morning. ${n.minHours} hours abed and back by ${n.wakeByHour} o&#8217;clock earns
      the Well-Rested boon — +${n.wisXp} Wisdom XP, +${n.coins} coins, +${n.staminaBonus} stamina
      cap for the day, once each day. The Sleep Ledger on the hovel wall remembers every judged night.</p>
    </div>
    <div class="sheet-section">
      <h2>The Two Purses</h2>
      <div class="kv"><span>Coins</span><span class="v">quest spoils and rat bounties</span></div>
      <div class="kv"><span>The Treasury</span><span class="v">thy true savings, kept at the Exchequer</span></div>
      <p class="muted">They never mix. Coins of the realm will never buy back a virtue,
      and thy true hoard answers to no game. When each month turns, the clerk hears the
      Reckoning — coin earned, coin spent, what was laid in the hoard, and the hoard counted
      true — judges it against thy pledge, and enters the roll. Summits are named, climbed
      by the month, and conquered only at a filing.</p>
    </div>
    ${o}
    <div class="sheet-section">
      <h2>The Keys</h2>
      ${a}
    </div>
    <div class="sheet-section">
      <h2>A Day Well Lived</h2>
      <p class="muted">Rise before ${n.wakeByHour} and collect the dawn. Post the daily. Go live —
      the deed happens out there, not in here. At evening, mark it done and name its virtue.
      Then shut the door, press E at the cot, and let the night be marked. The crown is not given;
      it is accumulated, one honest day at a time.</p>
    </div>`}function re(i,e,t,n,r){if(typeof e=="function"?i!==e||!0:!e.has(i))throw new TypeError("Cannot write private member to an object whose class did not declare it");return e.set(i,t),t}function P(i,e,t,n){if(t==="a"&&!n)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?i!==e||!n:!e.has(i))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?n:t==="a"?n.call(i):n?n.value:e.get(i)}let Yc=function(){const{crypto:i}=globalThis;if(i!=null&&i.randomUUID)return Yc=i.randomUUID.bind(i),i.randomUUID();const e=new Uint8Array(1),t=i?()=>i.getRandomValues(e)[0]:()=>Math.random()*255&255;return"10000000-1000-4000-8000-100000000000".replace(/[018]/g,n=>(+n^t()&15>>+n/4).toString(16))};function Xs(i){return typeof i=="object"&&i!==null&&("name"in i&&i.name==="AbortError"||"message"in i&&String(i.message).includes("FetchRequestCanceledException"))}const Kc=i=>{if(i instanceof Error)return i;if(typeof i=="object"&&i!==null){try{if(Object.prototype.toString.call(i)==="[object Error]"){const e=new Error(i.message,i.cause?{cause:i.cause}:{});return i.stack&&(e.stack=i.stack),i.cause&&!e.cause&&(e.cause=i.cause),i.name&&(e.name=i.name),e}}catch{}try{return new Error(JSON.stringify(i))}catch{}}return new Error(i)};class Fe extends Error{}class Zt extends Fe{constructor(e,t,n,r,s){super(`${Zt.makeMessage(e,t,n)}`),this.status=e,this.headers=r,this.requestID=r==null?void 0:r.get("request-id"),this.error=t,this.type=s??null}static makeMessage(e,t,n){const r=t!=null&&t.message?typeof t.message=="string"?t.message:JSON.stringify(t.message):t?JSON.stringify(t):n;return e&&r?`${e} ${r}`:e?`${e} status code (no body)`:r||"(no status code or body)"}static generate(e,t,n,r){var o;if(!e||!r)return new oo({message:n,cause:Kc(t)});const s=t,a=(o=s==null?void 0:s.error)==null?void 0:o.type;return e===400?new Ug(e,s,n,r,a):e===401?new Ng(e,s,n,r,a):e===403?new kg(e,s,n,r,a):e===404?new zg(e,s,n,r,a):e===409?new Og(e,s,n,r,a):e===422?new Fg(e,s,n,r,a):e===429?new Bg(e,s,n,r,a):e>=500?new Hg(e,s,n,r,a):new Zt(e,s,n,r,a)}}class ai extends Zt{constructor({message:e}={}){super(void 0,void 0,e||"Request was aborted.",void 0)}}class oo extends Zt{constructor({message:e,cause:t}){super(void 0,void 0,e||"Connection error.",void 0),t&&(this.cause=t)}}class Dg extends oo{constructor({message:e}={}){super({message:e??"Request timed out."})}}class rE extends Fe{constructor(e,{cause:t}={}){super(e??"Retryable error."),t!==void 0&&(this.cause=t)}}class Ug extends Zt{}class Ng extends Zt{}class kg extends Zt{}class zg extends Zt{}class Og extends Zt{}class Fg extends Zt{}class Bg extends Zt{}class Hg extends Zt{}const sE=/^[a-z][a-z0-9+.-]*:/i,aE=i=>sE.test(i);let En=i=>(En=Array.isArray,En(i)),n0=En;function jc(i){return typeof i!="object"?{}:i??{}}function i0(i){if(!i)return!0;for(const e in i)return!1;return!0}function oE(i,e){return Object.prototype.hasOwnProperty.call(i,e)}const cE=(i,e)=>{if(typeof e!="number"||!Number.isInteger(e))throw new Fe(`${i} must be an integer`);if(e<0)throw new Fe(`${i} must be a positive integer`);return e},Vg=i=>{try{return JSON.parse(i)}catch{return}},Fr=(i,e)=>new Promise(t=>{if(e!=null&&e.aborted)return t();const n=()=>{clearTimeout(r),t()},r=setTimeout(()=>{e==null||e.removeEventListener("abort",n),t()},i);e==null||e.addEventListener("abort",n,{once:!0})}),Zi="0.110.0",lE=()=>typeof window<"u"&&typeof window.document<"u"&&typeof navigator<"u";function uE(){return typeof Deno<"u"&&Deno.build!=null?"deno":typeof EdgeRuntime<"u"?"edge":Object.prototype.toString.call(typeof globalThis.process<"u"?globalThis.process:0)==="[object process]"?"node":"unknown"}const hE=()=>{var t;const i=uE();if(i==="deno")return{"X-Stainless-Lang":"js","X-Stainless-Package-Version":Zi,"X-Stainless-OS":s0(Deno.build.os),"X-Stainless-Arch":r0(Deno.build.arch),"X-Stainless-Runtime":"deno","X-Stainless-Runtime-Version":typeof Deno.version=="string"?Deno.version:((t=Deno.version)==null?void 0:t.deno)??"unknown"};if(typeof EdgeRuntime<"u")return{"X-Stainless-Lang":"js","X-Stainless-Package-Version":Zi,"X-Stainless-OS":"Unknown","X-Stainless-Arch":`other:${EdgeRuntime}`,"X-Stainless-Runtime":"edge","X-Stainless-Runtime-Version":globalThis.process.version};if(i==="node")return{"X-Stainless-Lang":"js","X-Stainless-Package-Version":Zi,"X-Stainless-OS":s0(globalThis.process.platform??"unknown"),"X-Stainless-Arch":r0(globalThis.process.arch??"unknown"),"X-Stainless-Runtime":"node","X-Stainless-Runtime-Version":globalThis.process.version??"unknown"};const e=dE();return e?{"X-Stainless-Lang":"js","X-Stainless-Package-Version":Zi,"X-Stainless-OS":"Unknown","X-Stainless-Arch":"unknown","X-Stainless-Runtime":`browser:${e.browser}`,"X-Stainless-Runtime-Version":e.version}:{"X-Stainless-Lang":"js","X-Stainless-Package-Version":Zi,"X-Stainless-OS":"Unknown","X-Stainless-Arch":"unknown","X-Stainless-Runtime":"unknown","X-Stainless-Runtime-Version":"unknown"}};function dE(){if(typeof navigator>"u"||!navigator)return null;const i=[{key:"edge",pattern:/Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/},{key:"ie",pattern:/MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/},{key:"ie",pattern:/Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/},{key:"chrome",pattern:/Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/},{key:"firefox",pattern:/Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/},{key:"safari",pattern:/(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/}];for(const{key:e,pattern:t}of i){const n=t.exec(navigator.userAgent);if(n){const r=n[1]||0,s=n[2]||0,a=n[3]||0;return{browser:e,version:`${r}.${s}.${a}`}}}return null}const r0=i=>i==="x32"?"x32":i==="x86_64"||i==="x64"?"x64":i==="arm"?"arm":i==="aarch64"||i==="arm64"?"arm64":i?`other:${i}`:"unknown",s0=i=>(i=i.toLowerCase(),i.includes("ios")?"iOS":i==="android"?"Android":i==="darwin"?"MacOS":i==="win32"?"Windows":i==="freebsd"?"FreeBSD":i==="openbsd"?"OpenBSD":i==="linux"?"Linux":i?`Other:${i}`:"Unknown");let a0;const Cd=()=>a0??(a0=hE());function fE(){if(typeof fetch<"u")return fetch;throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new Anthropic({ fetch })` or polyfill the global, `globalThis.fetch = fetch`")}function Gg(...i){const e=globalThis.ReadableStream;if(typeof e>"u")throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");return new e(...i)}function Wg(i){let e=Symbol.asyncIterator in i?i[Symbol.asyncIterator]():i[Symbol.iterator]();return Gg({start(){},async pull(t){const{done:n,value:r}=await e.next();n?t.close():t.enqueue(r)},async cancel(){var t;await((t=e.return)==null?void 0:t.call(e))}})}function Ld(i){if(i[Symbol.asyncIterator])return i;const e=i.getReader();return{async next(){try{const t=await e.read();return t!=null&&t.done&&e.releaseLock(),t}catch(t){throw e.releaseLock(),t}},async return(){const t=e.cancel();return e.releaseLock(),await t,{done:!0,value:void 0}},[Symbol.asyncIterator](){return this}}}async function pE(i){var n,r;if(i===null||typeof i!="object")return;if(i[Symbol.asyncIterator]){await((r=(n=i[Symbol.asyncIterator]()).return)==null?void 0:r.call(n));return}const e=i.getReader(),t=e.cancel();e.releaseLock(),await t}const mE=({headers:i,body:e})=>({bodyHeaders:{"content-type":"application/json"},body:JSON.stringify(e)}),$g="RFC3986",qg=i=>String(i),o0={RFC1738:i=>String(i).replace(/%20/g,"+"),RFC3986:qg},gE="RFC1738";let $h=(i,e)=>($h=Object.hasOwn??Function.prototype.call.bind(Object.prototype.hasOwnProperty),$h(i,e));const li=(()=>{const i=[];for(let e=0;e<256;++e)i.push("%"+((e<16?"0":"")+e.toString(16)).toUpperCase());return i})(),Su=1024,_E=(i,e,t,n,r)=>{if(i.length===0)return i;let s=i;if(typeof i=="symbol"?s=Symbol.prototype.toString.call(i):typeof i!="string"&&(s=String(i)),t==="iso-8859-1")return escape(s).replace(/%u[0-9a-f]{4}/gi,function(o){return"%26%23"+parseInt(o.slice(2),16)+"%3B"});let a="";for(let o=0;o<s.length;o+=Su){const c=s.length>=Su?s.slice(o,o+Su):s,l=[];for(let u=0;u<c.length;++u){let d=c.charCodeAt(u);if(d===45||d===46||d===95||d===126||d>=48&&d<=57||d>=65&&d<=90||d>=97&&d<=122||r===gE&&(d===40||d===41)){l[l.length]=c.charAt(u);continue}if(d<128){l[l.length]=li[d];continue}if(d<2048){l[l.length]=li[192|d>>6]+li[128|d&63];continue}if(d<55296||d>=57344){l[l.length]=li[224|d>>12]+li[128|d>>6&63]+li[128|d&63];continue}u+=1,d=65536+((d&1023)<<10|c.charCodeAt(u)&1023),l[l.length]=li[240|d>>18]+li[128|d>>12&63]+li[128|d>>6&63]+li[128|d&63]}a+=l.join("")}return a};function xE(i){return!i||typeof i!="object"?!1:!!(i.constructor&&i.constructor.isBuffer&&i.constructor.isBuffer(i))}function c0(i,e){if(En(i)){const t=[];for(let n=0;n<i.length;n+=1)t.push(e(i[n]));return t}return e(i)}const Xg={brackets(i){return String(i)+"[]"},comma:"comma",indices(i,e){return String(i)+"["+e+"]"},repeat(i){return String(i)}},Yg=function(i,e){Array.prototype.push.apply(i,En(e)?e:[e])};let l0;const Wt={addQueryPrefix:!1,allowDots:!1,allowEmptyArrays:!1,arrayFormat:"indices",charset:"utf-8",charsetSentinel:!1,delimiter:"&",encode:!0,encodeDotInKeys:!1,encoder:_E,encodeValuesOnly:!1,format:$g,formatter:qg,indices:!1,serializeDate(i){return(l0??(l0=Function.prototype.call.bind(Date.prototype.toISOString)))(i)},skipNulls:!1,strictNullHandling:!1};function yE(i){return typeof i=="string"||typeof i=="number"||typeof i=="boolean"||typeof i=="symbol"||typeof i=="bigint"}const bu={};function Kg(i,e,t,n,r,s,a,o,c,l,u,d,f,h,g,_,p,m){let v=i,x=m,w=0,M=!1;for(;(x=x.get(bu))!==void 0&&!M;){const y=x.get(i);if(w+=1,typeof y<"u"){if(y===w)throw new RangeError("Cyclic object value");M=!0}typeof x.get(bu)>"u"&&(w=0)}if(typeof l=="function"?v=l(e,v):v instanceof Date?v=f==null?void 0:f(v):t==="comma"&&En(v)&&(v=c0(v,function(y){return y instanceof Date?f==null?void 0:f(y):y})),v===null){if(s)return c&&!_?c(e,Wt.encoder,p,"key",h):e;v=""}if(yE(v)||xE(v)){if(c){const y=_?e:c(e,Wt.encoder,p,"key",h);return[(g==null?void 0:g(y))+"="+(g==null?void 0:g(c(v,Wt.encoder,p,"value",h)))]}return[(g==null?void 0:g(e))+"="+(g==null?void 0:g(String(v)))]}const E=[];if(typeof v>"u")return E;let T;if(t==="comma"&&En(v))_&&c&&(v=c0(v,c)),T=[{value:v.length>0?v.join(",")||null:void 0}];else if(En(l))T=l;else{const y=Object.keys(v);T=u?y.sort(u):y}const A=o?String(e).replace(/\./g,"%2E"):String(e),I=n&&En(v)&&v.length===1?A+"[]":A;if(r&&En(v)&&v.length===0)return I+"[]";for(let y=0;y<T.length;++y){const S=T[y],N=typeof S=="object"&&typeof S.value<"u"?S.value:v[S];if(a&&N===null)continue;const k=d&&o?S.replace(/\./g,"%2E"):S,z=En(v)?typeof t=="function"?t(I,k):I:I+(d?"."+k:"["+k+"]");m.set(i,w);const H=new WeakMap;H.set(bu,m),Yg(E,Kg(N,z,t,n,r,s,a,o,t==="comma"&&_&&En(v)?null:c,l,u,d,f,h,g,_,p,H))}return E}function vE(i=Wt){if(typeof i.allowEmptyArrays<"u"&&typeof i.allowEmptyArrays!="boolean")throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");if(typeof i.encodeDotInKeys<"u"&&typeof i.encodeDotInKeys!="boolean")throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");if(i.encoder!==null&&typeof i.encoder<"u"&&typeof i.encoder!="function")throw new TypeError("Encoder has to be a function.");const e=i.charset||Wt.charset;if(typeof i.charset<"u"&&i.charset!=="utf-8"&&i.charset!=="iso-8859-1")throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");let t=$g;if(typeof i.format<"u"){if(!$h(o0,i.format))throw new TypeError("Unknown format option provided.");t=i.format}const n=o0[t];let r=Wt.filter;(typeof i.filter=="function"||En(i.filter))&&(r=i.filter);let s;if(i.arrayFormat&&i.arrayFormat in Xg?s=i.arrayFormat:"indices"in i?s=i.indices?"indices":"repeat":s=Wt.arrayFormat,"commaRoundTrip"in i&&typeof i.commaRoundTrip!="boolean")throw new TypeError("`commaRoundTrip` must be a boolean, or absent");const a=typeof i.allowDots>"u"?i.encodeDotInKeys?!0:Wt.allowDots:!!i.allowDots;return{addQueryPrefix:typeof i.addQueryPrefix=="boolean"?i.addQueryPrefix:Wt.addQueryPrefix,allowDots:a,allowEmptyArrays:typeof i.allowEmptyArrays=="boolean"?!!i.allowEmptyArrays:Wt.allowEmptyArrays,arrayFormat:s,charset:e,charsetSentinel:typeof i.charsetSentinel=="boolean"?i.charsetSentinel:Wt.charsetSentinel,commaRoundTrip:!!i.commaRoundTrip,delimiter:typeof i.delimiter>"u"?Wt.delimiter:i.delimiter,encode:typeof i.encode=="boolean"?i.encode:Wt.encode,encodeDotInKeys:typeof i.encodeDotInKeys=="boolean"?i.encodeDotInKeys:Wt.encodeDotInKeys,encoder:typeof i.encoder=="function"?i.encoder:Wt.encoder,encodeValuesOnly:typeof i.encodeValuesOnly=="boolean"?i.encodeValuesOnly:Wt.encodeValuesOnly,filter:r,format:t,formatter:n,serializeDate:typeof i.serializeDate=="function"?i.serializeDate:Wt.serializeDate,skipNulls:typeof i.skipNulls=="boolean"?i.skipNulls:Wt.skipNulls,sort:typeof i.sort=="function"?i.sort:null,strictNullHandling:typeof i.strictNullHandling=="boolean"?i.strictNullHandling:Wt.strictNullHandling}}function wE(i,e={}){let t=i;const n=vE(e);let r,s;typeof n.filter=="function"?(s=n.filter,t=s("",t)):En(n.filter)&&(s=n.filter,r=s);const a=[];if(typeof t!="object"||t===null)return"";const o=Xg[n.arrayFormat],c=o==="comma"&&n.commaRoundTrip;r||(r=Object.keys(t)),n.sort&&r.sort(n.sort);const l=new WeakMap;for(let f=0;f<r.length;++f){const h=r[f];n.skipNulls&&t[h]===null||Yg(a,Kg(t[h],h,o,c,n.allowEmptyArrays,n.strictNullHandling,n.skipNulls,n.encodeDotInKeys,n.encode?n.encoder:null,n.filter,n.sort,n.allowDots,n.serializeDate,n.format,n.formatter,n.encodeValuesOnly,n.charset,l))}const u=a.join(n.delimiter);let d=n.addQueryPrefix===!0?"?":"";return n.charsetSentinel&&(n.charset==="iso-8859-1"?d+="utf8=%26%2310003%3B&":d+="utf8=%E2%9C%93&"),u.length>0?d+u:""}function ME(i){return wE(i,{arrayFormat:"brackets"})}const SE="modulepreload",bE=function(i,e){return new URL(i,e).href},u0={},Fn=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let a=function(u){return Promise.all(u.map(d=>Promise.resolve(d).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const o=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),l=(c==null?void 0:c.nonce)||(c==null?void 0:c.getAttribute("nonce"));r=a(t.map(u=>{if(u=bE(u,n),u in u0)return;u0[u]=!0;const d=u.endsWith(".css"),f=d?'[rel="stylesheet"]':"";if(!!n)for(let _=o.length-1;_>=0;_--){const p=o[_];if(p.href===u&&(!d||p.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${f}`))return;const g=document.createElement("link");if(g.rel=d?"stylesheet":SE,d||(g.as="script"),g.crossOrigin="",g.href=u,l&&g.setAttribute("nonce",l),document.head.appendChild(g),d)return new Promise((_,p)=>{g.addEventListener("load",_),g.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${u}`)))})}))}function s(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return r.then(a=>{for(const o of a||[])o.status==="rejected"&&s(o.reason);return e().catch(s)})},EE="urn:ietf:params:oauth:grant-type:jwt-bearer",TE="refresh_token",jg="/v1/oauth/token",Jc="oauth-2025-04-20",AE="oidc-federation-2026-04-01",RE=120,Id=30,PE=5,h0=1<<20;function Jg(i){if(!i)return;let e;try{e=new URL(i)}catch(n){throw new bt(`Invalid token endpoint base URL "${i}": ${n}`)}if(e.protocol==="https:")return;const t=e.hostname.toLowerCase().replace(/^\[|\]$/g,"");if(!(e.protocol==="http:"&&(t==="localhost"||t==="127.0.0.1"||t==="::1")))throw new bt(`Refusing to send credential over non-https token endpoint "${i}"`)}async function Zg(i,e){const t=await LE(i);let n;try{n=JSON.parse(t)}catch{throw new bt(`Token endpoint returned non-JSON response (status ${i.status})`,i.status,jn(t),e)}if(!n.access_token)throw new bt(`Token endpoint response missing access_token: ${JSON.stringify(jn(n))}`,i.status,jn(n),e);if(n.token_type&&n.token_type.toLowerCase()!=="bearer")throw new bt(`Token endpoint response: unsupported token_type "${n.token_type}" (want Bearer)`,i.status,jn(n),e);return n}const Eu=2e3,CE=new Set(["error","error_description","error_uri"]);function jn(i){if(i==null)return i;if(typeof i=="string"){let e;try{e=JSON.parse(i)}catch{return i.length<=Eu?i:i.slice(0,Eu)+`... <${i.length-Eu} more chars>`}return JSON.stringify(jn(e))}if(typeof i=="object"&&!Array.isArray(i)){const e={};for(const[t,n]of Object.entries(i))CE.has(t)&&(e[t]=n);return e}return null}async function Qg(i,e=t=>console.warn(`anthropic-sdk: ${t}`)){if(typeof process>"u"||process.platform==="win32")return;const t=await Fn(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url);let n=i,r;try{n=await t.promises.realpath(i),r=await t.promises.stat(n)}catch{return}const s=r.mode&511;if(s&18)throw new bt(`Credentials file at ${n} is group/world-writable (mode 0o${s.toString(8)}); this allows other local users to plant tokens. Run \`chmod 600 ${n}\`.`);if(s&36)throw new bt(`Credentials file at ${n} is group/world-readable (mode 0o${s.toString(8)}); run \`chmod 600 ${n}\` before retrying.`);typeof process.getuid=="function"&&r.uid!==process.getuid()&&e(`credentials file at ${n} is owned by uid ${r.uid} (current process uid ${process.getuid()}); verify this is intentional.`)}async function e_(i,e){const t=await Fn(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url),r=(await Fn(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url)).dirname(i);await t.promises.mkdir(r,{recursive:!0,mode:448});const s=`${i}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;try{const a=await t.promises.open(s,"w",384);try{await a.writeFile(JSON.stringify(e,null,2)),await a.sync()}finally{await a.close()}await t.promises.rename(s,i)}catch(a){throw await t.promises.unlink(s).catch(()=>{}),a}try{const a=await t.promises.open(r,"r");try{await a.sync()}finally{await a.close()}}catch{}}async function LE(i){if(!i.body)return"";const e=i.body.getReader(),t=[];let n=0;for(;;){const{done:s,value:a}=await e.read();if(s)break;if(n+a.length>h0){const o=h0-n;o>0&&t.push(a.subarray(0,o)),await e.cancel();break}t.push(a),n+=a.length}let r;if(t.length===1)r=t[0];else{r=new Uint8Array(t.reduce((a,o)=>a+o.length,0));let s=0;for(const a of t)r.set(a,s),s+=a.length}return new TextDecoder("utf-8").decode(r)}class bt extends Fe{constructor(e,t=null,n=null,r=null){super(e),this.statusCode=t,this.body=n,this.requestId=r}}function Br(){return Math.floor(Date.now()/1e3)}class IE{constructor(e,t){this.cached=null,this.pendingRefresh=null,this.nextForce=!1,this.lastAdvisoryError=0,this.provider=e,this.onAdvisoryRefreshError=t}async getToken(){const e=this.nextForce;this.nextForce=!1;const t=this.cached;if(e||t==null)return(await this.refresh(e)).token;if(t.expiresAt==null)return t.token;const n=t.expiresAt-Br();return n>RE?t.token:n>Id?(this.backgroundRefresh(),t.token):(await this.refresh()).token}invalidate(){this.cached=null,this.nextForce=!0}refresh(e=!1){return this.pendingRefresh&&!e?this.pendingRefresh:this.doRefresh(e)}backgroundRefresh(){this.pendingRefresh||Br()-this.lastAdvisoryError<PE||this.doRefresh().catch(e=>{var t;this.lastAdvisoryError=Br(),(t=this.onAdvisoryRefreshError)==null||t.call(this,e)})}doRefresh(e=!1){return this.pendingRefresh=this.provider(e?{forceRefresh:!0}:void 0).then(t=>(this.cached=t,this.pendingRefresh=null,t),t=>{throw this.pendingRefresh=null,t}),this.pendingRefresh}}var Tu={};const ct=i=>{var e,t,n,r;if(typeof globalThis.process<"u")return((e=Tu==null?void 0:Tu[i])==null?void 0:e.trim())||void 0;if(typeof globalThis.Deno<"u")return((r=(n=(t=globalThis.Deno.env)==null?void 0:t.get)==null?void 0:n.call(t,i))==null?void 0:r.trim())||void 0};function DE(i){let e=0;for(const r of i)e+=r.length;const t=new Uint8Array(e);let n=0;for(const r of i)t.set(r,n),n+=r.length;return t}let d0;function Dd(i){let e;return(d0??(e=new globalThis.TextEncoder,d0=e.encode.bind(e)))(i)}let f0;function p0(i){let e;return(f0??(e=new globalThis.TextDecoder,f0=e.decode.bind(e)))(i)}const Zc="warn",Qc={off:0,error:200,warn:300,info:400,debug:500},qh=(i,e,t)=>{if(i){if(oE(Qc,i))return i;t.warn(`${e} was set to ${JSON.stringify(i)}, expected one of ${JSON.stringify(Object.keys(Qc))}`)}};function Ua(){}function Jo(i,e,t){return!e||Qc[i]>Qc[t]?Ua:e[i].bind(e)}const UE={error:Ua,warn:Ua,info:Ua,debug:Ua};let m0=new WeakMap;function Xh(i,e){const t=m0.get(i);if(t&&t[0]===e)return t[1];const n={error:Jo("error",i,e),warn:Jo("warn",i,e),info:Jo("info",i,e),debug:Jo("debug",i,e)};return m0.set(i,[e,n]),n}function St(i){const e=i.logger,t=i.logLevel??"off";return e?Xh(e,t):UE}let g0,Au;function NE(){const i=ct("ANTHROPIC_LOG");return(!Au||i!==g0)&&(g0=i,Au=Xh(console,qh(i,"process.env['ANTHROPIC_LOG']",Xh(console,Zc))??Zc)),Au}const Ki=i=>(i.options&&(i.options={...i.options},delete i.options.headers),i.headers&&(i.headers=Object.fromEntries((i.headers instanceof Headers?[...i.headers]:Object.entries(i.headers)).map(([e,t])=>[e,e.toLowerCase()==="authorization"||e.toLowerCase()==="api-key"||e.toLowerCase()==="x-api-key"||e.toLowerCase()==="cookie"||e.toLowerCase()==="set-cookie"?"***":t]))),"retryOfRequestLogID"in i&&(i.retryOfRequestLogID&&(i.retryOf=i.retryOfRequestLogID),delete i.retryOfRequestLogID),i),t_="1.0",kE=/^[A-Za-z0-9_.-]+$/;function n_(i){if(!i)throw new Error("profile name is empty");if(i==="."||i==="..")throw new Error(`profile name "${i}" is not allowed`);if(i.includes("/")||i.includes("\\"))throw new Error(`profile name "${i}" must not contain path separators`);if(!kE.test(i))throw new Error(`profile name "${i}" contains disallowed characters (allowed: letters, digits, '_', '.', '-')`)}const zE=async i=>{var e,t;const n=await Ud();if(n===null)return null;const r=i??await i_();if(r===null)return null;n_(r);const s=await Fn(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url),o=(await Fn(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url)).join(n,"configs",`${r}.json`);let c;try{c=await s.promises.readFile(o,"utf-8")}catch(d){if((d==null?void 0:d.code)!=="ENOENT")throw new Error(`failed to read config file ${o}: ${d}`);c=null}if(c===null){const d=ct("ANTHROPIC_ORGANIZATION_ID"),f=ct("ANTHROPIC_IDENTITY_TOKEN_FILE"),h=ct("ANTHROPIC_FEDERATION_RULE_ID");return h&&d?{fromFile:!1,config:{organization_id:d,workspace_id:ct("ANTHROPIC_WORKSPACE_ID"),base_url:ct("ANTHROPIC_BASE_URL"),authentication:{type:"oidc_federation",federation_rule_id:h,service_account_id:ct("ANTHROPIC_SERVICE_ACCOUNT_ID"),identity_token:f?{source:"file",path:f}:void 0,scope:ct("ANTHROPIC_SCOPE")}}}:null}let l;try{l=JSON.parse(c)}catch(d){throw new Error(`failed to parse config file ${o}: ${d}`)}if(!l.authentication)throw new Error(`config file ${o} is missing "authentication"`);const u=l.authentication.type;if(u!=="oidc_federation"&&u!=="user_oauth")throw new Error(`authentication.type "${u}" is not a known authentication type`);if(l.organization_id??(l.organization_id=ct("ANTHROPIC_ORGANIZATION_ID")),l.workspace_id??(l.workspace_id=ct("ANTHROPIC_WORKSPACE_ID")),l.base_url??(l.base_url=ct("ANTHROPIC_BASE_URL")),(e=l.authentication).scope??(e.scope=ct("ANTHROPIC_SCOPE")),l.authentication.type==="oidc_federation"){if(!l.authentication.identity_token){const d=ct("ANTHROPIC_IDENTITY_TOKEN_FILE");d&&(l.authentication.identity_token={source:"file",path:d})}l.authentication.federation_rule_id||(l.authentication.federation_rule_id=ct("ANTHROPIC_FEDERATION_RULE_ID")??""),(t=l.authentication).service_account_id??(t.service_account_id=ct("ANTHROPIC_SERVICE_ACCOUNT_ID"))}return{config:l,fromFile:!0}},OE=async(i,e)=>{if(i!=null&&i.authentication.credentials_path)return i.authentication.credentials_path;const t=await Ud();if(!t)return null;const n=e??await i_();return n?(n_(n),(await Fn(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url)).join(t,"credentials",`${n}.json`)):null},Ud=async()=>{if(!FE())return null;const i=await Fn(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url),e=ct("ANTHROPIC_CONFIG_DIR");if(e)return e;if(Cd()["X-Stainless-OS"]==="Windows"){const s=ct("APPDATA");if(s)return i.join(s,"Anthropic");const a=ct("USERPROFILE");return a?i.join(a,"AppData","Roaming","Anthropic"):null}const n=ct("XDG_CONFIG_HOME");if(n)return i.join(n,"anthropic");const r=ct("HOME");return r?i.join(r,".config","anthropic"):null},FE=()=>{const i=Cd()["X-Stainless-Runtime"];return i==="node"||i==="deno"},i_=async()=>{const i=await Ud();if(!i)return null;const e=ct("ANTHROPIC_PROFILE");if(e)return e;const t=await Fn(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url),r=(await Fn(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url)).join(i,"active_config");try{return(await t.promises.readFile(r,"utf-8")).trim()||"default"}catch(s){if((s==null?void 0:s.code)!=="ENOENT")throw new Error(`failed to read ${r}: ${s}`);return"default"}};function _0(i){if(!i)throw new Fe("Identity token file path is empty");return async()=>{const e=await Fn(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url);let t;try{t=await e.promises.readFile(i,"utf-8")}catch(r){throw new Fe(`Failed to read identity token file at ${i}: ${r}`)}const n=t.trim();if(!n)throw new Fe(`Identity token file at ${i} is empty`);return n}}function BE(i){if(!i)throw new Fe("Identity token value is empty");return()=>i}function HE(i){return async()=>{Jg(i.baseURL);const e=await i.identityTokenProvider();if(e.length>16*1024)throw new bt(`Identity token is ${Math.ceil(e.length/1024)} KiB, exceeds the 16 KiB assertion limit`);const t={grant_type:EE,assertion:e,federation_rule_id:i.federationRuleId,organization_id:i.organizationId};i.serviceAccountId&&(t.service_account_id=i.serviceAccountId),i.workspaceId&&(t.workspace_id=i.workspaceId);const n=`${i.baseURL}${jg}`;let r;try{r=await i.fetch(n,{method:"POST",headers:{"Content-Type":"application/json","anthropic-beta":`${Jc},${AE}`,"User-Agent":i.userAgent||`anthropic-sdk-typescript/${Zi} oidcFederationProvider`},body:JSON.stringify(t)})}catch(c){throw new bt(`Failed to reach token endpoint ${n}: ${c}`)}const s=r.headers.get("Request-Id");if(!r.ok){const c=await r.text().catch(()=>""),l=jn(c);let u="";throw r.status===401&&(u=` Ensure your federation rule matches your identity token. ${i.workspaceId?"":"If your federation rule is scoped to multiple workspaces, set the ANTHROPIC_WORKSPACE_ID environment variable, the 'workspace_id' config key, or the `workspaceId` option. "}View your authentication events in the Workload identity page of Claude Console for more details.`),new bt(`Token exchange failed with status ${r.status}${s?` (request-id ${s})`:""}: ${l}${u}`,r.status,l,s)}const a=await Zg(r,s),o=Number(a.expires_in);if(!Number.isFinite(o))throw new bt(`Token endpoint response missing required fields: ${JSON.stringify(jn(a))}`,r.status,jn(a),s);return{token:a.access_token,expiresAt:Br()+o}}}function VE(i){return async e=>{const t=await Fn(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url);await Qg(i.credentialsPath,i.onSafetyWarning);let n;try{n=await t.promises.readFile(i.credentialsPath,"utf-8")}catch(p){throw new bt(`Credentials file not found at ${i.credentialsPath}: ${p}`)}let r;try{r=JSON.parse(n)}catch(p){throw new bt(`Credentials file at ${i.credentialsPath} is not valid JSON: ${p}`)}const s=r.access_token;if(!s)throw new bt(`Credentials file at ${i.credentialsPath} must include 'access_token'`);const a=r.expires_at;if(!(e!=null&&e.forceRefresh)&&(a==null||Br()<a-Id))return{token:s,expiresAt:a??null};const o=r.refresh_token;if(!i.clientId||!o)throw new bt(`Access token at ${i.credentialsPath} has expired and no refresh is available (client_id ${i.clientId?"set":"empty"}, refresh_token ${o?"set":"empty"})`);Jg(i.baseURL);const c={grant_type:TE,refresh_token:o,client_id:i.clientId},l=`${i.baseURL}${jg}`;let u;try{u=await i.fetch(l,{method:"POST",headers:{"Content-Type":"application/json","anthropic-beta":Jc,"User-Agent":i.userAgent||`anthropic-sdk-typescript/${Zi} userOAuthProvider`},body:JSON.stringify(c)})}catch(p){throw new bt(`User OAuth refresh failed to reach token endpoint: ${p}`)}const d=u.headers.get("Request-Id");if(!u.ok){const p=await u.text().catch(()=>"");throw new bt(`User OAuth refresh failed (HTTP ${u.status}): ${jn(p)}`,u.status,jn(p),d)}const f=await Zg(u,d),h=Number(f.expires_in);if(!Number.isFinite(h))throw new bt(`User OAuth refresh response missing or invalid expires_in: ${JSON.stringify(jn(f))}`,u.status,jn(f),d);const g=Br()+h,_=f.refresh_token||o;return await e_(i.credentialsPath,{...r,version:t_,type:"oauth_token",access_token:f.access_token,expires_at:g,refresh_token:_}),{token:f.access_token,expiresAt:g}}}function r_(i,e){const t=i.authentication.credentials_path??null,n=(i.base_url||e.baseURL).replace(/\/+$/,""),r=WE(i,t,n,e),s={};return i.workspace_id&&i.authentication.type==="user_oauth"&&(s["anthropic-workspace-id"]=i.workspace_id),{provider:r,extraHeaders:s,baseURL:i.base_url||void 0}}async function GE(i,e){const t=await zE(e);if(!t)return null;const{config:n,fromFile:r}=t,s=n.authentication.credentials_path||!r?n:{...n,authentication:{...n.authentication,credentials_path:await OE(n,e)??void 0}};return r_(s,i)}function WE(i,e,t,n){switch(i.authentication.type){case"oidc_federation":{const r=i.authentication,s=$E(r);if(!s)throw new bt("oidc_federation config requires an identity token (set authentication.identity_token, ANTHROPIC_IDENTITY_TOKEN_FILE, or ANTHROPIC_IDENTITY_TOKEN)");if(!r.federation_rule_id)throw new bt("oidc_federation config requires 'federation_rule_id'. Set it in authentication.federation_rule_id in your profile, or via ANTHROPIC_FEDERATION_RULE_ID (profile takes precedence).");if(!i.organization_id)throw new bt("oidc_federation config requires organization_id (set ANTHROPIC_ORGANIZATION_ID or config.organization_id)");const a=HE({identityTokenProvider:s,federationRuleId:r.federation_rule_id,organizationId:i.organization_id,serviceAccountId:r.service_account_id,workspaceId:i.workspace_id,baseURL:t,fetch:n.fetch,userAgent:n.userAgent});return e?qE(a,e,n.onCacheWriteError,n.onSafetyWarning):a}case"user_oauth":{if(!e)throw new bt("user_oauth config requires authentication.credentials_path (or load via a profile so it defaults to <config_dir>/credentials/<profile>.json)");return VE({credentialsPath:e,clientId:i.authentication.client_id,baseURL:t,fetch:n.fetch,userAgent:n.userAgent,onSafetyWarning:n.onSafetyWarning})}default:{const r=i.authentication.type;throw new bt(`authentication.type "${r}" is not a known authentication type`)}}}function $E(i){if(i.identity_token){const n=i.identity_token.source;if(n!=="file")throw new bt(`identity_token.source "${n}" is not supported by this SDK version (only "file")`);if(!i.identity_token.path)throw new bt('identity_token.source "file" requires a non-empty path');return _0(i.identity_token.path)}const e=ct("ANTHROPIC_IDENTITY_TOKEN_FILE");if(e)return _0(e);const t=ct("ANTHROPIC_IDENTITY_TOKEN");return t?BE(t):null}function qE(i,e,t,n){return async r=>{const s=await Fn(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url);await Qg(e,n);let a;try{const c=await s.promises.readFile(e,"utf-8");a=JSON.parse(c);const l=a==null?void 0:a.access_token;if(l&&!(r!=null&&r.forceRefresh)){const u=a==null?void 0:a.expires_at;if(u==null||Br()<u-Id)return{token:l,expiresAt:u??null}}}catch(c){(c==null?void 0:c.code)!=="ENOENT"&&!(c instanceof SyntaxError)&&(t==null||t(c))}const o=await i(r);try{await e_(e,{...a??{},version:t_,type:"oauth_token",access_token:o.token,expires_at:o.expiresAt})}catch(c){t==null||t(c)}return o}}var Nn,kn;class co{constructor(){Nn.set(this,void 0),kn.set(this,void 0),re(this,Nn,new Uint8Array),re(this,kn,null)}decode(e){if(e==null)return[];const t=e instanceof ArrayBuffer?new Uint8Array(e):typeof e=="string"?Dd(e):e;re(this,Nn,DE([P(this,Nn,"f"),t]));const n=[];let r;for(;(r=XE(P(this,Nn,"f"),P(this,kn,"f")))!=null;){if(r.carriage&&P(this,kn,"f")==null){re(this,kn,r.index);continue}if(P(this,kn,"f")!=null&&(r.index!==P(this,kn,"f")+1||r.carriage)){n.push(p0(P(this,Nn,"f").subarray(0,P(this,kn,"f")-1))),re(this,Nn,P(this,Nn,"f").subarray(P(this,kn,"f"))),re(this,kn,null);continue}const s=P(this,kn,"f")!==null?r.preceding-1:r.preceding,a=p0(P(this,Nn,"f").subarray(0,s));n.push(a),re(this,Nn,P(this,Nn,"f").subarray(r.index)),re(this,kn,null)}return n}flush(){return P(this,Nn,"f").length?this.decode(`
`):[]}}Nn=new WeakMap,kn=new WeakMap;co.NEWLINE_CHARS=new Set([`
`,"\r"]);co.NEWLINE_REGEXP=/\r\n|[\n\r]/g;function XE(i,e){for(let r=e??0;r<i.length;r++){if(i[r]===10)return{preceding:r,index:r+1,carriage:!1};if(i[r]===13)return{preceding:r,index:r+1,carriage:!0}}return null}function YE(i){for(let n=0;n<i.length-1;n++){if(i[n]===10&&i[n+1]===10||i[n]===13&&i[n+1]===13)return n+2;if(i[n]===13&&i[n+1]===10&&n+3<i.length&&i[n+2]===13&&i[n+3]===10)return n+4}return-1}var da;class oi{constructor(e,t,n){this.iterator=e,da.set(this,void 0),this.controller=t,re(this,da,n)}static rawEvents(e,t=new AbortController){return x0(e,t)}static fromSSEResponse(e,t,n){let r=!1;const s=n?St(n):console;async function*a(){var c;if(r)throw new Fe("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");r=!0;let o=!1;try{for await(const l of x0(e,t)){if(l.event==="completion")try{yield JSON.parse(l.data)}catch(u){throw s.error("Could not parse message into JSON:",l.data),s.error("From chunk:",l.raw),u}if(l.event==="message_start"||l.event==="message_delta"||l.event==="message_stop"||l.event==="content_block_start"||l.event==="content_block_delta"||l.event==="content_block_stop"||l.event==="message"||l.event==="user.message"||l.event==="user.interrupt"||l.event==="user.tool_confirmation"||l.event==="user.custom_tool_result"||l.event==="user.tool_result"||l.event==="agent.message"||l.event==="agent.thinking"||l.event==="agent.tool_use"||l.event==="agent.tool_result"||l.event==="agent.mcp_tool_use"||l.event==="agent.mcp_tool_result"||l.event==="agent.custom_tool_use"||l.event==="agent.thread_context_compacted"||l.event==="session.status_running"||l.event==="session.status_idle"||l.event==="session.status_rescheduled"||l.event==="session.status_terminated"||l.event==="session.error"||l.event==="session.deleted"||l.event==="session.updated"||l.event==="span.model_request_start"||l.event==="span.model_request_end"||l.event==="span.outcome_evaluation_start"||l.event==="span.outcome_evaluation_ongoing"||l.event==="span.outcome_evaluation_end"||l.event==="user.define_outcome"||l.event==="agent.thread_message_received"||l.event==="agent.thread_message_sent"||l.event==="agent.session_thread_message_received"||l.event==="agent.session_thread_message_sent"||l.event==="session.thread_created"||l.event==="session.thread_status_created"||l.event==="session.thread_status_running"||l.event==="session.thread_status_idle"||l.event==="session.thread_status_rescheduled"||l.event==="session.thread_status_terminated"||l.event==="event_start"||l.event==="event_delta"||l.event==="system.message")try{yield JSON.parse(l.data)}catch(u){throw s.error("Could not parse message into JSON:",l.data),s.error("From chunk:",l.raw),u}if(l.event!=="ping"&&l.event==="error"){const u=Vg(l.data)??l.data,d=(c=u==null?void 0:u.error)==null?void 0:c.type;throw new Zt(void 0,u,void 0,e.headers,d)}}o=!0}catch(l){if(Xs(l))return;throw l}finally{o||t.abort()}}return new oi(a,t,n)}static fromReadableStream(e,t,n){let r=!1;async function*s(){const o=new co,c=Ld(e);for await(const l of c)for(const u of o.decode(l))yield u;for(const l of o.flush())yield l}async function*a(){if(r)throw new Fe("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");r=!0;let o=!1;try{for await(const c of s())o||c&&(yield JSON.parse(c));o=!0}catch(c){if(Xs(c))return;throw c}finally{o||t.abort()}}return new oi(a,t,n)}[(da=new WeakMap,Symbol.asyncIterator)](){return this.iterator()}tee(){const e=[],t=[],n=this.iterator(),r=s=>({next:()=>{if(s.length===0){const a=n.next();e.push(a),t.push(a)}return s.shift()}});return[new oi(()=>r(e),this.controller,P(this,da,"f")),new oi(()=>r(t),this.controller,P(this,da,"f"))]}toReadableStream(){const e=this;let t;return Gg({async start(){t=e[Symbol.asyncIterator]()},async pull(n){try{const{value:r,done:s}=await t.next();if(s)return n.close();const a=Dd(JSON.stringify(r)+`
`);n.enqueue(a)}catch(r){n.error(r)}},async cancel(){var n;await((n=t.return)==null?void 0:n.call(t))}})}}async function*x0(i,e){if(!i.body)throw e.abort(),typeof globalThis.navigator<"u"&&globalThis.navigator.product==="ReactNative"?new Fe("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api"):new Fe("Attempted to iterate over a response with no body");const t=new jE,n=new co,r=Ld(i.body);for await(const s of KE(r))for(const a of n.decode(s)){const o=t.decode(a);o&&(yield o)}for(const s of n.flush()){const a=t.decode(s);a&&(yield a)}}async function*KE(i){let e=new Uint8Array;for await(const t of i){if(t==null)continue;const n=t instanceof ArrayBuffer?new Uint8Array(t):typeof t=="string"?Dd(t):t;let r=new Uint8Array(e.length+n.length);r.set(e),r.set(n,e.length),e=r;let s;for(;(s=YE(e))!==-1;)yield e.slice(0,s),e=e.slice(s)}e.length>0&&(yield e)}class jE{constructor(){this.event=null,this.data=[],this.chunks=[]}decode(e){if(e.endsWith("\r")&&(e=e.substring(0,e.length-1)),!e){if(!this.event&&!this.data.length)return null;const s={event:this.event,data:this.data.join(`
`),raw:this.chunks};return this.event=null,this.data=[],this.chunks=[],s}if(this.chunks.push(e),e.startsWith(":"))return null;let[t,n,r]=JE(e,":");return r.startsWith(" ")&&(r=r.substring(1)),t==="event"?this.event=r:t==="data"&&this.data.push(r),null}}function JE(i,e){const t=i.indexOf(e);return t!==-1?[i.substring(0,t),e,i.substring(t+e.length)]:[i,"",""]}async function s_(i,e){const{response:t,requestLogID:n,retryOfRequestLogID:r,startTime:s}=e,a=await(async()=>{var d;if(e.options.stream)return St(i).debug("response",t.status,t.url,t.headers,t.body),oi.fromSSEResponse(t,e.controller);if(t.status===204)return null;if(e.options.__binaryResponse)return t;const o=t.headers.get("content-type"),c=(d=o==null?void 0:o.split(";")[0])==null?void 0:d.trim();if((c==null?void 0:c.includes("application/json"))||(c==null?void 0:c.endsWith("+json"))){if(t.headers.get("content-length")==="0")return;const h=await t.json();return Nd(h,t)}return await t.text()})();return St(i).debug(`[${n}] response parsed`,Ki({retryOfRequestLogID:r,url:t.url,status:t.status,body:a,durationMs:Date.now()-s})),a}function Nd(i,e){return!i||typeof i!="object"||Array.isArray(i)?i:Object.defineProperty(i,"_request_id",{value:e.headers.get("request-id"),enumerable:!1})}const a_=new WeakSet;function o_(i){return typeof i=="object"&&i!==null&&a_.has(i)}function ZE(i){const e=new Set;for(;typeof i=="object"&&i!==null&&!e.has(i);){if(e.add(i),o_(i)||Xs(i)||i instanceof oo||i instanceof rE)return!0;i=i.cause}return!1}function y0(i,e,t,n){return async(r,s={})=>{var c;if(e.length===0)return i.call(void 0,r,s);const a=s.headers instanceof Headers?s.headers:new Headers(s.headers),o=await eT(i,e,t,n)({...s,headers:a,url:typeof r=="string"?r:r instanceof URL?r.href:r.url});if(o.bodyUsed||(c=o.body)!=null&&c.locked)throw new Fe("middleware consumed the response body; use response.clone() to inspect it, or return new Response(body, response) to consume and replace it");return o}}function QE(i,e){const t=new WeakMap;return{options:i,logger:e?St(e):NE(),parse(n){if(i!=null&&i.stream&&n.ok)return v0(n,i);let r=t.get(n);return r||(r=v0(n,i),t.set(n,r)),r}}}async function v0(i,e){var s,a;if(i.bodyUsed||(s=i.body)!=null&&s.locked)throw new Fe("cannot ctx.parse() a response whose body was already consumed; call ctx.parse() instead of reading the body, or read via response.clone()");if(e!=null&&e.stream&&i.ok)return oi.fromSSEResponse(i.clone(),new AbortController);if(i.status===204)return null;if(e!=null&&e.__binaryResponse)return i;const t=i.headers.get("content-type"),n=(a=t==null?void 0:t.split(";")[0])==null?void 0:a.trim();return(n==null?void 0:n.includes("application/json"))||(n==null?void 0:n.endsWith("+json"))?i.headers.get("content-length")==="0"?void 0:Nd(await i.clone().json(),i):await i.clone().text()}function eT(i,e,t,n){let r=async({url:a,...o})=>{try{return await i.call(void 0,a,o)}catch(c){const l=Kc(c);throw a_.add(l),l}};const s=QE(t,n);for(let a=e.length-1;a>=0;a--){const o=e[a],c=r;r=async l=>o(l,c,s)}return r}var Na;class _l extends Promise{constructor(e,t,n=s_){super(r=>{r(null)}),this.responsePromise=t,this.parseResponse=n,Na.set(this,void 0),re(this,Na,e)}_thenUnwrap(e){return new _l(P(this,Na,"f"),this.responsePromise,async(t,n)=>Nd(e(await this.parseResponse(t,n),n),n.response))}asResponse(){return this.responsePromise.then(e=>e.response)}async withResponse(){const[e,t]=await Promise.all([this.parse(),this.asResponse()]);return{data:e,response:t,request_id:t.headers.get("request-id")}}parse(){return this.parsedPromise||(this.parsedPromise=this.responsePromise.then(e=>this.parseResponse(P(this,Na,"f"),e))),this.parsedPromise}then(e,t){return this.parse().then(e,t)}catch(e){return this.parse().catch(e)}finally(e){return this.parse().finally(e)}}Na=new WeakMap;var Zo;class kd{constructor(e,t,n,r){Zo.set(this,void 0),re(this,Zo,e),this.options=r,this.response=t,this.body=n}hasNextPage(){return this.getPaginatedItems().length?this.nextPageRequestOptions()!=null:!1}async getNextPage(){const e=this.nextPageRequestOptions();if(!e)throw new Fe("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");return await P(this,Zo,"f").requestAPIList(this.constructor,e)}async*iterPages(){let e=this;for(yield e;e.hasNextPage();)e=await e.getNextPage(),yield e}async*[(Zo=new WeakMap,Symbol.asyncIterator)](){for await(const e of this.iterPages())for(const t of e.getPaginatedItems())yield t}}class tT extends _l{constructor(e,t,n){super(e,t,async(r,s)=>new n(r,s.response,await s_(r,s),s.options))}async*[Symbol.asyncIterator](){const e=await this;for await(const t of e)yield t}}class lo extends kd{constructor(e,t,n,r){super(e,t,n,r),this.data=n.data||[],this.has_more=n.has_more||!1,this.first_id=n.first_id||null,this.last_id=n.last_id||null}getPaginatedItems(){return this.data??[]}hasNextPage(){return this.has_more===!1?!1:super.hasNextPage()}nextPageRequestOptions(){var t;if((t=this.options.query)!=null&&t.before_id){const n=this.first_id;return n?{...this.options,query:{...jc(this.options.query),before_id:n}}:null}const e=this.last_id;return e?{...this.options,query:{...jc(this.options.query),after_id:e}}:null}}class Qt extends kd{constructor(e,t,n,r){super(e,t,n,r),this.data=n.data||[],this.next_page=n.next_page||null}getPaginatedItems(){return this.data??[]}nextPageRequestOptions(){const e=this.next_page;return e?{...this.options,query:{...jc(this.options.query),page:e}}:null}}class nT extends kd{constructor(e,t,n,r){super(e,t,n,r),this.data=n.data||[],this.next_page=n.next_page||null,this.prev_page=n.prev_page||null}getPaginatedItems(){return this.data??[]}nextPageRequestOptions(){const e=this.next_page;return e?{...this.options,query:{...jc(this.options.query),page:e}}:null}}const c_=()=>{var i;if(typeof File>"u"){const{process:e}=globalThis,t=typeof((i=e==null?void 0:e.versions)==null?void 0:i.node)=="string"&&parseInt(e.versions.node.split("."))<20;throw new Error("`File` is not defined as a global, which is required for file uploads."+(t?" Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`.":""))}};function ks(i,e,t){return c_(),new File(i,e??"unknown_file",t)}function Rc(i,e){const t=typeof i=="object"&&i!==null&&("name"in i&&i.name&&String(i.name)||"url"in i&&i.url&&String(i.url)||"filename"in i&&i.filename&&String(i.filename)||"path"in i&&i.path&&String(i.path))||"";return e?t.split(/[\\/]/).pop()||void 0:t}const l_=i=>i!=null&&typeof i=="object"&&typeof i[Symbol.asyncIterator]=="function",zd=async(i,e,t=!0)=>({...i,body:await rT(i.body,e,t)}),w0=new WeakMap;function iT(i){const e=typeof i=="function"?i:i.fetch,t=w0.get(e);if(t)return t;const n=(async()=>{try{const r="Response"in e?e.Response:(await e("data:,")).constructor,s=new FormData;return s.toString()!==await new r(s).text()}catch{return!0}})();return w0.set(e,n),n}const rT=async(i,e,t=!0)=>{if(!await iT(e))throw new TypeError("The provided fetch function does not support file uploads with the current global FormData class.");const n=new FormData;return await Promise.all(Object.entries(i||{}).map(([r,s])=>Yh(n,r,s,t))),n},sT=i=>i instanceof Blob&&"name"in i,Yh=async(i,e,t,n)=>{if(t!==void 0){if(t==null)throw new TypeError(`Received null for "${e}"; to pass null in FormData, you must use the string 'null'`);if(typeof t=="string"||typeof t=="number"||typeof t=="boolean")i.append(e,String(t));else if(t instanceof Response){let r={};const s=t.headers.get("Content-Type");s&&(r={type:s}),i.append(e,ks([await t.blob()],Rc(t,n),r))}else if(l_(t))i.append(e,ks([await new Response(Wg(t)).blob()],Rc(t,n)));else if(sT(t))i.append(e,ks([t],Rc(t,n),{type:t.type}));else if(Array.isArray(t))await Promise.all(t.map(r=>Yh(i,e+"[]",r,n)));else if(typeof t=="object")await Promise.all(Object.entries(t).map(([r,s])=>Yh(i,`${e}[${r}]`,s,n)));else throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${t} instead`)}},u_=i=>i!=null&&typeof i=="object"&&typeof i.size=="number"&&typeof i.type=="string"&&typeof i.text=="function"&&typeof i.slice=="function"&&typeof i.arrayBuffer=="function",aT=i=>i!=null&&typeof i=="object"&&typeof i.name=="string"&&typeof i.lastModified=="number"&&u_(i),oT=i=>i!=null&&typeof i=="object"&&typeof i.url=="string"&&typeof i.blob=="function";async function cT(i,e,t){if(c_(),i=await i,e||(e=Rc(i,!0)),aT(i))return i instanceof File&&e==null&&t==null?i:ks([await i.arrayBuffer()],e??i.name,{type:i.type,lastModified:i.lastModified,...t});if(oT(i)){const r=await i.blob();return e||(e=new URL(i.url).pathname.split(/[\\/]/).pop()),ks(await Kh(r),e,t)}const n=await Kh(i);if(!(t!=null&&t.type)){const r=n.find(s=>typeof s=="object"&&"type"in s&&s.type);typeof r=="string"&&(t={...t,type:r})}return ks(n,e,t)}async function Kh(i){var t;let e=[];if(typeof i=="string"||ArrayBuffer.isView(i)||i instanceof ArrayBuffer)e.push(i);else if(u_(i))e.push(i instanceof Blob?i:await i.arrayBuffer());else if(l_(i))for await(const n of i)e.push(...await Kh(n));else{const n=(t=i==null?void 0:i.constructor)==null?void 0:t.name;throw new Error(`Unexpected data type: ${typeof i}${n?`; constructor: ${n}`:""}${lT(i)}`)}return e}function lT(i){return typeof i!="object"||i===null?"":`; props: [${Object.getOwnPropertyNames(i).map(t=>`"${t}"`).join(", ")}]`}class gt{constructor(e){this._client=e}}const h_=Symbol.for("brand.privateNullableHeaders");function*uT(i){if(!i)return;if(h_ in i){const{values:n,nulls:r}=i;yield*n.entries();for(const s of r)yield[s,null];return}let e=!1,t;i instanceof Headers?t=i.entries():n0(i)?t=i:(e=!0,t=Object.entries(i??{}));for(let n of t){const r=n[0];if(typeof r!="string")throw new TypeError("expected header name to be a string");const s=n0(n[1])?n[1]:[n[1]];let a=!1;for(const o of s)o!==void 0&&(e&&!a&&(a=!0,yield[r,Pc]),yield[r,o])}}const Pc=Symbol("clear"),hT=new Set(["x-stainless-helper"]),dT=(i,e)=>{const t=i?i.split(",").map(n=>n.trim()).filter(Boolean):[];for(const n of e.split(",").map(r=>r.trim()))n&&!t.includes(n)&&t.push(n);return t.join(", ")},K=i=>{const e=new Headers,t=new Set;for(const n of i){const r=new Set;for(const[s,a]of uT(n)){const o=s.toLowerCase();if(hT.has(o)){if(a===Pc)continue;a===null?(e.delete(s),t.add(o)):(e.set(s,dT(e.get(s),a)),t.delete(o));continue}(a===Pc||!r.has(o))&&(e.delete(s),r.add(o),a===Pc)||(a===null?(e.delete(s),t.add(o)):(e.append(s,a),t.delete(o)))}}return{[h_]:!0,values:e,nulls:t}};function d_(i){return i.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g,encodeURIComponent)}const M0=Object.freeze(Object.create(null)),fT=(i=d_)=>function(t,...n){if(t.length===1)return t[0];let r=!1;const s=[],a=t.reduce((u,d,f)=>{var _;/[?#]/.test(d)&&(r=!0);const h=n[f];let g=(r?encodeURIComponent:i)(""+h);return f!==n.length&&(h==null||typeof h=="object"&&h.toString===((_=Object.getPrototypeOf(Object.getPrototypeOf(h.hasOwnProperty??M0)??M0))==null?void 0:_.toString))&&(g=h+"",s.push({start:u.length+d.length,length:g.length,error:`Value of type ${Object.prototype.toString.call(h).slice(8,-1)} is not a valid path parameter`})),u+d+(f===n.length?"":g)},""),o=a.split(/[?#]/,1)[0],c=new RegExp("(?<=^|\\/)(?:\\.|%2e){1,2}(?=\\/|$)","gi");let l;for(;(l=c.exec(o))!==null;)s.push({start:l.index,length:l[0].length,error:`Value "${l[0]}" can't be safely passed as a path parameter`});if(s.sort((u,d)=>u.start-d.start),s.length>0){let u=0;const d=s.reduce((f,h)=>{const g=" ".repeat(h.start-u),_="^".repeat(h.length);return u=h.start+h.length,f+g+_},"");throw new Fe(`Path parameters result in path with invalid segments:
${s.map(f=>f.error).join(`
`)}
${a}
${d}`)}return a},fe=fT(d_);class f_ extends gt{retrieve(e,t={},n){const{betas:r}=t??{};return this._client.get(fe`/v1/deployment_runs/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}list(e={},t){const{betas:n,...r}=e??{};return this._client.getAPIList("/v1/deployment_runs?beta=true",Qt,{query:r,...t,headers:K([{"anthropic-beta":[...n??[],"managed-agents-2026-04-01"].toString()},t==null?void 0:t.headers])})}}class p_ extends gt{create(e,t){const{betas:n,...r}=e;return this._client.post("/v1/deployments?beta=true",{body:r,...t,headers:K([{"anthropic-beta":[...n??[],"managed-agents-2026-04-01"].toString()},t==null?void 0:t.headers])})}retrieve(e,t={},n){const{betas:r}=t??{};return this._client.get(fe`/v1/deployments/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}update(e,t,n){const{betas:r,...s}=t;return this._client.post(fe`/v1/deployments/${e}?beta=true`,{body:s,...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}list(e={},t){const{betas:n,...r}=e??{};return this._client.getAPIList("/v1/deployments?beta=true",Qt,{query:r,...t,headers:K([{"anthropic-beta":[...n??[],"managed-agents-2026-04-01"].toString()},t==null?void 0:t.headers])})}archive(e,t={},n){const{betas:r}=t??{};return this._client.post(fe`/v1/deployments/${e}/archive?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}pause(e,t={},n){const{betas:r}=t??{};return this._client.post(fe`/v1/deployments/${e}/pause?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}run(e,t={},n){const{betas:r}=t??{};return this._client.post(fe`/v1/deployments/${e}/run?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}unpause(e,t={},n){const{betas:r}=t??{};return this._client.post(fe`/v1/deployments/${e}/unpause?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}}const uo="x-stainless-helper",m_="x-stainless-helper-method";function jh(i){return{[uo]:i}}const Va=Symbol("anthropic.sdk.stainlessHelper");function Cc(i){return typeof i=="object"&&i!==null&&Va in i}function g_(i,e){const t=new Set;if(i)for(const n of i)Cc(n)&&t.add(n[Va]);if(e)for(const n of e){Cc(n)&&t.add(n[Va]);const r=n.content;if(Array.isArray(r))for(const s of r)Cc(s)&&t.add(s[Va])}return Array.from(t)}function __(i,e){const t=g_(i,e);return t.length===0?{}:{[uo]:t.join(", ")}}function pT(i){return Cc(i)?{[uo]:i[Va]}:{}}class x_ extends gt{list(e={},t){const{betas:n,...r}=e??{};return this._client.getAPIList("/v1/files?beta=true",lo,{query:r,...t,headers:K([{"anthropic-beta":[...n??[],"files-api-2025-04-14"].toString()},t==null?void 0:t.headers])})}delete(e,t={},n){const{betas:r}=t??{};return this._client.delete(fe`/v1/files/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"files-api-2025-04-14"].toString()},n==null?void 0:n.headers])})}download(e,t={},n){const{betas:r}=t??{};return this._client.get(fe`/v1/files/${e}/content?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"files-api-2025-04-14"].toString(),Accept:"application/binary"},n==null?void 0:n.headers]),__binaryResponse:!0})}retrieveMetadata(e,t={},n){const{betas:r}=t??{};return this._client.get(fe`/v1/files/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"files-api-2025-04-14"].toString()},n==null?void 0:n.headers])})}upload(e,t){const{betas:n,...r}=e;return this._client.post("/v1/files?beta=true",zd({body:r,...t,headers:K([{"anthropic-beta":[...n??[],"files-api-2025-04-14"].toString()},pT(r.file),t==null?void 0:t.headers])},this._client))}}let y_=class extends gt{retrieve(e,t={},n){const{betas:r}=t??{};return this._client.get(fe`/v1/models/${e}?beta=true`,{...n,headers:K([{...(r==null?void 0:r.toString())!=null?{"anthropic-beta":r==null?void 0:r.toString()}:void 0},n==null?void 0:n.headers])})}list(e={},t){const{betas:n,...r}=e??{};return this._client.getAPIList("/v1/models?beta=true",lo,{query:r,...t,headers:K([{...(n==null?void 0:n.toString())!=null?{"anthropic-beta":n==null?void 0:n.toString()}:void 0},t==null?void 0:t.headers])})}};class v_ extends gt{create(e,t){const{betas:n,...r}=e;return this._client.post("/v1/user_profiles?beta=true",{body:r,...t,headers:K([{"anthropic-beta":[...n??[],"user-profiles-2026-03-24"].toString()},t==null?void 0:t.headers])})}retrieve(e,t={},n){const{betas:r}=t??{};return this._client.get(fe`/v1/user_profiles/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"user-profiles-2026-03-24"].toString()},n==null?void 0:n.headers])})}update(e,t,n){const{betas:r,...s}=t;return this._client.post(fe`/v1/user_profiles/${e}?beta=true`,{body:s,...n,headers:K([{"anthropic-beta":[...r??[],"user-profiles-2026-03-24"].toString()},n==null?void 0:n.headers])})}list(e={},t){const{betas:n,...r}=e??{};return this._client.getAPIList("/v1/user_profiles?beta=true",Qt,{query:r,...t,headers:K([{"anthropic-beta":[...n??[],"user-profiles-2026-03-24"].toString()},t==null?void 0:t.headers])})}createEnrollmentURL(e,t={},n){const{betas:r}=t??{};return this._client.post(fe`/v1/user_profiles/${e}/enrollment_url?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"user-profiles-2026-03-24"].toString()},n==null?void 0:n.headers])})}}var vr={},fa={},S0;function mT(){if(S0)return fa;S0=1,Object.defineProperty(fa,"__esModule",{value:!0}),fa.timingSafeEqual=void 0;function i(t,n=""){if(!t)throw new Error(n)}function e(t,n){if(t.byteLength!==n.byteLength)return!1;t instanceof DataView||(t=new DataView(ArrayBuffer.isView(t)?t.buffer:t)),n instanceof DataView||(n=new DataView(ArrayBuffer.isView(n)?n.buffer:n)),i(t instanceof DataView),i(n instanceof DataView);const r=t.byteLength;let s=0,a=-1;for(;++a<r;)s|=t.getUint8(a)^n.getUint8(a);return s===0}return fa.timingSafeEqual=e,fa}var wn={},b0;function gT(){if(b0)return wn;b0=1;var i=wn&&wn.__extends||(function(){var u=function(d,f){return u=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(h,g){h.__proto__=g}||function(h,g){for(var _ in g)g.hasOwnProperty(_)&&(h[_]=g[_])},u(d,f)};return function(d,f){u(d,f);function h(){this.constructor=d}d.prototype=f===null?Object.create(f):(h.prototype=f.prototype,new h)}})();Object.defineProperty(wn,"__esModule",{value:!0});var e=256,t=(function(){function u(d){d===void 0&&(d="="),this._paddingCharacter=d}return u.prototype.encodedLength=function(d){return this._paddingCharacter?(d+2)/3*4|0:(d*8+5)/6|0},u.prototype.encode=function(d){for(var f="",h=0;h<d.length-2;h+=3){var g=d[h]<<16|d[h+1]<<8|d[h+2];f+=this._encodeByte(g>>>18&63),f+=this._encodeByte(g>>>12&63),f+=this._encodeByte(g>>>6&63),f+=this._encodeByte(g>>>0&63)}var _=d.length-h;if(_>0){var g=d[h]<<16|(_===2?d[h+1]<<8:0);f+=this._encodeByte(g>>>18&63),f+=this._encodeByte(g>>>12&63),_===2?f+=this._encodeByte(g>>>6&63):f+=this._paddingCharacter||"",f+=this._paddingCharacter||""}return f},u.prototype.maxDecodedLength=function(d){return this._paddingCharacter?d/4*3|0:(d*6+7)/8|0},u.prototype.decodedLength=function(d){return this.maxDecodedLength(d.length-this._getPaddingLength(d))},u.prototype.decode=function(d){if(d.length===0)return new Uint8Array(0);for(var f=this._getPaddingLength(d),h=d.length-f,g=new Uint8Array(this.maxDecodedLength(h)),_=0,p=0,m=0,v=0,x=0,w=0,M=0;p<h-4;p+=4)v=this._decodeChar(d.charCodeAt(p+0)),x=this._decodeChar(d.charCodeAt(p+1)),w=this._decodeChar(d.charCodeAt(p+2)),M=this._decodeChar(d.charCodeAt(p+3)),g[_++]=v<<2|x>>>4,g[_++]=x<<4|w>>>2,g[_++]=w<<6|M,m|=v&e,m|=x&e,m|=w&e,m|=M&e;if(p<h-1&&(v=this._decodeChar(d.charCodeAt(p)),x=this._decodeChar(d.charCodeAt(p+1)),g[_++]=v<<2|x>>>4,m|=v&e,m|=x&e),p<h-2&&(w=this._decodeChar(d.charCodeAt(p+2)),g[_++]=x<<4|w>>>2,m|=w&e),p<h-3&&(M=this._decodeChar(d.charCodeAt(p+3)),g[_++]=w<<6|M,m|=M&e),m!==0)throw new Error("Base64Coder: incorrect characters for decoding");return g},u.prototype._encodeByte=function(d){var f=d;return f+=65,f+=25-d>>>8&6,f+=51-d>>>8&-75,f+=61-d>>>8&-15,f+=62-d>>>8&3,String.fromCharCode(f)},u.prototype._decodeChar=function(d){var f=e;return f+=(42-d&d-44)>>>8&-e+d-43+62,f+=(46-d&d-48)>>>8&-e+d-47+63,f+=(47-d&d-58)>>>8&-e+d-48+52,f+=(64-d&d-91)>>>8&-e+d-65+0,f+=(96-d&d-123)>>>8&-e+d-97+26,f},u.prototype._getPaddingLength=function(d){var f=0;if(this._paddingCharacter){for(var h=d.length-1;h>=0&&d[h]===this._paddingCharacter;h--)f++;if(d.length<4||f>2)throw new Error("Base64Coder: incorrect padding")}return f},u})();wn.Coder=t;var n=new t;function r(u){return n.encode(u)}wn.encode=r;function s(u){return n.decode(u)}wn.decode=s;var a=(function(u){i(d,u);function d(){return u!==null&&u.apply(this,arguments)||this}return d.prototype._encodeByte=function(f){var h=f;return h+=65,h+=25-f>>>8&6,h+=51-f>>>8&-75,h+=61-f>>>8&-13,h+=62-f>>>8&49,String.fromCharCode(h)},d.prototype._decodeChar=function(f){var h=e;return h+=(44-f&f-46)>>>8&-e+f-45+62,h+=(94-f&f-96)>>>8&-e+f-95+63,h+=(47-f&f-58)>>>8&-e+f-48+52,h+=(64-f&f-91)>>>8&-e+f-65+0,h+=(96-f&f-123)>>>8&-e+f-97+26,h},d})(t);wn.URLSafeCoder=a;var o=new a;function c(u){return o.encode(u)}wn.encodeURLSafe=c;function l(u){return o.decode(u)}return wn.decodeURLSafe=l,wn.encodedLength=function(u){return n.encodedLength(u)},wn.maxDecodedLength=function(u){return n.maxDecodedLength(u)},wn.decodedLength=function(u){return n.decodedLength(u)},wn}var Lc={exports:{}},_T=Lc.exports,E0;function xT(){return E0||(E0=1,(function(i){(function(e,t){var n={};t(n);var r=n.default;for(var s in n)r[s]=n[s];i.exports=r})(_T,function(e){e.__esModule=!0,e.digestLength=32,e.blockSize=64;var t=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);function n(f,h,g,_,p){for(var m,v,x,w,M,E,T,A,I,y,S,N,k;p>=64;){for(m=h[0],v=h[1],x=h[2],w=h[3],M=h[4],E=h[5],T=h[6],A=h[7],y=0;y<16;y++)S=_+y*4,f[y]=(g[S]&255)<<24|(g[S+1]&255)<<16|(g[S+2]&255)<<8|g[S+3]&255;for(y=16;y<64;y++)I=f[y-2],N=(I>>>17|I<<15)^(I>>>19|I<<13)^I>>>10,I=f[y-15],k=(I>>>7|I<<25)^(I>>>18|I<<14)^I>>>3,f[y]=(N+f[y-7]|0)+(k+f[y-16]|0);for(y=0;y<64;y++)N=(((M>>>6|M<<26)^(M>>>11|M<<21)^(M>>>25|M<<7))+(M&E^~M&T)|0)+(A+(t[y]+f[y]|0)|0)|0,k=((m>>>2|m<<30)^(m>>>13|m<<19)^(m>>>22|m<<10))+(m&v^m&x^v&x)|0,A=T,T=E,E=M,M=w+N|0,w=x,x=v,v=m,m=N+k|0;h[0]+=m,h[1]+=v,h[2]+=x,h[3]+=w,h[4]+=M,h[5]+=E,h[6]+=T,h[7]+=A,_+=64,p-=64}return _}var r=(function(){function f(){this.digestLength=e.digestLength,this.blockSize=e.blockSize,this.state=new Int32Array(8),this.temp=new Int32Array(64),this.buffer=new Uint8Array(128),this.bufferLength=0,this.bytesHashed=0,this.finished=!1,this.reset()}return f.prototype.reset=function(){return this.state[0]=1779033703,this.state[1]=3144134277,this.state[2]=1013904242,this.state[3]=2773480762,this.state[4]=1359893119,this.state[5]=2600822924,this.state[6]=528734635,this.state[7]=1541459225,this.bufferLength=0,this.bytesHashed=0,this.finished=!1,this},f.prototype.clean=function(){for(var h=0;h<this.buffer.length;h++)this.buffer[h]=0;for(var h=0;h<this.temp.length;h++)this.temp[h]=0;this.reset()},f.prototype.update=function(h,g){if(g===void 0&&(g=h.length),this.finished)throw new Error("SHA256: can't update because hash was finished.");var _=0;if(this.bytesHashed+=g,this.bufferLength>0){for(;this.bufferLength<64&&g>0;)this.buffer[this.bufferLength++]=h[_++],g--;this.bufferLength===64&&(n(this.temp,this.state,this.buffer,0,64),this.bufferLength=0)}for(g>=64&&(_=n(this.temp,this.state,h,_,g),g%=64);g>0;)this.buffer[this.bufferLength++]=h[_++],g--;return this},f.prototype.finish=function(h){if(!this.finished){var g=this.bytesHashed,_=this.bufferLength,p=g/536870912|0,m=g<<3,v=g%64<56?64:128;this.buffer[_]=128;for(var x=_+1;x<v-8;x++)this.buffer[x]=0;this.buffer[v-8]=p>>>24&255,this.buffer[v-7]=p>>>16&255,this.buffer[v-6]=p>>>8&255,this.buffer[v-5]=p>>>0&255,this.buffer[v-4]=m>>>24&255,this.buffer[v-3]=m>>>16&255,this.buffer[v-2]=m>>>8&255,this.buffer[v-1]=m>>>0&255,n(this.temp,this.state,this.buffer,0,v),this.finished=!0}for(var x=0;x<8;x++)h[x*4+0]=this.state[x]>>>24&255,h[x*4+1]=this.state[x]>>>16&255,h[x*4+2]=this.state[x]>>>8&255,h[x*4+3]=this.state[x]>>>0&255;return this},f.prototype.digest=function(){var h=new Uint8Array(this.digestLength);return this.finish(h),h},f.prototype._saveState=function(h){for(var g=0;g<this.state.length;g++)h[g]=this.state[g]},f.prototype._restoreState=function(h,g){for(var _=0;_<this.state.length;_++)this.state[_]=h[_];this.bytesHashed=g,this.finished=!1,this.bufferLength=0},f})();e.Hash=r;var s=(function(){function f(h){this.inner=new r,this.outer=new r,this.blockSize=this.inner.blockSize,this.digestLength=this.inner.digestLength;var g=new Uint8Array(this.blockSize);if(h.length>this.blockSize)new r().update(h).finish(g).clean();else for(var _=0;_<h.length;_++)g[_]=h[_];for(var _=0;_<g.length;_++)g[_]^=54;this.inner.update(g);for(var _=0;_<g.length;_++)g[_]^=106;this.outer.update(g),this.istate=new Uint32Array(8),this.ostate=new Uint32Array(8),this.inner._saveState(this.istate),this.outer._saveState(this.ostate);for(var _=0;_<g.length;_++)g[_]=0}return f.prototype.reset=function(){return this.inner._restoreState(this.istate,this.inner.blockSize),this.outer._restoreState(this.ostate,this.outer.blockSize),this},f.prototype.clean=function(){for(var h=0;h<this.istate.length;h++)this.ostate[h]=this.istate[h]=0;this.inner.clean(),this.outer.clean()},f.prototype.update=function(h){return this.inner.update(h),this},f.prototype.finish=function(h){return this.outer.finished?this.outer.finish(h):(this.inner.finish(h),this.outer.update(h,this.digestLength).finish(h)),this},f.prototype.digest=function(){var h=new Uint8Array(this.digestLength);return this.finish(h),h},f})();e.HMAC=s;function a(f){var h=new r().update(f),g=h.digest();return h.clean(),g}e.hash=a,e.default=a;function o(f,h){var g=new s(f).update(h),_=g.digest();return g.clean(),_}e.hmac=o;function c(f,h,g,_){var p=_[0];if(p===0)throw new Error("hkdf: cannot expand more");h.reset(),p>1&&h.update(f),g&&h.update(g),h.update(_),h.finish(f),_[0]++}var l=new Uint8Array(e.digestLength);function u(f,h,g,_){h===void 0&&(h=l),_===void 0&&(_=32);for(var p=new Uint8Array([1]),m=o(h,f),v=new s(m),x=new Uint8Array(v.digestLength),w=x.length,M=new Uint8Array(_),E=0;E<_;E++)w===x.length&&(c(x,v,g,p),w=0),M[E]=x[w++];return v.clean(),x.fill(0),p.fill(0),M}e.hkdf=u;function d(f,h,g,_){for(var p=new s(f),m=p.digestLength,v=new Uint8Array(4),x=new Uint8Array(m),w=new Uint8Array(m),M=new Uint8Array(_),E=0;E*m<_;E++){var T=E+1;v[0]=T>>>24&255,v[1]=T>>>16&255,v[2]=T>>>8&255,v[3]=T>>>0&255,p.reset(),p.update(h),p.update(v),p.finish(w);for(var A=0;A<m;A++)x[A]=w[A];for(var A=2;A<=g;A++){p.reset(),p.update(w).finish(w);for(var I=0;I<m;I++)x[I]^=w[I]}for(var A=0;A<m&&E*m+A<_;A++)M[E*m+A]=x[A]}for(var E=0;E<m;E++)x[E]=w[E]=0;for(var E=0;E<4;E++)v[E]=0;return p.clean(),M}e.pbkdf2=d})})(Lc)),Lc.exports}var T0;function yT(){if(T0)return vr;T0=1,Object.defineProperty(vr,"__esModule",{value:!0}),vr.Webhook=vr.WebhookVerificationError=void 0;const i=mT(),e=gT(),t=xT(),n=300;class r extends Error{constructor(c){super(c),Object.setPrototypeOf(this,r.prototype),this.name="ExtendableError",this.stack=new Error(c).stack}}class s extends r{constructor(c){super(c),Object.setPrototypeOf(this,s.prototype),this.name="WebhookVerificationError"}}vr.WebhookVerificationError=s;class a{constructor(c,l){if(!c)throw new Error("Secret can't be empty.");if((l==null?void 0:l.format)==="raw")c instanceof Uint8Array?this.key=c:this.key=Uint8Array.from(c,u=>u.charCodeAt(0));else{if(typeof c!="string")throw new Error("Expected secret to be of type string");c.startsWith(a.prefix)&&(c=c.substring(a.prefix.length)),this.key=e.decode(c)}}verify(c,l){const u={};for(const x of Object.keys(l))u[x.toLowerCase()]=l[x];const d=u["webhook-id"],f=u["webhook-signature"],h=u["webhook-timestamp"];if(!f||!d||!h)throw new s("Missing required headers");const g=this.verifyTimestamp(h),p=this.sign(d,g,c).split(",")[1],m=f.split(" "),v=new globalThis.TextEncoder;for(const x of m){const[w,M]=x.split(",");if(w==="v1"&&(0,i.timingSafeEqual)(v.encode(M),v.encode(p)))return JSON.parse(c.toString())}throw new s("No matching signature found")}sign(c,l,u){if(typeof u!="string")if(u.constructor.name==="Buffer")u=u.toString();else throw new Error("Expected payload to be of type string or Buffer.");const d=new TextEncoder,f=Math.floor(l.getTime()/1e3),h=d.encode(`${c}.${f}.${u}`);return`v1,${e.encode(t.hmac(this.key,h))}`}verifyTimestamp(c){const l=Math.floor(Date.now()/1e3),u=parseInt(c,10);if(isNaN(u))throw new s("Invalid Signature Headers");if(l-u>n)throw new s("Message timestamp too old");if(u>l+n)throw new s("Message timestamp too new");return new Date(u*1e3)}}return vr.Webhook=a,a.prefix="whsec_",vr}var vT=yT();class w_ extends gt{unwrap(e,{headers:t,key:n}){if(t!==void 0){const r=n===void 0?this._client.webhookKey:n;if(r===null)throw new Error("Webhook key must not be null in order to unwrap");new vT.Webhook(r).verify(e,t)}return JSON.parse(e)}}let M_=class extends gt{list(e,t={},n){const{betas:r,...s}=t??{};return this._client.getAPIList(fe`/v1/agents/${e}/versions?beta=true`,Qt,{query:s,...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}};class Od extends gt{constructor(){super(...arguments),this.versions=new M_(this._client)}create(e,t){const{betas:n,...r}=e;return this._client.post("/v1/agents?beta=true",{body:r,...t,headers:K([{"anthropic-beta":[...n??[],"managed-agents-2026-04-01"].toString()},t==null?void 0:t.headers])})}retrieve(e,t={},n){const{betas:r,...s}=t??{};return this._client.get(fe`/v1/agents/${e}?beta=true`,{query:s,...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}update(e,t,n){const{betas:r,...s}=t;return this._client.post(fe`/v1/agents/${e}?beta=true`,{body:s,...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}list(e={},t){const{betas:n,...r}=e??{};return this._client.getAPIList("/v1/agents?beta=true",Qt,{query:r,...t,headers:K([{"anthropic-beta":[...n??[],"managed-agents-2026-04-01"].toString()},t==null?void 0:t.headers])})}archive(e,t={},n){const{betas:r}=t??{};return this._client.post(fe`/v1/agents/${e}/archive?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}}Od.Versions=M_;function xl(i,e){if(!i)return()=>{};if(i.aborted)return e.abort(),()=>{};const t=()=>e.abort();return i.addEventListener("abort",t),()=>i.removeEventListener("abort",t)}function Ga(i,e){return i instanceof Zt&&i.status===e}function wT(i){return i instanceof Zt&&typeof i.status=="number"&&i.status>=400&&i.status<500}function el(i){return wT(i)&&!Ga(i,408)&&!Ga(i,409)&&!Ga(i,429)}function MT(i,e,t){return Math.min(e*2**i,t)}function ST(i,e){return i+Math.random()*(e-i)}function bT(i){return i*(1-Math.random()*.25)}function S_(i,{authToken:e,helper:t}){var c;if(!e)throw new Fe(`copyClientForHelper: expected a non-empty authToken but received ${JSON.stringify(e)}`);const n=i,r=n._options.defaultHeaders,s=(c=n._authState)==null?void 0:c.extraHeaders,a=s?Object.fromEntries(Object.entries(s).filter(([l])=>{const u=l.toLowerCase();return u!=="authorization"&&u!=="x-api-key"})):void 0,o=K([a,r,{[uo]:t}]);return i.withOptions({apiKey:null,authToken:e,baseURL:i.baseURL,credentials:void 0,defaultHeaders:o})}var ms,Qo,Gn,ec,tc,nc,pa,ma,gs;const ET=999,TT=1e3,AT=6e4;class Fd{constructor(e){ms.set(this,void 0),Qo.set(this,!1),Gn.set(this,void 0),ec.set(this,void 0),tc.set(this,void 0),nc.set(this,void 0),pa.set(this,void 0),ma.set(this,void 0),gs.set(this,void 0),this.client=e.client,this.environmentId=e.environmentId,this.environmentKey=e.environmentKey,this.workerId=e.workerId??PT(),re(this,ms,S_(e.client,{authToken:e.environmentKey,helper:"environments-work-poller"})),re(this,tc,e.autoStop??!0),re(this,nc,e.drain??!1),re(this,pa,e.blockMs===void 0?ET:e.blockMs),re(this,ma,e.reclaimOlderThanMs??null),re(this,gs,e.requestOptions),re(this,Gn,new AbortController),re(this,ec,xl(e.signal,P(this,Gn,"f")))}get signal(){return P(this,Gn,"f").signal}abort(){P(this,Gn,"f").abort()}async*[(ms=new WeakMap,Qo=new WeakMap,Gn=new WeakMap,ec=new WeakMap,tc=new WeakMap,nc=new WeakMap,pa=new WeakMap,ma=new WeakMap,gs=new WeakMap,Symbol.asyncIterator)](){var t,n,r;if(P(this,Qo,"f"))throw new Fe("Cannot iterate over a consumed WorkPoller");re(this,Qo,!0);const e=St(this.client);e.info("poller starting",{component:"work-poller",environment_id:this.environmentId});try{let s=0;for(;!P(this,Gn,"f").signal.aborted;){let a;try{a=await P(this,ms,"f").beta.environments.work.poll(this.environmentId,{"Anthropic-Worker-ID":this.workerId,...P(this,pa,"f")!==null?{block_ms:P(this,pa,"f")}:{},...P(this,ma,"f")!==null?{reclaim_older_than_ms:P(this,ma,"f")}:{}},{headers:K([(t=P(this,gs,"f"))==null?void 0:t.headers]),signal:P(this,Gn,"f").signal})}catch(o){if(P(this,Gn,"f").signal.aborted)return;if(el(o))throw e.error("poll failed permanently, stopping poller",{error:String(o)}),o;const c=bT(RT(s));e.warn("poll failed, backing off",{error:String(o),backoff_ms:c}),s++,await Fr(c,P(this,Gn,"f").signal);continue}if(s=0,a==null){if(P(this,nc,"f"))return;await Fr(ST(1e3,3e3),P(this,Gn,"f").signal);continue}e.info("claimed work",{component:"work-poller",environment_id:this.environmentId,work_id:a.id,work_type:a.data.type});try{await P(this,ms,"f").beta.environments.work.ack(a.id,{environment_id:a.environment_id},{headers:K([(n=P(this,gs,"f"))==null?void 0:n.headers]),signal:P(this,Gn,"f").signal})}catch(o){e.error("ack failed",{work_id:a.id,error:String(o)});continue}try{yield a}finally{if(P(this,tc,"f"))try{await P(this,ms,"f").beta.environments.work.stop(a.id,{environment_id:a.environment_id},{headers:K([(r=P(this,gs,"f"))==null?void 0:r.headers])})}catch(o){Ga(o,409)||e.warn("stop failed",{work_id:a.id,error:String(o)})}}}}finally{P(this,ec,"f").call(this)}}}function RT(i){return MT(i,TT,AT)}function PT(){var t;const i=(t=globalThis.process)==null?void 0:t.env,e=i==null?void 0:i.HOSTNAME;return e?`${e}-${Yc()}`:Yc()}var Ms,ji,Ss;class CT{constructor(){Ms.set(this,[]),ji.set(this,[]),Ss.set(this,!1)}push(e){if(P(this,Ss,"f"))return!1;const t=P(this,ji,"f").shift();return t?t({done:!1,value:e}):P(this,Ms,"f").push(e),!0}close(){if(!P(this,Ss,"f"))for(re(this,Ss,!0);P(this,ji,"f").length>0;)P(this,ji,"f").shift()({done:!0,value:void 0})}next(e){return P(this,Ms,"f").length>0?Promise.resolve({done:!1,value:P(this,Ms,"f").shift()}):P(this,Ss,"f")||e!=null&&e.aborted?Promise.resolve({done:!0,value:void 0}):new Promise(t=>{const n=s=>{e==null||e.removeEventListener("abort",r),t(s)},r=()=>{const s=P(this,ji,"f").indexOf(n);s>=0&&P(this,ji,"f").splice(s,1),t({done:!0,value:void 0})};P(this,ji,"f").push(n),e==null||e.addEventListener("abort",r,{once:!0})})}tryShift(){return P(this,Ms,"f").shift()}}Ms=new WeakMap,ji=new WeakMap,Ss=new WeakMap;class Bd extends Error{constructor(e){const t=typeof e=="string"?e:e.map(n=>n.type==="text"?n.text:`[${n.type}]`).join(" ");super(t),this.name="ToolError",this.content=e}}function A0(i){return"name"in i?i.name:i.mcp_server_name}function LT(i){return i instanceof Bd?i.content:`Error: ${i instanceof Error?i.message:String(i)}`}async function IT(i,e,t){try{const n=i.parse?i.parse(e):e;return{content:await i.run(n,t),isError:!1}}catch(n){return{content:LT(n),isError:!0}}}var $t,ic,tn,rc,Wa,Ic,ln,Rs,fi,Lr,Ai,$a,Ps,sc,b_,R0,P0,C0,Ru,ka,Pu,L0,E_;const I0=500,DT=1e4,UT=12e4,NT=3e4,D0=3,kT=6e4;function U0(i){var e;return i.type==="session.status_idle"&&((e=i.stop_reason)==null?void 0:e.type)==="end_turn"}class Hd{constructor(e,t){$t.add(this),ic.set(this,!1),tn.set(this,void 0),rc.set(this,void 0),Wa.set(this,void 0),Ic.set(this,void 0),ln.set(this,void 0),Rs.set(this,new Set),fi.set(this,new Set),Lr.set(this,new CT),Ai.set(this,0),$a.set(this,null),Ps.set(this,void 0),this.client=t.client,this.sessionId=e,this.tools=t.tools,this.maxIdleMs=t.maxIdleMs??kT,re(this,ln,St(t.client)),re(this,Ic,new Map(t.tools.map(n=>[A0(n),n]))),re(this,tn,new AbortController),re(this,rc,xl(t.signal,P(this,tn,"f"))),re(this,Wa,t.requestOptions)}get signal(){return P(this,tn,"f").signal}abort(){P(this,tn,"f").abort()}async*[(ic=new WeakMap,tn=new WeakMap,rc=new WeakMap,Wa=new WeakMap,Ic=new WeakMap,ln=new WeakMap,Rs=new WeakMap,fi=new WeakMap,Lr=new WeakMap,Ai=new WeakMap,$a=new WeakMap,Ps=new WeakMap,$t=new WeakSet,Symbol.asyncIterator)](){var t;if(P(this,ic,"f"))throw new Fe("Cannot iterate over a consumed SessionToolRunner");re(this,ic,!0),P(this,ln,"f").info("session tool runner starting",{component:"session-tool-runner",session_id:this.sessionId});const e=P(this,$t,"m",b_).call(this).catch(n=>{P(this,tn,"f").signal.aborted||P(this,ln,"f").error("stream loop failed",{error:String(n)}),P(this,tn,"f").abort()});try{for(;;){const r=await P(this,Lr,"f").next(P(this,tn,"f").signal);if(r.done)break;yield r.value}await e;let n;for(;(n=P(this,Lr,"f").tryShift())!==void 0;)yield n}finally{P(this,tn,"f").abort(),P(this,$t,"m",ka).call(this),await e;try{await P(this,$t,"m",E_).call(this)}catch(n){P(this,ln,"f").warn("drain failed",{error:String(n)})}P(this,Lr,"f").close();for(const n of this.tools)try{await((t=n.close)==null?void 0:t.call(n))}catch(r){P(this,ln,"f").warn("tool.close failed",{tool:A0(n),error:String(r)})}P(this,rc,"f").call(this)}}}sc=function(){var e;return{...P(this,Wa,"f"),headers:K([jh("session-tool-runner"),(e=P(this,Wa,"f"))==null?void 0:e.headers]),signal:P(this,tn,"f").signal}},b_=async function(){const e=P(this,tn,"f");let t=I0;for(;!e.signal.aborted;){try{const n=await this.client.beta.sessions.events.stream(this.sessionId,{},P(this,$t,"m",sc).call(this));await P(this,$t,"m",R0).call(this);for await(const r of n)if(t=I0,await P(this,$t,"m",C0).call(this,r))return}catch(n){if(e.signal.throwIfAborted(),el(n))throw P(this,ln,"f").error("permanent stream failure, shutting down",{error:String(n)}),e.abort(),n;P(this,ln,"f").warn("stream disconnected, reconnecting",{error:String(n),backoff_ms:t})}e.signal.throwIfAborted(),await Fr(t,e.signal),t=Math.min(t*2,DT)}},R0=async function(){const e=P(this,tn,"f"),t=[];let n=!1;try{for await(const s of this.client.beta.sessions.events.list(this.sessionId,{limit:1e3},P(this,$t,"m",sc).call(this)))P(this,$t,"m",P0).call(this,s,t),n=U0(s)}catch(s){e.signal.throwIfAborted(),P(this,ln,"f").warn("reconcile list failed",{error:String(s)});for(const a of t)P(this,Rs,"f").delete(a.id);return}const r=t.filter(s=>!P(this,fi,"f").has(s.id));n&&r.length===0?P(this,$t,"m",Ru).call(this):P(this,$t,"m",ka).call(this);for(const s of r)await P(this,$t,"m",Pu).call(this,s)},P0=function(e,t){e.type==="agent.tool_use"||e.type==="agent.custom_tool_use"?(P(this,Rs,"f").add(e.id),P(this,fi,"f").has(e.id)||t.push(e)):e.type==="user.tool_result"?P(this,fi,"f").add(e.tool_use_id):e.type==="user.custom_tool_result"&&P(this,fi,"f").add(e.custom_tool_use_id)},C0=async function(e){switch(U0(e)?P(this,$t,"m",Ru).call(this):P(this,$t,"m",ka).call(this),e.type){case"agent.tool_use":case"agent.custom_tool_use":return P(this,Rs,"f").has(e.id)||(P(this,Rs,"f").add(e.id),await P(this,$t,"m",Pu).call(this,e)),!1;case"user.tool_result":return P(this,fi,"f").add(e.tool_use_id),!1;case"user.custom_tool_result":return P(this,fi,"f").add(e.custom_tool_use_id),!1;case"session.status_terminated":case"session.deleted":return P(this,ln,"f").info("session terminated",{component:"session-tool-runner",session_id:this.sessionId}),P(this,tn,"f").abort(),!0;default:return!1}},Ru=function(){P(this,$t,"m",ka).call(this),!(this.maxIdleMs<=0)&&re(this,Ps,setTimeout(()=>{P(this,ln,"f").info("session idle after end_turn; stopping",{component:"session-tool-runner",session_id:this.sessionId,max_idle_ms:this.maxIdleMs}),P(this,tn,"f").abort()},this.maxIdleMs))},ka=function(){P(this,Ps,"f")!==void 0&&(clearTimeout(P(this,Ps,"f")),re(this,Ps,void 0))},Pu=async function(e){var r;var t,n;if(!P(this,fi,"f").has(e.id)){P(this,ln,"f").info("executing tool",{component:"session-tool-runner",session_id:this.sessionId,tool:e.name,tool_use_id:e.id}),re(this,Ai,(t=P(this,Ai,"f"),t++,t));try{const s=P(this,Ic,"f").get(e.name);if(!s){P(this,ln,"f").info("tool not owned by this runner; leaving the tool_use_id pending for its owner",{component:"session-tool-runner",session_id:this.sessionId,tool:e.name,tool_use_id:e.id}),P(this,Lr,"f").push({event:e,toolUseId:e.id,name:e.name,isError:!1,posted:!1});return}let a,o;const c=new AbortController,l=xl(P(this,tn,"f").signal,c),u=setTimeout(()=>c.abort(),UT);try{const h=await IT(s,e.input,{toolUse:e,toolUseBlock:e,signal:c.signal});a=h.content,o=h.isError}finally{clearTimeout(u),l()}const d=zT(e,o,OT(a)),f=await P(this,$t,"m",L0).call(this,d,e.id);P(this,Lr,"f").push({event:e,result:d,toolUseId:e.id,name:e.name,isError:o,posted:f})}finally{re(this,Ai,(n=P(this,Ai,"f"),n--,n)),P(this,Ai,"f")===0&&((r=P(this,$a,"f"))==null||r.call(this))}}},L0=async function(e,t){const n=P(this,tn,"f");let r;for(let s=0;s<D0;s++){n.signal.throwIfAborted();try{return await this.client.beta.sessions.events.send(this.sessionId,{events:[e]},P(this,$t,"m",sc).call(this)),P(this,fi,"f").add(t),!0}catch(a){if(r=a,el(a))break;s<D0-1&&await Fr((s+1)*1e3,n.signal)}}return P(this,ln,"f").error("failed to send tool result",{tool_use_id:t,error:String(r)}),!1},E_=async function(){P(this,Ai,"f")!==0&&(await Promise.race([new Promise(e=>re(this,$a,e)),Fr(NT)]),re(this,$a,null),P(this,Ai,"f")>0&&P(this,ln,"f").warn("drain timeout exceeded"))};function zT(i,e,t){return i.type==="agent.custom_tool_use"?{type:"user.custom_tool_result",custom_tool_use_id:i.id,is_error:e,content:t}:{type:"user.tool_result",tool_use_id:i.id,is_error:e,content:t}}function OT(i){if(typeof i=="string")return[{type:"text",text:i||"(no output)"}];const e=i.map(t=>{var n;return t.type==="text"?{type:"text",text:t.text||"(no output)"}:t.type==="image"||t.type==="document"?t:t.type==="search_result"?{type:"search_result",source:t.source,title:t.title,content:t.content.map(r=>({type:"text",text:r.text})),citations:{enabled:((n=t.citations)==null?void 0:n.enabled)??!1}}:{type:"text",text:JSON.stringify(t)}});return e.length>0?e:[{type:"text",text:"(no output)"}]}var Dc,za,Jh;const N0=3e4,FT="NO_HEARTBEAT";class T_{constructor(e){Dc.add(this),za.set(this,void 0),this.client=e.client,this.environmentId=e.environmentId,this.environmentKey=e.environmentKey,this.tools=e.tools,this.workdir=e.workdir??process.cwd(),this.unrestrictedPaths=e.unrestrictedPaths,this.maxFileBytes=e.maxFileBytes,this.maxIdleMs=e.maxIdleMs,this.workerId=e.workerId,this.requestOptions=e.requestOptions,re(this,za,e.signal)}async run(e){const{environmentId:t,environmentKey:n}=this;if(t===void 0||n===void 0)throw new Fe("EnvironmentWorker.run: environmentId and environmentKey are required to poll for work");const r=e??P(this,za,"f"),s=new Fd({client:this.client,environmentId:t,environmentKey:n,...this.workerId!==void 0?{workerId:this.workerId}:{},...r?{signal:r}:{},...this.requestOptions!==void 0?{requestOptions:this.requestOptions}:{},autoStop:!1});for await(const a of s)await P(this,Dc,"m",Jh).call(this,a,n,s.signal)}async handleItem(e){const t=(e==null?void 0:e.workId)??ct("ANTHROPIC_WORK_ID"),n=(e==null?void 0:e.environmentId)??ct("ANTHROPIC_ENVIRONMENT_ID"),r=(e==null?void 0:e.sessionId)??ct("ANTHROPIC_SESSION_ID"),s=(e==null?void 0:e.environmentKey)??this.environmentKey??ct("ANTHROPIC_ENVIRONMENT_KEY");if(!t)throw new Fe("handleItem: workId is required — pass it or set ANTHROPIC_WORK_ID");if(!n)throw new Fe("handleItem: environmentId is required — pass it or set ANTHROPIC_ENVIRONMENT_ID");if(!r)throw new Fe("handleItem: sessionId is required — pass it or set ANTHROPIC_SESSION_ID");if(!s)throw new Fe("handleItem: environmentKey is required — pass it, construct the worker with it, or set ANTHROPIC_ENVIRONMENT_KEY");const a={id:t,environment_id:n,data:{type:"session",id:r}};await P(this,Dc,"m",Jh).call(this,a,s,(e==null?void 0:e.signal)??P(this,za,"f"))}}za=new WeakMap,Dc=new WeakSet,Jh=async function(e,t,n){const r=St(this.client),s=S_(this.client,{authToken:t,helper:"environments-worker"}),a=e.data.id,o={workdir:this.workdir,client:this.client,sessionId:a,...this.unrestrictedPaths!==void 0?{unrestrictedPaths:this.unrestrictedPaths}:{},...this.maxFileBytes!==void 0?{maxFileBytes:this.maxFileBytes}:{}},c=await Fn(()=>import("./node.browser-CIVnFDeH.js"),[],import.meta.url);let l=async()=>{};try{l=await c.setupSkills(o)}catch(g){r.warn("skill setup failed",{session_id:a,work_id:e.id,error:String(g)})}const u=typeof this.tools=="function"?this.tools(o):this.tools??c.betaAgentToolset20260401(o),d=new AbortController,f=xl(n,d),h=HT(s,e,d,r,this.requestOptions).catch(g=>{d.signal.aborted||r.error("heartbeat loop failed",{work_id:e.id,error:String(g)}),d.abort()});try{const g=new Hd(a,{client:s,tools:u,...this.maxIdleMs!==void 0?{maxIdleMs:this.maxIdleMs}:{},...this.requestOptions!==void 0?{requestOptions:this.requestOptions}:{},signal:d.signal});for await(const _ of g);}finally{d.abort(),f(),await h,await l().catch(g=>{r.warn("skill cleanup failed",{session_id:a,work_id:e.id,error:String(g)})}),await BT(s,e,r,this.requestOptions)}};async function BT(i,e,t,n){try{await i.beta.environments.work.stop(e.id,{environment_id:e.environment_id,force:!0},{...n,headers:K([n==null?void 0:n.headers])})}catch(r){Ga(r,409)||t.error("force-stop on exit failed",{work_id:e.id,error:String(r)})}}async function HT(i,e,t,n,r){let s=N0,a=FT;const o=async()=>{try{const c=await i.beta.environments.work.heartbeat(e.id,{environment_id:e.environment_id,expected_last_heartbeat:a},{...r,headers:K([r==null?void 0:r.headers]),signal:t.signal});a=c.last_heartbeat,c.ttl_seconds>0&&(s=Math.max(1e3,Math.min(c.ttl_seconds*1e3/2,N0))),(c.state==="stopping"||c.state==="stopped")&&(n.info("heartbeat signals shutdown",{work_id:e.id,state:c.state}),t.abort()),c.lease_extended||(n.warn("lease not extended, shutting down",{work_id:e.id}),t.abort())}catch(c){if(t.signal.throwIfAborted(),el(c))throw n.error("permanent heartbeat failure",{work_id:e.id,error:String(c)}),t.abort(),c;n.warn("transient heartbeat failure",{work_id:e.id,error:String(c)})}};for(await o();!t.signal.aborted;)await Fr(s,t.signal),t.signal.throwIfAborted(),await o()}class yl extends gt{retrieve(e,t,n){const{environment_id:r,betas:s}=t;return this._client.get(fe`/v1/environments/${r}/work/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...s??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}update(e,t,n){const{environment_id:r,betas:s,...a}=t;return this._client.post(fe`/v1/environments/${r}/work/${e}?beta=true`,{body:a,...n,headers:K([{"anthropic-beta":[...s??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}list(e,t={},n){const{betas:r,...s}=t??{};return this._client.getAPIList(fe`/v1/environments/${e}/work?beta=true`,Qt,{query:s,...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}ack(e,t,n){const{environment_id:r,betas:s}=t;return this._client.post(fe`/v1/environments/${r}/work/${e}/ack?beta=true`,{...n,headers:K([{"anthropic-beta":[...s??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}heartbeat(e,t,n){const{environment_id:r,desired_ttl_seconds:s,expected_last_heartbeat:a,betas:o}=t;return this._client.post(fe`/v1/environments/${r}/work/${e}/heartbeat?beta=true`,{query:{desired_ttl_seconds:s,expected_last_heartbeat:a},...n,headers:K([{"anthropic-beta":[...o??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}poll(e,t={},n){const{betas:r,"Anthropic-Worker-ID":s,...a}=t??{};return this._client.get(fe`/v1/environments/${e}/work/poll?beta=true`,{query:a,...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString(),...s!=null?{"Anthropic-Worker-ID":s}:void 0},n==null?void 0:n.headers])})}stats(e,t={},n){const{betas:r}=t??{};return this._client.get(fe`/v1/environments/${e}/work/stats?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}stop(e,t,n){const{environment_id:r,betas:s,...a}=t;return this._client.post(fe`/v1/environments/${r}/work/${e}/stop?beta=true`,{body:a,...n,headers:K([{"anthropic-beta":[...s??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}poller(e){return new Fd({...e,client:this._client})}worker(e){return new T_({...e,client:this._client})}}yl.WorkPoller=Fd;yl.EnvironmentWorker=T_;class Vd extends gt{constructor(){super(...arguments),this.work=new yl(this._client)}create(e,t){const{betas:n,...r}=e;return this._client.post("/v1/environments?beta=true",{body:r,...t,headers:K([{"anthropic-beta":[...n??[],"managed-agents-2026-04-01"].toString()},t==null?void 0:t.headers])})}retrieve(e,t={},n){const{betas:r}=t??{};return this._client.get(fe`/v1/environments/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}update(e,t,n){const{betas:r,...s}=t;return this._client.post(fe`/v1/environments/${e}?beta=true`,{body:s,...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}list(e={},t){const{betas:n,...r}=e??{};return this._client.getAPIList("/v1/environments?beta=true",Qt,{query:r,...t,headers:K([{"anthropic-beta":[...n??[],"managed-agents-2026-04-01"].toString()},t==null?void 0:t.headers])})}delete(e,t={},n){const{betas:r}=t??{};return this._client.delete(fe`/v1/environments/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}archive(e,t={},n){const{betas:r}=t??{};return this._client.post(fe`/v1/environments/${e}/archive?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}}Vd.Work=yl;class A_ extends gt{create(e,t,n){const{view:r,betas:s,...a}=t;return this._client.post(fe`/v1/memory_stores/${e}/memories?beta=true`,{query:{view:r},body:a,...n,headers:K([{"anthropic-beta":[...s??[],"agent-memory-2026-07-22"].toString()},n==null?void 0:n.headers])})}retrieve(e,t,n){const{memory_store_id:r,betas:s,...a}=t;return this._client.get(fe`/v1/memory_stores/${r}/memories/${e}?beta=true`,{query:a,...n,headers:K([{"anthropic-beta":[...s??[],"agent-memory-2026-07-22"].toString()},n==null?void 0:n.headers])})}update(e,t,n){const{memory_store_id:r,view:s,betas:a,...o}=t;return this._client.post(fe`/v1/memory_stores/${r}/memories/${e}?beta=true`,{query:{view:s},body:o,...n,headers:K([{"anthropic-beta":[...a??[],"agent-memory-2026-07-22"].toString()},n==null?void 0:n.headers])})}list(e,t={},n){const{betas:r,...s}=t??{};return this._client.getAPIList(fe`/v1/memory_stores/${e}/memories?beta=true`,Qt,{query:s,...n,headers:K([{"anthropic-beta":[...r??[],"agent-memory-2026-07-22"].toString()},n==null?void 0:n.headers])})}delete(e,t,n){const{memory_store_id:r,expected_content_sha256:s,betas:a}=t;return this._client.delete(fe`/v1/memory_stores/${r}/memories/${e}?beta=true`,{query:{expected_content_sha256:s},...n,headers:K([{"anthropic-beta":[...a??[],"agent-memory-2026-07-22"].toString()},n==null?void 0:n.headers])})}}class R_ extends gt{retrieve(e,t,n){const{memory_store_id:r,betas:s,...a}=t;return this._client.get(fe`/v1/memory_stores/${r}/memory_versions/${e}?beta=true`,{query:a,...n,headers:K([{"anthropic-beta":[...s??[],"agent-memory-2026-07-22"].toString()},n==null?void 0:n.headers])})}list(e,t={},n){const{betas:r,...s}=t??{};return this._client.getAPIList(fe`/v1/memory_stores/${e}/memory_versions?beta=true`,Qt,{query:s,...n,headers:K([{"anthropic-beta":[...r??[],"agent-memory-2026-07-22"].toString()},n==null?void 0:n.headers])})}redact(e,t,n){const{memory_store_id:r,betas:s}=t;return this._client.post(fe`/v1/memory_stores/${r}/memory_versions/${e}/redact?beta=true`,{...n,headers:K([{"anthropic-beta":[...s??[],"agent-memory-2026-07-22"].toString()},n==null?void 0:n.headers])})}}class vl extends gt{constructor(){super(...arguments),this.memories=new A_(this._client),this.memoryVersions=new R_(this._client)}create(e,t){const{betas:n,...r}=e;return this._client.post("/v1/memory_stores?beta=true",{body:r,...t,headers:K([{"anthropic-beta":[...n??[],"agent-memory-2026-07-22"].toString()},t==null?void 0:t.headers])})}retrieve(e,t={},n){const{betas:r}=t??{};return this._client.get(fe`/v1/memory_stores/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"agent-memory-2026-07-22"].toString()},n==null?void 0:n.headers])})}update(e,t,n){const{betas:r,...s}=t;return this._client.post(fe`/v1/memory_stores/${e}?beta=true`,{body:s,...n,headers:K([{"anthropic-beta":[...r??[],"agent-memory-2026-07-22"].toString()},n==null?void 0:n.headers])})}list(e={},t){const{betas:n,...r}=e??{};return this._client.getAPIList("/v1/memory_stores?beta=true",Qt,{query:r,...t,headers:K([{"anthropic-beta":[...n??[],"agent-memory-2026-07-22"].toString()},t==null?void 0:t.headers])})}delete(e,t={},n){const{betas:r}=t??{};return this._client.delete(fe`/v1/memory_stores/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"agent-memory-2026-07-22"].toString()},n==null?void 0:n.headers])})}archive(e,t={},n){const{betas:r}=t??{};return this._client.post(fe`/v1/memory_stores/${e}/archive?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"agent-memory-2026-07-22"].toString()},n==null?void 0:n.headers])})}}vl.Memories=A_;vl.MemoryVersions=R_;class wl{constructor(e,t){this.iterator=e,this.controller=t}async*decoder(){const e=new co;for await(const t of this.iterator)for(const n of e.decode(t))yield JSON.parse(n);for(const t of e.flush())yield JSON.parse(t)}[Symbol.asyncIterator](){return this.decoder()}static fromResponse(e,t){if(!e.body)throw t.abort(),typeof globalThis.navigator<"u"&&globalThis.navigator.product==="ReactNative"?new Fe("The default react-native fetch implementation does not support streaming. Please use expo/fetch: https://docs.expo.dev/versions/latest/sdk/expo/#expofetch-api"):new Fe("Attempted to iterate over a response with no body");return new wl(Ld(e.body),t)}}let P_=class extends gt{create(e,t){const{betas:n,user_profile_id:r,...s}=e;return this._client.post("/v1/messages/batches?beta=true",{body:s,...t,headers:K([{"anthropic-beta":[...n??[],"message-batches-2024-09-24"].toString(),...r!=null?{"anthropic-user-profile-id":r}:void 0},t==null?void 0:t.headers])})}retrieve(e,t={},n){const{betas:r}=t??{};return this._client.get(fe`/v1/messages/batches/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"message-batches-2024-09-24"].toString()},n==null?void 0:n.headers])})}list(e={},t){const{betas:n,...r}=e??{};return this._client.getAPIList("/v1/messages/batches?beta=true",lo,{query:r,...t,headers:K([{"anthropic-beta":[...n??[],"message-batches-2024-09-24"].toString()},t==null?void 0:t.headers])})}delete(e,t={},n){const{betas:r}=t??{};return this._client.delete(fe`/v1/messages/batches/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"message-batches-2024-09-24"].toString()},n==null?void 0:n.headers])})}cancel(e,t={},n){const{betas:r}=t??{};return this._client.post(fe`/v1/messages/batches/${e}/cancel?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"message-batches-2024-09-24"].toString()},n==null?void 0:n.headers])})}async results(e,t={},n){const r=await this.retrieve(e);if(!r.results_url)throw new Fe(`No batch \`results_url\`; Has it finished processing? ${r.processing_status} - ${r.id}`);const{betas:s}=t??{};return this._client.get(r.results_url,{...n,headers:K([{"anthropic-beta":[...s??[],"message-batches-2024-09-24"].toString(),Accept:"application/binary"},n==null?void 0:n.headers]),stream:!0,__binaryResponse:!0})._thenUnwrap((a,o)=>wl.fromResponse(o.response,o.controller))}};const C_={"claude-opus-4-20250514":8192,"claude-opus-4-0":8192,"claude-4-opus-20250514":8192,"anthropic.claude-opus-4-20250514-v1:0":8192,"claude-opus-4@20250514":8192,"claude-opus-4-1-20250805":8192,"anthropic.claude-opus-4-1-20250805-v1:0":8192,"claude-opus-4-1@20250805":8192};function L_(i){var e;return(i==null?void 0:i.output_format)??((e=i==null?void 0:i.output_config)==null?void 0:e.format)}function k0(i,e,t){const n=L_(e);return!e||!("parse"in(n??{}))?{...i,content:i.content.map(r=>{if(r.type==="text"){const s=Object.defineProperty({...r},"parsed_output",{value:null,enumerable:!1});return Object.defineProperty(s,"parsed",{get(){return t.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead."),null},enumerable:!1})}return r}),parsed_output:null}:I_(i,e,t)}function I_(i,e,t){let n=null;const r=i.content.map(s=>{if(s.type==="text"){const a=VT(e,s.text);n===null&&(n=a);const o=Object.defineProperty({...s},"parsed_output",{value:a,enumerable:!1});return Object.defineProperty(o,"parsed",{get(){return t.logger.warn("The `parsed` property on `text` blocks is deprecated, please use `parsed_output` instead."),a},enumerable:!1})}return s});return{...i,content:r,parsed_output:n}}function VT(i,e){const t=L_(i);if((t==null?void 0:t.type)!=="json_schema")return null;try{return"parse"in t?t.parse(e):JSON.parse(e)}catch(n){throw new Fe(`Failed to parse structured output: ${n}`)}}const GT=i=>{let e=0,t=[];for(;e<i.length;){let n=i[e];if(n==="\\"){e++;continue}if(n==="{"){t.push({type:"brace",value:"{"}),e++;continue}if(n==="}"){t.push({type:"brace",value:"}"}),e++;continue}if(n==="["){t.push({type:"paren",value:"["}),e++;continue}if(n==="]"){t.push({type:"paren",value:"]"}),e++;continue}if(n===":"){t.push({type:"separator",value:":"}),e++;continue}if(n===","){t.push({type:"delimiter",value:","}),e++;continue}if(n==='"'){let o="",c=!1;for(n=i[++e];n!=='"';){if(e===i.length){c=!0;break}if(n==="\\"){if(e++,e===i.length){c=!0;break}o+=n+i[e],n=i[++e]}else o+=n,n=i[++e]}n=i[++e],c||t.push({type:"string",value:o});continue}if(n&&/\s/.test(n)){e++;continue}let s=/[0-9]/;if(n&&s.test(n)||n==="-"||n==="."){let o="";for(n==="-"&&(o+=n,n=i[++e]);n&&(s.test(n)||n==="."||n==="e"||n==="E"||(n==="-"||n==="+")&&(o[o.length-1]==="e"||o[o.length-1]==="E"));)o+=n,n=i[++e];t.push({type:"number",value:o});continue}let a=/[a-z]/i;if(n&&a.test(n)){let o="";for(;n&&a.test(n)&&e!==i.length;)o+=n,n=i[++e];if(o=="true"||o=="false"||o==="null")t.push({type:"name",value:o});else{e++;continue}continue}e++}return t},bs=i=>{if(i.length===0)return i;let e=i[i.length-1];switch(e.type){case"separator":return i=i.slice(0,i.length-1),bs(i);case"number":let t=e.value[e.value.length-1];if(t==="."||t==="-"||t==="+"||t==="e"||t==="E")return i=i.slice(0,i.length-1),bs(i);case"string":let n=i[i.length-2];if((n==null?void 0:n.type)==="delimiter")return i=i.slice(0,i.length-1),bs(i);if((n==null?void 0:n.type)==="brace"&&n.value==="{")return i=i.slice(0,i.length-1),bs(i);break;case"delimiter":return i=i.slice(0,i.length-1),bs(i)}return i},WT=i=>{let e=[];return i.map(t=>{t.type==="brace"&&(t.value==="{"?e.push("}"):e.splice(e.lastIndexOf("}"),1)),t.type==="paren"&&(t.value==="["?e.push("]"):e.splice(e.lastIndexOf("]"),1))}),e.length>0&&e.reverse().map(t=>{t==="}"?i.push({type:"brace",value:"}"}):t==="]"&&i.push({type:"paren",value:"]"})}),i},$T=i=>{let e="";return i.map(t=>{switch(t.type){case"string":e+='"'+t.value+'"';break;default:e+=t.value;break}}),e},qT=i=>JSON.parse($T(WT(bs(GT(i))))),zs="__json_buf";function D_(i,e){const t={};for(const s of Object.keys(i))s!=="input"&&(t[s]=i[s]);Object.defineProperty(t,zs,{value:e,enumerable:!1,writable:!0});let n,r=!1;return Object.defineProperty(t,"input",{enumerable:!0,configurable:!0,get(){return r||(n=e?qT(e):{},r=!0),n}}),t}var Mn,qi,_s,ga,ac,_a,xa,oc,ya,ui,va,cc,lc,wr,uc,hc,wa,Cu,z0,Ma,Lu,Iu,Du,O0,Uu;function Nu(i){return i.type==="tool_use"||i.type==="server_tool_use"||i.type==="mcp_tool_use"}class tl{constructor(e,t){Mn.add(this),this.messages=[],this.receivedMessages=[],qi.set(this,void 0),_s.set(this,null),this.controller=new AbortController,ga.set(this,void 0),ac.set(this,()=>{}),_a.set(this,()=>{}),xa.set(this,void 0),oc.set(this,()=>{}),ya.set(this,()=>{}),ui.set(this,{}),va.set(this,!1),cc.set(this,!1),lc.set(this,!1),wr.set(this,!1),uc.set(this,void 0),hc.set(this,void 0),wa.set(this,void 0),Ma.set(this,n=>{if(re(this,cc,!0),Xs(n)&&(n=new ai),n instanceof ai)return re(this,lc,!0),this._emit("abort",n);if(n instanceof Fe)return this._emit("error",n);if(n instanceof Error){const r=new Fe(n.message);return r.cause=n,this._emit("error",r)}return this._emit("error",new Fe(String(n)))}),re(this,ga,new Promise((n,r)=>{re(this,ac,n,"f"),re(this,_a,r,"f")})),re(this,xa,new Promise((n,r)=>{re(this,oc,n,"f"),re(this,ya,r,"f")})),P(this,ga,"f").catch(()=>{}),P(this,xa,"f").catch(()=>{}),re(this,_s,e),re(this,wa,(t==null?void 0:t.logger)??console)}get response(){return P(this,uc,"f")}get request_id(){return P(this,hc,"f")}async withResponse(){re(this,wr,!0);const e=await P(this,ga,"f");if(!e)throw new Error("Could not resolve a `Response` object");return{data:this,response:e,request_id:e.headers.get("request-id")}}static fromReadableStream(e){const t=new tl(null);return t._run(()=>t._fromReadableStream(e)),t}static createMessage(e,t,n,{logger:r}={}){const s=new tl(t,{logger:r});for(const a of t.messages)s._addMessageParam(a);return re(s,_s,{...t,stream:!0}),s._run(()=>s._createMessage(e,{...t,stream:!0},{...n,headers:{...n==null?void 0:n.headers,[m_]:"stream"}})),s}_run(e){e().then(()=>{this._emitFinal(),this._emit("end")},P(this,Ma,"f"))}_addMessageParam(e){this.messages.push(e)}_addMessage(e,t=!0){this.receivedMessages.push(e),t&&this._emit("message",e)}async _createMessage(e,t,n){var a;const r=n==null?void 0:n.signal;let s;r&&(r.aborted&&this.controller.abort(),s=this.controller.abort.bind(this.controller),r.addEventListener("abort",s));try{P(this,Mn,"m",Lu).call(this);const{response:o,data:c}=await e.create({...t,stream:!0},{...n,signal:this.controller.signal}).withResponse();this._connected(o);for await(const l of c)P(this,Mn,"m",Iu).call(this,l);if((a=c.controller.signal)!=null&&a.aborted)throw new ai;P(this,Mn,"m",Du).call(this)}finally{r&&s&&r.removeEventListener("abort",s)}}_connected(e){this.ended||(re(this,uc,e),re(this,hc,e==null?void 0:e.headers.get("request-id")),P(this,ac,"f").call(this,e),this._emit("connect"))}get ended(){return P(this,va,"f")}get errored(){return P(this,cc,"f")}get aborted(){return P(this,lc,"f")}abort(){this.controller.abort()}on(e,t){return(P(this,ui,"f")[e]||(P(this,ui,"f")[e]=[])).push({listener:t}),this}off(e,t){const n=P(this,ui,"f")[e];if(!n)return this;const r=n.findIndex(s=>s.listener===t);return r>=0&&n.splice(r,1),this}once(e,t){return(P(this,ui,"f")[e]||(P(this,ui,"f")[e]=[])).push({listener:t,once:!0}),this}emitted(e){return new Promise((t,n)=>{re(this,wr,!0),e!=="error"&&this.once("error",n),this.once(e,t)})}async done(){re(this,wr,!0),await P(this,xa,"f")}get currentMessage(){return P(this,qi,"f")}async finalMessage(){return await this.done(),P(this,Mn,"m",Cu).call(this)}async finalText(){return await this.done(),P(this,Mn,"m",z0).call(this)}_emit(e,...t){if(P(this,va,"f"))return;e==="end"&&(re(this,va,!0),P(this,oc,"f").call(this));const n=P(this,ui,"f")[e];if(n&&(P(this,ui,"f")[e]=n.filter(r=>!r.once),n.forEach(({listener:r})=>r(...t))),e==="abort"){const r=t[0];!P(this,wr,"f")&&!(n!=null&&n.length)&&Promise.reject(r),P(this,_a,"f").call(this,r),P(this,ya,"f").call(this,r),this._emit("end");return}if(e==="error"){const r=t[0];!P(this,wr,"f")&&!(n!=null&&n.length)&&Promise.reject(r),P(this,_a,"f").call(this,r),P(this,ya,"f").call(this,r),this._emit("end")}}_emitFinal(){this.receivedMessages.at(-1)&&this._emit("finalMessage",P(this,Mn,"m",Cu).call(this))}async _fromReadableStream(e,t){var s;const n=t==null?void 0:t.signal;let r;n&&(n.aborted&&this.controller.abort(),r=this.controller.abort.bind(this.controller),n.addEventListener("abort",r));try{P(this,Mn,"m",Lu).call(this),this._connected(null);const a=oi.fromReadableStream(e,this.controller);for await(const o of a)P(this,Mn,"m",Iu).call(this,o);if((s=a.controller.signal)!=null&&s.aborted)throw new ai;P(this,Mn,"m",Du).call(this)}finally{n&&r&&n.removeEventListener("abort",r)}}[(qi=new WeakMap,_s=new WeakMap,ga=new WeakMap,ac=new WeakMap,_a=new WeakMap,xa=new WeakMap,oc=new WeakMap,ya=new WeakMap,ui=new WeakMap,va=new WeakMap,cc=new WeakMap,lc=new WeakMap,wr=new WeakMap,uc=new WeakMap,hc=new WeakMap,wa=new WeakMap,Ma=new WeakMap,Mn=new WeakSet,Cu=function(){if(this.receivedMessages.length===0)throw new Fe("stream ended without producing a Message with role=assistant");return this.receivedMessages.at(-1)},z0=function(){if(this.receivedMessages.length===0)throw new Fe("stream ended without producing a Message with role=assistant");const t=this.receivedMessages.at(-1).content.filter(n=>n.type==="text").map(n=>n.text);if(t.length===0)throw new Fe("stream ended without producing a content block with type=text");return t.join(" ")},Lu=function(){this.ended||re(this,qi,void 0)},Iu=function(t){var r;if(this.ended)return;const n=P(this,Mn,"m",O0).call(this,t);switch(this._emit("streamEvent",t,n),t.type){case"content_block_delta":{const s=n.content.at(-1);switch(t.delta.type){case"text_delta":{s.type==="text"&&this._emit("text",t.delta.text,s.text||"");break}case"citations_delta":{s.type==="text"&&this._emit("citation",t.delta.citation,s.citations??[]);break}case"input_json_delta":{if(Nu(s)&&((r=P(this,ui,"f").inputJson)!=null&&r.length)){let a;try{a=s.input}catch(o){P(this,Ma,"f").call(this,P(this,Mn,"m",Uu).call(this,s,o));break}this._emit("inputJson",t.delta.partial_json,a)}break}case"thinking_delta":{s.type==="thinking"&&this._emit("thinking",t.delta.thinking,s.thinking);break}case"signature_delta":{s.type==="thinking"&&this._emit("signature",s.signature);break}case"compaction_delta":{s.type==="compaction"&&s.content&&this._emit("compaction",s.content);break}default:t.delta}break}case"message_stop":{this._addMessageParam(n),this._addMessage(k0(n,P(this,_s,"f"),{logger:P(this,wa,"f")}),!0);break}case"content_block_stop":{this._emit("contentBlock",n.content.at(-1));break}case"message_start":{re(this,qi,n);break}}},Du=function(){if(this.ended)throw new Fe("stream has ended, this shouldn't happen");const t=P(this,qi,"f");if(!t)throw new Fe("request ended without sending any chunks");return re(this,qi,void 0),k0(t,P(this,_s,"f"),{logger:P(this,wa,"f")})},O0=function(t){let n=P(this,qi,"f");if(t.type==="message_start"){if(n)throw new Fe(`Unexpected event order, got ${t.type} before receiving "message_stop"`);return t.message}if(!n)throw new Fe(`Unexpected event order, got ${t.type} before "message_start"`);switch(t.type){case"message_stop":return n;case"message_delta":return n.container=t.delta.container,n.stop_reason=t.delta.stop_reason,n.stop_sequence=t.delta.stop_sequence,t.delta.stop_details!=null&&(n.stop_details=t.delta.stop_details),n.usage.output_tokens=t.usage.output_tokens,n.context_management=t.context_management,t.usage.input_tokens!=null&&(n.usage.input_tokens=t.usage.input_tokens),t.usage.cache_creation_input_tokens!=null&&(n.usage.cache_creation_input_tokens=t.usage.cache_creation_input_tokens),t.usage.cache_read_input_tokens!=null&&(n.usage.cache_read_input_tokens=t.usage.cache_read_input_tokens),t.usage.server_tool_use!=null&&(n.usage.server_tool_use=t.usage.server_tool_use),t.usage.iterations!=null&&(n.usage.iterations=t.usage.iterations),n;case"content_block_start":return n.content.push(t.content_block),t.content_block.type==="fallback"&&(n.model=t.content_block.to.model),n;case"content_block_delta":{const r=n.content.at(t.index);switch(t.delta.type){case"text_delta":{(r==null?void 0:r.type)==="text"&&(n.content[t.index]={...r,text:(r.text||"")+t.delta.text});break}case"citations_delta":{(r==null?void 0:r.type)==="text"&&(n.content[t.index]={...r,citations:[...r.citations??[],t.delta.citation]});break}case"input_json_delta":{if(r&&Nu(r)){const s=(r[zs]||"")+t.delta.partial_json;n.content[t.index]=D_(r,s)}break}case"thinking_delta":{(r==null?void 0:r.type)==="thinking"&&(n.content[t.index]={...r,thinking:r.thinking+t.delta.thinking});break}case"signature_delta":{(r==null?void 0:r.type)==="thinking"&&(n.content[t.index]={...r,signature:t.delta.signature});break}case"compaction_delta":{(r==null?void 0:r.type)==="compaction"&&(n.content[t.index]={...r,content:(r.content||"")+t.delta.content,encrypted_content:t.delta.encrypted_content});break}default:t.delta}return n}case"content_block_stop":{const r=n.content.at(t.index);if(r&&Nu(r)&&zs in r){let s;try{s=r.input}catch(a){s={},P(this,Ma,"f").call(this,P(this,Mn,"m",Uu).call(this,r,a))}Object.defineProperty(r,"input",{value:s,enumerable:!0,configurable:!0,writable:!0})}return n}}},Uu=function(t,n){const r=t[zs];return new Fe(`Unable to parse tool parameter JSON from model. Please retry your request or adjust your prompt. Error: ${n}. JSON: ${r}`)},Symbol.asyncIterator)](){const e=[],t=[];let n=!1;return this.on("streamEvent",r=>{const s=t.shift();s?s.resolve(r):e.push(r)}),this.on("end",()=>{n=!0;for(const r of t)r.resolve(void 0);t.length=0}),this.on("abort",r=>{n=!0;for(const s of t)s.reject(r);t.length=0}),this.on("error",r=>{n=!0;for(const s of t)s.reject(r);t.length=0}),{next:async()=>e.length?{value:e.shift(),done:!1}:n?{value:void 0,done:!0}:new Promise((s,a)=>t.push({resolve:s,reject:a})).then(s=>s?{value:s,done:!1}:{value:void 0,done:!0}),return:async()=>(this.abort(),{value:void 0,done:!0})}}toReadableStream(){return new oi(this[Symbol.asyncIterator].bind(this),this.controller).toReadableStream()}}function F0(){let i,e;return{promise:new Promise((n,r)=>{i=n,e=r}),resolve:i,reject:e}}const XT=1e5,YT=`You have been working on the task described above but have not yet completed it. Write a continuation summary that will allow you (or another instance of yourself) to resume work efficiently in a future context window where the conversation history will be replaced with this summary. Your summary should be structured, concise, and actionable. Include:
1. Task Overview
The user's core request and success criteria
Any clarifications or constraints they specified
2. Current State
What has been completed so far
Files created, modified, or analyzed (with paths if relevant)
Key outputs or artifacts produced
3. Important Discoveries
Technical constraints or requirements uncovered
Decisions made and their rationale
Errors encountered and how they were resolved
What approaches were tried that didn't work (and why)
4. Next Steps
Specific actions needed to complete the task
Any blockers or open questions to resolve
Priority order if multiple steps remain
5. Context to Preserve
User preferences or style requirements
Domain-specific details that aren't obvious
Any promises made to the user
Be concise but complete—err on the side of including information that would prevent duplicate work or repeated mistakes. Write in a way that enables immediate resumption of the task.
Wrap your summary in <summary></summary> tags.`;var Sa,xs,Mr,Gt,bn,Dn,Pi,Xi,ba,B0,Zh;class U_{constructor(e,t,n){var s;Sa.add(this),this.client=e,xs.set(this,!1),Mr.set(this,!1),Gt.set(this,void 0),bn.set(this,void 0),Dn.set(this,void 0),Pi.set(this,void 0),Xi.set(this,void 0),ba.set(this,0),re(this,Gt,{params:{...t,messages:structuredClone(t.messages)}});const r=g_(t.tools,t.messages);re(this,bn,{...n,headers:K([jh("BetaToolRunner"),r.length?{[uo]:r.join(", ")}:void 0,n==null?void 0:n.headers])}),re(this,Xi,F0()),(s=t.compactionControl)!=null&&s.enabled&&console.warn('Anthropic: The `compactionControl` parameter is deprecated and will be removed in a future version. Use server-side compaction instead by passing `edits: [{ type: "compact_20260112" }]` in the params passed to `toolRunner()`. See https://platform.claude.com/docs/en/build-with-claude/compaction')}async*[(xs=new WeakMap,Mr=new WeakMap,Gt=new WeakMap,bn=new WeakMap,Dn=new WeakMap,Pi=new WeakMap,Xi=new WeakMap,ba=new WeakMap,Sa=new WeakSet,B0=async function(){var l;const t=P(this,Gt,"f").params.compactionControl;if(!t||!t.enabled)return!1;let n=0;if(P(this,Dn,"f")!==void 0)try{const u=await P(this,Dn,"f");n=u.usage.input_tokens+(u.usage.cache_creation_input_tokens??0)+(u.usage.cache_read_input_tokens??0)+u.usage.output_tokens}catch{return!1}const r=t.contextTokenThreshold??XT;if(n<r)return!1;const s=t.model??P(this,Gt,"f").params.model,a=t.summaryPrompt??YT,o=P(this,Gt,"f").params.messages;if(o[o.length-1].role==="assistant"){const u=o[o.length-1];if(Array.isArray(u.content)){const d=u.content.filter(f=>f.type!=="tool_use");d.length===0?o.pop():u.content=d}}const c=await this.client.beta.messages.create({model:s,messages:[...o,{role:"user",content:[{type:"text",text:a}]}],max_tokens:P(this,Gt,"f").params.max_tokens},{signal:P(this,bn,"f").signal,headers:K([P(this,bn,"f").headers,jh("compaction")])});if(((l=c.content[0])==null?void 0:l.type)!=="text")throw new Fe("Expected text response for compaction");return P(this,Gt,"f").params.messages=[{role:"user",content:c.content}],!0},Symbol.asyncIterator)](){var e;if(P(this,xs,"f"))throw new Fe("Cannot iterate over a consumed stream");re(this,xs,!0),re(this,Mr,!0),re(this,Pi,void 0);try{for(;;){let t;try{if(P(this,Gt,"f").params.max_iterations&&P(this,ba,"f")>=P(this,Gt,"f").params.max_iterations)break;re(this,Mr,!1,"f"),re(this,Pi,void 0,"f"),re(this,ba,(e=P(this,ba,"f"),e++,e),"f"),re(this,Dn,void 0,"f");const{max_iterations:n,compactionControl:r,...s}=P(this,Gt,"f").params;if(s.stream?(t=this.client.beta.messages.stream({...s},P(this,bn,"f")),re(this,Dn,t.finalMessage(),"f"),P(this,Dn,"f").catch(()=>{}),yield t):(re(this,Dn,this.client.beta.messages.create({...s,stream:!1},P(this,bn,"f")),"f"),yield P(this,Dn,"f")),!await P(this,Sa,"m",B0).call(this)){if(!P(this,Mr,"f")){const c=await P(this,Dn,"f");if(P(this,Gt,"f").params.messages.push({role:c.role,content:c.content}),c.stop_reason==="refusal")break}const o=await P(this,Sa,"m",Zh).call(this,P(this,Gt,"f").params.messages.at(-1));if(o)P(this,Gt,"f").params.messages.push(o);else if(!P(this,Mr,"f"))break}}finally{t&&t.abort()}}if(!P(this,Dn,"f"))throw new Fe("ToolRunner concluded without a message from the server");P(this,Xi,"f").resolve(await P(this,Dn,"f"))}catch(t){throw re(this,xs,!1),P(this,Xi,"f").promise.catch(()=>{}),P(this,Xi,"f").reject(t),re(this,Xi,F0()),t}}setMessagesParams(e){typeof e=="function"?P(this,Gt,"f").params=e(P(this,Gt,"f").params):P(this,Gt,"f").params=e,re(this,Mr,!0),re(this,Pi,void 0)}setRequestOptions(e){typeof e=="function"?re(this,bn,e(P(this,bn,"f"))):re(this,bn,{...P(this,bn,"f"),...e})}async generateToolResponse(e=P(this,bn,"f").signal){const t=await P(this,Dn,"f")??this.params.messages.at(-1);return t?P(this,Sa,"m",Zh).call(this,t,e):null}done(){return P(this,Xi,"f").promise}async runUntilDone(){if(!P(this,xs,"f"))for await(const e of this);return this.done()}get params(){return P(this,Gt,"f").params}pushMessages(...e){this.setMessagesParams(t=>({...t,messages:[...t.messages,...e]}))}then(e,t){return this.runUntilDone().then(e,t)}}Zh=async function(e,t=P(this,bn,"f").signal){return P(this,Pi,"f")!==void 0?P(this,Pi,"f"):(re(this,Pi,KT(P(this,Gt,"f").params,e,{...P(this,bn,"f"),signal:t})),P(this,Pi,"f"))};async function KT(i,e=i.messages.at(-1),t){if(!e||e.role!=="assistant"||!e.content||typeof e.content=="string")return null;const n=e.content.filter(s=>s.type==="tool_use");return n.length===0?null:{role:"user",content:await Promise.all(n.map(async s=>{const a=i.tools.find(o=>("name"in o?o.name:o.mcp_server_name)===s.name);if(!a||!("run"in a))return{type:"tool_result",tool_use_id:s.id,content:`Error: Tool '${s.name}' not found`,is_error:!0};try{let o=s.input;"parse"in a&&a.parse&&(o=a.parse(o));const c=await a.run(o,{toolUse:s,toolUseBlock:s,signal:t==null?void 0:t.signal});return{type:"tool_result",tool_use_id:s.id,content:c}}catch(o){return{type:"tool_result",tool_use_id:s.id,content:o instanceof Bd?o.content:`Error: ${o instanceof Error?o.message:String(o)}`,is_error:!0}}}))}}const H0={"claude-1.3":"November 6th, 2024","claude-1.3-100k":"November 6th, 2024","claude-instant-1.1":"November 6th, 2024","claude-instant-1.1-100k":"November 6th, 2024","claude-instant-1.2":"November 6th, 2024","claude-3-sonnet-20240229":"July 21st, 2025","claude-3-opus-20240229":"January 5th, 2026","claude-2.1":"July 21st, 2025","claude-2.0":"July 21st, 2025","claude-3-7-sonnet-latest":"February 19th, 2026","claude-3-7-sonnet-20250219":"February 19th, 2026","claude-3-5-haiku-latest":"February 19th, 2026","claude-3-5-haiku-20241022":"February 19th, 2026","claude-opus-4-0":"June 15th, 2026","claude-opus-4-20250514":"June 15th, 2026","claude-sonnet-4-0":"June 15th, 2026","claude-sonnet-4-20250514":"June 15th, 2026","claude-opus-4-1":"August 5th, 2026","claude-opus-4-1-20250805":"August 5th, 2026","claude-mythos-preview":"June 30th, 2026"},jT=["claude-mythos-preview","claude-opus-4-6"];let ho=class extends gt{constructor(){super(...arguments),this.batches=new P_(this._client)}create(e,t){const n=V0(e),{betas:r,user_profile_id:s,...a}=n;a.model in H0&&console.warn(`The model '${a.model}' is deprecated and will reach end-of-life on ${H0[a.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`),jT.includes(a.model)&&a.thinking&&a.thinking.type==="enabled"&&console.warn(`Using Claude with ${a.model} and 'thinking.type=enabled' is deprecated. Use 'thinking.type=adaptive' instead which results in better model performance in our testing: https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking`);let o=this._client._options.timeout;if(!a.stream&&o==null){const l=C_[a.model]??void 0;o=this._client.calculateNonstreamingTimeout(a.max_tokens,l)}const c=__(a.tools,a.messages);return this._client.post("/v1/messages?beta=true",{body:a,timeout:o??6e5,...t,headers:K([{...(r==null?void 0:r.toString())!=null?{"anthropic-beta":r==null?void 0:r.toString()}:void 0,...s!=null?{"anthropic-user-profile-id":s}:void 0},c,t==null?void 0:t.headers]),stream:n.stream??!1})}parse(e,t){return t={...t,headers:K([{"anthropic-beta":[...e.betas??[],"structured-outputs-2025-12-15"].toString()},t==null?void 0:t.headers])},this.create(e,t).then(n=>I_(n,e,{logger:this._client.logger??console}))}stream(e,t){return tl.createMessage(this,e,t)}countTokens(e,t){const n=V0(e),{betas:r,user_profile_id:s,...a}=n;return this._client.post("/v1/messages/count_tokens?beta=true",{body:a,...t,headers:K([{"anthropic-beta":[...r??[],"token-counting-2024-11-01"].toString(),...s!=null?{"anthropic-user-profile-id":s}:void 0},t==null?void 0:t.headers])})}toolRunner(e,t){return new U_(this._client,e,t)}};function V0(i){var n;if(!i.output_format)return i;if((n=i.output_config)!=null&&n.format)throw new Fe("Both output_format and output_config.format were provided. Please use only output_config.format (output_format is deprecated).");const{output_format:e,...t}=i;return{...t,output_config:{...i.output_config,format:e}}}ho.Batches=P_;ho.BetaToolRunner=U_;ho.ToolError=Bd;let Gd=class extends gt{list(e,t={},n){const{betas:r,...s}=t??{};return this._client.getAPIList(fe`/v1/sessions/${e}/events?beta=true`,Qt,{query:s,...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}send(e,t,n){const{betas:r,...s}=t;return this._client.post(fe`/v1/sessions/${e}/events?beta=true`,{body:s,...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}stream(e,t={},n){const{betas:r,...s}=t??{};return this._client.get(fe`/v1/sessions/${e}/events/stream?beta=true`,{query:s,...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers]),stream:!0})}toolRunner(e,t){return new Hd(e,{...t,client:this._client})}};Gd.SessionToolRunner=Hd;class N_ extends gt{retrieve(e,t,n){const{session_id:r,betas:s}=t;return this._client.get(fe`/v1/sessions/${r}/resources/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...s??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}update(e,t,n){const{session_id:r,betas:s,...a}=t;return this._client.post(fe`/v1/sessions/${r}/resources/${e}?beta=true`,{body:a,...n,headers:K([{"anthropic-beta":[...s??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}list(e,t={},n){const{betas:r,...s}=t??{};return this._client.getAPIList(fe`/v1/sessions/${e}/resources?beta=true`,Qt,{query:s,...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}delete(e,t,n){const{session_id:r,betas:s}=t;return this._client.delete(fe`/v1/sessions/${r}/resources/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...s??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}add(e,t,n){const{betas:r,...s}=t;return this._client.post(fe`/v1/sessions/${e}/resources?beta=true`,{body:s,...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}}class k_ extends gt{list(e,t,n){const{session_id:r,betas:s,...a}=t;return this._client.getAPIList(fe`/v1/sessions/${r}/threads/${e}/events?beta=true`,Qt,{query:a,...n,headers:K([{"anthropic-beta":[...s??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}stream(e,t,n){const{session_id:r,betas:s}=t;return this._client.get(fe`/v1/sessions/${r}/threads/${e}/stream?beta=true`,{...n,headers:K([{"anthropic-beta":[...s??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers]),stream:!0})}}class Wd extends gt{constructor(){super(...arguments),this.events=new k_(this._client)}retrieve(e,t,n){const{session_id:r,betas:s}=t;return this._client.get(fe`/v1/sessions/${r}/threads/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...s??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}list(e,t={},n){const{betas:r,...s}=t??{};return this._client.getAPIList(fe`/v1/sessions/${e}/threads?beta=true`,Qt,{query:s,...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}archive(e,t,n){const{session_id:r,betas:s}=t;return this._client.post(fe`/v1/sessions/${r}/threads/${e}/archive?beta=true`,{...n,headers:K([{"anthropic-beta":[...s??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}}Wd.Events=k_;class fo extends gt{constructor(){super(...arguments),this.events=new Gd(this._client),this.resources=new N_(this._client),this.threads=new Wd(this._client)}create(e,t){const{betas:n,...r}=e;return this._client.post("/v1/sessions?beta=true",{body:r,...t,headers:K([{"anthropic-beta":[...n??[],"managed-agents-2026-04-01"].toString()},t==null?void 0:t.headers])})}retrieve(e,t={},n){const{betas:r}=t??{};return this._client.get(fe`/v1/sessions/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}update(e,t,n){const{betas:r,...s}=t;return this._client.post(fe`/v1/sessions/${e}?beta=true`,{body:s,...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}list(e={},t){const{betas:n,...r}=e??{};return this._client.getAPIList("/v1/sessions?beta=true",nT,{query:r,...t,headers:K([{"anthropic-beta":[...n??[],"managed-agents-2026-04-01"].toString()},t==null?void 0:t.headers])})}delete(e,t={},n){const{betas:r}=t??{};return this._client.delete(fe`/v1/sessions/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}archive(e,t={},n){const{betas:r}=t??{};return this._client.post(fe`/v1/sessions/${e}/archive?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}}fo.Events=Gd;fo.Resources=N_;fo.Threads=Wd;class z_ extends gt{create(e,t,n){const{betas:r,...s}=t;return this._client.post(fe`/v1/skills/${e}/versions?beta=true`,zd({body:s,...n,headers:K([{"anthropic-beta":[...r??[],"skills-2025-10-02"].toString()},n==null?void 0:n.headers])},this._client,!1))}retrieve(e,t,n){const{skill_id:r,betas:s}=t;return this._client.get(fe`/v1/skills/${r}/versions/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...s??[],"skills-2025-10-02"].toString()},n==null?void 0:n.headers])})}list(e,t={},n){const{betas:r,...s}=t??{};return this._client.getAPIList(fe`/v1/skills/${e}/versions?beta=true`,Qt,{query:s,...n,headers:K([{"anthropic-beta":[...r??[],"skills-2025-10-02"].toString()},n==null?void 0:n.headers])})}delete(e,t,n){const{skill_id:r,betas:s}=t;return this._client.delete(fe`/v1/skills/${r}/versions/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...s??[],"skills-2025-10-02"].toString()},n==null?void 0:n.headers])})}download(e,t,n){const{skill_id:r,betas:s}=t;return this._client.get(fe`/v1/skills/${r}/versions/${e}/content?beta=true`,{...n,headers:K([{"anthropic-beta":[...s??[],"skills-2025-10-02"].toString(),Accept:"application/binary"},n==null?void 0:n.headers]),__binaryResponse:!0})}}class $d extends gt{constructor(){super(...arguments),this.versions=new z_(this._client)}create(e,t){const{betas:n,...r}=e;return this._client.post("/v1/skills?beta=true",zd({body:r,...t,headers:K([{"anthropic-beta":[...n??[],"skills-2025-10-02"].toString()},t==null?void 0:t.headers])},this._client,!1))}retrieve(e,t={},n){const{betas:r}=t??{};return this._client.get(fe`/v1/skills/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"skills-2025-10-02"].toString()},n==null?void 0:n.headers])})}list(e={},t){const{betas:n,...r}=e??{};return this._client.getAPIList("/v1/skills?beta=true",Qt,{query:r,...t,headers:K([{"anthropic-beta":[...n??[],"skills-2025-10-02"].toString()},t==null?void 0:t.headers])})}delete(e,t={},n){const{betas:r}=t??{};return this._client.delete(fe`/v1/skills/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"skills-2025-10-02"].toString()},n==null?void 0:n.headers])})}}$d.Versions=z_;class O_ extends gt{create(e,t,n){const{betas:r,...s}=t;return this._client.post(fe`/v1/vaults/${e}/credentials?beta=true`,{body:s,...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}retrieve(e,t,n){const{vault_id:r,betas:s}=t;return this._client.get(fe`/v1/vaults/${r}/credentials/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...s??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}update(e,t,n){const{vault_id:r,betas:s,...a}=t;return this._client.post(fe`/v1/vaults/${r}/credentials/${e}?beta=true`,{body:a,...n,headers:K([{"anthropic-beta":[...s??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}list(e,t={},n){const{betas:r,...s}=t??{};return this._client.getAPIList(fe`/v1/vaults/${e}/credentials?beta=true`,Qt,{query:s,...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}delete(e,t,n){const{vault_id:r,betas:s}=t;return this._client.delete(fe`/v1/vaults/${r}/credentials/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...s??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}archive(e,t,n){const{vault_id:r,betas:s}=t;return this._client.post(fe`/v1/vaults/${r}/credentials/${e}/archive?beta=true`,{...n,headers:K([{"anthropic-beta":[...s??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}mcpOAuthValidate(e,t,n){const{vault_id:r,betas:s}=t;return this._client.post(fe`/v1/vaults/${r}/credentials/${e}/mcp_oauth_validate?beta=true`,{...n,headers:K([{"anthropic-beta":[...s??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}}class qd extends gt{constructor(){super(...arguments),this.credentials=new O_(this._client)}create(e,t){const{betas:n,...r}=e;return this._client.post("/v1/vaults?beta=true",{body:r,...t,headers:K([{"anthropic-beta":[...n??[],"managed-agents-2026-04-01"].toString()},t==null?void 0:t.headers])})}retrieve(e,t={},n){const{betas:r}=t??{};return this._client.get(fe`/v1/vaults/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}update(e,t,n){const{betas:r,...s}=t;return this._client.post(fe`/v1/vaults/${e}?beta=true`,{body:s,...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}list(e={},t){const{betas:n,...r}=e??{};return this._client.getAPIList("/v1/vaults?beta=true",Qt,{query:r,...t,headers:K([{"anthropic-beta":[...n??[],"managed-agents-2026-04-01"].toString()},t==null?void 0:t.headers])})}delete(e,t={},n){const{betas:r}=t??{};return this._client.delete(fe`/v1/vaults/${e}?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}archive(e,t={},n){const{betas:r}=t??{};return this._client.post(fe`/v1/vaults/${e}/archive?beta=true`,{...n,headers:K([{"anthropic-beta":[...r??[],"managed-agents-2026-04-01"].toString()},n==null?void 0:n.headers])})}}qd.Credentials=O_;class xn extends gt{constructor(){super(...arguments),this.models=new y_(this._client),this.messages=new ho(this._client),this.agents=new Od(this._client),this.environments=new Vd(this._client),this.sessions=new fo(this._client),this.deployments=new p_(this._client),this.deploymentRuns=new f_(this._client),this.vaults=new qd(this._client),this.memoryStores=new vl(this._client),this.files=new x_(this._client),this.skills=new $d(this._client),this.webhooks=new w_(this._client),this.userProfiles=new v_(this._client)}}xn.Models=y_;xn.Messages=ho;xn.Agents=Od;xn.Environments=Vd;xn.Sessions=fo;xn.Deployments=p_;xn.DeploymentRuns=f_;xn.Vaults=qd;xn.MemoryStores=vl;xn.Files=x_;xn.Skills=$d;xn.Webhooks=w_;xn.UserProfiles=v_;class F_ extends gt{create(e,t){const{betas:n,...r}=e;return this._client.post("/v1/complete",{body:r,timeout:this._client._options.timeout??6e5,...t,headers:K([{...(n==null?void 0:n.toString())!=null?{"anthropic-beta":n==null?void 0:n.toString()}:void 0},t==null?void 0:t.headers]),stream:e.stream??!1})}}function B_(i){var e;return(e=i==null?void 0:i.output_config)==null?void 0:e.format}function G0(i,e,t){const n=B_(e);return!e||!("parse"in(n??{}))?{...i,content:i.content.map(r=>r.type==="text"?Object.defineProperty({...r},"parsed_output",{value:null,enumerable:!1}):r),parsed_output:null}:H_(i,e)}function H_(i,e,t){let n=null;const r=i.content.map(s=>{if(s.type==="text"){const a=JT(e,s.text);return n===null&&(n=a),Object.defineProperty({...s},"parsed_output",{value:a,enumerable:!1})}return s});return{...i,content:r,parsed_output:n}}function JT(i,e){const t=B_(i);if((t==null?void 0:t.type)!=="json_schema")return null;try{return"parse"in t?t.parse(e):JSON.parse(e)}catch(n){throw new Fe(`Failed to parse structured output: ${n}`)}}var Wn,Yi,ys,Ea,dc,Ta,Aa,fc,Ra,hi,Pa,pc,mc,Sr,gc,_c,Ca,ku,W0,zu,Ou,Fu,Bu,$0;function Hu(i){return i.type==="tool_use"||i.type==="server_tool_use"}class nl{constructor(e,t){Wn.add(this),this.messages=[],this.receivedMessages=[],Yi.set(this,void 0),ys.set(this,null),this.controller=new AbortController,Ea.set(this,void 0),dc.set(this,()=>{}),Ta.set(this,()=>{}),Aa.set(this,void 0),fc.set(this,()=>{}),Ra.set(this,()=>{}),hi.set(this,{}),Pa.set(this,!1),pc.set(this,!1),mc.set(this,!1),Sr.set(this,!1),gc.set(this,void 0),_c.set(this,void 0),Ca.set(this,void 0),zu.set(this,n=>{if(re(this,pc,!0),Xs(n)&&(n=new ai),n instanceof ai)return re(this,mc,!0),this._emit("abort",n);if(n instanceof Fe)return this._emit("error",n);if(n instanceof Error){const r=new Fe(n.message);return r.cause=n,this._emit("error",r)}return this._emit("error",new Fe(String(n)))}),re(this,Ea,new Promise((n,r)=>{re(this,dc,n,"f"),re(this,Ta,r,"f")})),re(this,Aa,new Promise((n,r)=>{re(this,fc,n,"f"),re(this,Ra,r,"f")})),P(this,Ea,"f").catch(()=>{}),P(this,Aa,"f").catch(()=>{}),re(this,ys,e),re(this,Ca,(t==null?void 0:t.logger)??console)}get response(){return P(this,gc,"f")}get request_id(){return P(this,_c,"f")}async withResponse(){re(this,Sr,!0);const e=await P(this,Ea,"f");if(!e)throw new Error("Could not resolve a `Response` object");return{data:this,response:e,request_id:e.headers.get("request-id")}}static fromReadableStream(e){const t=new nl(null);return t._run(()=>t._fromReadableStream(e)),t}static createMessage(e,t,n,{logger:r}={}){const s=new nl(t,{logger:r});for(const a of t.messages)s._addMessageParam(a);return re(s,ys,{...t,stream:!0}),s._run(()=>s._createMessage(e,{...t,stream:!0},{...n,headers:{...n==null?void 0:n.headers,[m_]:"stream"}})),s}_run(e){e().then(()=>{this._emitFinal(),this._emit("end")},P(this,zu,"f"))}_addMessageParam(e){this.messages.push(e)}_addMessage(e,t=!0){this.receivedMessages.push(e),t&&this._emit("message",e)}async _createMessage(e,t,n){var a;const r=n==null?void 0:n.signal;let s;r&&(r.aborted&&this.controller.abort(),s=this.controller.abort.bind(this.controller),r.addEventListener("abort",s));try{P(this,Wn,"m",Ou).call(this);const{response:o,data:c}=await e.create({...t,stream:!0},{...n,signal:this.controller.signal}).withResponse();this._connected(o);for await(const l of c)P(this,Wn,"m",Fu).call(this,l);if((a=c.controller.signal)!=null&&a.aborted)throw new ai;P(this,Wn,"m",Bu).call(this)}finally{r&&s&&r.removeEventListener("abort",s)}}_connected(e){this.ended||(re(this,gc,e),re(this,_c,e==null?void 0:e.headers.get("request-id")),P(this,dc,"f").call(this,e),this._emit("connect"))}get ended(){return P(this,Pa,"f")}get errored(){return P(this,pc,"f")}get aborted(){return P(this,mc,"f")}abort(){this.controller.abort()}on(e,t){return(P(this,hi,"f")[e]||(P(this,hi,"f")[e]=[])).push({listener:t}),this}off(e,t){const n=P(this,hi,"f")[e];if(!n)return this;const r=n.findIndex(s=>s.listener===t);return r>=0&&n.splice(r,1),this}once(e,t){return(P(this,hi,"f")[e]||(P(this,hi,"f")[e]=[])).push({listener:t,once:!0}),this}emitted(e){return new Promise((t,n)=>{re(this,Sr,!0),e!=="error"&&this.once("error",n),this.once(e,t)})}async done(){re(this,Sr,!0),await P(this,Aa,"f")}get currentMessage(){return P(this,Yi,"f")}async finalMessage(){return await this.done(),P(this,Wn,"m",ku).call(this)}async finalText(){return await this.done(),P(this,Wn,"m",W0).call(this)}_emit(e,...t){if(P(this,Pa,"f"))return;e==="end"&&(re(this,Pa,!0),P(this,fc,"f").call(this));const n=P(this,hi,"f")[e];if(n&&(P(this,hi,"f")[e]=n.filter(r=>!r.once),n.forEach(({listener:r})=>r(...t))),e==="abort"){const r=t[0];!P(this,Sr,"f")&&!(n!=null&&n.length)&&Promise.reject(r),P(this,Ta,"f").call(this,r),P(this,Ra,"f").call(this,r),this._emit("end");return}if(e==="error"){const r=t[0];!P(this,Sr,"f")&&!(n!=null&&n.length)&&Promise.reject(r),P(this,Ta,"f").call(this,r),P(this,Ra,"f").call(this,r),this._emit("end")}}_emitFinal(){this.receivedMessages.at(-1)&&this._emit("finalMessage",P(this,Wn,"m",ku).call(this))}async _fromReadableStream(e,t){var s;const n=t==null?void 0:t.signal;let r;n&&(n.aborted&&this.controller.abort(),r=this.controller.abort.bind(this.controller),n.addEventListener("abort",r));try{P(this,Wn,"m",Ou).call(this),this._connected(null);const a=oi.fromReadableStream(e,this.controller);for await(const o of a)P(this,Wn,"m",Fu).call(this,o);if((s=a.controller.signal)!=null&&s.aborted)throw new ai;P(this,Wn,"m",Bu).call(this)}finally{n&&r&&n.removeEventListener("abort",r)}}[(Yi=new WeakMap,ys=new WeakMap,Ea=new WeakMap,dc=new WeakMap,Ta=new WeakMap,Aa=new WeakMap,fc=new WeakMap,Ra=new WeakMap,hi=new WeakMap,Pa=new WeakMap,pc=new WeakMap,mc=new WeakMap,Sr=new WeakMap,gc=new WeakMap,_c=new WeakMap,Ca=new WeakMap,zu=new WeakMap,Wn=new WeakSet,ku=function(){if(this.receivedMessages.length===0)throw new Fe("stream ended without producing a Message with role=assistant");return this.receivedMessages.at(-1)},W0=function(){if(this.receivedMessages.length===0)throw new Fe("stream ended without producing a Message with role=assistant");const t=this.receivedMessages.at(-1).content.filter(n=>n.type==="text").map(n=>n.text);if(t.length===0)throw new Fe("stream ended without producing a content block with type=text");return t.join(" ")},Ou=function(){this.ended||re(this,Yi,void 0)},Fu=function(t){var r;if(this.ended)return;const n=P(this,Wn,"m",$0).call(this,t);switch(this._emit("streamEvent",t,n),t.type){case"content_block_delta":{const s=n.content.at(-1);switch(t.delta.type){case"text_delta":{s.type==="text"&&this._emit("text",t.delta.text,s.text||"");break}case"citations_delta":{s.type==="text"&&this._emit("citation",t.delta.citation,s.citations??[]);break}case"input_json_delta":{Hu(s)&&((r=P(this,hi,"f").inputJson)!=null&&r.length)&&this._emit("inputJson",t.delta.partial_json,s.input);break}case"thinking_delta":{s.type==="thinking"&&this._emit("thinking",t.delta.thinking,s.thinking);break}case"signature_delta":{s.type==="thinking"&&this._emit("signature",s.signature);break}default:t.delta}break}case"message_stop":{this._addMessageParam(n),this._addMessage(G0(n,P(this,ys,"f"),{logger:P(this,Ca,"f")}),!0);break}case"content_block_stop":{this._emit("contentBlock",n.content.at(-1));break}case"message_start":{re(this,Yi,n);break}}},Bu=function(){if(this.ended)throw new Fe("stream has ended, this shouldn't happen");const t=P(this,Yi,"f");if(!t)throw new Fe("request ended without sending any chunks");return re(this,Yi,void 0),G0(t,P(this,ys,"f"),{logger:P(this,Ca,"f")})},$0=function(t){let n=P(this,Yi,"f");if(t.type==="message_start"){if(n)throw new Fe(`Unexpected event order, got ${t.type} before receiving "message_stop"`);return t.message}if(!n)throw new Fe(`Unexpected event order, got ${t.type} before "message_start"`);switch(t.type){case"message_stop":return n;case"message_delta":return n.stop_reason=t.delta.stop_reason,n.stop_sequence=t.delta.stop_sequence,t.delta.stop_details!=null&&(n.stop_details=t.delta.stop_details),n.usage.output_tokens=t.usage.output_tokens,t.usage.input_tokens!=null&&(n.usage.input_tokens=t.usage.input_tokens),t.usage.cache_creation_input_tokens!=null&&(n.usage.cache_creation_input_tokens=t.usage.cache_creation_input_tokens),t.usage.cache_read_input_tokens!=null&&(n.usage.cache_read_input_tokens=t.usage.cache_read_input_tokens),t.usage.server_tool_use!=null&&(n.usage.server_tool_use=t.usage.server_tool_use),n;case"content_block_start":return n.content.push({...t.content_block}),n;case"content_block_delta":{const r=n.content.at(t.index);switch(t.delta.type){case"text_delta":{(r==null?void 0:r.type)==="text"&&(n.content[t.index]={...r,text:(r.text||"")+t.delta.text});break}case"citations_delta":{(r==null?void 0:r.type)==="text"&&(n.content[t.index]={...r,citations:[...r.citations??[],t.delta.citation]});break}case"input_json_delta":{if(r&&Hu(r)){const s=(r[zs]||"")+t.delta.partial_json;n.content[t.index]=D_(r,s)}break}case"thinking_delta":{(r==null?void 0:r.type)==="thinking"&&(n.content[t.index]={...r,thinking:r.thinking+t.delta.thinking});break}case"signature_delta":{(r==null?void 0:r.type)==="thinking"&&(n.content[t.index]={...r,signature:t.delta.signature});break}default:t.delta}return n}case"content_block_stop":{const r=n.content.at(t.index);return r&&Hu(r)&&zs in r&&Object.defineProperty(r,"input",{value:r.input,enumerable:!0,configurable:!0,writable:!0}),n}}},Symbol.asyncIterator)](){const e=[],t=[];let n=!1;return this.on("streamEvent",r=>{const s=t.shift();s?s.resolve(r):e.push(r)}),this.on("end",()=>{n=!0;for(const r of t)r.resolve(void 0);t.length=0}),this.on("abort",r=>{n=!0;for(const s of t)s.reject(r);t.length=0}),this.on("error",r=>{n=!0;for(const s of t)s.reject(r);t.length=0}),{next:async()=>e.length?{value:e.shift(),done:!1}:n?{value:void 0,done:!0}:new Promise((s,a)=>t.push({resolve:s,reject:a})).then(s=>s?{value:s,done:!1}:{value:void 0,done:!0}),return:async()=>(this.abort(),{value:void 0,done:!0})}}toReadableStream(){return new oi(this[Symbol.asyncIterator].bind(this),this.controller).toReadableStream()}}class V_ extends gt{create(e,t){const{user_profile_id:n,...r}=e;return this._client.post("/v1/messages/batches",{body:r,...t,headers:K([{...n!=null?{"anthropic-user-profile-id":n}:void 0},t==null?void 0:t.headers])})}retrieve(e,t){return this._client.get(fe`/v1/messages/batches/${e}`,t)}list(e={},t){return this._client.getAPIList("/v1/messages/batches",lo,{query:e,...t})}delete(e,t){return this._client.delete(fe`/v1/messages/batches/${e}`,t)}cancel(e,t){return this._client.post(fe`/v1/messages/batches/${e}/cancel`,t)}async results(e,t){const n=await this.retrieve(e);if(!n.results_url)throw new Fe(`No batch \`results_url\`; Has it finished processing? ${n.processing_status} - ${n.id}`);return this._client.get(n.results_url,{...t,headers:K([{Accept:"application/binary"},t==null?void 0:t.headers]),stream:!0,__binaryResponse:!0})._thenUnwrap((r,s)=>wl.fromResponse(s.response,s.controller))}}class Xd extends gt{constructor(){super(...arguments),this.batches=new V_(this._client)}create(e,t){const{user_profile_id:n,...r}=e;r.model in q0&&console.warn(`The model '${r.model}' is deprecated and will reach end-of-life on ${q0[r.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`),ZT.includes(r.model)&&r.thinking&&r.thinking.type==="enabled"&&console.warn(`Using Claude with ${r.model} and 'thinking.type=enabled' is deprecated. Use 'thinking.type=adaptive' instead which results in better model performance in our testing: https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking`);let s=this._client._options.timeout;if(!r.stream&&s==null){const o=C_[r.model]??void 0;s=this._client.calculateNonstreamingTimeout(r.max_tokens,o)}const a=__(r.tools,r.messages);return this._client.post("/v1/messages",{body:r,timeout:s??6e5,...t,headers:K([{...n!=null?{"anthropic-user-profile-id":n}:void 0},a,t==null?void 0:t.headers]),stream:e.stream??!1})}parse(e,t){return this.create(e,t).then(n=>H_(n,e,{logger:this._client.logger??console}))}stream(e,t){return nl.createMessage(this,e,t,{logger:this._client.logger??console})}countTokens(e,t){const{user_profile_id:n,...r}=e;return this._client.post("/v1/messages/count_tokens",{body:r,...t,headers:K([{...n!=null?{"anthropic-user-profile-id":n}:void 0},t==null?void 0:t.headers])})}}const q0={"claude-1.3":"November 6th, 2024","claude-1.3-100k":"November 6th, 2024","claude-instant-1.1":"November 6th, 2024","claude-instant-1.1-100k":"November 6th, 2024","claude-instant-1.2":"November 6th, 2024","claude-3-sonnet-20240229":"July 21st, 2025","claude-3-opus-20240229":"January 5th, 2026","claude-2.1":"July 21st, 2025","claude-2.0":"July 21st, 2025","claude-3-7-sonnet-latest":"February 19th, 2026","claude-3-7-sonnet-20250219":"February 19th, 2026","claude-3-5-haiku-latest":"February 19th, 2026","claude-3-5-haiku-20241022":"February 19th, 2026","claude-opus-4-0":"June 15th, 2026","claude-opus-4-20250514":"June 15th, 2026","claude-sonnet-4-0":"June 15th, 2026","claude-sonnet-4-20250514":"June 15th, 2026","claude-opus-4-1":"August 5th, 2026","claude-opus-4-1-20250805":"August 5th, 2026","claude-mythos-preview":"June 30th, 2026"},ZT=["claude-mythos-preview","claude-opus-4-6"];Xd.Batches=V_;class G_ extends gt{retrieve(e,t={},n){const{betas:r}=t??{};return this._client.get(fe`/v1/models/${e}`,{...n,headers:K([{...(r==null?void 0:r.toString())!=null?{"anthropic-beta":r==null?void 0:r.toString()}:void 0},n==null?void 0:n.headers])})}list(e={},t){const{betas:n,...r}=e??{};return this._client.getAPIList("/v1/models",lo,{query:r,...t,headers:K([{...(n==null?void 0:n.toString())!=null?{"anthropic-beta":n==null?void 0:n.toString()}:void 0},t==null?void 0:t.headers])})}}var Qh,Yd,Uc,W_;const QT="\\n\\nHuman:",eA="\\n\\nAssistant:";class Vt{get credentials(){return this._authState.provider}constructor({baseURL:e=ct("ANTHROPIC_BASE_URL"),apiKey:t,authToken:n,webhookKey:r=ct("ANTHROPIC_WEBHOOK_SIGNING_KEY")??null,...s}={}){if(Qh.add(this),this._requestAuthFlags=new WeakMap,Uc.set(this,void 0),t===void 0&&(t=s.profile!=null?null:ct("ANTHROPIC_API_KEY")??null),n===void 0&&(n=s.profile!=null?null:ct("ANTHROPIC_AUTH_TOKEN")??null),s.profile!=null&&(s.credentials!=null||s.config!=null))throw new TypeError("Pass at most one of `profile`, `credentials`, or `config`.");const a={apiKey:t,authToken:n,webhookKey:r,...s,baseURL:e||"https://api.anthropic.com"};if(!a.dangerouslyAllowBrowser&&lE())throw new Fe(`It looks like you're running in a browser-like environment.

This is disabled by default, as it risks exposing your secret API credentials to attackers.
If you understand the risks and have appropriate mitigations in place,
you can set the \`dangerouslyAllowBrowser\` option to \`true\`, e.g.,

new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
`);this.baseURL=a.baseURL,this._baseURLIsExplicit=s.__baseURLIsExplicit??!!e,this.timeout=a.timeout??Yd.DEFAULT_TIMEOUT,this.logger=a.logger??console,this.logLevel=Zc,this.logLevel=qh(a.logLevel,"ClientOptions.logLevel",St(this))??qh(ct("ANTHROPIC_LOG"),"process.env['ANTHROPIC_LOG']",St(this))??Zc,this.fetchOptions=a.fetchOptions,this.maxRetries=a.maxRetries??2,this.fetch=a.fetch??fE(),re(this,Uc,mE),this.middleware=[...a.middleware??[]];const o=ct("ANTHROPIC_CUSTOM_HEADERS");if(o){const l={};for(const u of o.split(`
`)){const d=u.indexOf(":");d>=0&&(l[u.substring(0,d).trim()]=u.substring(d+1).trim())}a.defaultHeaders={...l,...a.defaultHeaders}}const c=s.__auth;if(delete a.__auth,delete a.__baseURLIsExplicit,this._options=a,this.apiKey=typeof t=="string"?t:null,this.authToken=n,this.webhookKey=r,c)this._authState=c,!this._baseURLIsExplicit&&c.baseURL&&(this.baseURL=c.baseURL);else if(this._authState={provider:null,tokenCache:null,resolution:null,error:null,extraHeaders:{}},this.apiKey==null&&this.authToken==null){const l=a.credentials??null;if(l)this._authState.provider=l,this._authState.tokenCache=this._makeTokenCache(l);else if(a.config!=null){const u=r_(a.config,this._credentialResolverOptions());this._authState.provider=u.provider,this._authState.tokenCache=this._makeTokenCache(u.provider),this._authState.extraHeaders=u.extraHeaders,this._applyCredentialBaseURL(u.baseURL)}else a.profile!=null?this._authState.resolution=this._resolveDefaultCredentials(a.profile):this._authState.resolution=this._resolveDefaultCredentials()}}_applyCredentialBaseURL(e){if(!e)return;const t=e.replace(/\/+$/,"");this._authState.baseURL=t,this._baseURLIsExplicit||(this.baseURL=t)}_credentialResolverOptions(){return{baseURL:this.baseURL,fetch:this._credentialsFetch(),userAgent:this.getUserAgent(),onCacheWriteError:e=>{St(this).debug("credential cache write failed (best-effort)",e)},onSafetyWarning:e=>{St(this).warn(e)}}}_credentialsFetch(){return y0(this.fetch,this.middleware,void 0,this)}_makeTokenCache(e){return new IE(e,t=>{St(this).debug("advisory token refresh failed; serving cached token",t)})}withOptions(e){const t="credentials"in e||"config"in e||"profile"in e,n="apiKey"in e||"authToken"in e||t,r={...this._options,...this._baseURLIsExplicit?{baseURL:this.baseURL}:{},maxRetries:this.maxRetries,timeout:this.timeout,logger:this.logger,logLevel:this.logLevel,fetch:this.fetch,fetchOptions:this.fetchOptions,middleware:this.middleware,apiKey:this.apiKey,authToken:this.authToken,webhookKey:this.webhookKey,credentials:this.credentials,...t?{credentials:void 0,config:void 0,profile:void 0}:{},...e,__auth:n?void 0:this._authState,__baseURLIsExplicit:"baseURL"in e?!0:this._baseURLIsExplicit};return new this.constructor(r)}async _resolveDefaultCredentials(e){try{const t=await GE(this._credentialResolverOptions(),e);if(t)this._authState.provider=t.provider,this._authState.tokenCache=this._makeTokenCache(t.provider),this._authState.extraHeaders=t.extraHeaders,this._applyCredentialBaseURL(t.baseURL);else if(e!=null)throw new Fe(`Profile "${e}" could not be resolved (no <config_dir>/configs/${e}.json found).`)}catch(t){this._authState.error=t}finally{this._authState.resolution=null}}defaultQuery(){return this._options.defaultQuery}validateHeaders({values:e,nulls:t}){if(!(e.get("x-api-key")||e.get("authorization"))){if(this._authState.error)throw this._authState.error;if(!(this._authState.tokenCache||this._authState.resolution)&&!(this.apiKey&&e.get("x-api-key"))&&!t.has("x-api-key")&&!(this.authToken&&e.get("authorization"))&&!t.has("authorization"))throw new Error('Could not resolve authentication method. Expected one of apiKey, authToken, credentials, config, or profile to be set. Or for one of the "X-Api-Key" or "Authorization" headers to be explicitly omitted')}}_authFlags(e){let t=this._requestAuthFlags.get(e);return t||(t={usedTokenCache:!1,didRefreshFor401:!1},this._requestAuthFlags.set(e,t)),t}async authHeaders(e){if(this._authState.resolution&&await this._authState.resolution,!this._authState.error){if(this._authState.tokenCache&&this.apiKey==null){const t=await this._authState.tokenCache.getToken();return this._authFlags(e).usedTokenCache=!0,K([{Authorization:`Bearer ${t}`}])}return K([await this.apiKeyAuth(e),await this.bearerAuth(e)])}}async apiKeyAuth(e){if(this.apiKey!=null)return K([{"X-Api-Key":this.apiKey}])}async bearerAuth(e){if(this.authToken!=null)return K([{Authorization:`Bearer ${this.authToken}`}])}stringifyQuery(e){return ME(e)}getUserAgent(){return`${this.constructor.name}/JS ${Zi}`}defaultIdempotencyKey(){return`stainless-node-retry-${Yc()}`}makeStatusError(e,t,n,r){return Zt.generate(e,t,n,r)}buildURL(e,t,n){const r=!P(this,Qh,"m",W_).call(this)&&n||this.baseURL,s=aE(e)?new URL(e):new URL(r+(r.endsWith("/")&&e.startsWith("/")?e.slice(1):e)),a=this.defaultQuery(),o=Object.fromEntries(s.searchParams);return(!i0(a)||!i0(o))&&(t={...o,...a,...t}),typeof t=="object"&&t&&!Array.isArray(t)&&(s.search=this.stringifyQuery(t)),s.toString()}_calculateNonstreamingTimeout(e){if(3600*e/128e3>600)throw new Fe("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#streaming-responses for more details");return 600*1e3}async prepareOptions(e){}async prepareRequest(e,{url:t,options:n}){var r;if(this._authState.tokenCache&&this.apiKey==null){const s=e.headers instanceof Headers?e.headers:new Headers(e.headers);for(const[o,c]of Object.entries(this._authState.extraHeaders))s.has(o)||s.set(o,c);const a=(r=s.get("anthropic-beta"))==null?void 0:r.split(",").map(o=>o.trim());a!=null&&a.includes(Jc)||s.append("anthropic-beta",Jc),e.headers=s}}backendMiddleware(){return[]}get(e,t){return this.methodRequest("get",e,t)}post(e,t){return this.methodRequest("post",e,t)}patch(e,t){return this.methodRequest("patch",e,t)}put(e,t){return this.methodRequest("put",e,t)}delete(e,t){return this.methodRequest("delete",e,t)}methodRequest(e,t,n){return this.request(Promise.resolve(n).then(r=>({method:e,path:t,...r})))}request(e,t=null){return new _l(this,this.makeRequest(e,t,void 0))}async makeRequest(e,t,n){var m,v,x;const r=await e,s=r.maxRetries??this.maxRetries;t==null&&(t=s,this._requestAuthFlags.delete(r)),await this.prepareOptions(r);const{req:a,url:o,timeout:c}=await this.buildRequest(r,{retryCount:s-t}),l="log_"+(Math.random()*(1<<24)|0).toString(16).padStart(6,"0"),u=n===void 0?"":`, retryOf: ${n}`,d=Date.now();if((m=r.signal)!=null&&m.aborted)throw new ai;const f=new AbortController,h=await this.fetchWithTimeout(o,a,c,f,r,{requestLogID:l,retryOfRequestLogID:n}).catch(Kc),g=Date.now();if(h instanceof globalThis.Error){const w=`retrying, ${t} attempts remaining`;if((v=r.signal)!=null&&v.aborted)throw new ai;const M=Xs(h)||/timed? ?out/i.test(String(h)+("cause"in h?String(h.cause):"")),E=this.middleware.length>0||!!((x=r.middleware)!=null&&x.length)||this.backendMiddleware().length>0;if(E&&!M&&!ZE(h))throw St(this).info(`[${l}] middleware error (not retryable)`),St(this).debug(`[${l}] middleware error (not retryable)`,Ki({retryOfRequestLogID:n,url:o,durationMs:g-d,message:h.message})),h;if(t)return St(this).info(`[${l}] connection ${M?"timed out":"failed"} - ${w}`),St(this).debug(`[${l}] connection ${M?"timed out":"failed"} (${w})`,Ki({retryOfRequestLogID:n,url:o,durationMs:g-d,message:h.message})),this.retryRequest(r,t,n??l);throw St(this).info(`[${l}] connection ${M?"timed out":"failed"} - error; no more retries left`),St(this).debug(`[${l}] connection ${M?"timed out":"failed"} (error; no more retries left)`,Ki({retryOfRequestLogID:n,url:o,durationMs:g-d,message:h.message})),M?new Dg:E&&!o_(h)?h:new oo({cause:h})}const _=[...h.headers.entries()].filter(([w])=>w==="request-id").map(([w,M])=>", "+w+": "+JSON.stringify(M)).join(""),p=`[${l}${u}${_}] ${a.method} ${o} ${h.ok?"succeeded":"failed"} with status ${h.status} in ${g-d}ms`;if(!h.ok){const w=await this.shouldRetry(h,r);if(t&&w){const y=`retrying, ${t} attempts remaining`;return await pE(h.body),St(this).info(`${p} - ${y}`),St(this).debug(`[${l}] response error (${y})`,Ki({retryOfRequestLogID:n,url:h.url,status:h.status,headers:h.headers,durationMs:g-d})),this.retryRequest(r,t,n??l,h.headers)}const M=w?"error; no more retries left":"error; not retryable";St(this).info(`${p} - ${M}`);const E=await h.text().catch(y=>Kc(y).message),T=Vg(E),A=T?void 0:E;throw St(this).debug(`[${l}] response error (${M})`,Ki({retryOfRequestLogID:n,url:h.url,status:h.status,headers:h.headers,message:A,durationMs:Date.now()-d})),this.makeStatusError(h.status,T,A,h.headers)}return St(this).info(p),St(this).debug(`[${l}] response start`,Ki({retryOfRequestLogID:n,url:h.url,status:h.status,headers:h.headers,durationMs:g-d})),{response:h,options:r,controller:f,requestLogID:l,retryOfRequestLogID:n,startTime:d}}getAPIList(e,t,n){return this.requestAPIList(t,n&&"then"in n?n.then(r=>({method:"get",path:e,...r})):{method:"get",path:e,...n})}requestAPIList(e,t){const n=this.makeRequest(t,null,void 0);return new tT(this,n,e)}async fetchWithTimeout(e,t,n,r,s,a){const{signal:o,method:c,...l}=t||{},u=this._makeAbort(r);o&&o.addEventListener("abort",u,{once:!0});const d=globalThis.ReadableStream&&l.body instanceof globalThis.ReadableStream||typeof l.body=="object"&&l.body!==null&&Symbol.asyncIterator in l.body,f={signal:r.signal,...d?{duplex:"half"}:{},method:"GET",...l};c&&(f.method=c.toUpperCase());const h=this.fetch,g=async(x,w)=>{const M=setTimeout(u,n);try{return await h.call(void 0,x,w)}finally{clearTimeout(M)}},_=s===void 0?g:(async(x,w={})=>{const M=typeof x=="string"?x:x instanceof URL?x.href:x.url;return w.headers=w.headers instanceof Headers?w.headers:new Headers(w.headers),await this.prepareRequest(w,{url:M,options:s}),a&&St(this).debug(`[${a.requestLogID}] sending request`,Ki({retryOfRequestLogID:a.retryOfRequestLogID,method:w.method,url:M,options:s,headers:w.headers})),g(x,w)}),p=s==null?void 0:s.middleware,m=this.backendMiddleware(),v=p!=null&&p.length||m.length?[...this.middleware,...p??[],...m]:this.middleware;return await y0(_,v,s,this)(e,f)}async shouldRetry(e,t){const n=this._authFlags(t);if(e.status===401&&this._authState.tokenCache&&n.usedTokenCache&&!n.didRefreshFor401)return n.didRefreshFor401=!0,this._authState.tokenCache.invalidate(),!0;const r=e.headers.get("x-should-retry");return r==="true"?!0:r==="false"?!1:e.status===408||e.status===409||e.status===429||e.status>=500}async retryRequest(e,t,n,r){let s;const a=r==null?void 0:r.get("retry-after-ms");if(a){const c=parseFloat(a);Number.isNaN(c)||(s=c)}const o=r==null?void 0:r.get("retry-after");if(o&&!s){const c=parseFloat(o);Number.isNaN(c)?s=Date.parse(o)-Date.now():s=c*1e3}if(s===void 0){const c=e.maxRetries??this.maxRetries;s=this.calculateDefaultRetryTimeoutMillis(t,c)}return await Fr(s),this.makeRequest(e,t-1,n)}calculateDefaultRetryTimeoutMillis(e,t){const s=t-e,a=Math.min(.5*Math.pow(2,s),8),o=1-Math.random()*.25;return a*o*1e3}calculateNonstreamingTimeout(e,t){if(36e5*e/128e3>6e5||t!=null&&e>t)throw new Fe("Streaming is required for operations that may take longer than 10 minutes. See https://github.com/anthropics/anthropic-sdk-typescript#long-requests for more details");return 6e5}async buildRequest(e,{retryCount:t=0}={}){const n={...e},{method:r,path:s,query:a,defaultBaseURL:o}=n;this._authState.resolution&&await this._authState.resolution,!this._baseURLIsExplicit&&this._authState.baseURL&&this.baseURL!==this._authState.baseURL&&(this.baseURL=this._authState.baseURL);const c=this.buildURL(s,a,o);"timeout"in n&&cE("timeout",n.timeout),n.timeout=n.timeout??this.timeout;const{bodyHeaders:l,body:u}=this.buildBody({options:n}),d=await this.buildHeaders({options:e,method:r,bodyHeaders:l,retryCount:t});return{req:{method:r,headers:d,...n.signal&&{signal:n.signal},...globalThis.ReadableStream&&u instanceof globalThis.ReadableStream&&{duplex:"half"},...u&&{body:u},...this.fetchOptions??{},...n.fetchOptions??{}},url:c,timeout:n.timeout}}async buildHeaders({options:e,method:t,bodyHeaders:n,retryCount:r}){let s={};this.idempotencyHeader&&t!=="get"&&(e.idempotencyKey||(e.idempotencyKey=this.defaultIdempotencyKey()),s[this.idempotencyHeader]=e.idempotencyKey);const a=K([s,{Accept:"application/json","User-Agent":this.getUserAgent(),"X-Stainless-Retry-Count":String(r),...e.timeout?{"X-Stainless-Timeout":String(Math.trunc(e.timeout/1e3))}:{},...Cd(),...this._options.dangerouslyAllowBrowser?{"anthropic-dangerous-direct-browser-access":"true"}:void 0,"anthropic-version":"2023-06-01"},await this.authHeaders(e),this._options.defaultHeaders,n,e.headers]);return this.validateHeaders(a),a.values}_makeAbort(e){return()=>e.abort()}buildBody({options:{body:e,headers:t}}){if(!e)return{bodyHeaders:void 0,body:void 0};const n=K([t]);return ArrayBuffer.isView(e)||e instanceof ArrayBuffer||e instanceof DataView||typeof e=="string"&&n.values.has("content-type")||globalThis.Blob&&e instanceof globalThis.Blob||e instanceof FormData||e instanceof URLSearchParams||globalThis.ReadableStream&&e instanceof globalThis.ReadableStream?{bodyHeaders:void 0,body:e}:typeof e=="object"&&(Symbol.asyncIterator in e||Symbol.iterator in e&&"next"in e&&typeof e.next=="function")?{bodyHeaders:void 0,body:Wg(e)}:typeof e=="object"&&n.values.get("content-type")==="application/x-www-form-urlencoded"?{bodyHeaders:{"content-type":"application/x-www-form-urlencoded"},body:this.stringifyQuery(e)}:P(this,Uc,"f").call(this,{body:e,headers:n})}}Yd=Vt,Uc=new WeakMap,Qh=new WeakSet,W_=function(){return this.baseURL!=="https://api.anthropic.com"};Vt.Anthropic=Yd;Vt.HUMAN_PROMPT=QT;Vt.AI_PROMPT=eA;Vt.DEFAULT_TIMEOUT=6e5;Vt.AnthropicError=Fe;Vt.APIError=Zt;Vt.APIConnectionError=oo;Vt.APIConnectionTimeoutError=Dg;Vt.APIUserAbortError=ai;Vt.NotFoundError=zg;Vt.ConflictError=Og;Vt.RateLimitError=Bg;Vt.BadRequestError=Ug;Vt.AuthenticationError=Ng;Vt.InternalServerError=Hg;Vt.PermissionDeniedError=kg;Vt.UnprocessableEntityError=Fg;Vt.toFile=cT;class Ii extends Vt{constructor(){super(...arguments),this.completions=new F_(this),this.messages=new Xd(this),this.models=new G_(this),this.beta=new xn(this)}}Ii.Completions=F_;Ii.Messages=Xd;Ii.Models=G_;Ii.Beta=xn;new TextEncoder;const to="crownbound_sage_key",tA=["str","agi","wis","inf"],nA=`A player in a medieval life-RPG completed a real-world deed and logged it as a quest. Classify the deed into exactly one of four virtues:
str — Strength: lifting, gym work, physical labor, endurance
agi — Agility: sport played for speed and coordination (tennis, running, climbing), mobility
wis — Wisdom: learning, reading, studying, writing, planning, personal finance
inf — Influence: business, clients, outreach, networking, leadership, family and social bonds
Reply with exactly one word: str, agi, wis, or inf.`;function ed(){return!!localStorage.getItem(to)}function $_(){return localStorage.getItem(to)}function X0(i){i?localStorage.setItem(to,i):localStorage.removeItem(to)}async function q_(i){var t;const e=localStorage.getItem(to);if(!e)return{virtue:null,keyTrouble:!1};try{const s=(t=(await new Ii({apiKey:e,dangerouslyAllowBrowser:!0,timeout:me.sage.timeoutMs,maxRetries:0}).messages.create({model:me.sage.model,max_tokens:me.sage.maxTokens,system:nA,messages:[{role:"user",content:i}]})).content)==null?void 0:t[0],a=(s==null?void 0:s.type)==="text"?s.text.trim().toLowerCase():"";return{virtue:tA.includes(a)?a:null,keyTrouble:!1}}catch(n){return console.warn("[sage] judgment failed:",n),{virtue:null,keyTrouble:n instanceof Ii.AuthenticationError||n instanceof Ii.PermissionDeniedError||n instanceof Ii.BadRequestError&&/credit|billing/i.test(n.message)}}}let vs,Y0="",K0=0;function rt(i,e=""){vs||(vs=document.getElementById("toasts"));const t=performance.now();if(i===Y0&&t-K0<2500)return;Y0=i,K0=t;const n=document.createElement("div");for(n.className="toast"+(e?` toast-${e}`:""),n.textContent=i,vs.appendChild(n);vs.children.length>4;)vs.removeChild(vs.firstChild);n.addEventListener("animationend",()=>n.remove())}let qt=null,qa=null;function iA(){return qt||(qt=new(window.AudioContext||window.webkitAudioContext),qa=qt.createGain(),qa.gain.value=.16,qa.connect(qt.destination)),qt.state==="suspended"&&qt.resume(),qt}function rA(){const i=()=>iA();window.addEventListener("pointerdown",i,{once:!0}),window.addEventListener("keydown",i,{once:!0})}function Sn({freq:i=440,to:e=i,type:t="sine",dur:n=.1,gain:r=.5,when:s=0}){if(!qt)return;const a=qt.currentTime+s,o=qt.createOscillator(),c=qt.createGain();o.type=t,o.frequency.setValueAtTime(i,a),o.frequency.exponentialRampToValueAtTime(Math.max(e,1),a+n),c.gain.setValueAtTime(r,a),c.gain.exponentialRampToValueAtTime(.001,a+n),o.connect(c).connect(qa),o.start(a),o.stop(a+n+.02)}function xc({dur:i=.08,gain:e=.3,freq:t=1200,when:n=0}){if(!qt)return;const r=qt.currentTime+n,s=Math.floor(qt.sampleRate*i),a=qt.createBuffer(1,s,qt.sampleRate),o=a.getChannelData(0);for(let d=0;d<s;d++)o[d]=(Math.random()*2-1)*(1-d/s);const c=qt.createBufferSource();c.buffer=a;const l=qt.createBiquadFilter();l.type="bandpass",l.frequency.value=t;const u=qt.createGain();u.gain.value=e,c.connect(l).connect(u).connect(qa),c.start(r)}const nn={swing:()=>xc({dur:.09,gain:.25,freq:900}),thud:()=>{Sn({freq:120,to:55,type:"square",dur:.08,gain:.4}),xc({dur:.05,gain:.2,freq:400})},squeak:()=>Sn({freq:950,to:480,type:"triangle",dur:.12,gain:.3}),ratDie:()=>{Sn({freq:700,to:180,type:"triangle",dur:.25,gain:.3})},coin:()=>{Sn({freq:880,to:880,dur:.07,gain:.25}),Sn({freq:1320,to:1320,dur:.12,gain:.2,when:.06})},questDone:()=>{Sn({freq:523,dur:.12,gain:.3}),Sn({freq:659,dur:.12,gain:.3,when:.1}),Sn({freq:784,dur:.2,gain:.3,when:.2})},levelUp:()=>{Sn({freq:392,dur:.1,gain:.3}),Sn({freq:523,dur:.1,gain:.3,when:.09}),Sn({freq:659,dur:.1,gain:.3,when:.18}),Sn({freq:784,dur:.25,gain:.35,when:.27})},page:()=>xc({dur:.15,gain:.12,freq:2400}),creak:()=>{Sn({freq:160,to:70,type:"sawtooth",dur:.3,gain:.12}),xc({dur:.12,gain:.08,freq:600})},hurt:()=>Sn({freq:200,to:90,type:"sawtooth",dur:.15,gain:.3})};let Xa,Kd,jd,Jd,Zd,Qd,ef,Ri,$n,X_,qn,td,Y_,no=null,tf=()=>{},il={isWounded:()=>!1,onPurchase:()=>{}},Cs=null,Ls=null,Nc=0,rl=!1,Ar=null;const La={daily:"Daily Quest",weekly:"Weekly Bounty",monthly:"Monthly Campaign"},sA={daily:"The day is won. The fire grows.",weekly:"A bounty well earned.",monthly:"A campaign concluded in glory."},aA={daily:B2,weekly:V2,monthly:W2},j0={daily:H2,weekly:G2,monthly:$2},Jn=i=>String(i).replace(/[&<>"']/g,e=>`&#${e.charCodeAt(0)};`);function K_(){const i=_n();if(i.coronationAt){const t=new Date(i.coronationAt);return`The realm hath its King — crowned ${t.getDate()} ${Ml[t.getMonth()]} ${t.getFullYear()}.`}const e=me.ranks.find(t=>t.title==="King").totalLevels;return`The crown is not given — it is earned. ${Tg()} of ${e} virtue levels won.`}function Vu({kind:i,q:e,sub:t,placeholder:n}){if(!e.text)return`
      <div class="quest-block" data-kind="${i}">
        <h2>${La[i]} <span class="sub">${t}</span></h2>
        <p class="muted">${n}</p>
        <div class="row">
          <input type="text" class="grow" data-input maxlength="120"
            placeholder="Write it in your own words..." />
          <button class="primary" data-post>Post</button>
        </div>
      </div>`;if(!e.completed&&Ls===i)return`
      <div class="quest-block" data-kind="${i}">
        <h2>${La[i]} <span class="sub">${t}</span></h2>
        <div class="quest-text">“${Jn(e.text)}”</div>
        <p class="muted">The sage reads thy deed…</p>
        <div class="row right"><button data-sage-cancel>Choose thyself</button></div>
      </div>`;if(!e.completed&&Cs===i){const r=Object.entries(Or).map(([s,a])=>`<button data-pick="${s}">${a}</button>`).join("");return`
      <div class="quest-block" data-kind="${i}">
        <h2>${La[i]} <span class="sub">${t}</span></h2>
        <div class="quest-text">“${Jn(e.text)}”</div>
        <p class="muted">Which virtue did this deed train?</p>
        <div class="stat-pick">${r}</div>
      </div>`}return e.completed?`
    <div class="quest-block" data-kind="${i}">
      <div class="stamp">Done</div>
      <h2>${La[i]}</h2>
      <div class="quest-text">“${Jn(e.text)}”</div>
      <p class="muted">${sA[i]}</p>
    </div>`:`
      <div class="quest-block" data-kind="${i}">
        <h2>${La[i]} <span class="sub">${t}</span></h2>
        <div class="quest-text">“${Jn(e.text)}”</div>
        <div class="row right"><button class="primary" data-complete>Mark Complete</button></div>
      </div>`}function di(){const i=_n(),e=i.quests.epic,t=me.rewards,n=!e.text||rl?`<div class="row">
          <input type="text" class="grow" data-epic-input maxlength="160"
            value="${Jn(e.text)}" placeholder="The one great deed of this year..." />
          <button class="primary" data-epic-save>Inscribe</button>
        </div>`:`<div class="quest-text">“${Jn(e.text)}”</div>
        <div class="row">
          <div class="xpbar grow" title="${e.progressPct}%"><div style="width:${e.progressPct}%"></div></div>
          <span>${e.progressPct}%</span>
        </div>
        <div class="row">
          <input type="number" data-epic-pct min="0" max="100" value="${e.progressPct}" style="width:90px" />
          <button data-epic-update>Update Progress</button>
          <span class="grow"></span>
          <button data-epic-edit>Rewrite</button>
        </div>`;Ri.innerHTML=`
    ${Vu({kind:"daily",q:i.quests.daily,sub:`+${t.daily.xp} XP · +${t.daily.coins} coins · refills stamina`,placeholder:"What real deed will you do today? Lift, learn, build, reach out..."})}
    ${Vu({kind:"weekly",q:i.quests.weekly,sub:`+${t.weekly.xp} XP · +${t.weekly.coins} coins · resets Monday`,placeholder:"One greater labor for this week."})}
    ${Vu({kind:"monthly",q:i.quests.monthly,sub:`+${t.monthly.xp} XP · +${t.monthly.coins} coins · resets the 1st`,placeholder:"One mighty campaign for this moon."})}
    <div class="quest-block">
      <h2>The Epic Quest <span class="sub">the year&#8217;s great work</span></h2>
      ${n}
      <p class="countdown" style="margin-top:10px">${K_()}</p>
    </div>`,oA()}function J0(i,e){rt(`+${e.xp} ${i} XP · +${e.coins} coins`,"gold"),nn.questDone();for(const t of e.levelUps)rt(`${i} rises to level ${t}!`,"gold"),nn.levelUp()}function oA(){var e,t,n,r,s;for(const a of Ri.querySelectorAll(".quest-block[data-kind]")){const o=a.dataset.kind,c=a.querySelector("[data-input]"),l=a.querySelector("[data-post]");if(l){const u=()=>{c.value.trim()&&(aA[o](c.value),di())};l.addEventListener("click",u),c.addEventListener("keydown",d=>{d.key==="Enter"&&u(),d.stopPropagation()})}(e=a.querySelector("[data-complete]"))==null||e.addEventListener("click",()=>{if(!ed()){Cs=o,di();return}Ls=o;const u=++Nc;di(),q_(_n().quests[o].text).then(({virtue:d,keyTrouble:f})=>{if(!(u!==Nc||Ls!==o)){if(Ls=null,d){const h=j0[o](d);h&&(rt(`The sage judges this deed ${Or[d]}.`,""),J0(Or[d],h))}else rt(f?"The sage rejects thy key — see him in the Tome.":"The sage is silent. Choose thyself.","grim"),Cs=o;di()}})}),(t=a.querySelector("[data-sage-cancel]"))==null||t.addEventListener("click",()=>{Nc+=1,Ls=null,Cs=o,di()});for(const u of a.querySelectorAll("[data-pick]"))u.addEventListener("click",()=>{const d=u.dataset.pick,f=j0[o](d);Cs=null,f&&J0(Or[d],f),di()})}const i=Ri.querySelector("[data-epic-input]");i&&(i.addEventListener("keydown",a=>a.stopPropagation()),Ri.querySelector("[data-epic-save]").addEventListener("click",()=>{i.value.trim()&&(q2(i.value),rl=!1,rt("The Epic Quest is inscribed.","gold"),di())})),(n=Ri.querySelector("[data-epic-edit]"))==null||n.addEventListener("click",()=>{rl=!0,di()}),(r=Ri.querySelector("[data-epic-update]"))==null||r.addEventListener("click",()=>{const a=Number(Ri.querySelector("[data-epic-pct]").value);X2(a),rt(`The great work stands at ${_n().quests.epic.progressPct}%.`,"gold"),di()}),(s=Ri.querySelector("[data-epic-pct]"))==null||s.addEventListener("keydown",a=>a.stopPropagation())}const Ml=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function nf(i){const[e,t,n]=i.split("-").map(Number);return`${n} ${Ml[t-1]} ’${String(e).slice(2)}`}function cA(i){return i.length?[...i].reverse().map(e=>{const t=e.type==="epic"?`the great work · ${e.progressPct}%`:`${Or[e.statTrained]??"—"} · ${e.type}`;return`<div class="deed">
        <span class="deed-date">${nf(e.date)}</span>
        <span class="deed-text">“${Jn(e.questText)}”</span>
        <span class="deed-tag">${t}</span>
      </div>`}).join(""):'<p class="muted">No deeds yet writ. The board awaits.</p>'}function lA(i){return[...i].reverse().map(e=>`<div class="journal-entry">
        <div class="journal-week">Week of ${nf(e.week)}</div>
        <p class="journal-prose">${Jn(e.text)}</p>
      </div>`).join("")}function Rr(){var r,s,a,o,c,l;const i=_n(),e=me.ranks.map(u=>`<span class="rank-chip${u.title===i.rank?" current":""}">${u.title}</span>`).join(""),t=Object.entries(Or).map(([u,d])=>{const f=i.stats[u],h=F2(u);return`
        <div class="stat-row">
          <span>${d}</span><span class="lvl">Lv ${f.level}</span>
          <div class="xpbar" title="${f.xp} / ${h} XP"><div style="width:${f.xp/h*100}%"></div></div>
        </div>`}).join("");$n.innerHTML=`
    <div class="sheet-section">
      <div class="rank-ladder">${e}</div>
    </div>
    <div class="sheet-section">
      <p class="countdown"><span class="big">${K_()}</span></p>
    </div>
    <div class="sheet-section">
      <h2>Virtues</h2>
      ${t}
    </div>
    <div class="sheet-section">
      <h2>Wealth</h2>
      <div class="kv"><span>Coins (quest spoils)</span><span class="v">${i.coins}</span></div>
      <p class="muted">Thy true hoard is counted at the Exchequer&#8217;s table.</p>
    </div>
    <div class="sheet-section">
      <h2>The Chronicle</h2>
      <div class="kv"><span>Streak</span><span class="v">${i.streak.current} days (best ${i.streak.best})</span></div>
      <div class="kv"><span>Days walked this land</span><span class="v">${i.daysPlayed}</span></div>
      <div class="kv"><span>Deeds recorded</span><span class="v">${i.history.length}</span></div>
      <div class="deed-list">${cA(i.history)}</div>
    </div>
    <div class="sheet-section">
      <h2>The Weekly Chronicle</h2>
      ${i.chronicle.length?`<div class="deed-list journal">${lA(i.chronicle)}</div>`:`<p class="muted">${ed()?"The chronicler has yet to take up his pen. He writes of each week once it has ended.":"Appoint the sage (below) and the chronicler will write of thy weeks in his own hand."}</p>`}
    </div>
    <div class="sheet-section">
      <h2>The Scribe</h2>
      <p class="muted">Thy chronicle lives only in this browser. Keep a copy against misfortune.</p>
      ${Ar?`<p>Replace thy current chronicle with “${Jn(Ar.name)}”? All present progress yields to the copy.</p>
            <div class="row">
              <button class="primary" data-import-confirm>Restore the copy</button>
              <button data-import-cancel>Keep mine</button>
            </div>`:`<div class="row">
              <button data-export>Download a copy</button>
              <button data-import-pick>Restore from a copy</button>
              <input type="file" accept=".json,application/json" data-import-file class="hidden" />
            </div>`}
    </div>
    <div class="sheet-section">
      <h2>The Reins</h2>
      <p class="muted">How sharply the camera answers thy mouse. Kept to this browser, outside thy save.</p>
      <div class="stat-pick">
        ${me.mouse.feels.map(u=>`<button data-feel="${u.id}"${u.id===$p()?' class="chosen"':""}>${u.name}</button>`).join("")}
      </div>
    </div>
    <div class="sheet-section">
      <h2>The Sage</h2>
      ${ed()?`<p class="muted">The sage is in thy service — he names the virtue of each completed
              deed himself. The manual choice returns whenever he falters.</p>
            <div class="row right"><button data-sage-clear>Dismiss the sage</button></div>`:`<p class="muted">Grant the sage a key (console.anthropic.com) and he will name the
              virtue of each completed deed. The key stays in this browser, outside thy save.</p>
            <div class="row">
              <input type="password" class="grow" data-sage-key placeholder="sk-ant-..." />
              <button data-sage-set>Appoint</button>
            </div>`}
    </div>`,(r=$n.querySelector("[data-export]"))==null||r.addEventListener("click",()=>{const u=new Blob([wg()],{type:"application/json"}),d=document.createElement("a");d.href=URL.createObjectURL(u),d.download=`crownbound-save-${rn()}.json`,d.click(),URL.revokeObjectURL(d.href),rt("The scribe copies thy chronicle.","gold")});const n=$n.querySelector("[data-import-file]");(s=$n.querySelector("[data-import-pick]"))==null||s.addEventListener("click",()=>n.click()),n==null||n.addEventListener("change",async()=>{const u=n.files[0];if(!u)return;const d=await u.text();if(!U2(d)){rt("That scroll is no chronicle of this realm.","grim"),n.value="";return}Ar={name:u.name,text:d},Rr()}),(a=$n.querySelector("[data-import-confirm]"))==null||a.addEventListener("click",()=>{Sg(Ar.text)?(rt("The chronicle is restored. The realm awakens anew.","gold"),setTimeout(()=>location.reload(),900)):(rt("That scroll is no chronicle of this realm.","grim"),Ar=null,Rr())}),(o=$n.querySelector("[data-import-cancel]"))==null||o.addEventListener("click",()=>{Ar=null,Rr()});for(const u of $n.querySelectorAll("[data-feel]"))u.addEventListener("click",()=>{u.dataset.feel!==$p()&&(E2(u.dataset.feel),rt(`The reins are set ${u.textContent.toLowerCase()}.`,""),Rr())});(c=$n.querySelector("[data-sage-set]"))==null||c.addEventListener("click",()=>{const u=$n.querySelector("[data-sage-key]").value.trim();u&&(X0(u),rt("The sage enters thy service.","gold"),Rr())}),(l=$n.querySelector("[data-sage-clear]"))==null||l.addEventListener("click",()=>{X0(null),rt("The sage departs the village.",""),Rr()});for(const u of $n.querySelectorAll("input"))u.addEventListener("keydown",d=>d.stopPropagation())}const uA=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function hA(i){const e=new Date(i);return`${uA[e.getDay()]} ${e.getDate()} ${Ml[e.getMonth()]}`}function Z0(i){return new Date(i).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}const dA={dawn:["rose with the dawn","tag-gold"],late:["past the bell","tag-grim"],unwitnessed:["unwitnessed",""]};function fA(){const e=_n().sleep.log.slice(-7).reverse(),t=e.filter(r=>r.verdict==="dawn").length,n=e.map(r=>{const[s,a]=dA[r.verdict]??["—",""];let o=`abed ${Z0(r.bed)}`;if(r.wake){const c=Math.max(0,Math.round((new Date(r.wake)-new Date(r.bed))/6e4));o+=` · rose ${Z0(r.wake)} · ${Math.floor(c/60)}h ${String(c%60).padStart(2,"0")}m`}else o+=" · the morning went unmarked";return`<div class="deed">
        <span class="deed-date">${hA(r.wake??r.bed)}</span>
        <span class="deed-text">${o}</span>
        <span class="deed-tag ${a}">${s}</span>
      </div>`}).join("");X_.innerHTML=`
    <div class="sheet-section">
      <p class="muted">Sleep in thy cot to mark the night; return with the dawn to mark the morning.
      Seven hours abed and back by ${me.sleep.wakeByHour} o&#8217;clock earns the Well-Rested boon.</p>
      ${e.length?`<div class="kv"><span>This week</span>
              <span class="v">${t} of ${e.length} night${e.length===1?"":"s"} well-rested</span></div>
            <div class="deed-list">${n}</div>`:`<p class="muted" style="text-align:center; margin-top:14px">No nights yet recorded.
              The cot awaits, and the dawn keeps its own tally.</p>`}
    </div>`}const Q0={fat:["the hoard grew fat","tag-gold"],held:["held the line",""],bled:["the purse bled","tag-grim"],unreckoned:["unreckoned",""]};function em(i){const[e,t]=i.split("-").map(Number);return`${Ml[t-1]} ’${String(e).slice(2)}`}function kc(){var o,c;const i=_n().treasury,e=gl(),t=i.goal>0?`<div class="sheet-section">
          <h2>${i.name?Jn(i.name):"The Hoard"}</h2>
          <div class="kv"><span>True savings</span>
            <span class="v">${i.current.toLocaleString()} / ${i.goal.toLocaleString()}</span></div>
          <div class="xpbar treasury" style="margin:6px 0"><div style="width:${Math.min(100,i.current/i.goal*100)}%"></div></div>
        </div>`:`<div class="sheet-section">
          <h2>The Next Summit</h2>
          <p class="muted">The hoard stands at ${i.current.toLocaleString()} and no summit is raised.
          Name the next hoard and its height.</p>
          <div class="row">
            <input type="text" class="grow" data-s-name maxlength="60" placeholder="Name the hoard..." />
            <input type="number" data-s-goal min="1" placeholder="Goal" style="width:110px" />
            <button class="primary" data-s-set>Raise it</button>
          </div>
        </div>`,n=e?`<div class="sheet-section">
        <h2>The Reckoning — ${em(e)}</h2>
        <p class="muted">The clerk awaits the month&#8217;s statement.${i.pledge>0?` The pledge stands at ${i.pledge.toLocaleString()} laid in.`:" No pledge stands — set one under Revisions and the months will be judged by it."}</p>
        <div class="row">
          <input type="number" data-r-earned min="0" placeholder="Coin earned" title="All income this month" />
          <input type="number" data-r-spent min="0" placeholder="Coin spent" title="All spending this month" />
        </div>
        <div class="row">
          <input type="number" data-r-saved min="0" placeholder="Laid in the hoard" title="Moved into savings this month" />
          <input type="number" data-r-counted min="0" placeholder="Hoard, counted true" title="What the accounts truly say the total now is" />
          <button class="primary" data-r-file>File</button>
        </div>
      </div>`:`<div class="sheet-section">
        <p class="muted">The month&#8217;s reckoning is filed. The clerk hears the next when the month turns.</p>
      </div>`,r=[...i.rolls].slice(-6).reverse().map(l=>{const[u,d]=Q0[l.verdict]??["—",""],f=l.verdict==="unreckoned"?"no statement was heard":`earned ${l.earned.toLocaleString()} · spent ${l.spent.toLocaleString()} · kept ${(l.earned-l.spent).toLocaleString()} · laid in ${l.saved.toLocaleString()}`;return`<div class="deed">
        <span class="deed-date">${em(l.month)}</span>
        <span class="deed-text">${f}</span>
        <span class="deed-tag ${d}">${u}</span>
      </div>`}).join(""),s=i.rolls.length?`<div class="sheet-section"><h2>The Rolls</h2><div class="deed-list">${r}</div></div>`:"",a=i.conquered.length?`<div class="sheet-section"><h2>Summits Conquered</h2><div class="deed-list">${[...i.conquered].reverse().map(l=>`<div class="deed">
            <span class="deed-date">${nf(l.conqueredAt.slice(0,10))}</span>
            <span class="deed-text">“${Jn(l.name)}”</span>
            <span class="deed-tag tag-gold">${l.goal.toLocaleString()}</span>
          </div>`).join("")}</div></div>`:"";qn.innerHTML=`
    ${t}
    ${n}
    ${s}
    ${a}
    <div class="sheet-section">
      <h2>Revisions</h2>
      <div class="row"><span class="muted grow">The hoard, corrected</span>
        <input type="number" data-t-current min="0" value="${i.current}" style="width:130px" /></div>
      ${i.goal>0?`<div class="row"><span class="muted grow">The summit</span>
              <input type="number" data-t-goal min="1" value="${i.goal}" style="width:130px" /></div>`:""}
      <div class="row"><span class="muted grow">The monthly pledge</span>
        <input type="number" data-t-pledge min="0" value="${i.pledge}" style="width:130px" /></div>
      <div class="row right"><button data-t-set>Set</button></div>
      <p class="muted">The Exchequer keeps thy true hoard — coins of the realm buy nothing here.
      Corrections move no summit; only a filed reckoning conquers one.</p>
    </div>`,(o=qn.querySelector("[data-r-file]"))==null||o.addEventListener("click",()=>{const l=g=>Number(qn.querySelector(g).value),u={earned:l("[data-r-earned]"),spent:l("[data-r-spent]"),saved:l("[data-r-saved]"),counted:l("[data-r-counted]")};if(!Object.values(u).every(g=>Number.isFinite(g)&&g>=0)){rt("The clerk squints — those figures are no figures.","grim");return}const d=Lg(u);if(!d)return;nn.page();const f=d.roll.earned-d.roll.spent,[h]=Q0[d.roll.verdict];rt(d.roll.earned>0?`The roll is entered — ${h}. Of every hundred earned, ${Math.max(0,Math.round(f/d.roll.earned*100))} were kept.`:`The roll is entered — ${h}.`,d.roll.verdict==="fat"?"gold":d.roll.verdict==="bled"?"grim":""),d.conquered&&(nn.levelUp(),rt(`${Jn(d.conquered.name)} — conquered! The hoard stands at ${_n().treasury.current.toLocaleString()}.`,"gold")),kc()}),(c=qn.querySelector("[data-s-set]"))==null||c.addEventListener("click",()=>{const l=qn.querySelector("[data-s-name]").value,u=Number(qn.querySelector("[data-s-goal]").value);!Number.isFinite(u)||u<1||(Ig(l,u),rt("A new summit is raised. The climb resumes.","gold"),kc())}),qn.querySelector("[data-t-set]").addEventListener("click",()=>{const l=Number(qn.querySelector("[data-t-current]").value),u=qn.querySelector("[data-t-goal]"),d=u?Number(u.value):NaN,f=Number(qn.querySelector("[data-t-pledge]").value);Number.isFinite(f)&&Pg(f),Number.isFinite(l)&&j2(l,u&&Number.isFinite(d)&&d>=1?d:i.goal),rt("The Treasury ledger is updated.","gold"),kc()});for(const l of qn.querySelectorAll("input"))l.addEventListener("keydown",u=>u.stopPropagation())}const pA=[["hand","Wares for the Hand"],["home","Wares for the Home"],["comforts","Small Comforts"]];function j_(){const i=_n(),e=n=>me.ranks.findIndex(r=>r.title===n),t=pA.map(([n,r])=>{const s=me.shop.items.filter(a=>a.category===n).map(a=>{const o=a.once&&i.shop.owned.includes(a.id),c=a.minRank&&e(i.rank)<e(a.minRank),l=a.id==="loaf"&&!il.isWounded();let u;return o?u='<span class="deed-tag tag-gold">owned</span>':c?u=`<span class="deed-tag tag-grim">for a ${a.minRank}</span>`:u=`<button data-buy="${a.id}" ${i.coins<a.price||l?"disabled":""}
            title="${l?"Thou art hale — bread keeps.":""}">${a.price}c</button>`,`<div class="deed">
          <span class="deed-text"><b>${a.name}</b> — <span class="muted">${a.flavor}</span></span>
          ${u}
        </div>`}).join("");return`<div class="sheet-section"><h2>${r}</h2>${s}</div>`}).join("");td.innerHTML=`
    <div class="sheet-section">
      <div class="kv"><span>Thy purse</span><span class="v">${i.coins} coins</span></div>
      <p class="muted">The chapman deals in comfort and swagger. Virtue is not for sale, at any price.</p>
    </div>
    ${t}`;for(const n of td.querySelectorAll("[data-buy]"))n.addEventListener("click",()=>{const r=K2(n.dataset.buy);r.ok?(rt(`${r.item.name} — bought and paid for.`,"gold"),nn.questDone(),il.onPurchase(r.item)):r.why==="coins"&&rt("Thy purse is too light for that.","grim"),j_()})}function tm(){no&&(no=null,Cs=null,Nc+=1,Ls=null,rl=!1,Ar=null,Xa.classList.add("hidden"),Kd.classList.add("hidden"),jd.classList.add("hidden"),Jd.classList.add("hidden"),Zd.classList.add("hidden"),Qd.classList.add("hidden"),ef.classList.add("hidden"),tf(!1))}function J_(i){no=i,nn.page(),Xa.classList.remove("hidden"),Kd.classList.toggle("hidden",i!=="board"),jd.classList.toggle("hidden",i!=="tome"),Jd.classList.toggle("hidden",i!=="ledger"),Zd.classList.toggle("hidden",i!=="treasury"),Qd.classList.toggle("hidden",i!=="shop"),ef.classList.toggle("hidden",i!=="guide"),i==="board"?di():i==="ledger"?fA():i==="treasury"?kc():i==="shop"?j_():i==="guide"?iE(Y_):Rr(),tf(!0)}function Sl(){return no!==null}function mA(i,e){tf=i,e&&(il={...il,...e}),Xa=document.getElementById("panel-overlay"),Kd=document.getElementById("quest-panel"),jd=document.getElementById("tome-panel"),Jd=document.getElementById("ledger-panel"),Zd=document.getElementById("treasury-panel"),Qd=document.getElementById("shop-panel"),ef=document.getElementById("guide-panel"),Ri=document.getElementById("quest-body"),$n=document.getElementById("tome-body"),X_=document.getElementById("ledger-body"),qn=document.getElementById("treasury-body"),td=document.getElementById("shop-body"),Y_=document.getElementById("guide-body"),window.addEventListener("keydown",t=>{t.key==="Escape"&&no&&tm()}),Xa.addEventListener("mousedown",t=>{t.target===Xa&&tm()})}localStorage.getItem(me.saveKey);async function gA(){}const _A="The ledger holds no deeds for this week; the chronicler left the page blank.",xA="You are the chronicler of a small medieval village in a life-RPG. Each week you write one short journal entry about one villager, whose real-world deeds (training, study, labor, trade, thrift) are recorded in the ledger you are given. Write 60-110 words of period prose: third person, past tense, a single paragraph. Render modern deeds in medieval terms — a gym becomes the training yard, office or computer work a guild labor, savings coin laid in the hoard. Chronicle only what the ledger shows; if it is thin, be brief. No headings, no lists, no quotation marks around the entry, no modern words.";function Z_(i,e){const[t,n,r]=i.split("-").map(Number);return rn(new Date(t,n-1,r+e))}function yA(i,e=new Date){const t=eo(e),n=new Set(i.chronicle.map(a=>a.week)),r=[];let s=eo(new Date(i.createdAt));for(let a=0;s<t&&a<520;a++)n.has(s)||r.push(s),s=Z_(s,7);return r}function vA(i,e){const t=Z_(e,6),n=i.history.filter(s=>s.date>=e&&s.date<=t),r=i.sleep.log.filter(s=>{const a=(s.wake??s.bed).slice(0,10);return a>=e&&a<=t});return{weekStart:e,weekEnd:t,rank:i.rank,deeds:n,nights:r}}function wA(i){const e=i.deeds.map(n=>{const r=n.statTrained?` (trained ${Or[n.statTrained]})`:"",s=n.type==="epic"?` — the great work stands at ${n.progressPct}%`:"";return`- ${n.date} [${n.type}] ${n.questText}${r}${s}`}),t=i.nights.filter(n=>n.verdict==="dawn").length;return[`Week of ${i.weekStart} to ${i.weekEnd}. The villager holds the rank of ${i.rank}.`,"Deeds in the ledger:",...e,i.nights.length?`Nights recorded: ${i.nights.length}, of which ${t} rose with the dawn.`:"No nights were recorded."].join(`
`)}async function MA(i){var e;try{const r=(e=(await new Ii({apiKey:$_(),dangerouslyAllowBrowser:!0,timeout:me.chronicler.timeoutMs,maxRetries:0}).messages.create({model:me.chronicler.model,max_tokens:me.chronicler.maxTokens,system:xA,messages:[{role:"user",content:wA(i)}]})).content)==null?void 0:e[0];return((r==null?void 0:r.type)==="text"?r.text.trim():"")||null}catch(t){return console.warn("[chronicler] the pen faltered:",t),null}}async function SA(i=new Date){if(!$_())return{entries:0,prose:!1};const e=_n();let t=0;for(const n of yA(e,i)){const r=vA(e,n);if(r.deeds.length===0){t0(n,_A),t+=1;continue}const s=await MA(r);if(!s)break;return t0(n,s),{entries:t+1,prose:!0}}return{entries:t,prose:!1}}function bA(i){const e=i.pivot;let t=0,n=0,r=!1;return{x:$e.dummy.x,z:$e.dummy.z,radius:.55,alive:!0,hit(s,a){const o=this.x-s,c=this.z-a,l=Math.hypot(o,c)||1;t+=c/l*7,n+=-(o/l)*7,nn.thud();const u=J2();if(u>0){const d=ao("str",u);for(const f of d)rt(`Strength rises to level ${f}!`,"gold"),nn.levelUp()}else r||(r=!0,rt("The dummy has taught you all it can today."))},update(s){t+=(-e.rotation.x*26-t*4.2)*s,n+=(-e.rotation.z*26-n*4.2)*s,e.rotation.x+=t*s,e.rotation.z+=n*s}}}const Un=me.rats,nm=7234908,EA=5722186,Ia=12159608;function TA(){const i=new Je,e=$(new Jt(.15,7,5),nm,{y:.14});e.scale.set(1,.82,1.65);const t=$(new Jt(.13,6,5),EA,{y:.15,z:-.12});t.scale.set(1.08,.9,1);const n=$(new Jt(.1,6,5),nm,{y:.15,z:.28});n.scale.set(1,.9,1.2),i.add(e,t,n),i.add($(new Zn(.065,.17,5),Ia,{y:.135,z:.43,rx:Math.PI/2}));for(const s of[-1,1])i.add($(new On(.05,.05,.015,6),Ia,{x:s*.075,y:.25,z:.25,rx:Math.PI/2,rz:s*.4})),i.add($(new _i(.02,.025,.02),1182728,{x:s*.06,y:.185,z:.36,shadow:!1})),i.add($(new _i(.04,.03,.07),Ia,{x:s*.1,y:.015,z:.17})),i.add($(new _i(.045,.03,.09),Ia,{x:s*.11,y:.015,z:-.14}));const r=$(new On(.012,.028,.46,5),Ia,{y:.1,z:-.48});return r.rotation.x=Math.PI/2-.22,i.add(r),Rn(i)}function AA(i){const e={x:$e.granary.x,z:$e.granary.z},t=[],n=_n().counters.ratsKilled,r=Math.max(0,Un.count-n);for(let a=0;a<r;a++){const o=a/Un.count*Math.PI*2+.7,c={group:TA(),x:e.x+Math.cos(o)*2.2,z:e.z+Math.sin(o)*2.2,hp:Un.hp,alive:!0,dying:0,state:"wander",targetX:e.x,targetZ:e.z,wanderTimer:Math.random()*2,biteTimer:0,stun:0,kbX:0,kbZ:0,facing:o,hopPhase:Math.random()*6,radius:.32};c.group.position.set(c.x,Nt(c.x,c.z),c.z),i.add(c.group),t.push(c)}function s(a){a.alive=!1,a.dying=.001;const o=Z2();rt(`The miller pays a bounty per tail. (+${o}c)`,"gold"),nn.ratDie(),nn.coin()}return{list:t,update(a,o,c){for(const l of t){if(!l.alive){if(l.dying>0){l.dying+=a;const v=Math.min(l.dying/.35,1);l.group.scale.set(1+v*.6,Math.max(1-v*1.1,.02),1+v*.6),v>=1&&(i.remove(l.group),l.dying=0)}continue}l.biteTimer=Math.max(0,l.biteTimer-a),l.stun=Math.max(0,l.stun-a);const u=o.pos.x-l.x,d=o.pos.z-l.z,f=Math.hypot(u,d),h=Math.hypot(l.x-e.x,l.z-e.z);h>Un.leashRange?l.state="return":f<Un.aggroRange&&o.hp>0?l.state="chase":(l.state==="chase"||l.state==="return")&&h<2&&(l.state="wander");let g=0,_=0,p=0;if(!(l.stun>0))if(l.state==="chase")f>Un.biteRange*.8&&(_=u/f,p=d/f,g=Un.speed),f<Un.biteRange&&l.biteTimer===0&&(l.biteTimer=Un.biteCooldown,l.hopPhase=0,c(Un.biteDamage,l.x,l.z));else{if(l.state==="return")l.targetX=e.x,l.targetZ=e.z;else if(l.wanderTimer-=a,l.wanderTimer<=0){l.wanderTimer=1.5+Math.random()*2.5;const M=Math.random()*Math.PI*2;l.targetX=e.x+Math.cos(M)*Un.wanderRadius,l.targetZ=e.z+Math.sin(M)*Un.wanderRadius}const v=l.targetX-l.x,x=l.targetZ-l.z,w=Math.hypot(v,x);w>.4&&(_=v/w,p=x/w,g=Un.speed*.45)}l.x+=(_*g+l.kbX)*a,l.z+=(p*g+l.kbZ)*a,l.kbX*=Math.max(0,1-a*8),l.kbZ*=Math.max(0,1-a*8),g>0&&(l.facing=Math.atan2(_,p),l.hopPhase+=a*13);const m=Math.abs(Math.sin(l.hopPhase))*.07*(g>0?1:0);l.group.position.set(l.x,Nt(l.x,l.z)+m,l.z),l.group.rotation.y=l.facing}},tryHit(a,o,c,l,u,d){let f=!1;for(const h of t){if(!h.alive)continue;const g=h.x-a,_=h.z-o,p=Math.hypot(g,_);if(p>l+h.radius)continue;const m=Math.atan2(g,_);let v=Math.abs(m-c)%(Math.PI*2);if(v>Math.PI&&(v=Math.PI*2-v),v>u)continue;h.hp-=d,h.stun=.3;const x=5.5;h.kbX=g/(p||1)*x,h.kbZ=_/(p||1)*x,Zm(h.group),nn.squeak(),f=!0,h.hp<=0&&s(h)}return f}}}const{messages:RA}=O2();gA();const im=new URLSearchParams(location.search).get("market"),Q_=im!==null?im==="1":me.shop.marketWeekdays.includes(new Date().getDay()),An=new uS({antialias:!0});An.setSize(window.innerWidth,window.innerHeight);An.setPixelRatio(Math.min(window.devicePixelRatio,2));An.shadowMap.enabled=!0;An.shadowMap.type=sm;An.toneMapping=am;An.toneMappingExposure=1;document.getElementById("app").appendChild(An.domElement);const po=new hS,ar=new zn(60,window.innerWidth/window.innerHeight,.1,1e3),nt=x2(po,Q_),ke=S2(po,$e.playerSpawn);function ex(){const i=_n().shop.owned;let e=me.player.attackDamage,t=me.player.attackRange,n=0;for(const r of me.shop.items)r.tier&&i.includes(r.id)&&r.tier>n&&(n=r.tier,e=r.damage,t=me.player.attackRange+(r.reach??0));ke.attackDamage=e,ke.attackReach=t,ke.setWeaponTier(n),nt.applyHomeUpgrades(i)}ex();ke.trySpend=i=>Rg(i);ke.onActionBlocked=()=>rt("Your arms are spent. Earn your strength — the board awaits.","grim");rA();const Is=bA(nt.dummy),rf=AA(po);function PA(i,e){let t=Math.abs(i-e)%(Math.PI*2);return t>Math.PI?Math.PI*2-t:t}ke.onAttackSwing=()=>{nn.swing();const e=me.player.attackArcDeg*Math.PI/360;rf.tryHit(ke.pos.x,ke.pos.z,ke.facing,ke.attackReach,e,ke.attackDamage);const t=Is.x-ke.pos.x,n=Is.z-ke.pos.z;Math.hypot(t,n)<ke.attackReach+Is.radius&&PA(Math.atan2(t,n),ke.facing)<e&&Is.hit(ke.pos.x,ke.pos.z)};ke.onHurt=()=>{nn.hurt(),zi.shake(.24)};ke.onHpChange=(i,e)=>mg(i,e);const sl=document.getElementById("fade");ke.onDeath=()=>{ke.setEnabled(!1),sl.classList.add("show"),setTimeout(()=>{ke.respawn(nt.wakeSpot.x,nt.wakeSpot.z),sl.classList.remove("show"),rt("You wake on your straw cot, aching. The rats remain.","grim"),Sl()||ke.setEnabled(!0)},1100)};let Gu=!1;function tx(){if(Gu)return;Gu=!0;const i=ke.hp<ke.maxHp-.01;ke.setEnabled(!1),zi.unlock(),ke.startSleep(nt.bedRest),setTimeout(()=>{nn.page(),sl.classList.add("show")},1500),setTimeout(()=>{ke.respawn(nt.wakeSpot.x,nt.wakeSpot.z),k2(),sl.classList.remove("show"),rt(i?"Sleep knits your wounds. The night is marked.":"You rest your eyes a while. The night is marked.",""),Sl()||ke.setEnabled(!0),Gu=!1},2600)}const nx=Sl,zi=T2(ar,An.domElement,nx);zi.setInterior(nt.hovelInterior);zi.setOnTap(()=>{ke.isEnabled()&&ke.attack()});A2();mA(i=>{ke.setEnabled(!i),i&&(zi.unlock(),gg(null))},{isWounded:()=>ke.hp<ke.maxHp-.01,onPurchase:i=>{i.id==="loaf"&&(ke.hp=ke.maxHp,ke.onHpChange(ke.hp,ke.maxHp)),ex()}});function ix(){const i=_n();P2(i.coins),C2(i.rank),L2(i.streak.current),R2(i.stamina.current,ml()),mg(ke.hp,ke.maxHp),nt.campfire.setStreak(i.streak.current,Ag())}vg(ix);ix();vg(i=>{i==="coronation"&&(nn.levelUp(),rt("The bells ring out across the realm.","gold"),rt("THE CORONATION — thou art King.","gold"))});setTimeout(()=>{for(const i of RA)rt(i.text,i.style);Q_&&rt("The chapman has come — his cart stands by the path.","gold")},700);SA().then(i=>{i.prose&&rt("The chronicler has set down the week past — read it in the Tome.")});function CA(){const i=nt.hovelInterior;return ke.pos.x>i.minX&&ke.pos.x<i.maxX&&ke.pos.z>i.minZ&&ke.pos.z<i.maxZ}function LA(){let i=null,e=1/0;const t=CA();for(const n of nt.interactables){if(n.insideOnly&&!t)continue;const r=Math.hypot(ke.pos.x-n.x,ke.pos.z-n.z);r<n.radius&&r<e&&(e=r,i=n)}return i}function IA(){return Math.hypot(ke.pos.x-nt.door.x,ke.pos.z-nt.door.z)}function rx(){const i=LA(),e=IA(),t=i?Math.hypot(ke.pos.x-i.x,ke.pos.z-i.z):1/0;return e<nt.door.radius&&e<t?{id:"door",x:nt.door.x,z:nt.door.z}:i}function DA(i){return`Press <b>E</b> — ${i.id==="door"?nt.door.isOpen?"close the door":"open the door":i.label}`}const UA=2,yc=new U;function NA(i){if(ar.updateMatrixWorld(),yc.set(i.x,Nt(i.x,i.z)+UA,i.z).project(ar),yc.z>1)return null;const e=(yc.x*.5+.5)*window.innerWidth,t=(-yc.y*.5+.5)*window.innerHeight;return[Math.min(Math.max(e,90),window.innerWidth-90),Math.min(Math.max(t,50),window.innerHeight-130)]}nt.exchequer.onGreet=()=>rt(gl()?"The clerk looks up. The month’s reckoning is owed.":"The clerk inclines his head.","");nt.miller.onGreet=()=>rt("The miller raises a floury hand.","");nt.cart&&(nt.cart.chapman.onGreet=()=>rt("The chapman looks up from his wares.",""));function kA(){const i=_n().counters.ratsKilled;i===0?rt("Rats in my grain again, friend. Two coins a tail — the offer stands.",""):i<me.rats.count?rt(`${i===1?"One tail":`${i} tails`} this day. The grain breathes easier.`,"gold"):rt("The granary is quiet at last. Till the morrow, anyway.","gold")}window.addEventListener("keydown",i=>{if(i.code!=="KeyE"||!ke.isEnabled()||Sl())return;const e=rx();e&&(e.id==="door"?(nt.door.toggle(),nn.creak()):e.id==="bed"?tx():e.id==="chest"?(nn.creak(),nt.chest.toggle()&&rt("The lid creaks up: a spare tunic, a whetstone, a thin purse. A peasant’s whole estate.","")):e.id==="miller"?kA():(zi.unlock(),J_(e.id)))});new URLSearchParams(location.search).has("smoke")&&(window.__game={scene:po,camera:ar,renderer:An,colliders:nt.colliders,orbitCam:zi,player:ke,openPanel:J_,getState:_n,spendStamina:Rg,exportSave:wg,importSave:Sg,rats:rf,dummy:Is,campfire:nt.campfire,door:nt.door,chest:nt.chest,cart:nt.cart,exchequer:nt.exchequer,miller:nt.miller,homeUpgrades:nt.homeUpgrades,sleepAtCot:tx,evaluateSleep:bg,applySleepReward:Eg,fileReckoning:Lg,judgeReckoning:Cg,reckoningDue:gl,setPledge:Pg,setSummit:Ig,judgeDeed:q_,wakeSpot:nt.wakeSpot,CONFIG:me});window.addEventListener("resize",()=>{ar.aspect=window.innerWidth/window.innerHeight,ar.updateProjectionMatrix(),An.setSize(window.innerWidth,window.innerHeight)});const sx=new jS;let Wu=0,Ya=null;const zA=.05,OA=.5;function FA(i){var e;nx()||(ke.update(i,zi.getYaw(),nt.colliders),rf.update(i,ke,(t,n,r)=>ke.takeDamage(t,n,r)),Is.update(i),Ya=ke.isEnabled()?rx():null,gg(Ya?DA(Ya):null)),nt.campfire.update(i),nt.door.update(i),nt.chest.update(i),nt.exchequer.update(i,ke.pos),nt.miller.update(i,ke.pos),(e=nt.cart)==null||e.update(i,ke.pos),zi.update(i,ke.pos),nt.update(i,ke.pos,ar)}let vc=Math.min(window.devicePixelRatio,2),ws=0;function BA(i){if(document.hidden||i>.25||sx.elapsedTime<4){ws=0;return}ws=i>1/45?ws+i:Math.max(0,ws-i*2),ws>2&&vc>1&&(vc=Math.max(1,vc-.25),An.setPixelRatio(vc),ws=0)}function ax(){Wu++,(Wu===12||Wu===90)&&(window.__smoke={calls:An.info.render.calls,triangles:An.info.render.triangles});const i=sx.getDelta();BA(i);let e=Math.min(i,OA);do{const t=Math.min(e,zA);FA(t),e-=t}while(e>1e-4);Ya&&I2(NA(Ya)),An.render(po,ar),requestAnimationFrame(ax)}ax();export{Fe as A};
