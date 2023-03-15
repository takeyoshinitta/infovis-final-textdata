// This d3.js code will not be used in this final project, but may be used in the future.
const margin = { top: 20, right: 120, bottom: 20, left: 120 };
const width = 1280 - margin.right - margin.left;
const height = 800 - margin.top - margin.bottom;

let i = 0;
let root;

const tree = d3.tree().size([height, width]);

const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

const svg = d3.select("#body")
  .append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("static/data/flare.json", function(json) {
  root = d3.hierarchy(json);
  root.x0 = height / 2;
  root.y0 = 0;

  root.children.forEach(collapse);
  update(root);
});

function update(source) {
  const duration = d3.event && d3.event.altKey ? 5000 : 500;

  const nodes = root.descendants().reverse();
  const links = root.links();

  // Normalize for fixed-depth.
  nodes.forEach(d => d.y = d.depth * 180);

  // Update the nodes…
  const node = svg.selectAll("g.node")
    .data(nodes, d => d.id || (d.id = ++i));

  // Enter any new nodes at the parent's previous position.
  const nodeEnter = node.enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${source.y0},${source.x0})`)
    .on("click", d => {
      collapse(d);
      update(d);
    });

  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("fill", d => d._children ? "lightsteelblue" : "#fff");

  nodeEnter.append("text")
    .attr("x", d => d.children || d._children ? -10 : 10)
    .attr("dy", ".35em")
    .attr("text-anchor", d => d.children || d._children ? "end" : "start")
    .text(d => d.data.name)
    .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  const nodeUpdate = node.merge(nodeEnter).transition()
    .duration(duration)
    .attr("transform", d => `translate(${d.y},${d.x})`);

  nodeUpdate.select("circle")
    .attr("r", 4.5)
    .style("fill", d => d._children ? "lightsteelblue" : "#fff");

  nodeUpdate.select("text")
    .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  const nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", d => `translate(${source.y},${source.x})`)
    .remove();

  nodeExit.select("circle")
    .attr("r", 1e-6);

  nodeExit.select("text")
    .style("fill-opacity", 1e-6);

  // Update the links…
  const link = svg.selectAll("path.link")
    .data(links, d => d.target.id);

  // Enter any new links at the parent's previous position.
  link.enter()
    .insert("path", "g")
    .attr("class", "link")
        .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
        });
    
    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);
    
    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
        })
        .remove();
    
    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}