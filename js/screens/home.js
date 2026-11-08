/* Home / login screen. */
'use strict';

/* ---- home + login ---- */
function wireHome(){
  $('loginForm').addEventListener('submit',function(e){e.preventDefault();
    state.user=$('user').value.trim()||'Guest';go('create');});
  $('devBtn').addEventListener('click',function(){go('devlogin');});
  $('dBack').addEventListener('click',function(){go('home');});
  $('devForm1').addEventListener('submit',function(e){e.preventDefault();go('dev');});
  $('logoutBtn').addEventListener('click',function(){go('home');});
}
