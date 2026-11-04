(function(){
  /* Ziel des Formulars: '' = mailto-Fallback. Später z.B. 'https://anbieter.example/f/abc' eintragen,
     dann wird per POST (fetch) an diesen Endpunkt gesendet. */
  var FORM_ENDPOINT='';
  var ADDR='kontakt@uferwerk.ch';
  var f=document.getElementById('anfrage');if(!f)return;
  var status=f.querySelector('.form-status');
  var msgs={name:'Bitte geben Sie Ihren Namen oder den Namen Ihres Betriebs bzw. Vereins an.',emailEmpty:'Bitte geben Sie Ihre E-Mail-Adresse an.',emailBad:'Bitte geben Sie eine gültige E-Mail-Adresse an, z.B. name@beispiel.ch.'};
  function check(el){
    var m='';
    if(el.name==='name'&&!el.value.trim())m=msgs.name;
    if(el.name==='email'){if(!el.value.trim())m=msgs.emailEmpty;else if(el.validity.typeMismatch)m=msgs.emailBad;}
    var err=document.getElementById(el.getAttribute('aria-describedby'));
    if(err)err.textContent=m;
    el.setAttribute('aria-invalid',m?'true':'false');
    return !m;
  }
  ['name','email'].forEach(function(n){var el=f.elements[n];el.addEventListener('blur',function(){if(el.value)check(el)});el.addEventListener('input',function(){if(el.getAttribute('aria-invalid')==='true')check(el)});});
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var okN=check(f.elements.name),okM=check(f.elements.email);
    if(!okN||!okM){(okN?f.elements.email:f.elements.name).focus();return;}
    if(f.elements.website.value)return; /* Honeypot */
    var d={name:f.elements.name.value.trim(),email:f.elements.email.value.trim(),projekt:(f.querySelector('input[name=projekt]:checked')||{}).value||'',paket:f.elements.paket.value,nachricht:f.elements.nachricht.value.trim()};
    if(FORM_ENDPOINT){
      status.textContent='Wird gesendet …';
      fetch(FORM_ENDPOINT,{method:'POST',headers:{'Accept':'application/json'},body:new FormData(f)}).then(function(r){
        if(!r.ok)throw 0;f.reset();status.textContent='Vielen Dank. Ihre Anfrage ist angekommen.';
      }).catch(function(){status.textContent='Das Senden hat nicht geklappt. Schreiben Sie bitte direkt an '+ADDR+'.';});
      return;
    }
    var subject='Anfrage: '+d.paket+' – '+d.name;
    var body='Guten Tag Herr Eschenbacher\r\n\r\nName / Betrieb oder Verein: '+d.name+'\r\nE-Mail: '+d.email+'\r\nProjekt: '+d.projekt+'\r\nPaket: '+d.paket+'\r\n\r\nNachricht:\r\n'+(d.nachricht||'-')+'\r\n\r\nFreundliche Grüsse\r\n'+d.name+'\r\n';
    var href='mailto:'+ADDR+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    status.textContent='Ihr Mailprogramm öffnet sich mit der vorbereiteten Nachricht. Bitte senden Sie sie dort ab. Falls nichts geschieht: Schreiben Sie an '+ADDR+'.';
    f.dataset.mailto=href;
    window.location.href=href;
  });
})();
