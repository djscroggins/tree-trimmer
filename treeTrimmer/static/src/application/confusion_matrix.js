// params_in is an object of form:
// {container: id/class of div,
// matrix: NxN array,
// labels: N array of labels,
// start_color: color for color scale,
// end_color: color for color scale}

function draw_confusion_matrix(params_in) {

    d3.selectAll(".matrix-svg").remove();

    const width = 250;
    const height = 250;
    const matrix = params_in.matrix;
    const class_labels = params_in.labels;

    // Standard margins; if label is number returns fixed left margin else sets relative to length of longest label
    const margin = {top: 20, right: 5, bottom: 30, left: typeof class_labels[0] === 'number' ? 20 : function () {
            const max_label_length = params_in.labels.reduce(function (a, b) {
                return a.length > b.length ? a.length : b.length;
            });
            return max_label_length * 5;
        }};

	if(!matrix){
		throw new Error('Please pass data');
	}

	if(!Array.isArray(matrix) || !matrix.length || !Array.isArray(matrix[0])){
		throw new Error('It should be a 2-D array');
	}

    const max_value = d3.max(matrix, function(layer) { return d3.max(layer, function(d) { return d; }); });
    const min_value = d3.min(matrix, function(layer) { return d3.min(layer, function(d) { return d; }); });

	const num_rows = matrix.length;
	const num_cols = matrix[0].length;

	// set up svg
	const svg = d3.select(params_in.container)
		.append("svg")
		.attr("class", "matrix-svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// base rectangle for building matrix
	svg.append("rect")
	    .style("stroke", "black")
	    .style("stroke-width", "2px")
	    .attr("width", width)
	    .attr("height", height);

	// scales for building cells, adding labels
	const x = d3.scale.ordinal()
	    .domain(d3.range(num_cols))
	    .rangeBands([0, width]);

	const y = d3.scale.ordinal()
	    .domain(d3.range(num_rows))
	    .rangeBands([0, height]);

	// color map for cells
	const color_map = d3.scale.linear()
	    .domain([min_value,max_value])
	    .range([params_in.start_color, params_in.end_color]);

	// set up rows
	const row = svg.selectAll(".row")
	    .data(matrix)
	  	.enter()
		.append("g")
	    .attr("class", "row")
	    .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });

	// set up cells
	const cell = row.selectAll(".cell")
	    .data(function(d) { return d; })
		.enter()
		.append("g")
	    .attr("class", "cell")
	    .attr("transform", function(d, i) { return "translate(" + x(i) + ", 0)"; });

	// append rectangles to cells
	cell.append('rect')
	    .attr("width", x.rangeBand())
	    .attr("height", y.rangeBand())
	    .style("stroke-width", 0);

	// append text to cells
    cell.append("text")
	    .attr("dy", ".32em")
	    .attr("x", x.rangeBand() / 2)
	    .attr("y", y.rangeBand() / 2)
	    .attr("text-anchor", "middle")
	    .style("fill", function(d) { return d >= max_value/2 ? 'white' : 'black'; })
	    .text(function(d) {return d;});

    // Bind matrix row data to svg rows and map colors
	row.selectAll(".cell")
	    .data(function(d, i) { return matrix[i]; })
	    .style("fill", color_map);

	// set up g container for labels
	const label_g = svg.append('g')
		.attr('class', "labels");

	// bind class labels to label container and center on columns
	const column_labels = label_g.selectAll(".column-label")
	    .data(class_labels)
	    .enter()
		.append("g")
	    .attr("class", "column-label")
	    .attr("transform", function(d, i) { return "translate(" + x(i) + "," + height + ")"; });

	// add tick mark for labels
	column_labels.append("line")
		.style("stroke", "black")
	    .style("stroke-width", "1px")
	    .attr("x1", x.rangeBand() / 2)
	    .attr("x2", x.rangeBand() / 2)
	    .attr("y1", 0)
	    .attr("y2", 5);

	// append text to labels
	column_labels.append("text")
	    .attr("x", x.rangeBand() / 2)
	    .attr("y", y.rangeBand() / num_rows)
	    // .attr("dy", ".22em")
	    .attr("text-anchor", "middle")
	    // .attr("transform", "rotate(-60)")
	    .text(function(d) {return d;});

	// bind class labels to label container and center on rows
	const row_labels = label_g.selectAll(".row-label")
	    .data(class_labels)
	  	.enter()
		.append("g")
	    .attr("class", "row-label")
	    .attr("transform", function(d, i) {return "translate(" + 0 + "," + y(i) + ")";});

	// add tick marks for labels
	row_labels.append("line")
		.style("stroke", "black")
	    .style("stroke-width", "1px")
	    .attr("x1", 0)
	    .attr("x2", -5)
	    .attr("y1", y.rangeBand() / 2)
	    .attr("y2", y.rangeBand() / 2);

	// append text to labels
	row_labels.append("text")
	    .attr("x", -8)
	    .attr("y", y.rangeBand() / 2)
	    .attr("dy", ".32em")
	    .attr("text-anchor", "end")
	    .text(function(d) {return d;});
}
