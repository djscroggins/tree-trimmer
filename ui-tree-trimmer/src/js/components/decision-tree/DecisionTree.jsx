import React from "react";

import * as d3 from "d3";

export default class DecisionTree extends React.Component {
  constructor(props) {
    super(props);
    this.totalNodes = 0;
    this.maxLabelLength = 0;
    this.viewerWidth = window.innerWidth - 400;
    this.viewerHeight = window.innerHeight - 150;
    this.zoomListener = this._getZoomListener();
    this.baseSVG = undefined;
    this.SVGGroup = undefined;
  }

  _resetContainer = () => {
    d3.selectAll("#base-svg").remove();
    d3.select("#summary").remove();
    d3.select("#trim-button").remove();
    d3.select("#trim-options-table").remove();
    d3.select("#retrain-button").remove();
  };

  _getTree = (height, width) => {
    return d3.layout.tree().size([height, width]);
  };

  _getDiagonal = () => {
    return d3.svg.diagonal()
      .projection(function(d) {
        return [d.x, d.y];
      });
  };

  _zoom = () => {
    this.SVGGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  };

  _getZoomListener = () => {
    return d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", this._zoom);
  };

  _getBaseSVG = () => {
    return d3.select(this.decisionTreeContainer).append("svg").attr("id", "base-svg")
      .attr("width", this.viewerWidth)
      .attr("height", this.viewerHeight)
      .attr("class", "overlay")
      .call(this.zoomListener);
  };

  _getSVGGroup = (baseSVG) => {
    return baseSVG.append("g").attr("id", "");
  };

  // A recursive helper function for performing some setup by walking through all nodes
  _visit = (node) => {
    if (!node) return;
    this._recordVisit();
    let children = this._getChildren(node);
    if (children) children.forEach(child => this._visit(child));
  };

  _recordVisit = () => {
    this.totalNodes++;
    this.maxLabelLength = Math.max(20, this.maxLabelLength);
  };

  _getChildren = (node) => {
    return node.children && node.children.length > 0 ? node.children : null;
  };

  _getPercentageImpurityDecreaseText = (node) => {
    return "Impurity Decrease: " + node.percentage_impurity_decrease + "%";
  };

  _getSampleDistributionText = (node) => {
    const accumulator = [];
    const class_counts = node.node_class_counts;
    class_counts.forEach(function(cv) {
      accumulator.push(cv[1]);
    });

    return "[" + accumulator.join(", ") + "]";
  };

  _getNodeSamplesText = (node) => {
    return "Samples: " + node.n_node_samples;
  };

  _getCriterionText = (node) => {
    return node.impurity[0] + " = " + node.impurity[1];
  };

  _getSplitterText = (node) => {
    return node.split[0] + " >= " + node.split[1] + "\n";
  };

