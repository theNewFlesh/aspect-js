#! /bin/bash
export basepath=`pwd`
rm -rf docs
npm run docs
cd ./python
# python build_docs.py -b $basepath -c $basepath/src/vue >> /dev/null 2>&1
python build_docs.py -b $basepath -c $basepath/src/vue