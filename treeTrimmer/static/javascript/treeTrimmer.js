let targetIndex;
let interaction_parameters;
const stored_parameters_array = [];
let counter = 0;

function has_target (target_checkbox) {
    const index_input = document.getElementById('data-target-index');
    if (target_checkbox.checked) {
        index_input.style.display = 'inline-block';
    } else {
        index_input.style.display = 'none';
    }
}

function toggle_input_form(input_form_toggle) {
    const init_data_element = document.getElementById("init-data");
    if (init_data_element.style.display === "none") {
        init_data_element.style.display = "block";
        input_form_toggle.value = "Hide input form";
    } else {
        init_data_element.style.display = "none";
        // Check because element initially set to display:none and so treated as if it doesn't exist
        if (typeof input_form_toggle !== 'undefined') {
            input_form_toggle.value = "Show input form";
        }
    }
}

function get_parameters() {
    return {
        criterion: document.getElementById("criterion").value,
        max_depth: document.getElementById("max-depth").value,
        min_samples_split: document.getElementById("min-samples-split").value,
        min_samples_leaf: document.getElementById("min-samples-leaf").value,
        random_state: document.getElementById("random-state").checked
    };
}

function show_display_form_toggle () {
    const element = document.getElementById("input-form-toggle");
    if (element.style.display === "none") {
        element.style.display = "block";
    }
}

function update_interaction_parameters (key_to_update, value_to_update) {

    console.log("Inside update_interaction_parameters");
    console.log(interaction_parameters);
    console.log("Key to update: ", key_to_update);
    console.log("Value to update: ", value_to_update);

    interaction_parameters[key_to_update] = value_to_update;
    // console.log("Updated interaction parameters");
    // console.log(interaction_parameters);

}

function decisionTree (paramsObject, onSuccess) {

    $.post('decision_tree', {'parameters': JSON.stringify(paramsObject)}, function (returnData) {
        onSuccess(returnData);
    }).fail(function () {
        alert('Post failed')
    })
}

function tree_trimmer_app (ml_results, parameters) {

        draw_accuracy_report({
            container: '#accuracy-report',
            matrix: ml_results.confusion_matrix
        });

        draw_params_table({
            container: '#parameter-table',
            parameters: parameters
        });


        draw_tree_summary({
            container: "#tree-summary",
            summary: ml_results.tree_summary
        });

        // console.log("Tree JSON");
        // console.log(ml_results.tree_json);

        // TODO: Update this function to take object style parameters, correct display issues
        // draw_decision_tree(ml_results.tree_json);
        draw_decision_tree({
            data: ml_results.tree_json,
            container: '#tree-container'
        });

        draw_confusion_matrix({
            container: '#matrix',
            matrix: ml_results.confusion_matrix,
            labels: ml_results.class_labels,
            start_color: '#ffffff',
            end_color: '#042E8D'
        });

        draw_feature_table({
            container: '#important-features',
            features: ml_results.important_features,
            current_parameters: parameters
        });


}


function initializeTree (fileIn) {

    const formData = new FormData();
    formData.append('file', fileIn);
    console.log('Type', typeof fileIn);

    targetIndex = ($('#data-has-target')[0].checked) ? $('#data-target-index').val() : 0;
    formData.append('target_index', targetIndex);

    $.ajax({url: 'load_data', type: 'POST', data: formData, processData: false, contentType: false})
        .done(function (returnData) {
        // alert('Success');
        // console.log(returnData);

        toggle_input_form(document.getElementById('input-form-toggle'));
        show_display_form_toggle();
        const params = get_parameters();
        interaction_parameters = params;
        decisionTree(params, function (mlResults) {
            console.log(mlResults);
            tree_trimmer_app(mlResults, params)
        });
        }).fail(function () {
        alert('Post failed')
    })



    // if ($('#data-has-target')[0].checked) {target = $('#data-target-index').val();}

}

function retrain_tree() {

    stored_parameters_array.push(counter);
    counter++;

    console.log('Interaction parameters');
    console.log(interaction_parameters);

    decisionTree(interaction_parameters, function (mlResults) {
        tree_trimmer_app(mlResults, interaction_parameters)
    });

}
