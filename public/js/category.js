$(document).ready(function () {

    $('#openBtn').click(function () {
        $('#myModal').modal({
            show: true
        })
    });

    $(document).on('show.bs.modal', '.modal', function (event) {
        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function () {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1)
                .addClass('modal-stack');
        }, 0);
    });


});

$('.send-report').click(function (event) {
    let id = event.target.id
    let element = event.target.parentElement;
    let elementParent = element.previousElementSibling;
    // console.log(elementParent);
    let textArea = elementParent.firstElementChild.firstElementChild.firstElementChild.nextElementSibling;
    let value = textArea.value;
    id = parseInt(id)

    let data = {
        id: id,
        report: value
    }
    console.log(data)
    $.ajax({
        url: "http://localhost:3001/api/report",
        data: data,
        type: 'POST',
        success: function (result, satus) {
            if (result) {
                toastr.success(result.message);
            }
        }
    })
});