const jwt = require('jsonwebtoken');

const jwtValidate = (req, res, next) => {
  // x-token header
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No token provided',
    });
  }

  try {
    const { uid, fullname } = jwt.verify(token, process.env.SECRET_JWT_SEED);

    req.uid = uid;
    req.fullname = fullname;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Invalid token',
    });
  }

  next();
};

module.exports = { jwtValidate };
