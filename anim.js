(function(){
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var els=document.querySelectorAll('.reveal');
  document.documentElement.classList.add('js-anim');
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);e.target.addEventListener('transitionend',function(){e.target.style.transitionDelay='';},{once:true});}});
  },{rootMargin:'0px 0px -8% 0px',threshold:0.12});
  els.forEach(function(el){
    var sib=el.parentElement?Array.prototype.filter.call(el.parentElement.children,function(c){return c.classList.contains('card')}):[];
    var i=sib.indexOf(el);if(i>0)el.style.transitionDelay=(i*0.09)+'s';
    io.observe(el);
  });
})();
