import jwt from 'jsonwebtoken';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured in the backend environment');
  }

  return secret;
};

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (!token || scheme?.toLowerCase() !== 'bearer') {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const short = token.length > 40 ? `${token.slice(0, 40)}...` : token;
    console.log('Protect middleware token preview:', short);

    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verify error:', error && error.message ? error.message : error);
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

export default protect;
