import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { cookieOptions } from "../config.js";

const registerUser = async (req, res) => {
    console.log(process.env.JWT_SECRET);

    try {
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            return res.json({
                success: false,
                message: "Missing Details",
            });
        }
        const checkUser = await User.findOne({ email });
        if (checkUser)
            return res.json({
                success: false,
                message:
                    "User Already exists with given email! Please try again",
            });

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            username: userName,
            email,
            password: hashPassword,
        });

        await newUser.save();
        res.status(200).json({
            success: true,
            message: "Registration successful",
            data: newUser,
        });
    } catch (error) {
        console.log("Error Registering User\nError: ", error);
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({
                success: false,
                message: "Missing Details",
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User Not Found",
            });
        }
        const checkPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );
        if (!checkPasswordMatch) {
            return res.json({
                success: false,
                message: "Incorrect password! Please try again",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                name: user.username,
                role: user.role,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, cookieOptions).json({
            success: true,
            message: "Logged in successfully",
            user: {
                email: user.email,
                role: user.role,
                id: user._id,
                userName: user.username,
                token,
            },
        });
    } catch (error) {
        console.log("Error LoggingIn User\nError: ", error);
        res.status(500).json({
            success: false,
            message: "Error LoggingIn User",
        });
    }
};

const logoutUser = (req, res) => {
    try {
        res.clearCookie("token").json({
            success: true,
            message: "Logged out Successfully!",
        });
    }
    catch (error) {
        console.log("Error LoggingOut User\nError: ", error);
        res.status(500).json({
            success: false,
            message: "Error LoggingOut User",
        });
    }
};


export { 
    registerUser,
    loginUser,
    logoutUser
    };
