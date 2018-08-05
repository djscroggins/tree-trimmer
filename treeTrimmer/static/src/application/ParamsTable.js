// params_in is an object of form:
// {container: id/class of div,
// parameters: object of {parameter1:value1,...parameterN:valueN}}

const ParamsTable = function () {
    const newParamsTable = {


        renderParamsTable: function(params) {

            d3.selectAll("#p-table").remove();

            // Get keys as array
            let parametersArray = Object.keys(params.parameters);

            // We don't need to display 'filter_feature' array here; filter out value
            const valuesArray = Object.values(params.parameters)
                .filter((value, index, array) => parametersArray.indexOf('filter_feature') !== array.indexOf(value));

            // filter out 'filter_feature' key
            parametersArray = parametersArray.filter(key => key !== 'filter_feature');

            // set up table
            const table = d3.select(params.container)
                            .append("table")
                            .attr("id", "p-table");
            const thead = table.append("thead");
            const tbody = table.append("tbody");

            // build column labels
            thead.append("tr")
                .selectAll("th")
                .data(parametersArray)
                .enter()
                .append("th")
                .text(function (d) {return d;});

            // build cells
            tbody.selectAll("td")
                .data(valuesArray)
                .enter().append("td")
                .text(function (d) {return d;
                }).attr("align", "center");
        }

    };
    return newParamsTable;
};
