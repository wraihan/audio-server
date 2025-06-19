import os
from flask import Flask, render_template, send_from_directory


app = Flask(__name__)

@app.route('/')
def index():
    base_path = os.path.join('static', 'audio')
    folders = sorted([f for f in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, f))])
    return render_template('index.html', folders=folders)

@app.route('/folder/<folder>')
def show_folder(folder):
    folder_path = os.path.join('static', 'audio', folder)
    if not os.path.exists(folder_path):
        return "Folder not found", 404
    songs = sorted([f for f in os.listdir(folder_path) if f.endswith('.mp3')])
    return render_template('folder.html', folder=folder, songs=songs)

@app.route('/audio/<folder>/<filename>')
def serve_song(folder, filename):
    return send_from_directory(os.path.join('static', 'audio', folder), filename)


if __name__ == '__main__':
    app.run(port=5000, debug=True)
