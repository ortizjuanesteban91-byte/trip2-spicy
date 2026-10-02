from playwright.sync_api import sync_playwright
import os
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1280,'height':800}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+os.getcwd()+'/index.html'); pg.wait_for_timeout(1500); pg.screenshot(path='h1.png')
    pg.click('.hd:nth-of-type(2)'); pg.wait_for_timeout(1200); pg.screenshot(path='h2.png'); print(errs)
