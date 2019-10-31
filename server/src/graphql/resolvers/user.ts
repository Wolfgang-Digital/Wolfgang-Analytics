import User, { UserDocument } from '../../models/User';

export default {
  Query: {
    getCurrentUser: async (_: void, args: void, { user }: { user: UserDocument }) => {
      return user;
    },

    getUsers: async () => {
      return await User.find({}).sort({ name: 1 });
    },

    getUserById: async (_: void, { id }: { id: string }) => {
      return await User.findById(id);
    }
  }
};