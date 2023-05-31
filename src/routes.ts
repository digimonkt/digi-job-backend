import userRoute from './user/routes/index'

export const ROUTER = [
    {
        path: '/user',
        router: userRoute
    },
    {
        path: '/user/forget-password',
        router: userRoute
    }
]