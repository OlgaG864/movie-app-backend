var express = require("express");
const {
  validate,
  userValidator,
  validatePassword,
  signInValidator,
} = require("../middleware/validator");
const { isValidpassResetToken } = require("../middleware/user");
const {
  sendResetPasswordTokenStatus,
  resetPassword,
  signIn,
} = require("../controllers/user");

const {
  create,
  verification,
  resendEmail,
  forgetPassword,
} = require("../controllers/user");
const router = express.Router();

router.post("/create", userValidator, validate, create);
router.post("/verify-email", verification);
router.post("/resend-email-verification", resendEmail);
router.post("/forget-password", forgetPassword);
router.post(
  "/verify-password",
  isValidpassResetToken,
  sendResetPasswordTokenStatus
);
router.post(
  "/reset-password",
  validatePassword,
  validate,
  isValidpassResetToken,
  resetPassword
);

router.post("/signin", signInValidator, signIn);

module.exports = router;
