let input = document.querySelectorAll("input")
input = Array.from(input)
input.forEach(input => {
    input.addEventListener("input", function () {
        let classel = input.nextElementSibling
        if (classel) {
            classel.remove()
        }
    })

})

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

$("#signUp").click(function (e) {

    e.preventDefault()
    $.post("http://localhost:3001/api/signup", {
            email: document.getElementById('email').value,
            phonenumber: document.getElementById('phonenumber').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value
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

$("#login").click(function (e) {
    e.preventDefault();
    $.post("http://localhost:3001/api/signin", {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    }, function (data, status) {
        if (typeof (data.access_token) !== "undefined" || typeof (data.admin_access_token) !== "undefined") {
            data.user_profile.role === 'user'? document.cookie = `token=${data.access_token};SameSite=Lax`:document.cookie = `admin_token=${data.admin_access_token};Same-Site=Lax;path=/admin`;
            dasboard(data.user_profile.email,data.user_profile.role);
        } else if (typeof (data.redirect) !== "undefined") {
            let url = data.redirect;
            console.log(url)
            login(url)
        } else {
            let el = document.createElement("span");
            el.innerHTML = data.errorMessage;
            el.className = "error"
            let div = document.getElementById(data.param);
            div.nextElementSibling ? null : insertAfter(div, el);
        }
    });
});


function dasboard(email, role) {
    if (role === 'user') {
        toastr.success(`welcome ${email}`)
        setTimeout(() => {
            window.location.href = 'http://localhost:3001/api/homeAcc';
        }, 1000)
    }
    if (role === 'admin') {
        toastr.success(`welcome ${email}`)
        setTimeout(() => {
            window.location.href = 'http://localhost:3001/admin';
        }, 1000)
    }
}

function login(url) {
    window.location.href = url;
}