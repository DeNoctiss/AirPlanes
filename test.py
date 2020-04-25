import requests
for i in [1,2]:
	r = requests.get('http://127.0.0.1:5555/total.json?id='+str(i)+'&date=2020-03-14')