import os, re, json, subprocess, sys, glob
ROOT = "/tmp/claude-0/t2"
LABELS = ["URL slug","Canonical","301 redirect from","SEO Title","Meta Description","Focus keyword","Secondary keywords","H1","H2 order","Image alt texts","Breadcrumb","Schema prices","Schema JSON-LD","Internal links","Category"]
def pdf(path, layout=False):
    a = ["pdftotext"] + (["-layout"] if layout else []) + [path, "-"]
    return subprocess.run(a, capture_output=True, text=True).stdout.replace("\f", "\n")
def parse_seo(path):
    txt = pdf(path, True); out = {}; cur = None
    for line in txt.split("\n"):
        left, right = line[:29], line[29:]
        m = re.match(r"^\s{0,3}(" + "|".join(re.escape(l) for l in LABELS) + r")\b", left)
        if m and left.strip():
            cur = m.group(1); out[cur] = [right.strip()] if right.strip() else []
            if cur == "Schema JSON-LD": cur = "_skip"; out["_skip"] = []
            continue
        if cur and cur != "_skip" and right.strip(): out[cur].append(right.strip())
        elif cur and cur != "_skip" and line.strip() and not left.strip(): out[cur].append(line.strip())
        elif cur and cur != "_skip" and left.strip() and not right.strip() and not re.match(r"^\s*(characters\)|\d+ characters\))", left): pass
    return out
def join(v): return " ".join(v).strip() if v else ""
def clean_lines(txt):
    lines = []
    for l in txt.split("\n"):
        l = l.strip()
        if re.match(r"^TRIP2 ·", l): continue
        lines.append(l)
    return lines
def paras(lines):
    out, cur = [], []
    for l in lines:
        if not l:
            if cur: out.append(" ".join(cur)); cur = []
            continue
        cur.append(l)
        if len(l) < 88 and re.search(r"[.?!)”\"→]$", l): out.append(" ".join(cur)); cur = []
    if cur: out.append(" ".join(cur))
    return out
def items(lines):
    r = [l for l in lines if l]
    return [re.sub(r"^[•·\-–]\s*", "", x) for x in r]
def merge_items(lines):
    out = []
    for l in lines:
        l = re.sub(r"^[•·\-–]\s*", "", l.strip())
        if not l: continue
        if out and (l[0].islower() or out[-1].endswith((" and", " to", " of", " the", " a", " in", " with", " or", " for", " from", " at", " on", ","))): out[-1] += " " + l
        else: out.append(l)
    return out
def split_dash(lines):
    # "Included - a - b - c" style (may wrap)
    out = []; cur = None
    for l in lines:
        if not l: continue
        m = re.match(r"^(Included|Not included|Pros|Cons)\b\s*[-–]?\s*(.*)", l)
        if m: cur = [m.group(1), m.group(2)]; out.append(cur)
        elif cur: cur[1] += (" " if not cur[1].endswith("-") else "") + l
    res = []
    for k, v in out:
        parts = [p.strip() for p in re.split(r"\s+[-–]\s+", " - " + v) if p.strip()]
        res.append({"label": k, "items": parts})
    return res
def faqs(lines):
    out = []; cur = None
    for l in lines:
        if not l: continue
        m = re.match(r"^([A-Z][^?]{4,140}\?)\s*(.*)$", l)
        new = m and (cur is None or re.search(r"[.!?)”\"]$", cur["a"] or cur["q"]))
        if new:
            cur = {"q": m.group(1), "a": m.group(2)}; out.append(cur)
        elif cur:
            cur["a"] = (cur["a"] + " " + l).strip()
    return out
def sectionize(lines, h2s):
    # find index of each H2 line in order
    idx = []; pos = 0
    norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
    for h in h2s:
        for i in range(pos, len(lines)):
            if norm(lines[i]) == norm(h): idx.append((h, i)); pos = i + 1; break
    return idx
