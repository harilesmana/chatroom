import { Hono } from 'hono';
import { register, verify, login } from '../controllers/authController';
const router = new Hono();

router.post('/register', register);
router.get('/verify/:verificationCode', verify);
router.post('/login', login);

export default router;
