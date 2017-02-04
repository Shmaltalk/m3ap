from flask import Flask
import pickle
import json

app = Flask(__name__)

p = []
with open('data.pickle', 'rb') as f:
	p = pickle.load(f);

@app.route("/songs")
def get_songs():
	lst = []
	for song in p:
		d = {'title': song[1],
			 'artist': song[2],
			 'album': song[3]}
		lst.append(d)
	j = json.dumps(lst)
	return j

if __name__ == "__main__":
    app.run()