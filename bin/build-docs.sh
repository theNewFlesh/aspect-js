#! /bin/bash
source activate aspect-js
export basepath=`pwd`
rm -rf docs
typedoc --out docs --mode modules ./src --hideGenerator --theme ./node_modules/typedoc-henanigans-theme/bin/default
cd ./python
python build_docs.py --basepath $basepath --component_path $basepath/src/vue