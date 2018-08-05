const formUtilities = function () {
    const newFormUtilities = {

        hasTarget: function (target_checkbox) {
                const index_input = document.getElementById('data-target-index');
                if (target_checkbox.checked) {
                    index_input.style.display = 'inline-block';
                } else {
                    index_input.style.display = 'none';
                }
        },

        toggleInputForm: function (input_form_toggle) {
            const init_data_element = document.getElementById("init-data");
            if (init_data_element.style.display === "none") {
                init_data_element.style.display = "block";
                input_form_toggle.value = "Hide input form";
            } else {
                init_data_element.style.display = "none";
                // Check because element initially set to display:none and so treated as if it doesn't exist
                // if (typeof input_form_toggle !== 'undefined') {
                // input_form_toggle.value = "Show input form";
                // }
                // }

            }
        },

        getInitParameters: function () {
            return {
                criterion: document.getElementById("criterion").value,
                max_depth: document.getElementById("max-depth").value,
                min_samples_split: document.getElementById("min-samples-split").value,
                min_samples_leaf: document.getElementById("min-samples-leaf").value,
                random_state: document.getElementById("random-state").checked
            };

        },

        showFormButton: function () {
            const element = document.getElementById("input-form-toggle");
            if (element.style.display === "none") {
                element.style.display = "block";
            }
        }

    };
    return newFormUtilities;
};
