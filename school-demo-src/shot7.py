from playwright.sync_api import sync_playwright
import os
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1280,'height':800}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+os.getcwd()+'/index.html'); pg.wait_for_timeout(800)
    pg.evaluate("document.querySelector('#programs').scrollIntoView()"); pg.wait_for_timeout(1200)
    pg.click('.tab:nth-child(3)'); pg.wait_for_timeout(500); pg.click('.explore'); pg.wait_for_timeout(1800); pg.screenshot(path='scene.png')
    pg.keyboard.press('Escape')
    pg.evaluate("document.querySelector('#find').scrollIntoView()"); pg.wait_for_timeout(1200); pg.screenshot(path='find.png')
    q=b.new_page(); q.on('pageerror',lambda e:errs.append(str(e))); q.goto('file://'+os.getcwd()+'/programs-infants.html'); q.wait_for_timeout(400)
    print(errs, q.evaluate("document.querySelectorAll('.prose p').length"))
