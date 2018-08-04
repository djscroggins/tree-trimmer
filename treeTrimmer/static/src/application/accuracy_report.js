// params_in is an object of form:
// {container: id/class of div,
// matrix: NxN confusion matrix array}

// TODO: Expand to allow for passing of label array which is parsed to dynamically build various score reports

function draw_accuracy_report (params_in) {

    d3.selectAll("#a-table").remove();

    const label = ["Accuracy"];
    const confusion_matrix = params_in.matrix;
    const accuracy_score = [round(sum_true_positives(confusion_matrix) / compute_instance_sum(confusion_matrix), 4) * 100];

    // set up table
    const table = d3.select(params_in.container)
        .append("table")
        .attr("id", "a-table");
    const thead = table.append("thead");
    const tbody = table.append("tbody");

    // add column label(s)
    thead.append("tr")
        .selectAll("th")
        .data(label)
        .enter()
        .append("th")
        .text(function (d) {return d;});

    // build cell(s)
    tbody.selectAll("td")
        .data(accuracy_score)
        .enter()
        .append("td")
        .text(function (d) {return d;})
        .attr("align", "center");


    // Uses reduce to first concatenate the sub-arrays then sum the elements in the resulting array
    function compute_instance_sum (matrix_in) {
        return matrix_in.reduce((a, b) => a.concat(b)).reduce((a, b) => a + b);
    }

    function sum_true_positives (matrix_in) {
        // Map each row to filter function
        return matrix_in.map((row, row_index) =>
            // If row index equals column index of value return value
			row.filter((value, column_index, current_row) =>
			    row_index === current_row.indexOf(value)
            // Flatten resulting sub-arrays and sum total of resulting array
			)).reduce((a, b) => a.concat(b)).reduce((sum, addend) => sum + addend);
    }
}
