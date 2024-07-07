import { getRepository } from 'typeorm';
import { User } from '../models/User';
import { encryptMethod } from '../helpers/encryptionHelper';

export const userService = {
  addUser: async (
    lastName: string,
    firstName: string,
    email: string,
    address: string,
    phone: string,
    cityName: string,
    password: string
  ) => {
    try {
      const userRepository = getRepository(User);
      const encryptedPassword = encryptMethod(password);
      const newUser = userRepository.create({
        lastName,
        firstName,
        email,
        address,
        phone,
        cityName,
        password: encryptedPassword,
        uid: '',
      });
      await userRepository.save(newUser);
      return { status: 201, body: newUser };
    } catch (error) {
      return { status: 500, body: { message: 'Internal Server Error' } };
    }
  },

  getUser: async (id: number) => {
    try {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { idUsers: id } });
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      return null;
    }
  },

  getUsers: async () => {
    try {
      const userRepository = getRepository(User);
      const users = await userRepository.find();
      return users;
    } catch (error) {
      return [];
    }
  },

  validateUser: async (email: string, password: string) => {
    try {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        return { status: 404, body: { message: 'User not found' } };
      }
      const isValid = user.password === encryptMethod(password);
      if (!isValid) {
        return { status: 401, body: { message: 'Invalid credentials' } };
      }
      return { status: 200, body: user };
    } catch (error) {
      return { status: 500, body: { message: 'Internal Server Error' } };
    }
  },

  deleteUser: async (id: number) => {
    try {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { idUsers: id } });
      if (!user) {
        return { status: 404, body: { message: 'User not found' } };
      }
      await userRepository.remove(user);
      return { status: 200, body: { message: 'User deleted' } };
    } catch (error) {
      return { status: 500, body: { message: 'Internal Server Error' } };
    }
  },

  updateUserToBotanist: async (id: number) => {
    try {
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { idUsers: id } });
      if (!user) {
        return { status: 404, body: { message: 'User not found' } };
      }
      user.isBotanist = true;
      await userRepository.save(user);
      return { status: 200, body: user };
    } catch (error) {
      return { status: 500, body: { message: 'Internal Server Error' } };
    }
  },
};
