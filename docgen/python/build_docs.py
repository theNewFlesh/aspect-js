import argparse
import os
import shutil
import subprocess
import jinja2
from component_parser import *
# ------------------------------------------------------------------------------

def build_docs(component_dir):
    basepath = os.path.split(os.getcwd())[0]
    template_path = os.path.join(basepath, 'templates')
    ctemp = 'component.md.j2'
    docs = os.path.join(basepath, 'docs')
    mktemp = 'mkdocs.yml.j2'
    mkdocs = os.path.join(basepath, 'mkdocs.yml')
    csstemp = os.path.join(basepath, 'style.css')
    css = os.path.join(basepath, 'site', 'style.css')

    data = parse_components(component_dir)

    loader = jinja2.FileSystemLoader(searchpath=template_path)
    env = jinja2.Environment(loader=loader)
    ctemplate = env.get_template(ctemp)
    mktemplate = env.get_template(mktemp)

    if os.path.exists(docs):
        shutil.rmtree(docs)
    os.makedirs(docs)
    for item in data:
        with open(os.path.join(docs, item['name'] + '.md'), 'w') as f:
            f.write(ctemplate.render(component=item))

    if os.exists(mkdocs):
        shutil.rmtree(mkdocs)
    with open(mkdocs, 'w') as f:
        f.write(mktemplate.render(component=item))

    os.chdir(basepath)
    proc = subprocess.Popen(
        'mkdocs build --clean',
        shell=True,
        stdout=subprocess.PIPE
    )

    shutil.copy(csstemp, css)
# ------------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description='Build Vue component docs')

    parser.add_argument('-d', '--dir', metavar='str', type=str, nargs=1,
        action='store', help='vue component directory'
    )

    args = parser.parse_args()
    build_docs(args.dir)

if __name__ == "__main__":
    main()