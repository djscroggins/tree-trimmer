const app = TreeTrimmer();
const myFormUtilities = formUtilities();

let interactionParameters;


function updateInteractionParameters(key_to_update, value_to_update) {
    interactionParameters[key_to_update] = value_to_update;
}


function getDecisionTree(paramsObject, onSuccess) {
    $.post('decision_tree', {'parameters': JSON.stringify(paramsObject)}, function (returnData) {
        onSuccess(returnData);
    }).fail(function (jqXHR, textStatus) {
        //TODO: Add sensible error handling
        console.log('Decision tree failed');
        console.log(jqXHR);
        console.log(textStatus);
        alert('Post failed')
    })
}


function initializeTree(fileIn) {

    const targetIndex = ($('#data-has-target')[0].checked) ? $('#data-target-index').val() : 0;

    const formData = new FormData();
    formData.append('file', fileIn);
    formData.append('target_index', targetIndex);

    $.ajax({url: 'load_data', type: 'POST', data: formData, processData: false, contentType: false})
        .done(function (returnData, textStatus, jqXHR) {

            console.log('Done');
            console.log(returnData);
            console.log(textStatus);
            console.log(jqXHR);

            myFormUtilities.toggleInputForm(document.getElementById('input-form-toggle'));
            myFormUtilities.showFormButton();

            const params = myFormUtilities.getInitParameters();
            interactionParameters = params;

            getDecisionTree(params, function (results) {
                console.log(results);
                app.renderApp(results.ml_results, params, updateInteractionParameters, retrainTree)

            });
        }).fail(function (jqXHR, textStatus) {
            //TODO: Add sensible error handling
            console.log('Failed');
            console.log(jqXHR);
            console.log(textStatus);
            alert('Post failed')
        })
}


function retrainTree() {
    getDecisionTree(interactionParameters, function (results) {
        app.renderApp(results.ml_results, interactionParameters, updateInteractionParameters, retrainTree)
    });
}
