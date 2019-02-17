#! /bin/bash
source activate aspect-js
export basepath=`pwd`
rm -rf docs
typedoc --out docs --mode modules ./src --hideGenerator --theme ./node_modules/typedoc-henanigans-theme/bin/default
cd ./python
# python build_docs.py -b $basepath -c $basepath/src/vue >> /dev/null 2>&1
python build_docs.py -b $basepath -c $basepath/src/vue