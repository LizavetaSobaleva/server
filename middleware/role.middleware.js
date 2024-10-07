module.exports = (status) => {
    return (req, res, next) => {
        try {
            if (req.user.status !== status) {
                return res.status(403).json({ message: 'Access denied: insufficient permissions' });
            }
            next();
        } catch (e) {
            return res.status(403).json({ message: 'Access denied' });
        }
    };
};