h=open('index.html').read()
h=h.replace('</style>',open('boom.css').read()+'\n</style>',1)
S=[('1533222535026-754c501569dd','Where little <em>learners</em> shine.','Donde los pequeños <em>brillan</em>.','Play'),
   ('1761208663763-c4d30657c910','Play. Learn. <em>Belong.</em>','Jugar. Aprender. <em>Pertenecer.</em>','Learn'),
   ('1786292949404-084cbd10c7b1','Care you can <em>see.</em>','Un cuidado que <em>se nota.</em>','Grow')]
sl=''.join('<div class="slide%s" style="background-image:url(https://images.unsplash.com/photo-%s?auto=format&fit=crop&w=1800&q=75)"></div>'%(' on' if i==0 else '',s[0]) for i,s in enumerate(S))
h=h.replace('<div class="hero-bg"></div>','<div class="slides">'+sl+'</div><div class="hero-bg"></div><span class="star" style="left:46%;top:16%;font-size:34px">★</span><span class="star" style="left:8%;bottom:30%;font-size:22px;animation-delay:-3s">★</span><span class="star" style="right:6%;top:10%;font-size:26px;animation-delay:-5s">★</span>',1)
dots='<div class="hdots"><div class="wrap"><button class="arr" id="hp" type="button" aria-label="Previous">‹</button>'+''.join('<button class="hd%s" type="button" data-i="%d">%s<i></i></button>'%(' on' if i==0 else '',i,s[3]+['',' ',' '][0]) for i,s in enumerate(S))+'<button class="arr" id="hn" type="button" aria-label="Next">›</button></div></div>'
h=h.replace('<div class="wave">',dots+'<div class="wave">',1)
tick='<div class="tick"><div class="marq"><div class="track">'+''.join('<span>%s</span>'%t for t in ['Play-based learning','Bilingual classrooms','State licensed','Daily parent updates','Small groups','Open 6:30 – 6:00','Healthy meals','Caring teachers']*2)+'</div></div></div>\n'
h=h.replace('<section id="programs">',tick+'<section id="nums" style="padding-bottom:20px"><div class="wrap"><div class="eyebrow">By the numbers</div><h2>Families trust us</h2><div class="nums"><div class="num"><b data-to="15" data-suf="+">0</b><span>Years caring for families</span></div><div class="num"><b data-to="500" data-suf="+">0</b><span>Families served</span></div><div class="num"><b data-to="100" data-suf="%">0</b><span>Background-checked staff</span></div><div class="num"><b data-to="5.0" data-dec="1">0</b><span>Average parent rating</span></div></div><div class="sample">Sample figures. Replace with the school\'s real numbers.</div></div></section>\n<section id="programs">',1)
js='''<script>
(function(){
var sl=[].slice.call(document.querySelectorAll('.slide')),ds=[].slice.call(document.querySelectorAll('.hd')),h1=document.querySelector('.herofull h1'),
T=%s,cur=0,tm;
function words(html){var out='',i=0;html.split(/(<em>.*?<\\/em>|\\s+)/).forEach(function(p){if(!p||/^\\s+$/.test(p)){out+=' ';return}var em=/^<em>/.test(p);var t=p.replace(/<\\/?em>/g,'');out+='<span class="w" style="animation-delay:'+(i++*90)+'ms">'+(em?'<em>'+t+'</em>':t)+'</span>'});return out}
function go(n){cur=(n+sl.length)%%sl.length;sl.forEach(function(s,i){s.classList.toggle('on',i===cur)});ds.forEach(function(d,i){d.classList.remove('on');void d.offsetWidth;if(i===cur)d.classList.add('on')});h1.dataset.en=T[cur][0].replace(/<\\/?em>/g,'');h1.dataset.es=T[cur][1].replace(/<\\/?em>/g,'');h1.innerHTML=words(T[cur][lang==='es'?1:0]);clearTimeout(tm);tm=setTimeout(function(){go(cur+1)},6500)}
ds.forEach(function(d){d.onclick=function(){go(+d.dataset.i)}});document.getElementById('hn').onclick=function(){go(cur+1)};document.getElementById('hp').onclick=function(){go(cur-1)};
go(0);
var hf=document.querySelector('.herofull');hf.addEventListener('mousemove',function(e){var r=hf.getBoundingClientRect();hf.style.setProperty('--mx',(e.clientX-r.left)+'px');hf.style.setProperty('--my',(e.clientY-r.top)+'px')});
document.querySelectorAll('.herofull .btn,.hd').forEach(function(b){b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.25)+'px)'});b.addEventListener('mouseleave',function(){b.style.transform=''})});
var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);var el=e.target,to=+el.dataset.to,dec=+(el.dataset.dec||0),t0=performance.now();(function f(t){var p=Math.min(1,(t-t0)/1600),v=to*(1-Math.pow(1-p,3));el.textContent=v.toFixed(dec)+(p===1?(el.dataset.suf||''):'');if(p<1)requestAnimationFrame(f)})(t0)})},{threshold:.5});
document.querySelectorAll('.num b').forEach(function(b){cio.observe(b)});
document.querySelectorAll('.num').forEach(function(n){n.setAttribute('tabindex','0');n.addEventListener('click',function(){location.href='/school-demo/about.html'})});
document.querySelectorAll('.tick span').forEach(function(s){s.style.cursor='pointer';s.onclick=function(){location.href='/school-demo/programs.html'}});
})();
</script>'''%str([[s[1],s[2]] for s in S])
h=h.replace('</body>',js+'</body>',1)
open('index.html','w').write(h)
