<script>
(function(){var nav=document.querySelector('header.nav'),t=document.querySelector('.tools'),l=document.querySelector('.links');if(!nav||!l)return;if(!t){t=document.createElement('div');t.className='tools';nav.querySelector('.wrap').appendChild(t)}
var b=document.createElement('button');b.className='burger';b.type='button';b.setAttribute('aria-label','Menu');b.setAttribute('aria-expanded','false');b.innerHTML='<span></span><span></span><span></span>';t.appendChild(b);
var main=[].slice.call(l.querySelectorAll('a:not(.btn)'));var qm=main.filter(function(a){return !/index\.html$/.test(a.getAttribute('href'))});
var q=document.createElement('nav');q.className='quick';q.setAttribute('aria-label','Quick links');
qm.slice(0,4).forEach(function(a){var c=a.cloneNode(true);c.removeAttribute('style');if(location.pathname.indexOf(a.getAttribute('href'))>-1)c.classList.add('cur');q.appendChild(c)});
nav.appendChild(q);
var cta=l.querySelector('.btn'),have={};main.forEach(function(a){have[a.getAttribute('href')]=1});
[['/school-demo/enroll.html','Enroll','Inscripción'],['/school-demo/careers.html','Careers','Empleo'],['/school-demo/privacy.html','Privacy','Privacidad'],['/school-demo/terms.html','Terms','Términos']].forEach(function(x){if(have[x[0]])return;var a=document.createElement('a');a.href=x[0];a.textContent=x[1];a.setAttribute('data-en',x[1]);a.setAttribute('data-es',x[2]);a.className='xtra';l.insertBefore(a,cta)});
function close(){l.classList.remove('open');b.setAttribute('aria-expanded','false')}
b.onclick=function(e){e.stopPropagation();var o=l.classList.toggle('open');b.setAttribute('aria-expanded',o)};
document.addEventListener('click',function(e){if(!l.contains(e.target)&&e.target!==b)close()});
l.addEventListener('click',close);
})();
</script>
