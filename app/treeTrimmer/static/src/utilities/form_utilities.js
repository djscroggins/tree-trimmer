const formUtilities = function () {
    const newFormUtilities = {

        hasTarget: function (targetCheckbox) {
                const index_input = document.getElementById('data-target-index');
                if (targetCheckbox.checked) {
                    index_input.style.display = 'inline-block';
                } else {
                    index_input.style.display = 'none';
                }
        },

        toggleInputForm: function (inputFormToggleButton, inputForm) {
            // const init_data_element = document.getElementById(inputForm);
            if (inputForm.style.display === "none") {
                inputForm.style.display = "block";
                inputFormToggleButton.value = "Hide input form";
            } else {
                inputForm.style.display = "none";
                inputFormToggleButton.value = "Show input form"
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

        showFormButton: function (id) {
            const element = document.getElementById(id);
            if (element.style.display === "none") {
                element.style.display = "block";
            }
        },

        showErrorMessage: function (id) {
            const element = document.getElementById(id);
            if (element.style.display === "none") {
                element.style.display = "block";
            }
        },

        hideErrorMessage: function (id) {
            const element = document.getElementById(id);
            element.style.display = "none";
        }

    };
    return newFormUtilities;
};
