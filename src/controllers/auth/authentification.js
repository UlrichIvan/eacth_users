const User = require("../../models/users");
const cryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');
const {
    isEmail
}
=require('validator')// LOGIN WITH JWT
const login = async function (req, res)  {

    try {
        // check if email of user is valided
        if(!isEmail(req.body.email) || !req.body.password) {
            console.log("Bad data!");
            return res.status(401).json({"message":"Wrong credentials!"});
        }
        else {
            const user = await User.findOne({ email: req.body.email });

            if(!user) {
                console.log("Bad mail!");
                return res.status(401).json({"message":"Wrong credentials!"});
            }

            else {
                const hashedPassword = cryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
                const password = hashedPassword.toString(cryptoJS.enc.Utf8);
                if(password !== req.body.password) {
                    console.log("Bad Password!");
                    return res.status(401).json({"message":"Wrong credentials!"});
                }
            }

            const accessToken = jwt.sign({ id:user._id, isAdmin: user.role, }, process.env.JWT_SEC, {expiresIn: "3d"},);

            user.isOnline = true; // enable that user is online
            await user.save();
            res.status(200).json({user, accessToken});
            console.log("LOGIN SUCCESSFULY!");

        }


    }
    catch(e) {
        res.status(500).json(e);
        console.log(e);

    }
}


// EXPORTS ALL CONTROLLER'S SERVICES
module.exports = {
    login
}
