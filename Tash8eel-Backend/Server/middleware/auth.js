// const jwt = require('jsonwebtoken');

// function auth(req, res, next) {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

//     try {
//         const decoded = jwt.verify(token, process.env.SECRET_KEY);
//         req.user = decoded;
//         next();
//     } catch {
//         res.status(401).json({ error: 'Unauthorized' });
//     }
// }

// module.exports = auth;

// const jwt = require('jsonwebtoken');

// function auth(req, res, next) {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

//   try {
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     // robustly pick an id field from your JWT
//     const id = decoded.userId || decoded.id || decoded._id || decoded.sub;
//     if (!id) return res.status(401).json({ error: 'Unauthorized: Invalid token payload' });

//     req.userId = id;
//     req.user = decoded;
//     next();
//   } catch {
//     res.status(401).json({ error: 'Unauthorized' });
//   }
// }

// module.exports = auth;

// // // middleware/auth.js
// const jwt = require('jsonwebtoken');

// module.exports = function auth(req, res, next) {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'Unauthorized: No token' });
//   try {
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     // normalize for controllers
//     req.userId = decoded.id || decoded._id || decoded.userId || decoded.sub;
//     if (!req.userId) return res.status(401).json({ error: 'Unauthorized: bad token' });
//     next();
//   } catch {
//     res.status(401).json({ error: 'Unauthorized' });
//   }
// };

// middleware/auth.js
// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ error: 'Unauthorized: No token' });

//   try {
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     req.user = decoded;
//     req.userId = decoded.userId || decoded.id || decoded._id;
//     if (!req.userId) return res.status(401).json({ error: 'Unauthorized: invalid token payload' });
//     next();
//   } catch (e) {
//     res.status(401).json({ error: 'Unauthorized' });
//   }
// };

// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authz = req.headers.authorization || '';
  const token = authz.startsWith('Bearer ') ? authz.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const uid =
      decoded.userId ||
      decoded.id ||
      decoded._id ||
      decoded.sub;

    if (!uid) return res.status(401).json({ error: 'Unauthorized: invalid token payload' });

    req.user = decoded;
    req.userId = String(uid);
    next();
  } catch (e) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
