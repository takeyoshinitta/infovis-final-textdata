from flask import Flask, render_template, request, url_for
from wordcloud import WordCloud, STOPWORDS
import os
import time
import io
import matplotlib.pyplot as plt
# import mpld3


app = Flask(__name__)

@app.route('/')
def index():
    file_path = url_for('static', filename='image/wordcloud.png')
    timestamp = int(time.time())
    # Remove existing word cloud image
    if os.path.exists(file_path):
        os.remove(file_path)
        
    return render_template('index.html', timestamp=timestamp)

@app.route('/process_file', methods=['POST'])
def process_file():
    # get the file from the request
    file = request.files['file']
    # read the contents of the file
    contents = file.read()
    # convert the contents to a string
    contents_str = contents.decode('utf-8')
    words = list(set(contents_str.split()))

    timestamp = int(time.time())

    # stopwords = set(STOPWORDS)
    # wordcloud = WordCloud(stopwords=stopwords, background_color="white", width=800, height=400).generate(contents_str)
    
    # plt.imshow(wordcloud)
    # plt.axis("off")
    # plt.tight_layout(pad=0)
    # fig = plt.gcf()
    # wordcloud_html = mpld3.fig_to_html(fig, template_type="simple")

    file_path = url_for('static', filename='image/wordcloud.png')

    # Remove existing word cloud image
    if os.path.exists(file_path):
        os.remove(file_path)

    # Generate word cloud image
    wordcloud = WordCloud(width=800, height=400, background_color='white', colormap='inferno').generate(contents_str)

    # Save word cloud image to static/image folder
    image_path = os.path.join(app.static_folder, 'image', 'wordcloud.png')
    wordcloud.to_file(image_path)

    # Get URL for image
    img_url = file_path

    return render_template('index.html', input_str=contents_str, words=words, img_data=img_url, timestamp=timestamp)
    # return render_template('index.html', input_str=contents_str, words=words, wordcloud_html=wordcloud_html, timestamp=timestamp)

if __name__ == '__main__':
    app.run(debug=True)
