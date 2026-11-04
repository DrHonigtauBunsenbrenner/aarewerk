(function(){
  var ADDR='kontakt@uferwerk.ch',box,timer;
  function show(msg){
    if(!box){box=document.createElement('div');box.className='mail-hint';box.setAttribute('role','status');box.setAttribute('aria-live','polite');document.body.appendChild(box);}
    box.hidden=false;box.textContent='';
    setTimeout(function(){box.textContent=msg;},30);
    clearTimeout(timer);timer=setTimeout(function(){box.hidden=true;},7000);
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href^="mailto:"]');
    if(!a)return;
    var done=function(){show('Falls sich kein Mailprogramm öffnet: Die Adresse '+ADDR+' wurde kopiert.');};
    var fail=function(){show('Falls sich kein Mailprogramm öffnet: Schreiben Sie an '+ADDR+'.');};
    if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(ADDR).then(done,fail);}else{fail();}
  });
})();
