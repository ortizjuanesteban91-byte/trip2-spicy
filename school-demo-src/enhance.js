<div class="mod" id="mod" role="dialog" aria-modal="true" aria-labelledby="mt"><div class="mbox"><h3 id="mt"></h3><div id="mb"></div><div class="row"><a class="btn btn-main" href="/school-demo/book-a-tour.html" id="mcta"></a><button class="btn btn-line" type="button" id="mx" style="color:var(--ink);border-color:var(--line)"></button></div></div></div>
<div id="prog"></div>
<script>
(function(){
document.documentElement.classList.add('js');
var I={
 lic:{en:['State licensed','<p>Fully licensed and inspected. Our license number and latest inspection report are available on request and posted at the front desk.</p><ul><li>[License number]</li><li>Background-checked staff</li><li>Secure entry and cameras</li></ul>'],es:['Con licencia estatal','<p>Con licencia completa e inspecciones al día. El número de licencia y el último informe están disponibles a solicitud.</p><ul><li>[Número de licencia]</li><li>Personal verificado</li><li>Entrada segura y cámaras</li></ul>']},
 rat:{en:['Small groups','<p>Low child-to-teacher ratios so every child gets real attention.</p><ul><li>Infants [00]:1</li><li>Toddlers [00]:1</li><li>Preschool [00]:1</li></ul>'],es:['Grupos pequeños','<p>Pocos niños por maestra para atención real.</p><ul><li>Bebés [00]:1</li><li>Maternal [00]:1</li><li>Preescolar [00]:1</li></ul>']},
 hrs:{en:['Open Monday to Friday','<p>6:30 am to 6:00 pm, Monday to Friday. Early drop-off and late pickup options available.</p><ul><li>Holiday calendar on request</li><li>Summer camp for school age</li></ul>'],es:['Abierto de lunes a viernes','<p>De 6:30 am a 6:00 pm. Hay opciones de entrada temprana y salida tarde.</p><ul><li>Calendario de feriados a solicitud</li><li>Campamento de verano</li></ul>']},
 bil:{en:['Bilingual classrooms','<p>Children learn in English and Spanish through songs, stories and play, so both languages feel natural.</p>'],es:['Aulas bilingües','<p>Los niños aprenden en inglés y español con canciones, cuentos y juego.</p>']},
 day:{en:['A day at the school','<p>[Add details of this part of the day: activities, meals, what parents see in the daily report.]</p>'],es:['Un día en la escuela','<p>[Agregar detalles de esta parte del día: actividades, comidas, informe diario.]</p>']},
 why:{en:['Care you can see','<p>[Add details: teacher qualifications, safety procedures, parent app with daily photos and updates.]</p>'],es:['Un cuidado que se nota','<p>[Agregar detalles: formación de maestras, seguridad, app para padres con fotos y novedades diarias.]</p>']},
 rev:{en:['Parent review','<p>This is a sample review. On the live site, real reviews are pulled in from the school\'s Google page and link to the original.</p>'],es:['Opinión de padres','<p>Esta es una reseña de ejemplo. En el sitio real se muestran las reseñas de Google de la escuela.</p>']},
 prog:{en:['Program details','<p>Ages, ratios, daily schedule and tuition for this program. [Add tuition and registration fee.]</p>'],es:['Detalles del programa','<p>Edades, proporciones, horario y mensualidad. [Agregar costos.]</p>']}
};
var m=document.getElementById('mod');
function open(k,extra){var d=I[k][lang]||I[k].en;document.getElementById('mt').textContent=(extra||'')||d[0];document.getElementById('mb').innerHTML=d[1];document.getElementById('mcta').textContent=lang==='es'?'Reservar visita':'Book a tour';document.getElementById('mx').textContent=lang==='es'?'Cerrar':'Close';m.classList.add('open');document.getElementById('mx').focus()}
function close(){m.classList.remove('open')}
document.getElementById('mx').onclick=close;m.onclick=function(e){if(e.target===m)close()};
document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
function bind(sel,key,title){document.querySelectorAll(sel).forEach(function(el,i){el.setAttribute('tabindex','0');el.setAttribute('role','button');var k=typeof key==='function'?key(el,i):key;var go=function(){open(k,title&&title(el))};el.addEventListener('click',go);el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})})}
bind('.trust .wrap>div',function(e,i){return['lic','rat','hrs','bil'][i]});
bind('.step','day',function(el){return el.querySelector('b').textContent+' · '+el.querySelector('time').textContent});
bind('.why>div','why',function(el){return el.querySelector('h3').textContent});
bind('.rcard','rev',function(el){return el.querySelector('.who b').textContent});
document.querySelectorAll('.chip').forEach(function(c,i){c.addEventListener('click',function(){open(['rev','lic','bil'][i])})});
var rv=document.querySelectorAll('.step,.why>div,.panel,.faq details,.tour,.revsum,.day');
rv.forEach(function(e,i){e.classList.add('rv');e.style.transitionDelay=(i%5)*70+'ms'});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
rv.forEach(function(e){io.observe(e)});
var pg=document.getElementById('prog');function sc(){var h=document.documentElement;pg.style.transform='scaleX('+(h.scrollTop/(h.scrollHeight-h.clientHeight||1))+')'}addEventListener('scroll',sc,{passive:true});sc();
var hb=document.querySelector('.hero-bg');addEventListener('scroll',function(){if(hb&&scrollY<900)hb.style.marginTop=(scrollY*.18)+'px'},{passive:true});
})();
</script>
