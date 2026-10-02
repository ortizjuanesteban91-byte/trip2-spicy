import json,glob
C=json.load(open('config.json')); Y=C['years']; S=C['schools']; Yn=Y.rstrip('+')
R={'index.html':[
('[One sentence about your approach: play-based learning, small groups and teachers who know every child by name.]','More than %s years of high-quality early learning in The Colony and Lewisville, Texas, where a child who struggles one week is thriving the next.'%Y),
('Now enrolling · ages 6 weeks to 12 years','%s years · ages 6 weeks to 12 years'%Y),
('<b data-to="15" data-suf="+">0</b><span>Years caring for families</span>','<b data-to="%s" data-suf="+">0</b><span>Years of early-education experience</span>'%Yn),
('<b data-to="500" data-suf="+">0</b><span>Families served</span>','<b data-to="%s" data-suf="">0</b><span>Schools led by our owner</span>'%S),
('<span>Play-based learning</span>','<span>%s years of experience</span><span>%s schools, one standard of quality</span><span>Play-based learning</span>'%(Y,S)),
('Loved by families','What makes us different'),
('Families trust us','Experience you can trust')],
'about.html':[
('[A short, true story of the school: who started it, why, and what families can expect.]','Our owner has spent more than %s years in early education and leads %s schools, built on one standard: high-quality care and teaching where children who struggle one week are thriving the next.'%(Y,S)),
('[Teacher credentials, years of experience, background checks, first aid training.]','[Teacher credentials, background checks, first aid training: to confirm with the school.]')]}
for f,rs in R.items():
    h=open(f).read()
    for a,b in rs: h=h.replace(a,b)
    open(f,'w').write(h)
