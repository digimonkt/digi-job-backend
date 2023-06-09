import {
  CreateUserRequestType,
  CustomRequest,
  CustomRequestBody,
} from "../../interfaces/interfaces";
import createAccessToken from "../../middleware/create-access-token";
import createRefreshToken from "../../middleware/create-refresh-token";
import EmployerProfileModel from "../../models/employerProfile-model";
import JobSeekerProfileModel from "../../models/jobSeekerProfile-model";
import UserModel from "../../models/user-model";
import UserSessionModel from "../../models/userSession-model";

export const createUserService = async (
  email: string,
  password: string,
  role: string,
  mobile_number: string,
  country_code: string,
  req: CustomRequestBody<any, any, CreateUserRequestType>
) => {
  const userDetails = {
    email,
    password,
    profile_role: role,
    mobile_number,
    country_code,
  };

  const user = await UserModel.create(userDetails);

  if (role === "job_seeker") {
    const job = await JobSeekerProfileModel.create({
      user: user._id,
    });
    console.log(job);
  } else if (role === "employer") {
    const emp = await EmployerProfileModel.create({
      user: user._id,
    });
    console.log(emp);
  }

  const session = await UserSessionModel.create({
    user: user._id,
    ip_address: req.socket.remoteAddress,
    agent: req.get("User-Agent"),
    active: true,
  });

  const JWT_TOKEN_ACCESS = createAccessToken(session._id);
  const JWT_TOKEN_REFRESH = createRefreshToken(session._id);

  return { JWT_TOKEN_ACCESS, JWT_TOKEN_REFRESH };
};
