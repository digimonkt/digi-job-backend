import { Router } from 'express'
import { createUser, createSession, forgotPassword, changePassword, deleteSession, getUserDetail } from '../controllers/index'
// import verifyToken from '../../middleware/verify-token'

const router = Router();

router.post('/', createUser)
router.post('/session', createSession)
router.get('/forget-password/:email', forgotPassword)
router.put('/change-password', changePassword)
router.delete('/delete-session', deleteSession)

router.get('/', getUserDetail)

export default router;