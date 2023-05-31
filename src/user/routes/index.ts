import { Router } from 'express'
import { createUser, createSession, forgotPassword, changePassword, deleteSession, getUserDetailHandler, updateProfileImageHandler } from '../controllers/index'
import { verifyToken } from '../../middleware/verify-token';
import { postVerify } from '../../middleware/post-verify';
import upload from '../../middleware/multer';

const router = Router();

router.post('/', createUser)
router.post('/session', createSession)
router.get('/forget-password/:email', forgotPassword)
router.put('/change-password', changePassword)
router.delete('/delete-session', deleteSession)
router.get('/', getUserDetailHandler)
router.patch('/display-image', verifyToken, postVerify ,upload, updateProfileImageHandler);
export default router