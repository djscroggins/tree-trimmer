const app = treeTrimmer();
const myFormUtilities = formUtilities();

let interactionParameters;


function updateInteractionParameters (key_to_update, value_to_update) {interactionParameters[key_to_update] = value_to_update;}

function getDecisionTree (paramsObject, onSuccess) {
    $.post('decision_tree', {'parameters': JSON.stringify(paramsObject)}, function (returnData) {
        onSuccess(returnData);
    }).fail(function () {
        //TODO: Add sensible error handling
        alert('Post failed')
    })
}


function initializeTree(fileIn) {

    const targetIndex = ($('#data-has-target')[0].checked) ? $('#data-target-index').val() : 0;

    const formData = new FormData();
    formData.append('file', fileIn);
    formData.append('target_index', targetIndex);

    $.ajax({url: 'load_data', type: 'POST', data: formData, processData: false, contentType: false})
        .done(function (returnData) {
            myFormUtilities.toggleInputForm(document.getElementById('input-form-toggle'));
            myFormUtilities.showFormButton();

            const params = myFormUtilities.getInitParameters();
            interactionParameters = params;

            getDecisionTree(params, function (mlResults) {
                app.renderApp(mlResults, params, updateInteractionParameters, retrainTree)
            });
        }).fail(function () {
            //TODO: Add sensible error handling
            alert('Post failed')
        })



    // if ($('#data-has-target')[0].checked) {target = $('#data-target-index').val();}

}

function retrainTree() {

    console.log("RETAIN TREE");

    getDecisionTree(interactionParameters, function (mlResults) {
        // tree_trimmer_app(mlResults, interactionParameters)
        app.renderApp(mlResults, interactionParameters, updateInteractionParameters, retrainTree)
    });

}
