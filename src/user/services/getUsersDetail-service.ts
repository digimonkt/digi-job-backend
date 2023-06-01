import UserSessionModel from '../../models/userSession-model';
import UserModel from '../../models/user-model';
import { ObjectId } from 'mongodb';

export const getUserDetailService = async (userId: string | undefined, sessionId: string | undefined) => {
  if (!userId) {
    const session = await UserSessionModel.findById(sessionId).select('user')
    userId = session?.user?.toString() || '';
  }
  const userIdObj = new ObjectId(userId);
  const user = await UserModel.aggregate([
    {
      $match: { _id: userIdObj },
    },
  ]);
  // not completed
  return user;
};
