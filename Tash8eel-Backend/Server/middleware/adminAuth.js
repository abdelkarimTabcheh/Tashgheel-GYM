// middleware/adminAuth.js for !Admin Dashboard!
const jwt = require('jsonwebtoken');

function adminAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    req.user = decoded;
    next(); // <--- MUST call next() to proceed!
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

module.exports = adminAuth;
