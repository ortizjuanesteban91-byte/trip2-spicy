import re
h=open('index.html').read()
css=open('enhance.css').read(); js=open('enhance.js').read()
h=h.replace('</style>',css+'\n</style>',1)
h=h.replace('<div class="wrap hero">','<section class="herofull" style="padding:0"><div class="hero-bg"></div><span class="spark" style="width:220px;height:220px;left:6%;top:12%"></span><span class="spark" style="width:160px;height:160px;right:30%;bottom:18%;animation-delay:-3s"></span><div class="wrap hero">',1)
a=h.index('<div class="collage"'); b=h.index('\n<div class="trust">')
chips='''<div class="chips"><a class="chip" href="javascript:void(0)"><small>Parent rating</small><b>5.0 ★★★★★</b></a><a class="chip" href="javascript:void(0)"><small>Safety first</small><b>State licensed</b></a><a class="chip" href="javascript:void(0)"><small>Classrooms</small><b>English · Español</b></a></div>
</div>
<div class="wave"><svg viewBox="0 0 1440 60" preserveAspectRatio="none"><path d="M0,30 C240,70 480,0 720,28 C960,56 1200,6 1440,34 L1440,60 L0,60 Z" fill="#FFFFFF"/></svg></div></section>
'''
h=h[:a]+chips+h[b:]
cards=[('M','Maria G.','Mother of two','The teachers know every child by name. My daughter runs in every morning and the daily photos make my workday easier.','#0A63F5'),
('J','James T.','Toddler parent','Clean, bright, safe, and the bilingual classroom made a real difference. Our son is already singing in two languages.','#FF6B57'),
('A','Ana R.','Pre-K parent','Kindergarten readiness was exactly what we wanted. She reads simple books and is excited to learn.','#12B886'),
('D','David L.','Infant parent','Warm and caring from the first tour. They follow our baby\'s schedule and send updates all day.','#9B5DE5'),
('S','Sofia P.','School-age parent','After-school and summer camp were great. Homework help and fun activities, and pickup is easy.','#F59F00'),
('C','Carlos M.','Parent of three','Three kids, one place that works for all of them. Communication with the office is always quick.','#0B2545')]
def card(c):
    return '<div class="rcard"><div class="who"><span class="av" style="background:%s">%s</span><div><b>%s</b><small>%s</small></div><span class="ver">Verified parent</span></div><div class="stars">★★★★★</div><p>“%s”</p></div>'%(c[4],c[0],c[1],c[2],c[3])
trk=''.join(card(c) for c in cards)*2
rev='''<div class="eyebrow" data-en="Parent reviews" data-es="Opiniones de padres">Parent reviews</div>
  <h2 data-en="Loved by families" data-es="Queridos por las familias">Loved by families</h2>
  <div class="revw">
    <div class="revsum"><div class="big">5.0</div><div class="stars">★★★★★</div><div style="font-weight:700">Based on 120+ parent reviews</div>
      <div class="bar"><span>5★</span><i><b style="--w:94%"></b></i><span>94%</span></div><div class="bar"><span>4★</span><i><b style="--w:5%"></b></i><span>5%</span></div><div class="bar"><span>3★</span><i><b style="--w:1%"></b></i><span>1%</span></div>
      <a class="btn btn-main" href="/school-demo/contact.html">Leave a review</a><div class="sample">Sample content. Live Google reviews connect here at launch.</div></div>
    <div class="marq"><div class="track">'''+trk+'''</div></div>
  </div>
'''
s=h.index('<div class="eyebrow" data-en="Parent reviews"'); e=h.index('</div></section>',s)
h=h[:s]+rev+h[e:]
h=h.replace('</body>',js+'</body>',1)
open('index.html','w').write(h)
