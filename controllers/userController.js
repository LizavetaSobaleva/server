const User = require('../models/User')

class UserController {

    async getAllUsers(req, res) {
        try {
            const admin = await User.findById(req.user.id);
            if (admin.status !== 'admin') {
                return res.status(403).json({ message: 'Access denied' });
            }

            let users = await User.find().sort({status:1});
    
            return res.json(users);
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Failed to get users' });
        }
    }
    


    async changeUserStatusByAdmin(req, res) {
        try {
            const admin = await User.findById(req.user.id);
            if (admin.status !== 'admin') {
                return res.status(403).json({ message: 'Access denied' });
            }

            const { userId, status } = req.body;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (status === 'standard') {
                user.diskSpace = 1024**3; // 1 ГБ
            } else if (status === 'premium' || status === 'admin') {
                user.diskSpace = 1024**3 * 5; // 5 ГБ
            } else {
                return res.status(400).json({ message: 'Invalid status' });
            }

            user.status = status;
            await user.save();

            return res.json({ message: 'Status updated successfully', user });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: 'Failed to update status' });
        }
    }
}

module.exports = new UserController()