import { Router } from 'express';
import { getMessagesByUserId, addFriend, postMessage } from '../controllers/messageController';


const router = Router();

router.get('/:id', getMessagesByUserId);
router.post('/', postMessage);

router.post('/friends/add-friend', addFriend)

export default router;