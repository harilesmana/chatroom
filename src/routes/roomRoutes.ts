import { Hono } from 'hono';
import { createRoom, deleteRoom } from '../controllers/roomController';
const router = new Hono();

router.post('/create', createRoom);
router.delete('/delete/:id', deleteRoom);

export default router;
