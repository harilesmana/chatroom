import { Hono } from 'hono';
import { sendMessage, getMessages } from '../controllers/chatController';
const router = new Hono();

router.post('/send', sendMessage);
router.get('/messages/:roomId', getMessages);

export default router;
