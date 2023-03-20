const express = require ('express');
const {
  createUser,
  loginUser,
  getAllUsers,
  getaUser,
  deleteaUser,
  updateaUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
} = require ('../controllers/userCtrl');
const {authMiddleware, isAdmin} = require ('../middleware/authMiddleware');
const router = express.Router ();

router.post ('/register', createUser);
router.post ('/login', loginUser);
router.get ('/all-users', getAllUsers);
router.get ('/refresh', handleRefreshToken);
router.get ('/logout', logout);
router.get ('/:id', authMiddleware, isAdmin, getaUser);
router.delete ('/:id', deleteaUser);
router.put ('/edit-user', authMiddleware, updateaUser);
router.get ('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.get ('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

module.exports = router;
