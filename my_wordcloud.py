from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image

def generate_word_cloud(file):
    # Load the mask image
    mask = np.array(Image.open('/static/image/BYUH_Logo.png'))

    # Set the stopwords and generate the WordCloud
    stopwords = set(STOPWORDS)
    wordcloud = WordCloud(background_color='white', max_words=2000, mask=mask, stopwords=stopwords, contour_width=3, contour_color='steelblue')

    # Set the text and generate the WordCloud
    with open(file, 'r') as f:
        text = f.read()
    wordcloud.generate(text)

    wordcloud.to_file('/static/image/wordcloud.png')

    # Plot the WordCloud
    plt.figure(figsize=(8,8))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis('off')
    plt.show()
