h=open('index.html').read()
h=h.replace('</style>',open('pgl.css').read()+'\n</style>',1).replace('</body>',open('pgl.js').read()+'</body>',1)
open('index.html','w').write(h)
