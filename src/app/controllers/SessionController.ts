import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import express from 'express';

import User from '../models/User';
import File from '../models/File';
import authConfig from '../../config/auth';

interface Store {
  email: string;
  password: string;
}

interface UserType {
  id: number;
  name: string;
  email: string;
  avatar: string;
  admin: boolean;
};

interface Response {
  user?: UserType;
  token?: string;
  error?: string;
};

class SessionController {
  async store(req: express.Request, res: express.Response<Response>) {
    const schema: Yup.ObjectSchema<Store> = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { email, password } = req.body;

    
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password doesn\'t match' });
    }

    const {
      id, name, avatar, admin,
    } = user;


    return res.json({
      user: {
        id,
        name,
        email,
        avatar,
        admin,
      },
      token: jwt.sign({ id }, authConfig.secret, { expiresIn: authConfig.expiresIn }),
    });
  }
}

export default new SessionController();
