import re,json
from progdata import P,CITY
u=lambda i:"https://images.unsplash.com/photo-%s?auto=format&fit=crop&w=1800&q=75"%i
# subpages: longer SEO text
for d in P:
    f='programs-%s.html'%d['slug']; h=open(f).read()
    extra=''.join('<p>%s</p>'%x for x in d['p'])+'<h2>Why families choose our %s program</h2><ul>%s</ul><h2>Serving The Colony and Lewisville, TX</h2><p>%s is available at both of our Texas campuses, 6804 Anderson Dr in The Colony and 1597 Glencairn Ln in Lewisville, Monday to Friday from 6:30 am to 6:00 pm. Book a tour to see the classrooms and meet the teachers.</p>'%(d['name'].lower(),''.join('<li>%s</li>'%b for b in d['b']),d['name'])
    h=h.replace('<h2>What children do</h2>',extra+'<h2>What children do</h2>',1)
    open(f,'w').write(h)
# programs.html: SEO intro
h=open('programs.html').read()
seo='<section class="seo" style="padding-top:36px"><h2>Child care programs in The Colony and Lewisville, TX</h2>'+''.join('<h3 style="margin:22px 0 6px">%s <small style="font-weight:600;color:var(--muted)">· %s</small></h3><p>%s</p>'%(d['name'],d['ages'],d['p'][0]) for d in P)+'</section>'
h=h.replace('<div class="band"><h2>Not sure which fits?',seo+'<div class="band"><h2>Not sure which fits?',1)
open('programs.html','w').write(h)
