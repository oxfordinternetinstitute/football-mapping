cd /tmp
rm -rf football-mapping
git clone git@github.com:oxfordinternetinstitute/football-mapping.git
cd football-mapping
git checkout --orphan gh-pages
git add .
git commit -a -m "gh-pages auto-commit pages from master"
git push -f origin gh-pages
