function findMostFrequentWord(str) {
  // Split the string into an array of words
  var words = str.split(/\W+/);

  // Create an object to keep track of word frequency
  var wordCount = {};

  // Loop through the words array and count the frequency of each word
  for (const element of words) {
    var w = element.toLowerCase();
    if (wordCount[w]) {
      wordCount[w]++;
    } else {
      wordCount[w] = 1;
    }
  }

  // Find the word with the highest frequency
  var maxCount = 0;
  var mostFrequentWord = "";
  for (var w in wordCount) {
    if (wordCount[w] > maxCount) {
      maxCount = wordCount[w];
      mostFrequentWord = w;
    }
  }

  return mostFrequentWord;
}

var inputData = document.getElementById("inputText");
var txtData = inputData.textContent;
var wordSelect = document.getElementById("wordSelect");
var selectedWord = wordSelect.value;
if (selectedWord === "") {
  selectedWord = findMostFrequentWord(txtData);
}

google.charts.load("current", { packages: ["wordtree"] });
google.charts.setOnLoadCallback(drawSimpleNodeChart);
function drawSimpleNodeChart() {
  var chartWidth = document.documentElement.clientWidth * 0.9;
  var chartHeight = document.documentElement.clientHeight * 0.7;

  var data = google.visualization.arrayToDataTable([["Phrases"], [txtData]]);
  var options = {
    wordtree: {
      format: "implicit",
      type: "double",
      word: selectedWord,
    },
  };

  var wordtree = new google.visualization.WordTree(
    document.getElementById("wordtree_double")
  );
  wordtree.draw(data, {
    width: chartWidth,
    height: chartHeight,
    ...options
  });
}
