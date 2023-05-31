import userRoute from './user/routes/index'
import employerRoute from './employer/routes/index'

export const ROUTER = [
    {
        path: '/user',
        router: userRoute
    },
    {
        path: '/user/employer',
        router: employerRoute
    }
]