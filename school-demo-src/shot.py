from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium' if False else None)
    pg=b.new_page(viewport={'width':1280,'height':800}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+__import__('os').getcwd()+'/index.html'); pg.wait_for_timeout(1500)
    pg.screenshot(path='top.png')
    pg.click('.trust .wrap>div'); pg.wait_for_timeout(500); pg.screenshot(path='modal.png'); pg.keyboard.press('Escape')
    pg.evaluate("document.querySelector('.revw').scrollIntoView()"); pg.wait_for_timeout(1500); pg.screenshot(path='rev.png')
    print(errs, pg.evaluate("document.querySelectorAll('.rcard').length"))
