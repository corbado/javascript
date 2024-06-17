require('dotenv').config();
import { Request, Response } from 'express';
import express from 'express';

const app = express();
app.use(express.static('public'));

type SignupRequest = {};

app.post('/signup', function (req: Request, res: Response) {
  const email = req.body.email;

  res.status(200).cookie('conventional-token', email);
});

app.get('/appendToken', function (req: Request, res: Response) {
  // get token from cookie
  const token = req.cookies['conventional-token'];
  if (!token) {
    res.status(404).send('Token not found => user is not logged in => passkey append is not allowed');
    return;
  }

  // create token by calling backend API

  res.status(200).send('123456');
});

app.listen(3001, () => console.log('Server ready on port 3000.'));

module.exports = app;
