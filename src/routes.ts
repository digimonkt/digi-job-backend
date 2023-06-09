import userRoute from "./user/routes/index";
import employerRoute from "./employer/routes/index";
import adminRoute from "./admin/routes/index";

export const ROUTER = [
  {
    path: "/users",
    router: userRoute,
  },
  {
    path: "/user/employer",
    router: employerRoute,
  },
  {
    path: "/admin",
    router: adminRoute,
  },
];
