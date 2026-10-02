<div class="scene" id="scene" role="dialog" aria-modal="true"><div class="sbg" id="sbg"></div><span class="splane" style="top:18%">✈️</span><span class="splane" style="top:46%;animation-delay:-3s;font-size:26px">✈️</span><span class="splane" style="top:70%;animation-delay:-6s;font-size:30px">🛩️</span><button class="sx" id="sx" type="button" aria-label="Close">✕</button><div class="sin"><div class="scard" id="scard"></div></div><div class="schips" id="schips"></div></div>
<script>
(function(){
var P=__PDATA__;
var sc=document.getElementById('scene'),card=document.getElementById('scard'),bg=document.getElementById('sbg'),chips=document.getElementById('schips'),cur=0;
function draw(i,anim){cur=i;var d=P[i];bg.style.backgroundImage='url(https://images.unsplash.com/photo-'+d.img+'?auto=format&fit=crop&w=1800&q=75)';
 card.style.animation='none';void card.offsetWidth;card.style.animation='';
 card.innerHTML='<span class="ages">'+d.ages+'</span><h2>'+d.name+'</h2><div class="hd2">'+d.head+'</div>'+d.p.map(function(x){return'<p>'+x+'</p>'}).join('')+'<ul>'+d.b.map(function(x){return'<li>'+x+'</li>'}).join('')+'</ul><div class="scta"><a class="btn btn-main" href="/school-demo/book-a-tour.html">Book a tour</a><a class="btn btn-line" href="/school-demo/enroll.html">Enroll now</a><a class="btn btn-line" href="tel:+19403145437">Call (940) 314-5437</a></div><p style="margin-top:14px"><a href="/school-demo/programs-'+d.slug+'.html" style="color:#FFE08A;font-weight:800">Full details for '+d.name+' →</a></p>';
 chips.innerHTML=P.map(function(p,j){return'<button type="button" class="'+(j===i?'on':'')+'" data-j="'+j+'">'+p.name+'</button>'}).join('');
 [].forEach.call(chips.querySelectorAll('button'),function(b){b.onclick=function(){draw(+b.dataset.j)}})}
function open(i,x,y){sc.style.setProperty('--cx',x+'px');sc.style.setProperty('--cy',y+'px');draw(i);sc.classList.remove('open');void sc.offsetWidth;sc.classList.add('open');document.body.style.overflow='hidden'}
function close(){sc.classList.remove('open');document.body.style.overflow=''}
document.getElementById('sx').onclick=close;document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
var panel=document.getElementById('panel'),tabs=document.getElementById('tabs'),MAP=[0,1,3,4];
function idx(){var t=[].slice.call(tabs.querySelectorAll('.tab')),i=t.findIndex(function(x){return x.getAttribute('aria-selected')==='true'});return MAP[i<0?0:i]}
function addBtn(){var f=panel.firstElementChild;if(f&&!f.querySelector('.explore')){var b=document.createElement('button');b.type='button';b.className='explore';b.textContent='Explore this program ✈';f.appendChild(b)}}
new MutationObserver(addBtn).observe(panel,{childList:true});addBtn();
panel.addEventListener('click',function(e){if(e.target.closest('.explore')||e.target.closest('.ph')){var r=e.target.getBoundingClientRect();open(idx(),r.left+r.width/2,r.top+r.height/2)}});
})();
</script>
