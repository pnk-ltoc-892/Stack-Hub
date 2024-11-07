
import { Router } from 'express'
import { loginUser, logoutUser, registerUser } from '../controllers/user.controller.js'
import { authMiddleware } from '../middleware/auth-middleware.js'

const router = Router()


router.post('/register', registerUser)

router.post('/login', loginUser)


router.get('/check-auth', authMiddleware, (req, res) => {
    const user = req.user
    res.status(200).json({
        success: true,
        message: "Authenticated User",
        user
    })
})

router.post('/logout', logoutUser)

// router.post('/logout', logoutUser)




export default router

