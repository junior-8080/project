$('#logout').click(function () {
  console.log('logout')
  document.cookie = "token=" + undefined;
  window.location.href = '/'
})


$('.order').click(function (event) {
   console.log(event.target.id)
  let stringid = event.target.id.split('er')[1]
  let  id = parseInt(stringid);
  toastr.options.closeButton = true;
  toastr.success('Sending Serial number.....', '', {timeOut: 3000})
  $.ajax({
    url: "/api/order",
    data: {id:id},
    type: 'POST',
    success: function (result, satus) {
      if (result) {
        // toastr.success(result.message);
        toastr.success(result.message,'',{timeOut:1000});
      } 
    }
  })
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
    url: "/api/report",
    data: data,
    type: 'POST',
    success: function (result, satus) {
      if (result) {
        toastr.success(result.message);
      }
    }
  })
});

