const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

module.exports = auth;
