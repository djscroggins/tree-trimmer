const TreeSummary = function () {
    const newTreeSummary = {

        renderTreeSummary: function(params_in) {

            d3.selectAll("#t-summary-table").remove();

            const summary_array = Object.keys(params_in.summary);

            const values_array = Object.values(params_in.summary);

            const table = d3
                .select(params_in.container)
                .append("table")
                .attr("id", "t-summary-table");

            const thead = table.append("thead");
            const tbody = table.append("tbody");

            thead.append("tr")
                .selectAll("th")
                .data(summary_array)
                .enter().append("th")
                .text(function (d) {return d;});

            tbody.selectAll("td")
                .data(values_array)
                .enter().append("td")
                .text(function (d) {return d;})
                .attr("align", "center");

        }
    };
    return newTreeSummary;
};
