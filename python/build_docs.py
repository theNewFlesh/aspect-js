import argparse
import os
import shutil
import subprocess
import jinja2
from component_parser import *
# ------------------------------------------------------------------------------

def make_dir(dirpath):
    if os.path.exists(dirpath):
        shutil.rmtree(dirpath)
    os.makedirs(dirpath)

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
    )
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