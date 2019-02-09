#! /bin/bash
export basepath=`pwd`
# npm run docs
rm -rf docs/*
cd ./python
# python build_docs.py -b $basepath -c $basepath/src/vue >> /dev/null 2>&1
python build_docs.py -b $basepath -c $basepath/src/vue