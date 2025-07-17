import os
from flask import Flask, render_template, url_for, send_from_directory


app = Flask(__name__)

@app.route('/')
def index():
    base_path = os.path.join('media')
    folders = sorted([f for f in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, f))])
    return render_template('index.html', folders=folders)

@app.route('/folder/<folder>')
def show_folder(folder):
    folder_path = os.path.join('media', folder)
    if not os.path.exists(folder_path):
        return "Folder not found", 404
    songs = sorted([f for f in os.listdir(folder_path) if f.endswith('.mp3')])
    return render_template('folder.html', folder=folder, songs=songs)


if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000, debug=True)
