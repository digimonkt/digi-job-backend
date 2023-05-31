import UserSessionModel from '../../models/userSession-model';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import UserModel from '../../models/user-model';
import { ObjectId } from 'mongodb';

export const getUserDetailService = async (userId: string, token: string) => {
  if (!userId) {
    console.log(token);
    const decodedToken = jsonwebtoken.verify(token, process.env.TOKEN_HEADER_KEY) as JwtPayload;
    const session = await UserSessionModel.findById(decodedToken._id);
    userId = session?.user?.toString() || '';
  }
  const userIdObj = new ObjectId(userId);
  console.log(userIdObj);
  const user = await UserModel.aggregate([
    {
      $match: { _id: userIdObj },
    },
  ]);
  return user;
};
