// params_in is an object of form:
// {container: id/class of div,
// parameters: object of {parameter1:value1,...parameterN:valueN}}

function draw_params_table (params_in) {

    d3.selectAll("#p-table").remove();

    // Get keys as array
    let parameters_array = Object.keys(params_in.parameters);

    // We don't need to display 'filter_feature' array here; filter out value
    const values_array = Object.values(params_in.parameters)
        .filter((value, index, array) => parameters_array.indexOf('filter_feature') !== array.indexOf(value));

    // filter out 'filter_feature' key
    parameters_array = parameters_array.filter(key => key !== 'filter_feature');

    // set up table
    const table = d3.select(params_in.container)
                    .append("table")
                    .attr("id", "p-table");
    const thead = table.append("thead");
    const tbody = table.append("tbody");

    // build column labels
    thead.append("tr")
        .selectAll("th")
        .data(parameters_array)
        .enter()
        .append("th")
        .text(function (d) {return d;});

    // build cells
    tbody.selectAll("td")
        .data(values_array)
        .enter().append("td")
        .text(function (d) {return d;
        }).attr("align", "center");
}
