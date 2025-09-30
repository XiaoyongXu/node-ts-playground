import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('test endpoint')
});

export default router;