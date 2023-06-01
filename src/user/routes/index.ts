import { Router } from 'express'
import { createUser, forgotPassword, changePassword, deleteSession, getUserDetailHandler, updateProfileImageHandler, searchQueryHandler, createSessionHandler } from '../controllers/index'
import { postVerify } from '../../middleware/post-verify';
import upload from '../../middleware/multer';

const router = Router();

router.post('/', createUser)
router.post('/session', createSessionHandler)
router.get('/forget-password/:email', forgotPassword)
router.put('/change-password', changePassword)

router.get('/:userId', postVerify, getUserDetailHandler)
router.delete('/delete-session',postVerify, deleteSession)
router.patch('/display-image', postVerify ,upload, updateProfileImageHandler);
router.get('/search/:role', postVerify, searchQueryHandler)

export default router