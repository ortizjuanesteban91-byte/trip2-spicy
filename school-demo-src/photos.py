import re,glob
U=lambda i:"https://images.unsplash.com/photo-%s?auto=format&fit=crop&w=900&q=75"%i
M={'children in the classroom':'1761208663763-c4d30657c910','outdoor play':'1533222535026-754c501569dd','art time':'1770096679916-2cd9c720d400',
'teacher reading':'1786292949404-084cbd10c7b1','safe classroom':'1763310225230-6e15b125935a','parent pickup':'1788882681162-41c2fc0d7594'}
CYC=['1788882681164-dbb55962857d','1761208663763-c4d30657c910','1770096679916-2cd9c720d400','1786292949404-084cbd10c7b1','1547496614-d145e2fa88ed']
PROG={'infants':'1786292949404-084cbd10c7b1','toddlers':'1763310225230-6e15b125935a','transition':'1770096679916-2cd9c720d400','pre-k':'1788882681164-dbb55962857d','school-age':'1547496614-d145e2fa88ed'}
rx=re.compile(r'<div class="ph"(?: style="([^"]*)")?>\[Photo: ([^\]]*)\]</div>')
for f in glob.glob('*.html'):
    h=open(f).read(); n=[0]
    def sub(m):
        st,t=m.group(1) or '',m.group(2)
        img=M.get(t)
        if not img:
            k=[k for k in PROG if f=='programs-%s.html'%k]
            img=PROG[k[0]] if k else CYC[n[0]%5]; n[0]+=1
        st=re.sub(r'background:[^;]*;?','',st)
        return '<div class="ph" role="img" aria-label="%s" style="%sbackground:url(%s) center/cover no-repeat;color:transparent;font-size:0"></div>'%(t,st+(';' if st and not st.endswith(';') else ''),U(img))
    h=rx.sub(sub,h)
    h=h.replace("""<div class="ph" style="background:'+p.c+'">'+(lang==='en'?'[Photo: ':'[Foto: ')+p[lang]+']</div>""","""<div class="ph" style="background:url(%s) center/cover no-repeat;min-height:320px"></div>"""%U(CYC[1]))
    if 'Photos: Unsplash' not in h: h=h.replace('</footer>','<p style="font-size:12px;opacity:.7">Demo photos: Unsplash (stand-ins until real photos arrive)</p></footer>',1)
    open(f,'w').write(h)
for f in glob.glob('*.html'):
    h=open(f).read()
    if 'class="topbar"' not in h:
        h=h.replace('<header class="nav">','<div class="topbar"><div class="wrap"><span>Mon–Fri · 6:30 am – 6:00 pm &nbsp;·&nbsp; Licensed child care &amp; early learning</span><span>Call <a href="tel:+10000000000">(000) 000-0000</a> &nbsp;·&nbsp; <a href="/school-demo/book-a-tour.html">Book a tour →</a></span></div></div>\n<header class="nav">',1)
    open(f,'w').write(h)
