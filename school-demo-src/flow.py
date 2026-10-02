import glob
hrsHTML='''<div class="topbar"><div class="wrap"><button class="hrs" id="hrs" type="button" aria-expanded="false" aria-controls="hpop"><span class="live" id="hlive"></span><b id="hst">Open now</b><span id="hsd">· Mon–Fri 6:30 am – 6:00 pm</span><span class="chev">▾</span></button><span class="mid">Licensed child care &amp; early learning</span><a class="tbk" href="/school-demo/book-a-tour.html">📅 Book a tour →</a>
<div class="hpop" id="hpop" role="dialog" aria-label="Opening hours"><h4>Opening hours</h4><div class="hrow" data-d="1"><span>Monday</span><span>6:30 am – 6:00 pm</span></div><div class="hrow" data-d="2"><span>Tuesday</span><span>6:30 am – 6:00 pm</span></div><div class="hrow" data-d="3"><span>Wednesday</span><span>6:30 am – 6:00 pm</span></div><div class="hrow" data-d="4"><span>Thursday</span><span>6:30 am – 6:00 pm</span></div><div class="hrow" data-d="5"><span>Friday</span><span>6:30 am – 6:00 pm</span></div><div class="hrow closed" data-d="6"><span>Saturday</span><span>Closed</span></div><div class="hrow closed" data-d="0"><span>Sunday</span><span>Closed</span></div><div class="hbar"><b></b></div><a class="btn btn-main" href="/school-demo/book-a-tour.html">Book a tour</a></div></div></div>'''
css=open('flow.css').read(); js=open('flow.js').read()
import re
for f in glob.glob('*.html'):
    h=open(f).read()
    h=re.sub(r'<div class="topbar">.*?</div></div>\n(?=<header)',hrsHTML+'\n',h,count=1,flags=re.S)
    if 'id="hpop"' not in h: print('topbar not replaced',f)
    h=h.replace('</style>',css+'\n</style>',1).replace('</body>',js+'</body>',1)
    open(f,'w').write(h)
