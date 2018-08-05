// params_in is an object of form:
// {container: id/class of div,
// features: NxN array of [feature name, importance score],
// current_parameters: current parameters object}

const FeatureTable = function () {
    const newFeatureTable = {

        renderFeatureTable: function(params_in) {

            console.log("Feature table");
            console.log(params_in.features);

            reset_feature_table();

            const column_labels = ["Feature", "Score"];

            let features_to_filter_array;

            if (!("filter_feature" in params_in.current_parameters)) {
                // console.log("Key wasn't there");
                features_to_filter_array = [];
            } else {
                // console.log("Key was there");
                features_to_filter_array = params_in.current_parameters.filter_feature;
            }

            const feature_count = features_to_filter_array.length + params_in.features.length;

            // d3.select(params_in.container)
            //     .append("hr")
            //     .attr("id", "features-hr");

            const title = d3.select(params_in.container)
                .append("div")
                .attr("id", "features-title")
                .append("h3")
                .append("text")
                .text("Important Features");

            const warning_message_div = d3.select(params_in.container).append("div")
                .attr("id", "warning-message-div")
                .attr("display", "none");

            // set up table
            const table = d3.select(params_in.container).append("table")
                .attr("id", "feature-table")
                .attr("align", "center");
            const thead = table.append("thead");
            const tbody = table.append("tbody");

            // add column labels
            thead.append("tr")
                .selectAll("th")
                .data(column_labels)
                .enter().append("th")
                .text(function (d) {return d;});

            // build rows
            const rows = tbody.selectAll("tr")
                            .data(params_in.features)
                            .enter()
                            .append("tr").on("click", function (d) {
                                    // If row hasn't been selected for filtering
                                    if (d3.select(this).style("background-color") !== "rgb(255, 179, 179)") {
                                        // If filtering feature won't remove all features
                                        if (feature_count - features_to_filter_array.length > 1) {
                                            d3.select(this).style("background-color", "rgb(255, 179, 179)");
                                            features_to_filter_array.push(d[0]);
                                            toggle_retrain_button();
                                        // Removing all features will throw error on backend
                                        } else {
                                            remove_warning_message();
                                            display_warning_message();
                                        }
                                    } else {
                                        // If row has been selected, remove from filtering array
                                        d3.select(this).style("background-color", "transparent");
                                        const index = features_to_filter_array.indexOf(d[0]);
                                        if (index !== -1) {
                                            features_to_filter_array.splice(index, 1);
                                        }
                                        toggle_retrain_button();
                                        remove_warning_message();
                                    }
                            });

            // build cells
            rows.selectAll("td")
                .data(function (d) {return d;})
                .enter()
                .append("td")
                .text(function (d) {return d;});

            // Draw retrain button
            const this_table = document.getElementById("feature-table");
            // Set svg dimensions relative to table dimensions
            const svg_width = this_table.offsetWidth;
            const svg_height = 60;
            const button_width = svg_width - 10;
            const button_height = svg_height - 10;

            // Build svg
            const svg = d3.select(params_in.container)
                .append("svg")
                .attr("id", "feature-table-button")
                .attr("width", svg_width)
                .attr("height", svg_height)
                // Center svg in div
                .style("margin", "0 auto")
                .attr("display", "none");

            // Build rectangle
            svg.append("g")
                .append("rect")
                .attr("x", (svg_width - button_width) / 2)
                .attr("y", (svg_height - button_height) / 2)
                .attr("width", button_width)
                .attr("height", button_height)
                .style("fill", "lightgreen")
                .attr("rx", 10)
                .attr("ry", 10)
                .on("click", function () {
                    // function in sdk_tree_demo; pass features to be filtered
                    params_in.updateInteractionParameters("filter_feature", features_to_filter_array);
                    // update_interaction_parameters("filter_feature", features_to_filter_array);
                    // function in sdk_tree_demo
                    params_in.retrainTree();
                    // retrainTree();
                });

            svg.append("text")
                .attr("x", svg_width / 2)
                .attr("y", svg_height / 2)
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                // Ensure clicking on rectangle and text appear as single event to user
                .text("Re-train tree").on("click", function () {
                    params_in.updateInteractionParameters("filter_feature", features_to_filter_array);
                    // update_interaction_parameters("filter_feature", features_to_filter_array);
                params_in.retrainTree();
                    // retrainTree();
                });

            function display_warning_message () {
                warning_message_div.append("p")
                    .attr("id", "warning-message")
                    .append("text")
                    .text("Cannot train tree with no features")
                    .style("color", "red");
            }

            function reset_feature_table () {
                // d3.selectAll("#features-hr").remove();
                d3.selectAll("#features-title").remove();
                d3.selectAll("#feature-table").remove();
                d3.selectAll("#feature-table-button").remove();
                d3.selectAll("#warning_message-div").remove();
                remove_warning_message();
            }

            function remove_warning_message () {
                d3.selectAll("#warning-message").remove();
            }

            function toggle_retrain_button () {
                if (features_to_filter_array.length > 0) {
                    d3.select("#feature-table-button").attr("display", "block");
                } else {
                    d3.select("#feature-table-button").attr("display", "none");
                }
            }
        }
    };
    return newFeatureTable;
};
