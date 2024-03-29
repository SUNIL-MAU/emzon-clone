const User = require("../models/userModal");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User already exist");
  }
});

// login a user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email);

  const findUser = await User.findOne({ email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid creadiantial");
  }
});

// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie?.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No Refresh Token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decode) => {
    if (err || user.id !== decode.id)
      throw new Error("there is something wrong with token");
    const accessToken = generateToken(user.id);
    res.json({ accessToken });
  });
});

// logout
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie?.refreshToken;
  const user = await User.findOne({ refreshToken });
  if(!user) {
    res.clearCookie("refreshToken",{
      httpOnly:true,
      secure:true

    })
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken:""
  },{new:true})

  res.clearCookie("refreshToken",{
    httpOnly:true,
    secure:true
  })
  return res.sendStatus(204); // forbidden

});

// get all user
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.status(200).send(getUsers);
  } catch (err) {
    throw new Error(err);
  }
});

// get a user
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getaUser = await User.findById(id);
    res.status(200).send(getaUser);
  } catch (err) {
    throw new Errow(err);
  }
});

// delete a user
const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndRemove(id);
    res.status(200).send(deletedUser);
  } catch (err) {
    throw new Errow(err);
  }
});

// update a user
const updateaUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const updateaUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobile: req.body.mobile,
      },
      {
        new: true,
      }
    );
    res.status(200).send(updateaUser);
  } catch (err) {
    throw new Errow(err);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const blockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(blockUser);
  } catch (err) {
    throw new Error(err);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const unblockUser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json(unblockUser);
  } catch (err) {
    throw new Error(err);
  }
});

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getaUser,
  deleteaUser,
  updateaUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
};
