/* Small helpers used everywhere. */
'use strict';

var TAU=Math.PI*2;

var $=function(id){return document.getElementById(id);};
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;}
function toast(msg){var t=$('toast');t.textContent=msg;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(function(){t.classList.remove('on');},2600);}
