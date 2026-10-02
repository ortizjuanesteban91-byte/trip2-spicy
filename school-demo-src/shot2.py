from playwright.sync_api import sync_playwright
import os
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1280,'height':800}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+os.getcwd()+'/index.html'); pg.wait_for_timeout(1200)
    pg.click('#hrs'); pg.wait_for_timeout(700); pg.screenshot(path='hrs.png')
    pg.keyboard.press('Escape')
    pg.evaluate("document.querySelector('#programs').scrollIntoView()"); pg.wait_for_timeout(900)
    pg.click('.tab:nth-child(4)'); pg.wait_for_timeout(1300); pg.screenshot(path='tabs.png')
    for f in ['about','programs','contact']:
        q=b.new_page(); q.on('pageerror',lambda e:errs.append(f+str(e))); q.goto('file://'+os.getcwd()+'/%s.html'%f); q.wait_for_timeout(500)
    print(errs)
