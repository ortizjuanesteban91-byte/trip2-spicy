import glob,re
R=[('<span>Bilingual classrooms</span>','<span>Sensory room</span>'),
('<span>State licensed</span>','<span>Cultural curriculum</span>'),
('<small>Classrooms</small><b>English · Español</b>','<small>Two Texas campuses</small><b>The Colony · Lewisville</b>'),
('<small>Safety first</small><b>State licensed</b>','<small>Ready for kindergarten</small><b>Pre-K curriculum</b>'),
('<div><b>EN · ES</b><span data-en="Bilingual classrooms" data-es="Aulas bilingües">Bilingual classrooms</span></div>','<div><b>5 programs</b><span>Ages 6 weeks to 12 years</span></div>'),
('Licensed child care &amp; early learning','Child care &amp; early learning · The Colony &amp; Lewisville, TX'),
('Licensed child care and early learning','Child care and early learning'),
('Clean, bright, safe, and the bilingual classroom made a real difference. Our son is already singing in two languages.','Clean, bright and safe, and the art and hands-on play made a real difference. Our son comes home excited every day.'),
('tel:+10000000000','tel:+19403145437'),('(000) 000-0000','(940) 314-5437'),
('[Street address]<br>[Phone number]<br>[Email address]','<b>The Colony</b><br>6804 Anderson Dr, The Colony, TX 75056<br><b>Lewisville</b><br>1597 Glencairn Ln, Lewisville, TX 75067<br>(940) 314-5437<br>[Email address]'),
('[Street address]<br>[Phone number]','<b>The Colony:</b> 6804 Anderson Dr, The Colony, TX 75056<br><b>Lewisville:</b> 1597 Glencairn Ln, Lewisville, TX 75067<br>(940) 314-5437'),
('<h3>Campus One</h3><p>[Street address]<br>[City, State ZIP]<br>[Phone number]','<h3>The Colony</h3><p>6804 Anderson Dr<br>The Colony, TX 75056<br>(940) 314-5437'),
('<h3>Campus Two</h3><p>[Street address]<br>[City, State ZIP]<br>[Phone number]','<h3>Lewisville</h3><p>1597 Glencairn Ln<br>Lewisville, TX 75067<br>(940) 314-5437'),
("Children learn in English and Spanish through songs, stories and play, so both languages feel natural.","Children explore, create and play hands-on, with art and a sensory room."),
("['Bilingual classrooms'","['Sensory room and hands-on play'"),
('<style>','<style>#lang{display:none!important}',) ]
for f in glob.glob('*.html'):
    h=open(f).read()
    for a,b in R: h=h.replace(a,b,1) if a=='<style>' else h.replace(a,b)
    open(f,'w').write(h)
