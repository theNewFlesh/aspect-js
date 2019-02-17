import argparse
import os
import shutil
from copy import deepcopy
import subprocess
import jinja2
import bs4
from component_parser import *
# ------------------------------------------------------------------------------

def make_dir(dirpath):
    if os.path.exists(dirpath):
        shutil.rmtree(dirpath)
    os.makedirs(dirpath)

def append_component_link(src):
    with open(src) as f:
        html = f.read()
    soup = bs4.BeautifulSoup(html, 'html.parser')
    li = deepcopy(soup.select_one('.tsd-navigation.primary ul li'))
    a = li.select_one('a')
    a.attrs['href'] = 'components/search.html'
    em = li.select_one('em')
    em.contents[0].__class__
    em.contents = [bs4.element.NavigableString('Vue Components')]
    ul = soup.select_one('.tsd-navigation.primary ul')
    ul.append(li)
    soup.select('.tsd-navigation.primary ul li')
    with open(src, 'w') as f:
        f.write(soup.encode('UTF-8'))

def build_docs(basepath, component_path):
    template_path = os.path.join(basepath, 'templates')
    doc_path = os.path.join(basepath, 'docs')
    md = os.path.join(doc_path, 'md')
    site = os.path.join(doc_path, 'components')

    mkdocs = os.path.join(doc_path, 'mkdocs.yml')
    css = os.path.join(site, 'style.css')

    ctemp = 'component.md.j2'
    mktemp = 'mkdocs.yml.j2'
    csstemp = 'style.css.j2'

    data = parse_components(component_path)

    loader = jinja2.FileSystemLoader(searchpath=template_path)
    env = jinja2.Environment(loader=loader)
    ctemplate = env.get_template(ctemp)
    mktemplate = env.get_template(mktemp)
    csstemplate = env.get_template(csstemp)

    make_dir(md)
    make_dir(site)
    if os.path.exists(mkdocs):
        os.remove(mkdocs)

    for item in data:
        with open(os.path.join(md, item['name'] + '.md'), 'w') as f:
            f.write(ctemplate.render(component=item))

    with open(mkdocs, 'w') as f:
        f.write(mktemplate.render(components=data))

    with open(css, 'w') as f:
        f.write(csstemplate.render())

    os.chdir(doc_path)
    subprocess.Popen(
        'mkdocs build --dirty',
        shell=True
    ).wait()

    index = os.path.join(doc_path, 'index.html')
    append_component_link(index)
# ------------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description='Build Vue component docs')

    parser.add_argument('-b', '--basepath', required=True, metavar='str', type=str,
        nargs=1, action='store', help='vue component directory'
    )

    parser.add_argument('-c', '--component_path', required=True, metavar='str', type=str,
        nargs=1, action='store', help='vue component directory'
    )

    args = parser.parse_args()
    build_docs(args.basepath[0], args.component_path[0])

if __name__ == "__main__":
    main()