const jwt = require('jsonwebtoken');

const generateJWT = (uid, fullname) => {
  const payload = { uid, fullname };

  try {
    const token = jwt.sign(payload, process.env.SECRET_JWT_SEED, {
      expiresIn: '2h',
    });

    return token;
  } catch (err) {
    console.log(err);
    return 'Could not generate token';
  }
};

module.exports = { generateJWT };
