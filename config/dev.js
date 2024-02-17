module.exports = {
  db_conn: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  user: process.env.MAIL_TRAP_USER,
  pass: process.env.MAIL_TRAP_PASS,
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.CLOUD_API_KEY,
  API_SECRET: process.env.CLOUD_API_SECRET,
};
