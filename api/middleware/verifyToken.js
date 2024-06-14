import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  // Extract the token from cookies
  const token = req.cookies.token;

  // If the token is not present, send a 401 (Unauthorized) response
  if (!token) return res.status(401).json({ message: 'Not Authenticated' });

  // Verify the validity of the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    // If the token is invalid or an error occurred, send a 403 (Forbidden) response
    if (err) return res.status(403).json({ message: 'Token is Not Valid' });

    // If the token is valid, store the user ID in the request object
    req.userId = payload.id;

    // Proceed to the next middleware or route handler
    next();
  });
}
