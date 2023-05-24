const { isValidObjectId } = require("mongoose");
const passwordResetToken = require("../models/passwordResetToken");

const { sendError } = require("../utils/helpers");

exports.isValidpassResetToken = async (req, res, next) => {
  const { token, userId } = req.body;
  if (!token.trim() || isValidObjectId(userId)) {
    return sendError(res, "invalid request");
  }
  const resetToken = await passwordResetToken.findOne({ owner: userId });
  if (!resetToken) return sendError(res, "invalid request");

  const matched = await resetToken.compareToken(token);
  if (!matched) return sendError(res, "invalid request");
  req.resetToken = resetToken;
  next();
};
