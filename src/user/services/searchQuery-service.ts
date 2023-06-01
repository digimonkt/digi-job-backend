import JobSeekerModel, { Ijob_seeker_document } from "../../models/jobSeekerProfile-model";
import EmployerModel from "../../models/employerProfile-model";
import UserModel from "../../models/user-model";

enum model {
    job_seeker = 'job_seeker',
    employer = 'employer'
}

export const searchQueryService = async (role: string, search: string) => {
    let data: Ijob_seeker_document[];
    const regexSearch = new RegExp(search, 'i');

    if (role === model.job_seeker) {
        data = await JobSeekerModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $match: {
                    $or: [
                        { 'user.email': regexSearch },
                        { 'user.name': regexSearch },
                        { description: regexSearch }
                    ]
                }
            },
            {
                $project: {
                    id: { $arrayElemAt: ['$user._id', 0] },
                    role: { $arrayElemAt: ['$user.role', 0] },
                    name: { $arrayElemAt: ['$user.name', 0] },
                    email: { $arrayElemAt: ['$user.email', 0] },
                    country_code: { $arrayElemAt: ['$user.country_code', 0] },
                    mobile_number: { $arrayElemAt: ['$user.mobile_number', 0] },
                    is_active: { $arrayElemAt: ['$user.is_active', 0] }
                }
            }
        ]);
        console.log(data);
    } else if (role === model.employer) {
        data = await EmployerModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $match: {
                    $or: [
                        { 'user.email': regexSearch },
                        { 'user.name': regexSearch },
                        { description: regexSearch }
                    ]
                }
            },
            {
                $project: {
                    id: { $arrayElemAt: ['$user._id', 0] },
                    role: { $arrayElemAt: ['$user.role', 0] },
                    name: { $arrayElemAt: ['$user.name', 0] },
                    email: { $arrayElemAt: ['$user.email', 0] },
                    country_code: { $arrayElemAt: ['$user.country_code', 0] },
                    mobile_number: { $arrayElemAt: ['$user.mobile_number', 0] },
                    is_active: { $arrayElemAt: ['$user.is_active', 0] }
                }
            }
        ]);
        console.log(data);
    } else {
        return { code: 200, data: { count: 0, next: null, previous: null, results: [] } }; // Return empty array for unsupported role
    }

    const results = {
        count: data.length,
        next: null,
        previous: null,
        results: data
    };

    return { code: 200, data: results };
}
