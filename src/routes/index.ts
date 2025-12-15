import express from 'express';
import { loginRouter } from './loginRoute';

const mainRouter = express.Router();

mainRouter.get('/', (req, res) => {
    res.json({ pong: true});
})

mainRouter.use('/', loginRouter);

export default mainRouter;