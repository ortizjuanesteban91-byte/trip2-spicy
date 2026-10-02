import glob,json,re
NAME="Little Stars Academy"
desc={
'index':"High-quality child care and early learning in The Colony and Lewisville, TX. More than 25 years of experience with infants, toddlers, Pre-K and school-age children. Book a tour today.",
'about':"Meet "+NAME+": 25+ years of high-quality early learning, caring teachers, and hands-on, play-based education in The Colony and Lewisville, Texas.",
'programs':"Infant, toddler, transition/potty training, Pre-K and school-age programs in The Colony and Lewisville, TX. Ages 6 weeks to 12 years.",
'locations':"Two Texas campuses: 6804 Anderson Dr, The Colony and 1597 Glencairn Ln, Lewisville. Open Monday to Friday, 6:30 am to 6:00 pm.",
'contact':"Call (940) 314-5437 or send a message. Child care in The Colony and Lewisville, TX. Open Monday to Friday, 6:30 am to 6:00 pm.",
'book-a-tour':"Book a tour of our child care centers in The Colony and Lewisville, TX. See the classrooms and meet the teachers.",
'enroll':"Enroll your child in infant, toddler, Pre-K or school-age care in The Colony and Lewisville, TX.",
'careers':"Join our team of caring early-childhood educators in The Colony and Lewisville, TX.",
'parent-portal':"Parent portal: daily reports, photos, billing and messages.",
'privacy':"Privacy policy.","terms":"Terms and conditions."}
ld={"@context":"https://schema.org","@type":"ChildCare","name":NAME,"description":desc['index'],"telephone":"+1-940-314-5437","priceRange":"$$",
"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday"],"opens":"06:30","closes":"18:00"}],
"location":[{"@type":"Place","name":NAME+" The Colony","address":{"@type":"PostalAddress","streetAddress":"6804 Anderson Dr","addressLocality":"The Colony","addressRegion":"TX","postalCode":"75056","addressCountry":"US"}},
{"@type":"Place","name":NAME+" Lewisville","address":{"@type":"PostalAddress","streetAddress":"1597 Glencairn Ln","addressLocality":"Lewisville","addressRegion":"TX","postalCode":"75067","addressCountry":"US"}}],
"areaServed":["The Colony, TX","Lewisville, TX"],"audience":{"@type":"PeopleAudience","suggestedMinAge":0,"suggestedMaxAge":12}}
for f in glob.glob('*.html'):
    k=f[:-5]; d=desc.get(k,desc.get(k.split('-')[0],desc['programs']))
    h=open(f).read()
    meta='<meta name="description" content="%s"><meta property="og:title" content="%s"><meta property="og:description" content="%s"><meta property="og:type" content="website"><meta property="og:locale" content="en_US"><meta name="twitter:card" content="summary_large_image">'%(d,re.search(r'<title>(.*?)</title>',h).group(1),d)
    if k=='index': meta+='<script type="application/ld+json">'+json.dumps(ld)+'</script>'
    if 'name="description"' not in h: h=h.replace('</title>','</title>'+meta,1)
    h=h.replace('<html lang="en">','<html lang="en-US">') if '<html lang="en">' in h else h
    open(f,'w').write(h)
