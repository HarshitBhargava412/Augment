require("dotenv").config();
const userModel = require( "../Models/userModel" );
const bcrypt = require("bcrypt");
const jwt = require( "jsonwebtoken" );

const signup = async ( req, res ) => {
    const {name, email, password, phone, role} = req.body;

    const existingUser = await userModel.findOne({email: email});
    if(existingUser) {
        return res.status(400).json({message: "User Already Exist.", status: 400});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userModel.create({
        name: name,
        email: email,
        phone: phone,
        password: hashedPassword,
        role: role
    })

    const token = jwt.sign({email: result.email, id: result._id, role: result.role}, process.env.SECURITY_KEY);
    res.status(201).json({user: result, token: token, status: 201});
}

const signin = async ( req, res ) => {
    const {email, password} = req.body;

    const existingUser = await userModel.findOne({email: email});
    if(!existingUser) {
        return res.status(404).json({message: "User Not Found.", status: 404});
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if(!matchPassword) {
        return res.status(400).json({message: "Invalid Credentials", status: 400});
    }

    const token = jwt.sign({email: existingUser.email, id: existingUser.id, role: existingUser.role}, process.env.SECURITY_KEY);
    res.status(200).json({user: existingUser, token: token, status: 200});
}

module.exports = { signup, signin };