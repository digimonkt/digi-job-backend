import JobSeekerModel from "../../models/jobSeeker-model";
import UserModel from "../../models/user-model";
import EmployerModel from "../../models/employer-model";
enum model {
    job_seeker = 'job_seeker',
    employer = 'employer'
}

export const searchQueryService = async (role: model, search: string) => {
    let data;
    if(!search){
        if(role === model.job_seeker) {
            data = await JobSeekerModel.find().populate('user')
        } else if(role === model.employer) {
            data = await EmployerModel.find().populate('user')
        }
    }
    // const results = {
        
    // }
    const user = await UserModel.find({ role: role, $text: { $search: search } });
    return user;
}