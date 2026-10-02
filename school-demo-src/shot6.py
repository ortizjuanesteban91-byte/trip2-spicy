from playwright.sync_api import sync_playwright
import os
with sync_playwright() as p:
    b=p.chromium.launch(); errs=[]
    for f in ['enroll','book-a-tour','contact','index']:
        pg=b.new_page(viewport={'width':1000,'height':900}); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+os.getcwd()+'/%s.html'%f); pg.wait_for_timeout(500)
        sel='form' if f!='index' else '#tourForm'
        pg.evaluate("document.querySelector('%s').querySelector('button[type=submit]').click()"%sel); pg.wait_for_timeout(300)
        print(f, pg.evaluate("document.querySelector('%s .ok').textContent.slice(0,60)"%sel), pg.evaluate("document.querySelectorAll('%s [aria-invalid=true]').length"%sel))
    print(errs)
