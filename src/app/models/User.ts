import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  id: number;

  name: string;

  email: string;

  admin: boolean;

  static start(sequelize) {
    this.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
      }, {
        sequelize,
      },
    );

    this.addHook('beforeSave', async (user: any) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password, password_hash) {
    return bcrypt.compare(password, password_hash);
  }
}

export default User;
