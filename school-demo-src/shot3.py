from playwright.sync_api import sync_playwright
import os
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':800},device_scale_factor=2); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+os.getcwd()+'/index.html'); pg.wait_for_timeout(1500); pg.screenshot(path='m1.png')
    pg.click('.burger'); pg.wait_for_timeout(900); pg.screenshot(path='m2.png'); print(errs, pg.evaluate("document.documentElement.scrollWidth"))
