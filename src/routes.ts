import express from 'express';

import UserController from './app/controllers/UserController';

const routes: express.IRouter = express.Router();


routes.post('/users', UserController.store);

export default routes;
