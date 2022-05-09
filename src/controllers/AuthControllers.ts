import { Request, Response } from "express"
import { generateToken } from "../lib/jwt"
import { CreateUserDTO } from "../models/dto/UserDTO"
import { loginSchema, registerSchema } from "../models/validators/userSchemas"
import bcrytp from 'bcryptjs'
import AuthRepository from "../models/repositories/AuthRepository"

export default class AuthController {
  public readonly login = async (req: Request, res: Response) => {
    const credentials = req.body

    try {
      await loginSchema.validateAsync(credentials)
    } catch (err) {
      res.status(400).json({ error: err.mesage })
      return
    }

    const repository = new AuthRepository()

    try {
      const userFromDb = await repository.findByEmail(credentials.email)

      if (!userFromDb || !bcrytp.compareSync(credentials.password, userFromDb.password)) {
        res.status(401).json({ message: 'Invalid credentials' })
        return
      }
      const token = generateToken(userFromDb)
      res.json({ token })

    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }


  }

  public readonly register = async (req: Request, res: Response) => {
    const user = req.body as CreateUserDTO

    try {
      await registerSchema.validateAsync(user)
    } catch (error) {
      res.status(400).json({ error: error.mesage })
      return
    }

    const hashedPassword = bcrytp.hashSync(user.password, 10)

    const repository = new AuthRepository()

    try {
      const newUser = await repository.create({ ...user, password: hashedPassword })
      res.status(201).json(newUser)
    } catch (error) {
      if (error.code === 'P2002') {
        res.status(409).json({ message: 'User alredy exists ' })
        return
      }
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })

    }

  }
}