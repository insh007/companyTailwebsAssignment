const isValidPassword = function(password){
    let regex = /^(?=.*[0-9])(?=.*[!.@#$%^&*])[a-zA-Z0-9!.@#$%^&*]{8,15}$/
    return regex.test(password)
}

const isValidEmail = function (value) {
    let emailRegex =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
    return emailRegex.test(value)
}

module.exports = {isValidEmail,isValidPassword}