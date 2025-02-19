// backend/middleware/admin.middleware.js
export const adminOnly = async (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  };