  renderDecisionTree = () => {

    console.log("RENDER DECISION TREE");

    const instance = this;

    const data = this.props.data.tree_json;
    const containerNode = this.decisionTreeContainer;

    this._resetContainer();

    // Calculate total nodes, max label length
    // let totalNodes = 0;
    // let maxLabelLength = 0;

    let i = 0;
    const duration = 750;
    let root;

    const viewerWidth = window.innerWidth - 400;
    const viewerHeight = window.innerHeight - 150;

    // Might want to take this out
    // let tree = d3.layout.tree()
    //   .size([viewerHeight, viewerWidth]);
    let tree = this._getTree(this.viewerHeight, this.viewerWidth);

    // define a d3 diagonal projection for use by the node paths later on.
    const diagonal = this._getDiagonal();

    // Call visit function to establish maxLabelLength
    this._visit(data);


    // define the baseSvg, attaching a class for styling and the zoomListener
    // const baseSvg = d3.select(containerNode).append("svg").attr("id", "base-svg")
    //   .attr("width", viewerWidth)
    //   .attr("height", viewerHeight)
    //   .attr("class", "overlay")
    //   .call(zoomListener);
    // Define the zoom function for the zoomable tree
    // function zoom() {
    //   console.log("ZOOM");
    //   instance.SVGGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    // }

    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    // this.zoomListener = this._getZoomListener();

    this.baseSVG = this._getBaseSVG();
    this.SVGGroup = this._getSVGGroup(this.baseSVG);


    // Helper functions for collapsing and expanding nodes.
    //TODO: Keep for now. I might want to add back in expand and collapse
    // function collapse(d) {
    //   if (d.children) {
    //     d._children = d.children;
    //     d._children.forEach(collapse);
    //     d.children = null;
    //   }
    // }
    //
    // function expand(d) {
    //   if (d._children) {
    //     d.children = d._children;
    //     d.children.forEach(expand);
    //     d._children = null;
    //   }
    // }

    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.
    function center_node(source) {
      console.log("CENTER NODE");
      const scale = instance.zoomListener.scale();
      let x = -source.y0;
      let y = -source.x0;
      x = x * scale + viewerWidth / 2;
      y = y * scale + viewerHeight / 2;
      d3.select("g").transition()
        .duration(duration)
        .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
      instance.zoomListener.scale(scale);
      instance.zoomListener.translate([x, y]);
    }

    // Toggle children function
    function toggleChildren(d) {
      console.log("TOGGLE CHILDREN");
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else if (d._children) {
        d.children = d._children;
        d._children = null;
      }
      return d;
    }

    // Toggle children on click.
    // TODO: Leave in for now. Might want to resume collapse and expand functionality
    function click(d) {
      if (d3.event.defaultPrevented) return; // click suppressed
      d = toggleChildren(d);
      update(d);
      center_node(d);
    }

    function update(source) {
      console.log("UPDATE");
      // Compute the new height, function counts total children of root node and sets tree height accordingly.
      // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
      // This makes the layout more consistent.
      const levelWidth = [1];
      const childCount = function(level, n) {

        if (n.children && n.children.length > 0) {
          if (levelWidth.length <= level + 1) levelWidth.push(0);

          levelWidth[level + 1] += n.children.length;
          n.children.forEach(function(d) {
            childCount(level + 1, d);
          });
        }
      };
      childCount(0, root);
      const maxHeight = d3.max(levelWidth) * 25; // 25 pixels per line
      const newHeight = maxHeight >= 75 ? maxHeight : 75;

      tree = tree.nodeSize([newHeight, viewerWidth]);

      // Compute the new tree layout.
      const nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

      // Set widths between levels based on maxLabelLength.
      nodes.forEach(function(d) {
        d.y = (d.depth * (instance.maxLabelLength * 10));
      });

      // Update the nodes…
      const node = instance.SVGGroup.selectAll("g.node")
        .data(nodes, function(d) {
          return d.id || (d.id = ++i);
        });

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function() {
          return "translate(" + source.x0 + "," + source.y0 + ")";
        });

      nodeEnter.append("circle")
        .attr("class", "nodeCircle")
        .attr("r", 0)
        .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
        })
      //   .on('click', function (d) {
      //   d3.selectAll(".nodeCircle").style("fill", function (d) {
      //     return d._children ? "lightsteelblue" : "#fff";
      //   });
      //   d3.select(this).style("fill", "red");
      //   d.node ? nodeSummary.renderNodeSummary(d.node, params.updateInteractionParameters, params.retrainTree) : nodeSummary.renderNodeSummary(d.leaf, params.updateInteractionParameters, params.retrainTree, true);
      // })
      ;

      nodeEnter.append("text")
        .attr("y", function(d) {
          return d.children || d._children ? 18 : 18;
        })
        .attr("dy", ".35em")
        .attr("class", "nodeText")
        .attr("text-anchor", "middle")
        .append("tspan")
        .attr("x", 0)
        .text(function(d) {
          // console.log(d);
          return d.node ? instance._getSplitterText(d.node) : instance._getCriterionText(d.leaf);
        })
        .append("tspan")
        .attr("x", 0)
        .attr("dy", "1em")
        .text(function(d) {
          return d.node ? instance._getCriterionText(d.node) : instance._getNodeSamplesText(d.leaf);
        })
        .append("tspan")
        .attr("x", 0)
        .attr("dy", "1em").text(function(d) {
        return d.node ? instance._getPercentageImpurityDecreaseText(d.node) : instance._getSampleDistributionText(d.leaf);
      })
        .append("tspan")
        .attr("x", 0)
        .attr("dy", "1em")
        .text(function(d) {
          return d.node ? instance._getNodeSamplesText(d.node) : null;
        })
        .append("tspan")
        .attr("x", 0)
        .attr("dy", "1em")
        .text(function(d) {
          return d.node ? instance._getSampleDistributionText(d.node) : null;
        });

      // Change the circle fill depending on whether it has children and is collapsed
      node.select("circle.nodeCircle")
        .attr("r", 4.5)
        .style("fill", function(d) {
          return d._children ? "lightsteelblue" : "#fff";
        });

      // Transition nodes to their new position.
      const nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });

      // Fade the text in
      nodeUpdate.select("text")
        .style("fill-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function() {
          return "translate(" + source.x + "," + source.y + ")";
        })
        .remove();

      nodeExit.select("circle")
        .attr("r", 0);

      nodeExit.select("text")
        .style("fill-opacity", 0);

      // Update the links…
      const link = instance.SVGGroup.selectAll("path.link")
        .data(links, function(d) {
          return d.target.id;
        });

      // Enter any new links at the parent's previous position.
      link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function() {
          const o = {
            x: source.x0,
            y: source.y0
          };
          return diagonal({
            source: o,
            target: o
          });
        });

      // Transition links to their new position.
      link.transition()
        .duration(duration)
        .attr("d", diagonal);

      // Transition exiting nodes to the parent's new position.
      link.exit().transition()
        .duration(duration)
        .attr("d", function() {
          const o = {
            x: source.x,
            y: source.y
          };
          return diagonal({
            source: o,
            target: o
          });
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }


    // const svgGroup = baseSvg.append("g").attr("id", "");


    // Define the root
    root = data;
    root.x0 = viewerHeight / 2;
    root.y0 = 0;

    // Collapse all children of roots children before rendering.
    // root.children.forEach(function(child){
    // 	collapse(child);
    // });

    // Layout the tree initially and center on the root node.
    update(root);
    center_node(root);

  };

  componentDidMount() {
    if (this.props.data.tree_json) {
      this.renderDecisionTree();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.data.tree_json) {
      this.renderDecisionTree();
    }
  }

  render() {
    return (
      <div ref={node => this.decisionTreeContainer = node} className='decision-tree-container'>Decision Tree</div>
    );
  }
};
