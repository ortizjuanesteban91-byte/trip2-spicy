import glob
PH='<input id="%s" type="tel" inputmode="tel" autocomplete="tel" placeholder="(940) 555-0123" required>'
EM='<input id="%s" type="email" inputmode="email" autocomplete="email" placeholder="name@email.com" required>'
S=[('index.html','<label for="pc"><span data-en="Phone or email" data-es="Teléfono o correo">Phone or email</span><input id="pc" autocomplete="tel" required></label>',
 '<label for="pc"><span>Phone number (required)</span>'+PH%'pc'+'</label><label for="pe"><span>Email (required)</span>'+EM%'pe'+'</label>'),
('book-a-tour.html','<label for="tc">Phone or email<input id="tc" type="text" required></label>',
 '<label for="tc">Phone number (required)'+PH%'tc'+'</label><label for="te">Email (required)'+EM%'te'+'</label>'),
('enroll.html','<label for="ee">Email<input id="ee" type="email" required></label><label for="ep">Phone<input id="ep" type="text" required></label>',
 '<label for="ep">Phone number (required)'+PH%'ep'+'</label><label for="ee">Email (required)'+EM%'ee'+'</label>'),
('contact.html','<label for="cp">Phone<input id="cp" type="text" ></label>','<label for="cp">Phone number (required)'+PH%'cp'+'</label>'),
('contact.html','<label for="ce">Email<input id="ce" type="email" required></label>','<label for="ce">Email (required)'+EM%'ce'+'</label>')]
J='''<script>
(function(){
var HINT='<p style="margin:0;font-size:14px;opacity:.8">Phone number and email are required so we can confirm with you.</p>';
document.querySelectorAll('form').forEach(function(f){
 var b=f.querySelector('button[type=submit]');if(b&&!f.querySelector('.reqhint'))b.insertAdjacentHTML('beforebegin',HINT.replace('<p','<p class="reqhint"'));
 f.addEventListener('submit',function(e){
  e.preventDefault();e.stopImmediatePropagation();
  var bad=[],box=f.querySelector('.ok');if(!box){box=document.createElement('div');box.className='ok';f.appendChild(box)}
  [].forEach.call(f.querySelectorAll('input,select,textarea'),function(i){
   var v=(i.value||'').trim(),err=false;
   if(i.required&&!v)err=true;
   if(v&&i.type==='tel'&&v.replace(/\\D/g,'').length<10)err=true;
   if(v&&i.type==='email'&&!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]{2,}$/.test(v))err=true;
   i.style.borderColor=err?'#FF6B57':'';i.setAttribute('aria-invalid',err);if(err)bad.push(i)});
  box.hidden=false;
  if(bad.length){box.style.background='var(--blush)';box.textContent='Please check the highlighted fields. A valid phone number (10 digits) and email are required.';bad[0].focus()}
  else{box.style.background='var(--mint)';box.textContent='Thank you! This is a design preview, so nothing was sent. On the live site this goes straight to the school.';f.reset()}
 },true)})
})();
</script>'''
for f in glob.glob('*.html'):
    h=open(f).read()
    for n,a,b in S:
        if n==f: h=h.replace(a,b)
    if '<form' in h: h=h.replace('</body>',J+'</body>',1)
    open(f,'w').write(h)
