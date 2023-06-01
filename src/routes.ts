import userRoute from './user/routes/index'
import employerRoute from './employer/routes/index'
import jobSeekerRoute from './jobSeeker/routes/index'

export const ROUTER = [
    {
        path: '/user',
        router: userRoute
    },
    {
        path: '/user/employer',
        router: employerRoute
    },
    {
        path: '/user/job-seeker',
        router: jobSeekerRoute
    }
]