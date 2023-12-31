const express = require("express");
const ErrorHandler = require("../utils/ErrorHandler");
const sendMail = require("../utils/sendMail");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const path = require("path");
const router = express.Router();
// const { upload } = require("../multer");
const User = require("../model/user");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sendToken = require("../utils/jwToken.js");
const { isAuthenticated } = require("../middleware/auth.js");

// create user
router.post("/create-user", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const user = {
      name: name,
      email: email,
      password: password,
    };

    const activationToken = createActivationToken(user);

    const newActivationToken = activationToken.replace(/\./g, "!");

    const activationUrl = `https://film-folia.vercel.app/activation/${newActivationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `please check your email: ${user.email} to activate your account!`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const { name, email, password } = newUser;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }
      user = await User.create({
        name,
        email,
        password,
      });

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// login user
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide the all fields!", 400));
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("User doesn't exists!", 400));
      }

      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }

      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.get(
  "/logout",
  catchAsyncErrors(async (req, res, next) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      res.status(201).json({
        success: true,
        message: "Log out successful!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// load user
router.get(
  "/getuser",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//add-favorites

router.post(
  "/get-user-favorites",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { userId, movie, remove } = req.body;

      const foundUser = await User.findOne({ _id: userId });

      if (foundUser) {
        if (remove) {
          const index = foundUser.favorites.findIndex(
            (favorite) => favorite.id === movie.id
          );
          console.log(index);
          if (index !== -1) {
            foundUser.favorites.splice(index, 1);

            await foundUser.save();

            res.status(201).json({
              success: true,
              data: foundUser,
            });
          }else{
            return next(new ErrorHandler('not found', 400));

          }
        } else {
          const registered = foundUser.favorites.some(
            (element) => element.id === movie.id
          );

          if (registered) {
            res.status(201).json({
              success: true,
              data: foundUser,
            });
          }else{

            foundUser.favorites.push(movie);

            await foundUser.save();
  
            res.status(201).json({
              success: true,
              data: foundUser,
            });
          }

        }
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

//getUser-by-id
router.post(
  "/getuser-by-id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
    const {id} = req.body
    const user = await User.findOne({ _id: id })

      if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
