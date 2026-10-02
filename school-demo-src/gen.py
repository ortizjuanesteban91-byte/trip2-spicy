import re,os
src=open('/tmp/claude-0/-home-claude/9a52dd68-4e48-5c4c-aa2a-e3792b16b8eb/scratchpad/little-stars/index.html').read()
style=re.search(r'<style>(.*?)</style>',src,re.S).group(1)
TOK=open('tok.css').read()
BRIGHT=open('bright.css').read()
def retheme(css):
    b=css.index('*{box-sizing')
    return TOK+css[b:]+BRIGHT
style=retheme(style)
fonts=re.search(r'(<link rel="preconnect".*?display=swap" rel="stylesheet">)',src,re.S).group(1)
extra="""
.sub{padding-block:56px 24px}.sub h1{font-size:clamp(36px,5vw,60px);font-weight:800;margin:10px 0 14px}
.crumbs{font-size:14px;color:var(--muted)}.crumbs a{color:var(--brand)}
.prose{max-width:760px;font-size:18px}.prose h2{font-size:30px;margin:36px 0 10px}.prose ul{padding-left:22px;display:grid;gap:8px}
.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:24px;padding:24px;text-decoration:none;display:block}
.card h3{font-size:26px;margin:8px 0}.card p{margin:0;color:var(--muted)}
.band{background:var(--sun);color:var(--sun-ink);border-radius:32px;padding:36px;display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;margin-block:48px}
.band h2{font-size:32px}.band .btn-main{background:var(--sun-ink);color:#fff}
.formbox{max-width:620px}
@media(max-width:860px){.grid2,.grid3{grid-template-columns:minmax(0,1fr)}}
.links a,.pill,.logo span,.btn{white-space:nowrap}
.nav .wrap{flex-wrap:wrap}
@media(max-width:1100px){.links{order:3;width:100%;overflow-x:auto;padding-bottom:4px}}
@media(max-width:860px){.links a:not(.btn){display:inline-block!important}}
.links a.cur{color:var(--brand);text-decoration:underline;text-underline-offset:6px}
"""
P="/school-demo/"
def nav(cur):
    items=[("index.html","Home"),("programs.html","Programs"),("locations.html","Locations"),("about.html","About"),("contact.html","Contact")]
    l=''.join(f'<a href="{P}{h}"{" class=cur" if h==cur else ""}>{t}</a>' for h,t in items)
    return f'''<header class="nav"><div class="wrap"><a class="logo" href="{P}index.html"><i aria-hidden="true"></i><span>Little Stars Academy</span></a><nav class="links" aria-label="Main">{l}<a href="{P}parent-portal.html">Parent Portal</a><a href="{P}book-a-tour.html" class="btn btn-sun" style="padding:10px 20px">Book a tour</a></nav></div></header>'''
