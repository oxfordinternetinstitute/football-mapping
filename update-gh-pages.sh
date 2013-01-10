cd /tmp
rm -rf football-mapping
git clone git@github.com:oxfordinternetinstitute/football-mapping.git
#cp -r ~/code/oii/football-mapping /tmp/football-mapping
cd football-mapping
git checkout --orphan gh-pages

#Minify -- requires js-compiler.jar from https://developers.google.com/closure/compiler/
cp -r js jsFull
for i in main.js oms.js colorUtil.js plugins.js rivalries.js teams.js tinycolor.js vendor/zoomslider/L.Control.Zoomslider.js
do
	echo $i
	java -jar ~/code/js-compiler.jar --js jsFull/$i --js_output_file js/$i
done
rm -rf jsFull
git add .
git commit -a -m "gh-pages auto-commit pages from master"
git push -f origin gh-pages
