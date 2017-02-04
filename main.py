from secret import SONIC_API_ACCESS_TOKEN
from dank_beats import songs
import requests
import pickle

title = 'Talk to Me'
artist = "Marian Hill"
album = 'ACT ONE'
file_path = 'music\Talk to Me.ogg'

p = []
with open('data.pickle', 'rb') as f:
	p = pickle.load(f);
	
for l in p:
	if l[1] == title and l[2] == artist:
		print("Nope.")
		exit()

url = 'https://api.sonicapi.com/file/upload'
f = {'file' : open(file_path, 'rb')}

r = requests.post(url, files=f, data = {'access_id' : SONIC_API_ACCESS_TOKEN, 
										'format' : 'json'})

										
sonic_id = r.json()['file']['file_id']

print("Upload Complete.")

url_tempo = 'https://api.sonicapi.com/analyze/tempo'
down_tempo = requests.get(url_tempo, data = {'access_id' : SONIC_API_ACCESS_TOKEN,
											 'input_file' : songs['Down'],
											 'format' : 'json'})

print("Analysis Complete.")

data = down_tempo.text

p.append([sonic_id, title, artist, album, data])
with open('data.pickle', 'wb') as f:
	pickle.dump(p, f)
	


