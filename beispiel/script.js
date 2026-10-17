(function(){
  var b=document.querySelector('.burger'),m=document.getElementById('menu');
  if(b&&m){
    b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',String(o));});
    m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){m.classList.remove('open');b.setAttribute('aria-expanded','false');});});
  }
  var f=document.getElementById('reservation');
  if(f){
    var d=f.querySelector('#datum');
    if(d){d.min=new Date().toISOString().slice(0,10);}
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var s=document.getElementById('status');
      if(!f.checkValidity()){f.reportValidity();return;}
      s.textContent='Danke. Dies ist eine Demo, Ihre Anfrage wurde nicht versendet.';
      f.reset();
    });
  }
  var y=document.getElementById('jahr');if(y)y.textContent=new Date().getFullYear();
})();
