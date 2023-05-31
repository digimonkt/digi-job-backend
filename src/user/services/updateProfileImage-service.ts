import UserSessionModel from '../../models/userSession-model';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import UserModel from '../../models/user-model';
import { ObjectId } from 'mongodb';

export const getUserDetailService = async (userId: string) => {
  const user = await UserModel.findById(userId);
  
  return user;
};
