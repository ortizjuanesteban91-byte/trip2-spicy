import json
from progdata import P
h=open('index.html').read()
h=h.replace('</style>',open('scene.css').read()+'\n</style>',1).replace('</body>',open('scene.js').read().replace('__PDATA__',json.dumps(P))+'</body>',1)
open('index.html','w').write(h)
