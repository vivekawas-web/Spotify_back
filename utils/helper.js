const jwt = require("jsonwebtoken");

exports ={};

exports.getToken = async (email, user) =>{
    const token = jwt.sign({identifier : user._id},"this_is_secret_code_set_up_later");
    return token;
};

module.exports = exports;