FROM = {"01":59,"02":125,"04":50,"05":125,"06":67.5,"07":119,"09":120,"10":99,"11":45,"12":45,"13":100,"17":129,"18":85,"19":85,"20":130,"22":120,"23":140,"25":105,"26":140,"27":140,"29":90,"30":105,"31":155,"35":149,"37":55,"38":130.5,"39":124.5,"40":175.5,"41":90}
MIN2 = {"04","06","21","22","23","26","27","29","30","31"}
MULTI = {"38":["Single","Double","Triple","Quadruple"],"39":["Single","Double","Triple","Quadruple"],"40":["Single","Double","Triple","Quadruple"]}
def options(num, prices):
    out = []
    parts = [x.strip() for x in prices.split("·")]
    # re-merge pieces that lost their price tag (wrapped text)
    for k, x in enumerate(parts):
        m = re.search(r"\$\s?(\d[\d,.]*)\s*$", x)
        if not m: continue
        label = x[:m.start()].strip(); price = float(m.group(1).replace(",", ""))
        out.append([label, price])
    if num in MULTI:
        out = [[n, o[1]] for n, o in zip(MULTI[num], out)]
    res = []
    for label, price in out:
        l = label.lower(); people = 1; unit = "person"
        mm = re.search(r"\((\d)\s*(?:person|people|rider)", l)
        if "single" in l: people = 1
        elif "double" in l: people = 2
        elif "triple" in l: people = 3
        elif "quadruple" in l: people = 4
        elif "family" in l: people = 3 if num in ("04","05","06") else 4
        elif mm: people = int(mm.group(1))
        if re.search(r"single|double|triple|quadruple|family|rider|per boat|per vehicle|per buggy", l) : unit = "group"
        if "infant" in l: people = 1
        label = re.sub(r"^\(1 rider\)", "Single (1 rider)", label) if label.startswith("(") else label
        label = re.sub(r"^(?:1 rider|10\+|13\+|11\+)\)", lambda m: "Adult (" + m.group(0), label)
        label = ("Observer / C" + label) if label.startswith("ompanion") else label
        res.append({"label": label.strip(" ·"), "price": price, "people": people, "group": unit == "group"})
    return res
def fix_family(t):
    if isinstance(t, str):
        t = t.replace("for 2 adults + 1 child, or for up to 4 adults, at $160", "for 2 adults + 1 child (up to 3 people), at $160")
        t = t.replace("Family 2 adults + 1 child, or up to 4 adults ($160)", "Family 2 adults + 1 child, up to 3 people ($160)")
        t = t.replace("($160 for 2 adults + 1 child, or up to 4 adults)", "($160 for 2 adults + 1 child, up to 3 people)")
        t = t.replace("Family (2 adults + 1 child, or up to 4 adults), per boat", "Family (2 adults + 1 child, up to 3 people), per boat")
        t = t.replace("Family: 2 adults + 1 child, or up to 4 adults", "Family: 2 adults + 1 child, up to 3 people")
        return t
    if isinstance(t, list): return [fix_family(x) for x in t]
    if isinstance(t, dict): return {k: fix_family(v) for k, v in t.items()}
    return t
def parse_schema(path):
    txt = pdf(path)
    i = txt.find("Schema JSON-LD")
    if i < 0: return None
    body = txt[i + len("Schema JSON-LD"):]
    lines = [l for l in body.split("\n") if not re.match(r"^\s*(TRIP2 ·|\d+\s*$)", l)]
    raw = " ".join(l.strip() for l in lines)
    a = raw.find("{"); b = raw.rfind("}")
    if a < 0 or b < 0: return None
    raw = raw[a:b + 1]
    for fix in (lambda r: r, lambda r: re.sub(r"(\}\s+)(?=\"@type\": \"Question\")", "}, { ", re.sub(r",\s*\}\s*,\s*\{\s*\"name\"", ', "name"', r)), lambda r: re.sub(r",\s*\}\s*,\s*\{\s*\"name\"", ', "name"', r), lambda r: re.sub(r"\}\s*,\s*\{\s*(\"(?:name|text|@type|acceptedAnswer)\")", r", \1", r)):
        try: return json.loads(fix(raw))
        except Exception: pass
    try:
        import json_repair
        return json_repair.loads(raw)
    except Exception: return None
