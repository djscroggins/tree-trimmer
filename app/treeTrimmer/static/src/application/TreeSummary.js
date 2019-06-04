const TreeSummary = function () {
    const newTreeSummary = {

        renderTreeSummary: function(params) {

            d3.selectAll("#t-summary-table").remove();

            const summaryArray = Object.keys(params.summary);

            const valuesArray = Object.values(params.summary);

            const table = d3
                .select(params.container)
                .append("table")
                .attr("id", "t-summary-table");

            const thead = table.append("thead");
            const tbody = table.append("tbody");

            thead.append("tr")
                .selectAll("th")
                .data(summaryArray)
                .enter().append("th")
                .text(function (d) {return d;});

            tbody.selectAll("td")
                .data(valuesArray)
                .enter().append("td")
                .text(function (d) {return d;})
                .attr("align", "center");

        }
    };
    return newTreeSummary;
};
