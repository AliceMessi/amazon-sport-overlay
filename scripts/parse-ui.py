import re, sys
xml = open(sys.argv[1], encoding='utf-8').read()
nodes = re.findall(r'<node[^>]*>', xml)
for n in nodes:
    t = re.search(r'text="([^"]*)"', n)
    b = re.search(r'bounds="([^"]*)"', n)
    c = re.search(r'class="([^"]*)"', n)
    f = re.search(r'focused="([^"]*)"', n)
    r = re.search(r'resource-id="([^"]*)"', n)
    if (t and t.group(1)) or (f and f.group(1) == 'true'):
        line = '{} | {} | {} | focused={} | id={}'.format(
            t.group(1)[:60], b.group(1) if b else '?',
            (c.group(1).split('.')[-1] if c else '?'), (f.group(1) if f else '?'),
            (r.group(1) if r else ''))
        print(line.encode('ascii', 'replace').decode())