def build(kind, folder, copyname):
    seo = parse_seo(os.path.join(folder, "2 - SEO Settings.pdf"))
    slug = join(seo.get("URL slug", [])).strip("/").split("/")[-1]
    h2s = [re.sub(r"^[\d\s]*\.\s*", "", x) for x in seo.get("H2 order", []) if x.strip()]
    lines = clean_lines(pdf(os.path.join(folder, copyname)))
    # drop the front matter up to the "Headings = H1/H2." line
    start = next((i for i, l in enumerate(lines) if "Headings = H1/H2" in l), 0) + 1
    lines = lines[start:]
    while lines and not lines[0]: lines.pop(0)
    idx = sectionize(lines, h2s)
    h1 = join(seo.get("H1", []))
    first = idx[0][1] if idx else len(lines)
    intro_lines = lines[1:first] if lines else []  # skip H1 line (may wrap: handle)
    while intro_lines and h1 and not re.search(r"[.?!]$", lines[0]) and False: pass
    secs = []
    for n, (h, i) in enumerate(idx):
        j = idx[n + 1][1] if n + 1 < len(idx) else len(lines)
        body = lines[i + 1:j]
        secs.append((h, body))
    sections = []
    for h, body in secs:
        hl = h.lower()
        if hl.startswith("faq"): sections.append({"h2": h, "type": "faq", "faq": faqs(body)})
        elif "included" in hl and "not" in hl: sections.append({"h2": h, "type": "inc", "groups": split_dash(body)})
        elif hl.startswith("pros"): sections.append({"h2": h, "type": "pc", "groups": split_dash(body)})
        elif hl.startswith("what to expect") or any(re.match(r"^\d+\.\s", b) for b in body if b):
            sections.append({"h2": h, "type": "steps", "items": merge_items([re.sub(r"^\d+\.\s*", "", b) for b in body])})
        elif hl.startswith("related") or hl.startswith("you might also like"): sections.append({"h2": h, "type": "links", "items": items(body)})
        elif hl.startswith("why"): sections.append({"h2": h, "type": "list", "items": merge_items(body)})
        else:
            nb = [b for b in body if b]
            if nb and all(len(b) < 85 and not re.search(r"[.?!]$", b) for b in nb) and len(nb) > 1:
                sections.append({"h2": h, "type": "list", "items": merge_items(body)})
            else:
                sections.append({"h2": h, "type": "text", "paras": paras(body)})
    meta = join(seo.get("Meta Description", [])); title = join(seo.get("SEO Title", []))
    prices = join(seo.get("Schema prices", []))
    allp = [int(x.replace(",", "")) for x in re.findall(r"\$\s?(\d[\d,]*)", prices or meta)]
    d = {"slug": slug, "title": title, "metaTitle": title, "meta": meta, "h1": h1, "keyword": join(seo.get("Focus keyword", [])),
         "intro": paras(intro_lines), "sections": sections, "prices": prices, "from": FROM.get(os.path.basename(folder)[:2], next((a for a in allp if a), None)), "options": options(os.path.basename(folder)[:2], prices), "min2": os.path.basename(folder)[:2] in MIN2,
         "alts": [a for a in seo.get("Image alt texts", []) if a], "breadcrumb": join(seo.get("Breadcrumb", [])), "num": os.path.basename(folder)[:2], "schema": parse_schema(os.path.join(folder, "2 - SEO Settings.pdf")), "canonical": join(seo.get("Canonical", [])).replace(" ", ""), "cat": (lambda b: "Miches" if "Miches" in b else "Boats & Water" if "Boats" in b else "Adventures" if "Adventures" in b else "Day Trips")(join(seo.get("Breadcrumb", [])) or "")}
    return fix_family(d)
tours, posts, warn = [], [], []
for pack, sub in [("45119b76-Trip2_31_Tours_PDF5", "Trip2_31_Tours"), ("82b38293-Trip2_RunnersAdventures_Tours_PDF5", "Trip2_Ohana_Tours")]:
    base = os.path.join(ROOT, pack, sub)
    for f in sorted(os.listdir(base)):
        p = os.path.join(base, f)
        if os.path.isdir(p):
            t = build("tour", p, "1 - Page Copy.pdf"); t["pack"] = sub; t["name"] = f[5:]
            tours.append(t)
            if not t["slug"] or not t["sections"] or not t["intro"]: warn.append(("tour", f, bool(t["slug"]), len(t["sections"]), len(t["intro"])))
base = os.path.join(ROOT, "c1ff1747-Trip2_Blog_Posts_PDF2_1", "Trip2_Blog_Posts")
for f in sorted(os.listdir(base)):
    p = os.path.join(base, f)
    if os.path.isdir(p):
        b = build("blog", p, "1 - Blog Copy.pdf"); b["name"] = f[5:]; posts.append(b)
        if not b["slug"] or not b["sections"]: warn.append(("post", f, bool(b["slug"]), len(b["sections"]), len(b["intro"])))
def sane(t):
    sc = t.get("schema")
    if not sc: return
    faq = next((x["faq"] for x in t["sections"] if x["type"] == "faq"), [])
    for node in sc.get("@graph", []):
        if node.get("@type") == "FAQPage":
            me = node.get("mainEntity", [])
            ok = len(me) == len(faq) and all(isinstance(q, dict) and q.get("name") and isinstance(q.get("acceptedAnswer"), dict) and q["acceptedAnswer"].get("text") for q in me)
            if not ok:
                node["mainEntity"] = [{"@type": "Question", "name": f["q"], "acceptedAnswer": {"@type": "Answer", "text": f["a"]}} for f in faq]
                t["schema_faq_rebuilt"] = True
for t in tours: sane(t)
tours=[t for t in tours if t["slug"] and t["sections"] and t["intro"]]
os.makedirs("/home/claude/trip2-spicy/data", exist_ok=True)
json.dump(tours, open("/home/claude/trip2-spicy/data/tours.json", "w"), ensure_ascii=False, indent=1)
json.dump(posts, open("/home/claude/trip2-spicy/data/posts.json", "w"), ensure_ascii=False, indent=1)
print("faq rebuilt:", [t["slug"] for t in tours if t.get("schema_faq_rebuilt")]); print("no schema:", [t["slug"] for t in tours if not t.get("schema")], [t["slug"] for t in posts if not t.get("schema")]); print(len(tours), "tours", len(posts), "posts"); print("warnings:", warn)
