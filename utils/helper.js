require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.getToken = async (email, user) => {
    // Create JWT token with a payload containing user ID (and optionally email)
    const token = jwt.sign(
        { id: user._id }, // Standard to use 'id' in the payload
        process.env.JWT_SECRET, // Secret key
        { expiresIn: '1h' } // Expiration time (optional, 1 hour in this case)
    );
    return token;
};
