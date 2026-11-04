(function(){
  var nav=document.querySelector('.nav'),btn=nav&&nav.querySelector('.nav-toggle'),menu=document.getElementById('hauptmenu');
  if(!btn||!menu)return;
  var mq=window.matchMedia('(max-width:760px)');
  btn.hidden=false;nav.classList.add('nav-js');
  function set(open,focusBtn){
    nav.classList.toggle('nav-open',open);
    btn.setAttribute('aria-expanded',open?'true':'false');
    btn.setAttribute('aria-label',open?'Menü schliessen':'Menü öffnen');
    if(!open&&focusBtn)btn.focus();
  }
  function isOpen(){return btn.getAttribute('aria-expanded')==='true'}
  btn.addEventListener('click',function(){set(!isOpen())});
  menu.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&isOpen())set(false,true)});
  document.addEventListener('click',function(e){if(isOpen()&&!nav.contains(e.target))set(false)});
  document.addEventListener('focusin',function(e){if(isOpen()&&!nav.contains(e.target))set(false)});
  (mq.addEventListener?mq.addEventListener.bind(mq,'change'):mq.addListener.bind(mq))(function(){if(!mq.matches)set(false)});
})();
