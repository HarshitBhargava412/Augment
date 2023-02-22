require("dotenv").config();
const jwt = require( "jsonwebtoken" );

const auth = (req, res, next) => {
    let token = req.headers.authorization;
    if(token) {
        token = token.split(" ")[1];
        let user = jwt.verify(token, process.env.SECURITY_KEY);
        req.userId = user.id;
        req.role = user.role;
    } else {
        return res.status(401).json({message: "Unauthorized User."})
    }

    next();
}

module.exports = auth;