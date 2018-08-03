let targetIndex;

function has_target (target_checkbox) {
    let index_input = document.getElementById('data-target-index');
    if (target_checkbox.checked) {
        index_input.style.display = 'inline-block';
    } else {
        index_input.style.display = 'none';
    }
}

function toggle_input_form(input_form_toggle) {
    let init_data_element = document.getElementById("init-data");
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
    let element = document.getElementById("input-form-toggle");
    if (element.style.display === "none") {
        element.style.display = "block";
    }
}

function decisionTree (paramsObject, onSuccess) {

    $.post('decision_tree', {'parameters': JSON.stringify(paramsObject)}, function (returnData) {
        onSuccess(returnData);
    }).fail(function () {
        alert('Post failed')
    })
}


function initializeTree (fileIn) {

    const formData = new FormData();
    formData.append('file', fileIn);
    console.log('Type', typeof fileIn);

    targetIndex = ($('#data-has-target')[0].checked) ? $('#data-target-index').val() : 0;
    formData.append('target_index', targetIndex);

    $.ajax({
        url: 'load_data',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false
    }).done(function (returnData) {
        // alert('Success');
        // console.log(returnData);

        toggle_input_form(document.getElementById('input-form-toggle'));
        show_display_form_toggle();
        const params = get_parameters();
        decisionTree(params, function (mlResults) {
            console.log(mlResults);
        });
    }).fail(function () {
        alert('Post failed')
    })



    // if ($('#data-has-target')[0].checked) {target = $('#data-target-index').val();}

}
