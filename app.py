from flask import Flask, render_template, request
from random import randint
from collections import Counter
import json
import time

app = Flask(__name__)

@app.route('/')
def index():
    timestamp = int(time.time())
    return render_template('index.html', timestamp=timestamp)

@app.route('/process_file', methods=['POST'])
def process_file():
    # get the file from the request
    file = request.files['file']
    # read the contents of the file
    contents = file.read()
    # convert the contents to a string
    contents_str = contents.decode('utf-8')
    words = list(contents_str.split())
    word_counts = dict(Counter(words))

    # transform word_counts to the format expected by d3-cloud
    word_list = [{'text': word, 'size': count} for word, count in word_counts.items()]

    # randomly assign colors to each word
    colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b']
    for word in word_list:
        word['color'] = colors[randint(0, len(colors) - 1)]

    # convert word_list to JSON and pass it to the template
    word_list_json = json.dumps(word_list)

    print(word_list_json)

    timestamp = int(time.time())

    return render_template('index.html', input_str=contents_str, words=words, word_json=word_list_json, timestamp=timestamp)

if __name__ == '__main__':
    app.run(debug=True)
