import { Request } from "express"
import { createUser } from "./service.user"
import { CreateUserType } from "./schem.user"

export const createUserHandler = async (req: Request, res) => {
    const { email, password, name } = req.body as CreateUserType
    // create user
    const user = createUser({ email, password, name })

    // create session

    // token generation
}