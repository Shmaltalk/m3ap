from flask import Flask, send_from_directory
import pickle
import json

app = Flask(__name__)

p = []
with open('data.pickle', 'rb') as f:
	p = pickle.load(f);

@app.route("/songs")
def get_songs():
	lst = [{'index': i,
			'title': song[1],
			'artist': song[2],
			'album': song[3]} for i,song in enumerate(p)]
	j = json.dumps(lst)
	return j

@app.route("/beats/<song_number>")
def get_data(song_number):
	print(int(song_number))
	return p[int(song_number)][4]
	
@app.route('/web/<path>')
def web_something_or_other(path):
    return send_from_directory('web', path)
	
@app.route('/music/<path>')
def music_thing(path):
    return send_from_directory('music', path)
	
if __name__ == "__main__":
    app.run()