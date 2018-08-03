let targetIndex;

function has_target (target_checkbox) {
    let index_input = document.getElementById('data-target-index');
    if (target_checkbox.checked) {
        index_input.style.display = 'inline-block';
    } else {
        index_input.style.display = 'none';
    }
}


function initializeTree (fileIn) {

    const formData = new FormData();
    formData.append('file', fileIn);
    console.log('Type', typeof fileIn);

    targetIndex = ($('#data-has-target')[0].checked) ? $('#data-target-index').val() : null;

    $.ajax({
        url: 'load_data',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false
    }).done(function (returnData) {
        alert('Success');
        console.log(returnData);
    }).fail(function () {
        alert('Post failed')
    })



    // if ($('#data-has-target')[0].checked) {target = $('#data-target-index').val();}

}
