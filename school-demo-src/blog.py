import re,json,glob
from blogdata import B
CSS=open('blog.css').read()
FONT='<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;0,9..144,800;1,9..144,700&display=swap" rel="stylesheet">'
img=lambda i,w=1200:"https://images.unsplash.com/photo-%s?auto=format&fit=crop&w=%d&q=75"%(i,w)
def card(p,feat=False):
    u='/school-demo/blog-%s.html'%p['slug']
    if feat: return '<a class="bfeat" data-cat="%s" href="%s"><div class="imw"><div class="im" style="background-image:url(%s)"></div></div><div class="tx"><span class="cat">%s</span><h2>%s</h2><p>%s</p><span class="meta">%d min read · Little Stars team</span><span class="rm" style="font-weight:800;color:#FFE08A">Read the article →</span></div></a>'%(p['cat'],u,img(p['img'],1400),p['cat'],p['title'],p['ex'],p['min'])
    return '<a class="bcard" data-cat="%s" href="%s"><div class="imw"><div class="im" style="background-image:url(%s)"></div></div><div class="tx"><span class="cat">%s</span><h3>%s</h3><p>%s</p><span class="meta">%d min read</span><span class="rm">Read more →</span></div></a>'%(p['cat'],u,img(p['img'],900),p['cat'],p['title'],p['ex'],p['min'])
base=open('about.html').read()
def page(title,desc,main,ld=''):
    h=re.sub(r'<main.*?</main>','<main class="bl">'+main+'</main>',base,count=1,flags=re.S)
    h=re.sub(r'<title>.*?</title>','<title>%s</title><meta name="description" content="%s"><meta property="og:title" content="%s"><meta property="og:description" content="%s"><meta property="og:type" content="article">%s%s'%(title,desc,title,desc,FONT,ld),h,count=1)
    return h.replace('</style>',CSS+'\n</style>',1)
# index
cats=['All']+sorted({p['cat'] for p in B})
idx='<div class="wrap"><div class="bhero"><span class="eyebrow">The Little Stars Journal</span><h1>Advice for growing minds</h1><p>Practical ideas for parents, and a closer look at how we care for and teach children from 6 weeks to 12 years in The Colony and Lewisville, TX.</p></div><div class="bfilter">'+''.join('<button type="button" class="%s" data-f="%s">%s</button>'%('on' if c=='All' else '',c,c) for c in cats)+'</div>'+card(B[0],True)+'<div class="bgrid">'+''.join(card(p) for p in B[1:])+'</div></div><script>(function(){var b=document.querySelectorAll(".bfilter button"),c=document.querySelectorAll("[data-cat]");b.forEach(function(x){x.onclick=function(){b.forEach(function(y){y.classList.toggle("on",y===x)});c.forEach(function(e){e.hidden=x.dataset.f!=="All"&&e.dataset.cat!==x.dataset.f})}})})();</script>'
open('blog.html','w').write(page('Blog | Little Stars Academy','Parenting and early-learning advice from Little Stars Academy: infant care, hands-on learning, potty training and kindergarten readiness in The Colony and Lewisville, TX.',idx))
# posts
for n,p in enumerate(B):
    rel=[q for q in B if q is not p][:3]
    toc=''.join('<a href="#s%d">%d. %s</a>'%(i+1,i+1,s[0]) for i,s in enumerate(p['S']))
    body='<div class="tk"><h3>Key takeaways</h3><ul>%s</ul></div>'%''.join('<li>%s</li>'%t for t in p['take'])
    for i,(h2,p1,p2) in enumerate(p['S']):
        body+='<h2 id="s%d"><span>%d</span>%s</h2><p>%s</p>'%(i+1,i+1,h2,p1)
        if p2: body+='<p>%s</p>'%p2
        if i==1: body+='<div class="pq">%s</div>'%(re.split(r'(?<=[.!?]) ',p['S'][i][1])[0])
    if p.get('faq'): body+='<h2><span>?</span>Frequently asked questions</h2><div class="faqb">'+''.join('<details><summary>%s</summary><p>%s</p></details>'%q for q in p['faq'])+'</div>'
    main='<div class="wrap art"><div class="arthead"><div class="crumbs" style="margin-bottom:10px"><a href="/school-demo/index.html">Home</a> / <a href="/school-demo/blog.html">Blog</a> / %s</div><span class="cat">%s</span><h1>%s</h1><div class="meta">By the Little Stars early-learning team · October 2, 2026 · %d min read</div></div><div class="arthero" role="img" aria-label="%s" style="background-image:url(%s)"></div><div class="artgrid"><article class="artbody">%s<div class="author"><i>⭐</i><div><b>Little Stars Academy team</b><br><span style="color:var(--muted)">Early-childhood educators serving families in The Colony and Lewisville, TX, with 25+ years of experience.</span></div></div></article><aside class="side"><div class="toc"><h4>In this article</h4>%s</div><div class="sidecta"><h4>See it in person</h4><p>Book a tour and meet the teachers at The Colony or Lewisville.</p><a class="btn" href="/school-demo/book-a-tour.html">Book a tour</a></div></aside></div><div class="related"><h2>Keep reading</h2><div class="bgrid">%s</div></div></div>'%(p['cat'],p['cat'],p['title'],p['min'],p['title'],img(p['img'],1600),body,toc,''.join(card(q) for q in rel))
    art={"@context":"https://schema.org","@type":"Article","headline":p['title'],"description":p['ex'],"image":img(p['img'],1600),"datePublished":"2026-10-02","author":{"@type":"Organization","name":"Little Stars Academy"},"publisher":{"@type":"Organization","name":"Little Stars Academy"}}
    ld='<script type="application/ld+json">'+json.dumps(art)+'</script>'
    if p.get('faq'): ld+='<script type="application/ld+json">'+json.dumps({"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in p['faq']]})+'</script>'
    open('blog-%s.html'%p['slug'],'w').write(page(p['title']+' | Little Stars Academy',p['ex'],main,ld))
# home section
home='<section class="homeblog" style="padding-top:0"><div class="wrap"><div class="eyebrow">From our blog</div><h2>Why families enroll with us</h2><div class="bgrid">'+''.join(card(p) for p in B[:3])+'</div><p style="margin-top:22px"><a class="btn btn-main" href="/school-demo/blog.html">Read all articles</a></p></div></section>\n'
h=open('index.html').read()
h=h.replace('<section id="faq"',home+'<section id="faq"',1).replace('</style>',CSS+'\n</style>',1)
open('index.html','w').write(h)
# nav + footer links everywhere
for f in glob.glob('*.html'):
    h=open(f).read()
    h=re.sub(r'(<nav class="links"[^>]*>.*?<a href="/school-demo/about\.html"[^>]*>About</a>)',r'\1<a href="/school-demo/blog.html">Blog</a>',h,count=1,flags=re.S)
    h=h.replace('<a href="/school-demo/careers.html">Careers</a> ·','<a href="/school-demo/blog.html">Blog</a> · <a href="/school-demo/careers.html">Careers</a> ·',1)
    open(f,'w').write(h)
