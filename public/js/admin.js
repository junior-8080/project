$("#save-change").click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    let data = {
        email: document.getElementById('profilEmail').value,
        phonenumber: document.getElementById('profileNumber').value
    }
    $.ajax({
        url: "/admin/editProfile",
        data: data,
        type: 'PUT',
        success: function (data, satus) {
            if (data.token) {
                data.user_profile.role === 'user' ? document.cookie = `token=${data.access_token};SameSite=Lax` : document.cookie = `admin_token=${data.admin_access_token};Same-Site=Lax;path=/admin`
                alert(data.message)
            } else {
                toastr.success(data.message);
            }
            toastr.success(data.message);
        }
    })

})

$('.view').click(function (e) {
    let element = e.target;
    let param = element.parentElement.firstElementChild.textContent;
    console.log(`/admin/products/${param}`)
    window.location = `http://localhost:3001/admin/products/${param}`;
});

$(".imgAdd").click(function () {
    $(this).closest(".row").find('.imgAdd').before('<div class="col-sm-2 col-md-4 imgUp"><div class="imagePreview"></div><label class="btn btn-primary">Upload<input type="file" class="uploadFile img" value="Upload Photo" name="image" style="width:0px;height:0px;overflow:hidden;"></label><i class="fa fa-times del"></i></div>');
    let imagePreview = document.getElementsByClassName('imagePreview');
    let ImagePreviewArray = Array.from(imagePreview);
    console.log(ImagePreviewArray);
    if (ImagePreviewArray.length === 3) {
        console.log(document.getElementsByClassName('imgAdd')[0].style.display = 'none');
    }

});
$(document).on("click", "i.del", function () {
    $(this).parent().remove();
    let imagePreview = document.getElementsByClassName('imagePreview');
    let ImagePreviewArray = Array.from(imagePreview);
    console.log(ImagePreviewArray);
    if (ImagePreviewArray.length < 3) {
        console.log(document.getElementsByClassName('imgAdd')[0].style.display = 'inline');
    }
});
$(function () {
    $(document).on("change", ".uploadFile", function () {
        var uploadFile = $(this);
        var files = !!this.files ? this.files : [];
        if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support

        if (/^image/.test(files[0].type)) { // only image file
            var reader = new FileReader(); // instance of the FileReader
            reader.readAsDataURL(files[0]); // read the local file

            reader.onloadend = function () { // set image data as background of div
                //alert(uploadFile.closest(".upimage").find('.imagePreview').length);
                uploadFile.closest(".imgUp").find('.imagePreview').css("background-image", "url(" + this.result + ")");
            }
        }

    });
});

$('#post').click(function (e) {
    e.preventDefault()
    e.stopPropagation()
    let form = $('#requestForm')[0];
    let data = new FormData(form);
    let select = $('#status').val()
    let cat = $('#category').val()
    data.append("status", select)
    data.append("category", cat)
    $.ajax({
        url: 'http://localhost:3001/admin/post',
        type: 'POST',
        data: data,
        enctype: 'multipart/form-Data',
        contentType: false,
        processData: false,
        cache: false,
        success: function (data) {
            let errors = data.errors;
            if (typeof (errors) !== "undefined") {
                errors.forEach((data) => {
                    let el = document.createElement("span");
                    el.innerHTML = data.msg;
                    el.className = "error"
                    let div = document.getElementById(data.param);
                    div.nextElementSibling ? null : insertAfter(div, el);
                })
            }
            toastr.success(`${data}`);
            window.location = '/admin/#products'

        }
    });
});

$('#delete-btn').click(function (e) {
    let Id = document.getElementById('product-id').textContent.replace(/\s/g, '').split(':')[1];
    Id = parseInt(Id);
    $.ajax({
        url: `http://localhost:3001/admin/deleteProduct/${Id}`,
        type: 'DELETE',
        success: function (data, satus) {
            toastr.success(data.message);
        }
    })
    
    window.location = '/admin/#products'

});


$("#signUpAdmin").click(function (e) {

    e.preventDefault()
    $.post("/admin/signup", {
          
            email: document.getElementById('email').value,
            phonenumber: document.getElementById('phonenumber').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            admin:'admin'
        },
        function (data, status) {
            let errors = data.errors;
            let array = [];
            if (typeof (errors) !== "undefined") {
                errors.forEach((data) => {
                    let el = document.createElement("span");
                    el.innerHTML = data.msg;
                    el.className = "error"
                    let div = document.getElementById(data.param);
                    div.nextElementSibling ? null : insertAfter(div, el);
                })

            } else if (data.errorMessage) {
                let el = document.createElement("span");
                el.innerHTML = data.errorMessage;
                el.className = "error"
                let div = document.getElementById(data.param);
                div.nextElementSibling ? null : insertAfter(div, el);

            } else {
                let url = data.url;
                window.location = url;
            }
        });
});