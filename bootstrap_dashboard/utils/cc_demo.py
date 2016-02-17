import json
import time
import math
import requests
import random
import argparse
from random import randint

homehubs_url = 'http://localhost:3000/homehubs/'

homehubs = [{
	"hh_id":1,
  "label": "SLAC Demo - Unit 1",
	"total_power": 0,
	"location": "SLAC",
  "callback_url": "http://192.168.99.100:5050/",
	"state": {}
}]

def laplace(variance):
    rand = random.random()
    if rand < 0.5:
        return variance * math.log(2 * rand)
    else:
        return 0 - variance * math.log(2 * (1 - rand))

def register_home_hubs():
    ids = []
    headers = {'Content-Type':'application/json'}
    for homehub in homehubs:
        r = requests.post(homehubs_url, data=json.dumps(homehub), headers = headers)
        ids.append(json.loads(r.content)['uuid'])

    return ids

def mock_homehub_status(ids):
    variance = 1
    baseline = 300


    while 1:
        consumption = int(baseline + laplace(variance))
        url = homehubs_url + ids[randint(0,len(ids) - 1)]
        payload = {'total_power' : consumption}
        headers = {'Content-Type':'application/json'}
        requests.patch(url, data=json.dumps(payload), headers = headers)

        print 'done sent data -> ' + url + '; ' +str(payload)

        time.sleep(2)

if __name__ == '__main__':


	parser = argparse.ArgumentParser(description=
		'''Register Homehubs to Cloud Coordinator and feed homehub status to CC''')
	parser.add_argument('--ids', help='The uuids of the homehubs, separated by comma)')
	args = parser.parse_args()

	ids = []
	if args.ids:
		ids = args.ids.split(',')
		print 'using existing ids -> ' + str(ids)
	else:
		ids = register_home_hubs()
		print 'Register new Homehubs, and using the generated ids -> ' + str(ids)

	print 'Mock Homehubs status and send to CC'
	mock_homehub_status(ids)
