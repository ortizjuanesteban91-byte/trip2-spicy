<script>
(function(){
document.documentElement.classList.add('js');
/* hours widget */
var hrs=document.getElementById('hrs'),pop=document.getElementById('hpop');
if(hrs&&pop){
 var d=new Date(),day=d.getDay(),hr=d.getHours()+d.getMinutes()/60,wk=day>=1&&day<=5,open=wk&&hr>=6.5&&hr<18;
 var st=document.getElementById('hst'),sd=document.getElementById('hsd'),lv=document.getElementById('hlive');
 st.textContent=open?'Open now':'Closed now';
 sd.textContent=open?'· closes 6:00 pm':(wk&&hr<6.5?'· opens 6:30 am':'· opens '+(day===5||day===6?'Monday':'tomorrow')+' 6:30 am');
 if(!open)lv.classList.add('off');
 [].forEach.call(pop.querySelectorAll('.hrow'),function(r){if(+r.dataset.d===day)r.classList.add('today')});
 hrs.onclick=function(e){e.stopPropagation();var o=pop.classList.toggle('open');hrs.setAttribute('aria-expanded',o);pop.querySelector('.hbar b').style.width=o?(open?Math.round((hr-6.5)/11.5*100):0)+'%':'0'};
 document.addEventListener('click',function(e){if(!pop.contains(e.target)){pop.classList.remove('open');hrs.setAttribute('aria-expanded','false')}});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'){pop.classList.remove('open');hrs.setAttribute('aria-expanded','false')}});
}
/* age toggle thumb */
var tabs=document.getElementById('tabs');
if(tabs){var th=document.createElement('span');th.className='thumb';tabs.insertBefore(th,tabs.firstChild);
 function mv(){var s=tabs.querySelector('.tab[aria-selected="true"]');if(!s)return;th.style.left=s.offsetLeft+'px';th.style.width=s.offsetWidth+'px'}
 tabs.addEventListener('click',function(){setTimeout(mv,0)});addEventListener('resize',mv);setTimeout(mv,50);setTimeout(mv,600);
 new MutationObserver(function(){if(!tabs.querySelector('.thumb')){tabs.insertBefore(th,tabs.firstChild)}setTimeout(mv,0)}).observe(tabs,{childList:true,subtree:true,attributes:true,attributeFilter:['aria-selected']});}
/* flowing reveals */
var sel='.why>div,.step,.rcard,.num,.faq details,.revsum,.tour,.panel';
var els=[].slice.call(document.querySelectorAll('.card,.cardgrid>*,.grid>*,.locs>*,.team>*,.faq details,.step,.why>div,.num,.revsum,.tour'));
els.forEach(function(e,i){e.classList.add('fl',['l','u','r'][i%3]);e.style.transitionDelay=(i%4)*90+'ms'});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1});
els.forEach(function(e){io.observe(e)});
/* 3D tilt */
[].forEach.call(document.querySelectorAll('.why>div,.num,.rcard,.card'),function(c){c.classList.add('tilt');
 c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(800px) rotateY('+x*10+'deg) rotateX('+-y*10+'deg) translateY(-6px)'});
 c.addEventListener('mouseleave',function(){c.style.transform=''})});
/* parallax + blobs */
var b1=document.createElement('div'),b2=document.createElement('div');b1.className=b2.className='blob';
b1.style.cssText='width:420px;height:420px;left:-120px;top:30%;background:#8FC1FF';b2.style.cssText='width:360px;height:360px;right:-100px;top:60%;background:#FFD36B';document.body.appendChild(b1);document.body.appendChild(b2);
var ph=[].slice.call(document.querySelectorAll('.why .ph,.panel .ph'));
function par(){var y=scrollY;b1.style.transform='translateY('+(y*.25)+'px)';b2.style.transform='translateY('+(-y*.18)+'px)';ph.forEach(function(p){var r=p.getBoundingClientRect(),o=(r.top+r.height/2-innerHeight/2)*-.06;p.style.backgroundPosition='center calc(50% + '+o+'px)'})}
addEventListener('scroll',par,{passive:true});par();
})();
</script>
