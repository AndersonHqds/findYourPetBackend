import express from 'express';

const routes: express.IRouter = express.Router();

routes.get('/', (req, res) => {
  res.send('Working');
});

export default routes;
