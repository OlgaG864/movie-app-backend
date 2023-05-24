const User = require("../models/users");
const EmailVerification = require("../models/emailVerification");

const { isValidObjectId } = require("mongoose");
const { json } = require("express");
const { generateOTP, generateTransport } = require("../utils/mail");
const { sendError, generateRandomByte } = require("../utils/helpers");
const PasswordReset = require("../models/passwordResetToken");
const passwordResetToken = require("../models/passwordResetToken");
const jwt = require("jsonwebtoken");
const config = require("../config/dev");

exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });

  if (oldUser) return sendError(res, "This email is already in use!");

  const newUser = new User({ name, email, password });
  await newUser.save();

  // generate 6 digit otp
  let OTP = generateOTP();

  // store otp inside our db
  const newEmailVerificationToken = new EmailVerification({
    owner: newUser._id,
    token: OTP,
  });

  await newEmailVerificationToken.save();

  // send that otp to our user

  var transport = generateTransport();

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: newUser.email,
    subject: "Email Verification",
    html: `
      <p>You verification OTP</p>
      <h1>${OTP}</h1>
    `,
  });

  res.status(201).json({
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};

exports.verification = async (req, res) => {
  const { userId, OTP } = req.body;

  if (!isValidObjectId(userId))
    return res.status(401).json({ error: "invalid user" });

  const user = await User.findById(userId);
  if (!user) return res.json({ error: "Invalid user!" });
  if (user.isVerified) return res.json({ error: "user already verified!" });

  const token = await EmailVerification.findOne({ owner: userId });
  if (!token) return json.res({ error: "token not found" });

  const isMatch = await token.compareToken(OTP);
  if (!isMatch) return res.json({ error: "submit a valid otp" });

  user.isVerified = true;
  await user.save();

  EmailVerification.findByIdAndDelete(token._id);
  var transport = generateTransport();

  transport.sendMail({
    from: "verification@ourapp.com",
    to: user.email,
    subject: "Welcome Email",
    html: `<h1>Thank for login to our app</h1>
`,
  });

  res.json({ message: "your email is verified" });
};

exports.resendEmail = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.json({ error: "Invalid user!" });

  if (user.isVerified) return sendError(res, "user already verified");

  const token = await EmailVerification.findOne({ owner: userId });
  if (token)
    return json.res({
      error: " only after one hour you request for another token",
    });
  let OTP = generateOTP;
  var transport = generateTransport();
  transport.sendMail({
    from: "verification@ourapp.com",
    to: newUser.email,
    subject: "Email verification",
    html: `<p>Your OTP</p>
 <h1>${OTP}</h1>`,
  });
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) return sendError(res, "email is missing");

  const user = await User.findOne({ email });
  if (!user) return sendError(res, "user not found", 404);

  alreadyHasToken = await PasswordReset.findOne({ owner: user._id });
  if (alreadyHasToken)
    return sendError(
      res,
      "Only after one hour you can request for another token"
    );
  const token = generateRandomByte();
  const newPasswordReset = new PasswordReset({ owner: user._id, token });
  await newPasswordReset.save();
  const resetpasswordUrl = `http://localhost:4200/reset-password?token=${token}&id=${user._id}`;
  var transport = generateTransport();
  transport.sendMail({
    from: "security@ourapp.com",
    to: user.email,
    subject: "Reset password",
    html: `<p>Your reset password</p>
 <a href=${resetpasswordUrl}>Click here</a>`,
  });

  res.json({ message: "Link was send to your email" });
};

exports.sendResetPasswordTokenStatus = (req, res) => {
  res.json({ valid: true });
};

exports.resetPassword = async (req, res) => {
  const { newPassword, userId } = req.body;

  const user = await User.findById(userId);
  const matched = await user.comparePassword(newPassword);
  if (matched) {
    return sendError(err, "the new password must be different than old one");
  }
  user.password = newPassword;
  await user.save();

  await passwordResetToken.findByIdAndDelete(req.resetToken_id);

  var transport = generateTransport();
  transport.sendMail({
    from: "security@ourapp.com",
    to: user.email,
    subject: "password reset succesfuly",
    html: `<p>password reset succesfully</p>
 <p>You can use new password</p>`,
  });
  res.json({ message: "password reset successfully" });
};

exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return sendError(err, "user not found");

    const matched = await user.comparePassword(password);
    if (!matched) return sendError(err, "password not matched");
    const { _id, name } = user;
    const jwtToken = jwt.sign({ userId: user._id }, config.JWT_SECRET);
    res.json({ user: { _id, name, email, token: jwtToken } });
  } catch (error) {
    sendError(res, error.message);
  }
};
