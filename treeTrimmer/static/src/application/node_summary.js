function display_node_summary (data_in, updateInteractionParameters, leaf=false) {

    reset_node_summary();

    // d3.select("#summary").remove();
    // d3.select("#trim-button").remove();
    // d3.select("#trim-options-table").remove();
    // d3.select("#retrain-button").remove();

    const update_array = [];

    // if (!leaf) {
    //     console.log("Displaying node summary");
    // } else {
    //     console.log("Displaying leaf summary")
    // }

    // console.log(data_in);

    // d3.select("#node-summary").append("hr").attr("id", "node-hr");

    const div = d3.select("#node-summary").append("div").attr("id", "summary");

    div.append("h3").append("text").text("Node Summary");

    div.append("p").append("text").text("Depth: " + data_in.node_depth);

    if (!leaf) {
        div.append("p").append("text").text(data_in.split[0] + " >= " + data_in.split[1]);
    }

    div.append("p").append("text").text(data_in.impurity[0] + " = " + data_in.impurity[1]);

    if (!leaf) {
        div.append("p").append("text").text("Impurity decrease: " + round(data_in.weighted_impurity_decrease, 5) + " (" + data_in.percentage_impurity_decrease + "%)");
        // div.append("p").append("text").text("% decrease: " + data_in.percentage_impurity_decrease);
    }

    div.append("p").append("text").text("Number of samples: " + data_in.n_node_samples);

    div.append("p").append("text").text("[" + get_sample_distribution_text(data_in.node_class_counts) + "]");

    // get_sample_distribution_text(data_in.node_class_counts);

    // If not first node, draw trim button
    if (data_in.node_depth > 0) {
        const svg_height = 50;
        const svg_width = 150;
        const button_height = svg_height - 10;
        const button_width = svg_width - 10;

        const svg = div
            .append("svg")
            .attr("id", "trim-button")
            .attr("width", svg_width)
            .attr("height", svg_height)
            // Center svg in div
            .style("margin", "0 auto").attr("display", "block");

            svg.append("g")
            .append("rect")
            .attr("x", (svg_width - button_width) / 2)
            .attr("y", (svg_height - button_height) / 2)
            .attr("width", button_width)
            .attr("height", button_height)
            .style("fill", "rgb(255, 179, 179")
            .attr("rx", 10)
            .attr("ry", 10).on("click", function () {
                show_trim_options(data_in, leaf);
            });

            svg.append("text")
            .attr("x", svg_width / 2)
            .attr("y", svg_height / 2)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            // Ensure clicking on rectangle and text appear as single event to user
            .text("Trim node options").on("click", function () {
                show_trim_options(data_in, leaf);
            });
    }



    // Draw re-train button

    // const this_table = document.getElementById("trim-options-table");
    // const retrain_svg_width = this_table.offsetWidth;
    // const retrain_svg_height = 60;
    // const retrain_button_width = retrain_svg_width - 10;
    // const retrain_button_height = retrain_svg_height - 10;
    //
    // const retrain_button = d3.select("#node-summary")
    //     .append("svg")
    //     .attr("id", "retrain-button")
    //     .attr("width", retrain_svg_width)
    //     .attr("height", retrain_svg_height)
    //     // Center svg in div
    //     .style("margin", "0 auto")
    //     .attr("display", "none");
    //
    // retrain_button.append("g")
    //     .append("rect")
    //     .attr("x", (svg_width - button_width) / 2)
    //     .attr("y", (svg_height - button_height) / 2)
    //     .attr("width", button_width)
    //     .attr("height", button_height)
    //     .style("fill", "lightgreen")
    //     .attr("rx", 10)
    //     .attr("ry", 10)
    //     .on("click", function () {
    //         // function in sdk_tree_demo; pass features to be filtered
    //         update_interaction_parameters("filter_feature", features_to_filter_array);
    //         // function in sdk_tree_demo
    //         retrain_tree();
    //     });
    //
    // retrain_button.append("text")
    //     .attr("x", svg_width / 2)
    //     .attr("y", svg_height / 2)
    //     .attr("dy", ".35em")
    //     .attr("text-anchor", "middle")
    //     // Ensure clicking on rectangle and text appear as single event to user
    //     .text("Re-train tree");



    function show_trim_options(data_in, leaf_status_in) {

        toggle_retrain_button();

        d3.select("#trim-options").remove();
        d3.select("#trim-options-table").remove();
        d3.select("#retrain-button").remove();

        // console.log(data_in);

        const label = ["Why do you want to trim this node?"];

        const node_options = ["Not enough samples to split", "I want to limit the tree to this depth", "This node doesn't improve the tree enough"];
        const leaf_options = ["Not enough samples in leaf", "I want to limit the tree to this depth"];

        const div = d3.select("#node-summary").append("div").attr("id", "trim-options");

        const table = d3.select("#trim-options").append("table").attr("id", "trim-options-table").attr("align", "center");
        const thead = table.append("thead");
        const tbody = table.append("tbody");

        thead.append("tr").selectAll("th").data(label).enter().append("th").text(function (d) {
            return d;
        });

        let rows;

        if (!leaf_status_in) {
            rows = tbody.selectAll("tr").data(node_options).enter().append("tr").text(function (d) {
                return d;
            });
        } else {
            rows = tbody.selectAll("tr").data(leaf_options).enter().append("tr").text(function (d) {
                return d;
            });
        }

        draw_retrain_button();

        rows.on("click", function (d) {
            console.log(d);
            d3.selectAll("tr").style("background-color", "transparent");
            d3.select(this).style("background-color", "rgb(255, 179, 179)");
            adjust_update_array(data_in, d);
            toggle_retrain_button();
        })
    }

    function draw_retrain_button () {
        const this_table = document.getElementById("trim-options-table");
        const retrain_svg_width = this_table.offsetWidth;
        const retrain_svg_height = 60;
        const retrain_button_width = retrain_svg_width - 10;
        const retrain_button_height = retrain_svg_height - 10;

        const retrain_button = d3.select("#trim-options")
            .append("svg")
            .attr("id", "retrain-button")
            .attr("width", retrain_svg_width)
            .attr("height", retrain_svg_height)
            // Center svg in div
            .style("margin", "0 auto")
            .attr("display", "none");

        retrain_button.append("g")
            .append("rect")
            .attr("x", (retrain_svg_width - retrain_button_width) / 2)
            .attr("y", (retrain_svg_height - retrain_button_height) / 2)
            .attr("width", retrain_button_width)
            .attr("height", retrain_button_height)
            .style("fill", "lightgreen")
            .attr("rx", 10)
            .attr("ry", 10)
            .on("click", function () {
                updateInteractionParameters(update_array[0], update_array[1]);
                // update_interaction_parameters(update_array[0], update_array[1]);
                retrain_tree();
                reset_node_summary();
            });

        retrain_button.append("text")
            .attr("x", retrain_svg_width / 2)
            .attr("y", retrain_svg_height / 2)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            // Ensure clicking on rectangle and text appear as single event to user
            .text("Re-train tree").on("click", function () {
                updateInteractionParameters(update_array[0], update_array[1]);
                // update_interaction_parameters(update_array[0], update_array[1]);
                retrain_tree();
                reset_node_summary();
            });
    }

    function adjust_update_array (data_in, option_selected) {

        if (option_selected === "Not enough samples to split") {
            const n_node_samples = data_in.n_node_samples;
            update_array.splice(0, update_array.length, "min_samples_split", n_node_samples + 1);
            // update_array.push("min_samples_split", n_node_samples);
            console.log(update_array);
        } else if (option_selected === "I want to limit the tree to this depth") {
            const node_depth = data_in.node_depth;
            // update_array.push("max_depth", node_depth);
            update_array.splice(0, update_array.length, "max_depth", node_depth);
            console.log(update_array);
        } else if (option_selected === "This node doesn't improve the tree enough") {
            const impurity_decrease = data_in.weighted_impurity_decrease;
            update_array.splice(0, update_array.length, "min_impurity_decrease", impurity_decrease);
            console.log(update_array)
        } else if (option_selected === "Not enough samples in leaf") {
            const n_node_samples = data_in.n_node_samples;
            update_array.splice(0, update_array.length, "min_samples_leaf", n_node_samples + 1);
            // update_array.push("min_samples_leaf", n_node_samples);
            console.log(update_array);
        }


    }

    function toggle_retrain_button () {
        if (update_array.length > 0) {
            d3.select("#retrain-button").attr("display", "block");
        } else {
            d3.select("#retrain-button").attr("display", "none");
        }
    }

    function reset_node_summary () {
        // d3.select("#node-hr").remove();
        d3.select("#summary").remove();
        d3.select("#trim-button").remove();
        d3.select("#trim-options-table").remove();
        d3.select("#retrain-button").remove();
    }

    function get_sample_distribution_text (array_in) {
        const accumulator = [];
        array_in.forEach(function (cv) {
            accumulator.push(cv[0].toString() + ": " + cv[1].toString())
        });

        // console.log("Accumulator");
        // console.log(accumulator);

        return accumulator.join(", ");
    }

}
