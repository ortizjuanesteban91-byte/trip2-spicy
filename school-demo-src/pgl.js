<div class="pm" id="pm" role="dialog" aria-modal="true"><div class="pmbox"><div class="pmimg" id="pmimg"><button class="pmx" id="pmx" type="button" aria-label="Close">✕</button></div><div class="pmin"><h3 id="pmt"></h3><div class="tag2" id="pmtag"></div><div class="pmgrid" id="pmg"></div><div class="pmstat"><span>Ages 6 weeks – 12 years</span><span>The Colony · Lewisville, TX</span><span>Mon–Fri 6:30 – 6:00</span></div><div class="pmcta"><a class="btn btn-main" href="/school-demo/book-a-tour.html">Book a tour</a><a class="btn btn-line" id="pml" href="/school-demo/programs.html" style="color:#0B2545;border-color:#CFE0F5">See programs</a><a class="btn btn-line" href="tel:+19403145437" style="color:#0B2545;border-color:#CFE0F5">Call (940) 314-5437</a></div></div></div></div>
<script>
(function(){
var D=[
{t:'Play',tag:'Children learn best through exploration and meaningful play.',img:'1533222535026-754c501569dd',link:'/school-demo/programs-toddlers.html',
 b:[['🎨','Imaginative play and art expression every day'],['🧩','Hands-on activities that build strong foundations'],['🌈','A sensory room for calm, curious exploring'],['🤝','Friendships that start in the first years']]},
{t:'Learn',tag:'Cultural curriculum and kindergarten readiness.',img:'1761208663763-c4d30657c910',link:'/school-demo/programs-pre-k.html',
 b:[['📚','Pre-K / Primary for ages 3 to 5'],['🌍','Cultural development built into the curriculum'],['✏️','Art, early reading and math, ready for kindergarten'],['🚽','Transition program that bridges toddlers to Pre-K']]},
{t:'Grow',tag:'Trust, consistency, independence and confidence.',img:'1786292949404-084cbd10c7b1',link:'/school-demo/programs-school-age.html',
 b:[['💛','Experienced, compassionate caregivers'],['🌱','Personalized care from infants to age 12'],['🎒','School-age programs: new skills and friendships'],['📲','Parents stay connected through the Parent Portal']]}];
var chips=document.querySelector('.chips'),card=document.createElement('div');card.className='hcard';if(chips)chips.appendChild(card);
var cur=0;
function draw(i){cur=i;var d=D[i];card.style.animation='none';void card.offsetWidth;card.style.animation='';card.innerHTML='<h3>'+d.t+'</h3><div class="sub">'+d.tag+'</div><ul>'+d.b.map(function(x){return'<li><i>'+x[0]+'</i><span>'+x[1]+'</span></li>'}).join('')+'</ul><button class="more2" type="button">Tell me more →</button>';card.querySelector('.more2').onclick=function(){op(i)}}
var pm=document.getElementById('pm');
function op(i){var d=D[i];document.getElementById('pmt').textContent=d.t;document.getElementById('pmtag').textContent=d.tag;document.getElementById('pmimg').style.backgroundImage='url(https://images.unsplash.com/photo-'+d.img+'?auto=format&fit=crop&w=1200&q=75)';document.getElementById('pmg').innerHTML=d.b.map(function(x){return'<div><i>'+x[0]+'</i>'+x[1]+'</div>'}).join('');document.getElementById('pml').href=d.link;pm.classList.add('open')}
function cl(){pm.classList.remove('open')}
document.getElementById('pmx').onclick=cl;pm.onclick=function(e){if(e.target===pm)cl()};document.addEventListener('keydown',function(e){if(e.key==='Escape')cl()});
var ds=[].slice.call(document.querySelectorAll('.hd'));
ds.forEach(function(b,i){b.addEventListener('click',function(){draw(i);setTimeout(function(){op(i)},350)})});
new MutationObserver(function(){var i=ds.findIndex(function(d){return d.classList.contains('on')});if(i>-1&&i!==cur)draw(i)}).observe(document.querySelector('.hdots'),{attributes:true,subtree:true,attributeFilter:['class']});
draw(0);
})();
</script>
