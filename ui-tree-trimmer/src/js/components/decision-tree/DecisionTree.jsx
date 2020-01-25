//TODO: Move container names to config object
import React from "react";

// import _ from "lodash";
import isEqual from "lodash/isEqual";

import * as d3 from "d3";

import "../../../css/decision-tree/decision-tree.css";

export default class DecisionTree extends React.Component {
  constructor(props) {
    super(props);
    this.totalNodes = 0;
    this.maxLabelLength = 0;
    this.circleNodeBaseClass = "node-circle";
    this.parentNodeClasses = `${this.circleNodeBaseClass} parent-node`;
    this.leafNodeClasses = `${this.circleNodeBaseClass} leaf-node`;
    this.selectedNodeClass = "selected-node";
    this.selectedNodeClasses = `${this.circleNodeBaseClass} ${this.selectedNodeClass}`;
    this.viewerWidth = undefined;
    this.viewerHeight = undefined;
    this.duration = 750;
    this.tree = this._getTree(this.viewerHeight, this.viewerWidth);
    this.zoomListener = this._getZoomListener();
    this.diagonal = this._getDiagonal();
    this.baseSVG = undefined;
    this.SVGGroup = undefined;
  }

  _setViewerWidth = () => {
    this.viewerWidth = document.getElementById("base-svg").parentElement.clientWidth;
  };

  _setViewerHeight = () => {
    this.viewerHeight = document.getElementById("base-svg").parentElement.clientHeight;
  };

  _setBaseSVG = () => {
    const instance = this;

    this.baseSVG = d3.select(this.decisionTreeContainer).append("svg").attr("id", "base-svg")
      .attr("width", function() {
        instance._setViewerWidth();
        return instance.viewerWidth;
      })
      .attr("height", function() {
        instance._setViewerHeight();
        return instance.viewerHeight;
      })
      .attr("class", "overlay")
      .call(this.zoomListener);
  };

  _setSVGGroup = () => {
    this.SVGGroup = this._getSVGGroup(this.baseSVG);
  };

  _getSVGGroup = (baseSVG) => {
    return baseSVG.append("g").attr("id", "");
  };

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

  // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.
  _centerNode = (source) => {
    const scale = this.zoomListener.scale();
    let x = -source.y0;
    let y = -source.x0;
    x = x * scale + this.viewerWidth / 2;
    y = y * scale + this.viewerHeight / 2;
    d3.select("g").transition()
      .duration(this.duration)
      .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    this.zoomListener.scale(scale);
    this.zoomListener.translate([x, y]);
  };

  _getChildCount = (level, node, levelWidth) => {
    const instance = this;
    if (node.children && node.children.length > 0) {
      if (levelWidth.length <= level + 1) levelWidth.push(0);

      levelWidth[level + 1] += node.children.length;
      node.children.forEach(function(_node) {
        instance._getChildCount(level + 1, _node, levelWidth);
      });
    }
  };

  _getTreeLayout = (tree, source) => {
    const nodes = tree.nodes(source).reverse();
    return { "nodes": nodes, "links": tree.links(nodes) };
  };

  // Stash the old positions for transition.
  _stashNodeValues = (nodes) => {
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  };

  // Set widths between levels based on maxLabelLength.
  _setWidths = (nodes) => {
    const instance = this;
    nodes.forEach(function(d) {
      d.y = (d.depth * (instance.maxLabelLength * 10));
    });
  };

  _bindNodeData = (nodes) => {
    return this.SVGGroup.selectAll("g.node")
      .data(nodes, function(d, i) {
        return d.id || (d.id = ++i);
      });
  };

  _enterNewNodes = (nodes, source) => {
    nodes.enter().append("g")
      .attr("class", "node")
      .attr("transform", function() {
        return "translate(" + source.x0 + "," + source.y0 + ")";
      });
  };

  _setNodeClass = (node) => {
    return node.children ? this.parentNodeClasses : this.leafNodeClasses;
  };

  _appendNodeCircles = (node) => {
    const instance = this;
    node
      .append("circle")
      .attr("class", function(d) {
        return instance._setNodeClass(d);
      })
      .attr("r", 6)
      .on("mouseover", function() {
        d3.select(this).attr("r", 9);
      })
      .on("mouseout", function() {
        d3.select(this).attr("r", 6);
      });
  };


