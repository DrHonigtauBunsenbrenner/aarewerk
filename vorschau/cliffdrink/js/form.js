// Kontaktformular in der öffentlichen Vorschau deaktiviert – es wird nichts gesendet.
// Vorschau: Formular sendet nichts.
const f = document.getElementById('cform');
const s = document.getElementById('cform-status');
if (f) {
  const btn = f.querySelector('[type="submit"]');
  if (btn) { btn.disabled = true; btn.textContent = 'Im Entwurf deaktiviert'; }
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    if (s) s.textContent = 'Im Entwurf deaktiviert.';
  });
}
