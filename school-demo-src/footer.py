import glob
CSS='''.findus{background:linear-gradient(135deg,#EAF3FF,#FFF6D6);padding:64px 0}
.findus .grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:32px;align-items:stretch}
.findus h2{font-size:clamp(28px,4vw,44px);margin:6px 0 12px}
.ctabs{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}
.ctabs button{border:2px solid #CFE0F5;background:#fff;color:#0B2545;border-radius:999px;padding:11px 20px;font:800 15px var(--body);cursor:pointer;transition:transform .2s}
.ctabs button.on{background:linear-gradient(135deg,#0A63F5,#6C8BFF);color:#fff;border-color:transparent;box-shadow:0 10px 24px rgba(10,99,245,.35)}
.ctabs button:hover{transform:translateY(-2px)}
.fadr{font-size:20px;font-weight:800;line-height:1.35}.finfo{color:#4A5F7A;line-height:1.7;margin:8px 0 16px}
.fbtn{display:flex;gap:10px;flex-wrap:wrap}.fbtn .btn{flex:1 1 150px;text-align:center}
.fmap{border-radius:28px;overflow:hidden;box-shadow:0 20px 50px rgba(10,99,245,.2);min-height:360px;background:#fff;border:1px solid #D6E6FA}
.fmap iframe{width:100%;height:100%;min-height:360px;border:0;display:block}
@media(max-width:860px){.findus .grid{grid-template-columns:minmax(0,1fr)}}'''
HTML='''<section class="findus" id="find"><div class="wrap grid"><div><div class="eyebrow">Visit us</div><h2>Find us in The Colony and Lewisville, TX</h2><p class="finfo">Two Texas campuses. Come see the classrooms and meet the teachers.</p><div class="ctabs"><button type="button" class="on" data-c="0">The Colony</button><button type="button" data-c="1">Lewisville</button></div><div class="fadr" id="fadr"></div><div class="finfo">(940) 314-5437<br>Monday to Friday, 6:30 am to 6:00 pm</div><div class="fbtn"><a class="btn btn-main" id="fdir" target="_blank" rel="noopener" href="#">Get directions</a><a class="btn btn-line" href="tel:+19403145437" style="color:#0B2545;border-color:#CFE0F5">Call us</a><a class="btn btn-line" href="/school-demo/book-a-tour.html" style="color:#0B2545;border-color:#CFE0F5">Book a tour</a></div></div><div class="fmap"><iframe id="fframe" title="Map of our campus" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div></div></section>'''
JS='''<script>
(function(){var C=[["The Colony","6804 Anderson Dr, The Colony, TX 75056"],["Lewisville","1597 Glencairn Ln, Lewisville, TX 75067"]],fr=document.getElementById('fframe'),done=false;
function show(i){var a=C[i][1];document.getElementById('fadr').innerHTML='<b>'+C[i][0]+'</b><br>'+a;document.getElementById('fdir').href='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(a);if(done)fr.src='https://www.google.com/maps?q='+encodeURIComponent(a)+'&output=embed';
 [].forEach.call(document.querySelectorAll('.ctabs button'),function(b,j){b.classList.toggle('on',j===i)})}
var cur=0;[].forEach.call(document.querySelectorAll('.ctabs button'),function(b){b.onclick=function(){cur=+b.dataset.c;done=true;show(cur)}});show(0);
new IntersectionObserver(function(es,o){if(es[0].isIntersecting){done=true;show(cur);o.disconnect()}},{rootMargin:'300px'}).observe(document.getElementById('find'));})();
</script>'''
for f in glob.glob('*.html'):
    h=open(f).read()
    if 'id="find"' not in h:
        h=h.replace('<footer>',HTML+'\n<footer>',1).replace('</style>',CSS+'\n</style>',1).replace('</body>',JS+'</body>',1)
    open(f,'w').write(h)
