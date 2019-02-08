#! /bin/bash
cd ..
npm run docs
cd docgen/python
python build_docs.py -d src/vue