foot=f'''<footer><div class="wrap"><span>© Little Stars Academy · design preview with placeholder content</span><span><a href="{P}careers.html">Careers</a> · <a href="{P}enroll.html">Enroll</a> · <a href="{P}privacy.html">Privacy</a> · <a href="{P}terms.html">Terms</a></span></div></footer>'''
formjs="""<script>document.querySelectorAll('form.demo').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var ok=Array.prototype.every.call(f.querySelectorAll('[required]'),function(x){return x.value.trim()});var b=f.querySelector('.ok');b.hidden=false;b.style.background=ok?'var(--mint)':'var(--blush)';b.textContent=ok?'Thank you. This is a design preview, so nothing was sent. On the live site this goes straight to the school inbox.':'Please fill in the required fields.';});});</script>"""
def page(fn,title,crumb,body,cur=None):
    h=f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>{title} | Little Stars Academy</title>
{fonts}<style>{style}{extra}</style></head><body>
{nav(cur or fn)}<main><div class="wrap">{body}</div></main>{foot}{formjs}</body></html>'''
    open(fn,'w').write(h)
def sub(t,crumb,intro):
    return f'<div class="sub"><div class="crumbs"><a href="{P}index.html">Home</a> / {crumb}</div><h1>{t}</h1><p class="lede">{intro}</p></div>'
def band(t="Come see us in person.",b="Book a tour"):
    return f'<div class="band"><h2>{t}</h2><a class="btn btn-main" href="{P}book-a-tour.html">{b}</a></div>'
def field(i,l,req=True,typ="text"):
    return f'<label for="{i}">{l}<input id="{i}" type="{typ}" {"required" if req else ""}></label>'
def form(fields,btn,extra=""):
    return f'<form class="demo formbox" novalidate>{fields}{extra}<button class="btn btn-main" type="submit">{btn}</button><div class="ok" hidden></div></form>'
ages=[("infants","Infants","6 weeks to 18 months","Nurturing care, safe beginnings","Gentle, responsive care in a calm room, with a routine that follows each baby's own schedule.",["Feeding and sleep on each baby's schedule","Tummy time, music and sensory play","Daily report for parents"],"var(--mint)"),
("toddlers","Toddlers","15 to 36 months","Exploring, playing, growing","First words, first friends and a lot of safe exploring.",["Language through songs and stories","Art, building and outdoor play","Gentle routines for sharing and turns"],"var(--sky)"),
("transition","Transition and Potty Training","Toddler to Pre-K","Confidence, one step at a time","A bridge between the toddler room and preschool, with potty training support alongside parents.",["Potty training plan shared with parents","Self-care skills: hands, shoes, lunch","Short group lessons to build focus"],"var(--butter)"),
("pre-k","Preschool and Pre-K","3 to 5 years","Ready for kindergarten","Letters, numbers and the confidence to start kindergarten ready to learn.",["Early reading and math","Science and art projects","Kindergarten readiness checks"],"var(--blush)"),
("school-age","School Age","6 to 12 years","Learn, create, explore","After-school care with homework help, clubs and a full summer camp.",["Homework help every day","Clubs: art, sports, coding","Summer camp, week by week"],"var(--sky)")]
# programs index
cards=''.join(f'<a class="card" href="{P}programs-{s}.html"><span class="age">{a}</span><h3>{n}</h3><p>{tg}</p></a>' for s,n,a,tg,d,l,c in ages)
page('programs.html','Programs','Programs',sub('Programs','Programs','Find the right classroom for your child.')+f'<div class="grid3">{cards}</div>'+band('Not sure which fits?','Talk to us'),'programs.html')
for s,n,a,tg,d,l,c in ages:
    li=''.join(f'<li>{x}</li>' for x in l)
    others=''.join(f'<a class="pill" href="{P}programs-{s2}.html" style="text-decoration:none;display:inline-block">{n2}</a> ' for s2,n2,*_ in ages if s2!=s)
    body=sub(n,f'<a href="{P}programs.html">Programs</a> / {n}',tg)+f'<div class="grid2" style="align-items:center"><div class="prose"><span class="age">{a}</span><p>{d}</p><h2>What children do</h2><ul>{li}</ul><p style="margin-top:24px"><a class="btn btn-main" href="{P}book-a-tour.html">Book a tour</a> <a class="btn btn-line" href="{P}enroll.html">Enroll now</a></p></div><div class="ph" style="background:{c};min-height:320px">[Photo: {n} classroom]</div></div><h2 style="margin:40px 0 12px;font-size:26px">Other programs</h2><div>{others}</div>'+band()
    page(f'programs-{s}.html',n,n,body,'programs.html')
# locations
loc=lambda n:f'<div class="card"><h3>{n}</h3><p>[Street address]<br>[City, State ZIP]<br>[Phone number]<br>Monday to Friday, 6:30 am to 6:00 pm</p><p style="margin-top:14px"><a class="btn btn-main" href="{P}book-a-tour.html">Book a tour here</a></p></div>'
page('locations.html','Locations','Locations',sub('Our campuses','Locations','Two welcoming places to learn. [Edit to match the real campuses.]')+f'<div class="grid2">{loc("Campus One")}{loc("Campus Two")}</div><div class="ph" style="background:var(--sky);height:280px;margin-top:20px">[Map: add a Google Maps link for each campus]</div>'+band())
# about
page('about.html','About','About',sub('About us','About','[A short, true story of the school: who started it, why, and what families can expect.]')+'<div class="prose"><h2>Our approach</h2><p>[Two or three sentences on your teaching philosophy: play-based, hands-on, inclusive.]</p><h2>Our team</h2><p>[Teacher credentials, years of experience, background checks, first aid training.]</p><h2>Our values</h2><ul><li>Every child is seen and known by name</li><li>Families are partners, always informed</li><li>Safe, clean, joyful classrooms</li></ul></div>'+band())
# contact
page('contact.html','Contact','Contact',sub('Contact us','Contact','Questions? Send a message and we reply within one business day.')+'<div class="grid2"><div>'+form(field('cn','Your name')+field('ce','Email',True,'email')+field('cp','Phone',False)+'<label for="cm">Message<textarea id="cm" rows="4" required style="font:500 17px var(--body);padding:13px 14px;border-radius:12px;border:2px solid var(--line);background:var(--bg);color:var(--ink);width:100%"></textarea></label>','Send message')+'</div><div class="card"><h3>Visit or call</h3><p>[Street address]<br>[Phone number]<br>[Email address]<br>Monday to Friday, 6:30 am to 6:00 pm</p></div></div>'+band())
# book a tour
page('book-a-tour.html','Book a tour','Book a tour',sub('Book a tour','Book a tour','Tours take about 20 minutes. We show you the classrooms and answer every question.')+form(field('tn','Parent name')+field('tc','Phone or email')+field('td','Preferred day',False,'date')+'<label for="ta">Child\'s age<select id="ta" required><option value="">Choose</option><option>6 weeks to 18 months</option><option>15 to 36 months</option><option>3 to 5 years</option><option>6 to 12 years</option></select></label>','Request a tour')+'<div style="height:48px"></div>')
# enroll
page('enroll.html','Enroll','Enroll',sub('Enroll now','Enroll','Four simple steps. We confirm your start date within one day.')+'<div class="grid2"><div class="prose"><ul><li>Book a tour and meet the team</li><li>Complete this short form</li><li>We confirm your start date</li><li>Bring your child\'s records on the first day</li></ul></div><div>'+form(field('en','Parent name')+field('ee','Email',True,'email')+field('ep','Phone')+field('ek','Child\'s name')+field('eb','Child\'s birth date',True,'date')+field('es','Desired start date',False,'date'),'Submit enrollment')+'</div></div><div style="height:48px"></div>')
# parent portal
page('parent-portal.html','Parent Portal','Parent Portal',sub('Parent Portal','Parent Portal','Daily reports, photos, billing and messages in one place.')+'<div class="grid2"><div class="card"><h3>Sign in</h3><p>[Link to your parent app or portal login goes here.]</p><p style="margin-top:14px"><a class="btn btn-main" href="'+P+'contact.html">Need help signing in?</a></p></div><div class="card"><h3>New family?</h3><p>After enrollment you receive an invitation to the portal by email.</p><p style="margin-top:14px"><a class="btn btn-line" href="'+P+'enroll.html">Enroll now</a></p></div></div><div style="height:48px"></div>')
# careers
page('careers.html','Careers','Careers',sub('Careers','Careers','Join a team that loves working with children.')+'<div class="prose"><h2>Open roles</h2><ul><li>Lead teacher, preschool [edit]</li><li>Assistant teacher, toddlers [edit]</li><li>After-school aide [edit]</li></ul></div><div class="grid2" style="margin-top:20px"><div>'+form(field('jn','Your name')+field('je','Email',True,'email')+field('jr','Role you are interested in'),'Send application')+'</div></div><div style="height:48px"></div>')
# legal
leg=lambda t,ps:sub(t,t,'[Replace with your own text, reviewed by your lawyer.]')+'<div class="prose">'+''.join(f'<h2>{h}</h2><p>{p}</p>' for h,p in ps)+'</div><div style="height:48px"></div>'
page('privacy.html','Privacy','Privacy',leg('Privacy policy',[("What we collect","[Names, contact details and children's information given in forms.]"),("How we use it","[Only to run the school and contact families.]"),("Children's information","[How records are stored, who can see them, how to request deletion.]")]))
page('terms.html','Terms','Terms',leg('Terms and conditions',[("Enrollment","[Registration fee, tuition due dates, withdrawal notice.]"),("Health and safety","[Illness policy, pickup authorization.]"),("Use of this website","[Content is provided for information.]")]))
# home: link up
h=src
h=h.replace('<title>Little Stars Academy</title>','<meta name="robots" content="noindex,nofollow"><title>Little Stars Academy</title>')
h=h.replace('href="#top"',f'href="{P}index.html"')
h=h.replace('<a href="#day" data-en="A day here" data-es="Un día aquí">A day here</a>','').replace('<a href="#faq" data-en="FAQ" data-es="Preguntas">FAQ</a>','')
h=h.replace(re.search(r'<style>.*?</style>',h,re.S).group(0),'<style>'+retheme(re.search(r'<style>(.*?)</style>',h,re.S).group(1))+'</style>',1)
h=h.replace('</style>',""".links a,.pill,.logo span,.btn{white-space:nowrap}\n.nav .wrap{flex-wrap:wrap}\n@media(max-width:1100px){.links{order:3;width:100%;overflow-x:auto;padding-bottom:4px}}\n@media(max-width:860px){.links a:not(.btn){display:inline-block!important}}\n</style>""",1)
h=h.replace('.links a{display:none}','')
h=h.replace('<a href="#programs" data-en="Programs" data-es="Programas">Programs</a>',f'<a href="{P}programs.html" data-en="Programs" data-es="Programas">Programs</a><a href="{P}locations.html" data-en="Locations" data-es="Sedes">Locations</a><a href="{P}about.html" data-en="About" data-es="Nosotros">About</a><a href="{P}contact.html" data-en="Contact" data-es="Contacto">Contact</a><a href="{P}parent-portal.html" data-en="Parent Portal" data-es="Portal de Padres">Parent Portal</a>')
h=h.replace('<a href="#tour" class="btn btn-sun" style="padding:10px 20px"',f'<a href="{P}book-a-tour.html" class="btn btn-sun" style="padding:10px 20px"')
h=h.replace('<a class="btn btn-main" href="#tour" data-en="Book a tour"',f'<a class="btn btn-main" href="{P}book-a-tour.html" data-en="Book a tour"')
h=h.replace('<a class="btn btn-line" href="#programs"',f'<a class="btn btn-line" href="{P}programs.html"')
h=h.replace("href=\"#tour\">'+(lang","href=\"/school-demo/book-a-tour.html\">'+(lang")
h=h.replace('<span>Privacy · Terms</span>',f'<span><a href="{P}careers.html">Careers</a> · <a href="{P}enroll.html">Enroll</a> · <a href="{P}privacy.html">Privacy</a> · <a href="{P}terms.html">Terms</a></span>')
h=h.replace('.links a{display:none}','.links a:not(.btn){display:none}')
open('index.html','w').write('<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n'+h+'\n</body></html>\n')