  _appendNodeText = (node) => {
    const instance = this;
    node.append("text")
      .attr("y", function(d) {
        return d.children || d._children ? 18 : 18;
      })
      .attr("dy", ".35em")
      .attr("class", "nodeText")
      .attr("text-anchor", "middle")
      .append("tspan")
      .attr("x", 0)
      .text(function(d) {
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
      .attr("dy", "1em")
      .text(function(d) {
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
  };

  _setNodeAsSelected = (node) => {
    node.attr("class", this.selectedNodeClasses);
  };

  _bindOnClickHandler = (node) => {
    const instance = this;
    node
      .on("click", function(d) {
        const baseClass = `.${instance.circleNodeBaseClass}`;
        const element = d3.select(this).select(baseClass);
        const nodeCircles = d3.selectAll(baseClass);

        if (element.attr("class").includes(instance.selectedNodeClass)) {
          instance.props.toggleNodeSummary(false);
          instance._resetAllNodeColor(nodeCircles);
        } else {
          instance._resetAllNodeColor(nodeCircles);
          instance._setNodeAsSelected(element);
          d.node ? instance._displayNodeSummary(d.node) : instance._displayNodeSummary(d.leaf, true);
        }
      });
  };

  _resetAllNodeColor = (nodeCircles) => {
    const instance = this;
    nodeCircles
      .attr("class", function(d) {
        return instance._setNodeClass(d);
      });
  };

  _displayNodeSummary = (node, leaf = false) => {
    this.props.toggleNodeSummary(true);
    this.props.setNodeData(node, leaf);
  };

  _transitionNodes = (node) => {
    node.transition()
      .duration(this.duration)
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
  };

  // Transition exiting nodes to the parent's new position.
  _transitionExitingNodes = (node) => {
    // TODO: This doesn't seem to have any real effect in current implementation; nodeExist is empty, but maybe when nodes are actually removed
    const nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr("transform", function() {
        return "translate(" + source.x + "," + source.y + ")";
      })
      .remove();

    nodeExit.select("circle")
      .attr("r", 0);

    nodeExit.select("text")
      .style("fill-opacity", 0);

  };

  _bindLinksData = (links) => {
    return this.SVGGroup.selectAll("path.link")
      .data(links, function(d) {
        return d.target.id;
      });
  };

  // Enter any new links at the parent's previous position.
  _enterNewLinks = (links, source) => {
    const instance = this;
    links.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function() {
        const o = {
          x: source.x0,
          y: source.y0
        };
        return instance.diagonal({
          source: o,
          target: o
        });
      });
  };

  // Transition links to their new position.
  _transitionLinks = (links) => {
    links.transition()
      .duration(this.duration)
      .attr("d", this.diagonal);
  };

  // Transition exiting nodes to the parent's new position.
  _transitionExitingLinks = (links, source) => {
    const instance = this;
    links.exit().transition()
      .duration(this.duration)
      .attr("d", function() {
        const o = {
          x: source.x,
          y: source.y
        };
        return instance.diagonal({
          source: o,
          target: o
        });
      })
      .remove();
  };

  _update = (source) => {
    const instance = this;
    // console.log("UPDATE");

    // Compute the new height, function counts total children of root node and sets tree height accordingly.
    // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
    // This makes the layout more consistent.
    const levelWidth = [1];

    this._getChildCount(0, source, levelWidth);

    const maxHeight = d3.max(levelWidth) * 25; // 25 pixels per line
    const newHeight = maxHeight >= 75 ? maxHeight : 75;

    let tree = this.tree.nodeSize([newHeight, this.viewerWidth]);

    const { nodes, links } = this._getTreeLayout(tree, source);

    this._stashNodeValues(nodes);
    this._setWidths(nodes);

    const gNodes = this._bindNodeData(nodes);
    this._enterNewNodes(gNodes, source);
    this._appendNodeCircles(gNodes);
    this._appendNodeText(gNodes);
    this._bindOnClickHandler(gNodes);
    this._transitionNodes(gNodes);
    this._transitionExitingNodes(gNodes);

    const linkPaths = this._bindLinksData(links);
    this._enterNewLinks(linkPaths, source);
    this._transitionLinks(linkPaths);
    this._transitionExitingLinks(linkPaths, source);
  };


  _getPercentageImpurityDecreaseText = (node) => {
    // return "Impurity Decrease: " + node.percentage_impurity_decrease + "%";
    return `Impurity Decrease: ${node.percentage_impurity_decrease} %`;
  };

  _getSampleDistributionText = (node) => {
    const accumulator = [];
    const class_counts = node.node_class_counts;
    class_counts.forEach(function(cv) {
      accumulator.push(cv[1]);
    });

    return `[ ${accumulator.join(", ")} ]`;
  };

  _getNodeSamplesText = (node) => {
    return `Samples: ${node.n_node_samples}`;
  };

  _getCriterionText = (node) => {
    const criterion = node.impurity[0];
    const value = node.impurity[1];
    return `${criterion} = ${value}`;
  };

  _getSplitterText = (node) => {
    const feature = node.split[0];
    const value = node.split[1];
    return `${feature} >= ${value}`;
  };

  renderDecisionTree = () => {

    // console.log("renderDecisionTree");

    const data = this.props.data.tree_json;

    this._resetContainer();

    let root;


    // Call visit function to establish maxLabelLength
    this._visit(data);

    // console.log("container", this.decisionTreeContainer);

    this._setBaseSVG();
    this._setSVGGroup();

    // Define the root
    root = data;
    root.x0 = this.viewerHeight / 2;
    root.y0 = 0;


    // Layout the tree initially and center on the root node.
    this._update(root);
    this._centerNode(root);
  };

  componentDidMount() {
    if (this.props.data.tree_json) {
      this.renderDecisionTree();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log("DecisionTree Updated");
    // console.log("prevProps", prevProps.data.tree_json);
    // console.log("new data, ", this.props.data.tree_json);
    const prevData = prevProps.data.tree_json;
    const newData = this.props.data.tree_json;
    if (!isEqual(prevData, newData)) {
      // console.log("Re-rendering decision tree");
      this.renderDecisionTree();
    }
  }

  render() {
    return (
      <div ref={node => this.decisionTreeContainer = node} className='decision-tree-container'/>
    );
  }
};
