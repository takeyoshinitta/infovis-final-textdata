// retrieve word_list data from the Flask route
var word_list = {{ word_list|safe }};
var input_data = document.getElementById("inputText");
var txt_data = input_data.textContent;

// create a scale for the font sizes
var fontScale = d3.scaleLinear()
  .domain([0, d3.max(word_list, function(d) { return d.size; })])
  .range([10, 70]);

// create a d3-cloud layout
var layout = d3.layout.cloud()
  .size([800, 400])
  .words(word_list)
  .padding(5)
  .rotate(function() { return ~~(Math.random() * 2) * 90; })
  .font("Impact")
  .fontSize(function(d) { return fontScale(d.size); })
  .on("end", draw);

// start the layout
layout.start();

// draw the word cloud and make it interactive
function draw(words) {
  var svg = d3.select("#wordcloud").append("svg")
    .attr("width", layout.size()[0])
    .attr("height", layout.size()[1])
    .append("g")
    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")");

  // create text elements and make them interactive
  var text = svg.selectAll("text")
    .data(words)
    .enter().append("text")
    .style("font-size", function(d) { return d.size + "px"; })
    .style("font-family", "Impact")
    .style("fill", function(d) { return d.color; })
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
      return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) { return d.text; })
    .on("click", function(d) {
      drawWordTree(d.text);
    });
}

// draw the WordTree for the selected word
function drawWordTree(word) {
  google.charts.load('current', {'packages':['wordtree']});
  google.charts.setOnLoadCallback(function() {
    var data = google.visualization.arrayToDataTable([
      ['Phrases'],
      [txt_data]
    ]);
    var options = {
      wordtree: {
        format: 'implicit',
        type: "double",
        word: word
      }
    };
    var chart = new google.visualization.WordTree(document.getElementById('wordtree_double'));
    chart.draw(data, options);
  });
}