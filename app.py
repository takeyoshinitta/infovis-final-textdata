from flask import Flask, render_template, request
# from my_wordcloud import generate_word_cloud

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_file', methods=['POST'])
def process_file():
    # get the file from the request
    file = request.files['file']
    # read the contents of the file
    contents = file.read()
    # convert the contents to a string
    contents_str = contents.decode('utf-8')
    words = list(set(contents_str.split()))
    # generate_word_cloud(file)
    return render_template('index.html', input_str=contents_str, words=words)

if __name__ == '__main__':
    app.run(debug=True)
