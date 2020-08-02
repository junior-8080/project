function setfield(data) {
    let email = document.getElementById('profilEmail');
    let phonenumber = document.getElementById('profileNumber')
    email.setAttribute("value", data.message.user_email);
    phonenumber.setAttribute("value", data.message.phonenumber)
}

$(document).ready(function () {
    $.get("/api/profile", function (data, status) {
        return setfield(data);
    })

})

$("#v-pills-home-tab").on('shown.bs.tab', function (e) {
    e.stopPropagation()
    $.get("/api/profile", function (data, status) {
        let email = document.getElementById('profilEmail').value = data.message.user_email;
        let phonenumber = document.getElementById('profileNumber').value = data.message.phonenumber;
        //    console.log(email)
        //    console.log(data)

    })


})

$("#save-change").click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    let data = {
        email: document.getElementById('profilEmail').value,
        phonenumber: document.getElementById('profileNumber').value
    }
    $.ajax({
        url: "/api/editProfile",
        data: data,
        type: 'PUT',
        success: function (data, satus) {
            if (data.token) {
                document.cookie = "token=" + data.token;
                alert(data.message)
            } else {
                toastr.success(data.message);
            }
            toastr.success(data.message);
        }
    })

})
$("#reset-password").click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    let data = {
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmP').value
    }
    $.ajax({
        url: "/api/resetpassword",
        data: data,
        type: 'PUT',
        success: function (data, satus) {
            let errors = data.errors;
            let array = [];
            if (typeof (errors) !== "undefined") {
                errors.forEach((data) => {
                    array.push(data.msg)
                })
                array.forEach((error) => {
                    alert(error);
                })
            } else {
                toastr.success(data.message);
            }
        }
    })
})
let element = document.getElementById('img');
element.onclick = function (e) {
    let input = e.target;
    console.log(input)
    let id = '#' + input.getAttribute('id')
    console.log(id);
    e.stopPropagation()
    $(id).change(function (e) {
        for (let i = 0; i < e.originalEvent.srcElement.files.length; i++) {
            let file = e.originalEvent.srcElement.files[i];
            let img = document.createElement("img");
            img.setAttribute("id", `img${i}`)

            let reader = new FileReader();
            reader.onloadend = function () {
                img.src = reader.result;
                img.width = 200;
                img.height = 200;
            }
            reader.readAsDataURL(file);
            $(id).after(img);
        }
    })
}


$('.remove').click(function (e) {
    e.preventDefault()
    let nextSibling = e.target.nextElementSibling;
    let nextSiblingId = nextSibling.nextElementSibling.id;
    console.log(nextSiblingId)
    $(`#${nextSiblingId}`).remove();
})