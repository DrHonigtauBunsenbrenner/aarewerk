(function(){
  /* Web3Forms: Access Key ist absichtlich oeffentlich (Client-seitig). */
  var FORM_ENDPOINT='https://api.web3forms.com/submit';
  var ACCESS_KEY='cbfa8012-7820-4758-90d1-a0b012d9cf58';
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
    if(f.elements.website.value)return; /* eigenes Honeypot */
    var d={name:f.elements.name.value.trim(),email:f.elements.email.value.trim(),projekt:(f.querySelector('input[name=projekt]:checked')||{}).value||'',paket:f.elements.paket.value,nachricht:f.elements.nachricht.value.trim()};
    var payload={
      access_key:ACCESS_KEY,
      subject:'Anfrage: '+d.paket+' – '+d.name,
      from_name:'Uferwerk Website',
      name:d.name,
      email:d.email,
      projekt:d.projekt,
      paket:d.paket,
      nachricht:d.nachricht,
      botcheck:''
    };
    status.textContent='Wird gesendet …';
    fetch(FORM_ENDPOINT,{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify(payload)
    }).then(function(r){
      return r.json().then(function(j){
        if(!r.ok||!j||j.success!==true)throw 0;
        f.reset();
        status.textContent='Vielen Dank. Ihre Anfrage ist angekommen.';
      },function(){throw 0;});
    }).catch(function(){
      status.textContent='Das Senden hat nicht geklappt. Schreiben Sie bitte direkt an '+ADDR+'.';
    });
  });
})();
