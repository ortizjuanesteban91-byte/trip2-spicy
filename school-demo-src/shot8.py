from playwright.sync_api import sync_playwright
import os
with sync_playwright() as p:
    b=p.chromium.launch(); errs=[]
    for f,w in [('blog',1280),('blog-why-enroll-with-us',1280),('blog-why-enroll-with-us',390)]:
        pg=b.new_page(viewport={'width':w,'height':900}); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto('file://'+os.getcwd()+'/%s.html'%f); pg.wait_for_timeout(1200); pg.screenshot(path='%s-%d.png'%(f,w),full_page=False)
        print(f,w,pg.evaluate("document.documentElement.scrollWidth"))
    print(errs)
