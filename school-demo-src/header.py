import glob
c=open('header.css').read(); j=open('header.js').read()
for f in glob.glob('*.html'):
    h=open(f).read(); h=h.replace('</style>',c+'\n</style>',1).replace('</body>',j+'</body>',1); open(f,'w').write(h)
