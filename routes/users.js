var express = require("express");
const {
  validate,
  userValidator,
  validatePassword,
  signInValidator,
} = require("../middleware/validator");
const { isValidPassResetToken } = require("../middleware/user");
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
  "/verify-pass-reset-token",
  isValidPassResetToken,
  sendResetPasswordTokenStatus
);
router.post(
  "/reset-password",
  validatePassword,
  validate,
  isValidPassResetToken,
  resetPassword
);
const { isAuth } = require("../middleware/auth");

router.post("/signin", signInValidator, validate, signIn);

router.get("/is-auth", isAuth, (req, res) => {
  const { user } = req;
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
    },
  });
});

module.exports = router;
