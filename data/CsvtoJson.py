import json

fhCsv=open("districts_user2_trim.csv","r")

jsonDat={}
header=""
for line in fhCsv:
	if header=="":
		header=line.strip().split(",")
	else:
		j={}
		line=line.strip().split(",")
		for i in range(1,len(header)):
			j[header[i]]=line[i]
		jsonDat[line[0]]=j

jOut=open("data.js","w")
tmp=json.dumps(jsonDat)
tmp=tmp.replace("}, \"","},\n\"")
jOut.write("var teamData=%s;"%tmp)
jOut.close()

