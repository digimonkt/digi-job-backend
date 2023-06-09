import { CustomRequest, CustomRequestBody } from "../../interfaces/interfaces";
import createAccessToken from "../../middleware/create-access-token";
import createRefreshToken from "../../middleware/create-refresh-token";
import UserSessionModel from "../../models/userSession-model";

export const createSessionService = async (
  userId: string,
  req: CustomRequestBody<
    NonNullable<unknown>,
    NonNullable<unknown>,
    NonNullable<unknown>
  >
) => {
  const exitingActiveSession = await UserSessionModel.find({
    user: userId,
    active: true,
  });
  // logout from all devices
  if (exitingActiveSession.length > 0) {
    await UserSessionModel.updateMany(
      { user: userId, active: true },
      { active: false }
    );
  }
  const session = await UserSessionModel.create({
    user: userId,
    ip_address: req.socket.remoteAddress,
    agent: req.get("User-Agent"),
    active: true,
  });
  const JWT_TOKEN_ACCESS = createAccessToken(session._id);
  const JWT_TOKEN_REFRESH = createRefreshToken(session._id);
  return { JWT_TOKEN_ACCESS, JWT_TOKEN_REFRESH };
};
