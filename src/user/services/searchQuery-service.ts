import JobSeekerModel from "../../models/jobSeekerProfile-model";
import EmployerModel from "../../models/employerProfile-model";
enum model {
    job_seeker = 'job_seeker',
    employer = 'employer'
}

export const searchQueryService = async (role: string, search: string) => {
    let data;
    if (role === model.job_seeker) {
        data = await JobSeekerModel.find()
          .populate('user', 'id role name email country_code mobile_number is_active')
          .select('user');
    } else if (role === model.employer) {
        data = await EmployerModel.find()
        .populate('user', 'id role name email country_code mobile_number is_active')
        .select('user');
    }

    const results = {
        count: data.length,
        next: null,
        previous: null,
        results: data
    }
    return results;
}