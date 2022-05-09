import { Request, Response } from "express"
import { UpdateUserDTO, CreateUserDTO, UserDTO, UserTokenPayload } from "../models/dto/UserDTO"
import UserRepository from "../models/repositories/UserRepository"
import { updateUserSchema } from "../models/validators/userSchemas"
import { registerSchema } from "../models/validators/userSchemas"
import bcrytp from 'bcryptjs'
import AuthRepository from "../models/repositories/AuthRepository"
import { TaskDTO } from "../models/dto/TaskDTO"
import TaskRepository from "../models/repositories/TaskRepository"
import axios from "axios"


export default class UserController {

  // Controlador para crear usuarios cuando ya esta registrado ruta users
  // solo usuarios administradores pueden crear nuevos usuarios
  public readonly register = async (req: Request, res: Response) => {
    const user = req.body as CreateUserDTO
    const userToken = req.user as UserTokenPayload
    const repositoryUser = new UserRepository(userToken.sub)
    const userAdm = await repositoryUser.finById(userToken.sub)

    if (!userAdm?.admin) {
      res.status(500).json({ message: 'No permissions, only admin can create users' })
      console.log(' Solo administrador puede crear usuarios')
      return
    }
    else {
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

  //controlador para mostrar todos los usuarios
  public readonly getAll = async (req: Request, res: Response) => {
    const user = req.user as UserTokenPayload
    const repository = new UserRepository(user.sub)

    try {
      const users: UserDTO[] = await repository.findAll()
      res.json(users)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }

  }

  //controlador para mostrar un usuario especifico por ID
  public readonly getById = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req.user as UserTokenPayload
    const repository = new UserRepository(user.sub)

    try {
      const users = await repository.finById(parseInt(id))

      if (!users) {
        res.status(404).json({ message: 'User not fund' })
        return
      }
      res.json(users)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }

  }

  //Controlador para consultar tareas de un usuario en concreto desde ruta de users y usuario 
  // debe estar logueado
  public readonly getByTask = async (req: Request, res: Response) => {
    const { id } = req.params
    const repository = new TaskRepository(parseInt(id))

    try {
      const tasks: TaskDTO[] = await repository.findAll()
      res.json(tasks)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }

  }

  //controlador para actualizar datos usuario, debe ser admin para modificar otro usuario
  // no puede cambiar atributo de admin si no es administrador
  public readonly update = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req.body as UpdateUserDTO
    const userToken = req.user as UserTokenPayload
    const repository = new UserRepository(userToken.sub)
    const users = await repository.finById(parseInt(id))
    console.log(id, users?.admin)
    console.log(user)
    console.log(userToken)
    try {

      await updateUserSchema.validateAsync(user)

    } catch (error) {
      res.status(400).json({ messaje: error.message })
      return
    }
    if (!users?.admin) {
      res.status(500).json({ message: 'User is not admin' })
      console.log(' Solo administrador puede modificar')
      return
    } else {
      try {
        await repository.update(parseInt(id), user)
        res.sendStatus(204).json({ message: 'Update Successful' })
        console.log('modificacion exitosa')
        return
      }
      catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' })
      }
    }
  }

  //controlador para eliminar usuarios, solo administrador puede eliminar
  //usuario aunque sea administrador no puede eliminarse a si mismo
  public readonly delete = async (req: Request, res: Response) => {
    const { id } = req.params
    const userToken = req.user as UserTokenPayload
    const repository = new UserRepository(userToken.sub)
    const userDel = await repository.finById(parseInt(id))
    const userAdm = await repository.finById(userToken.sub)
    
    if (!userAdm?.admin) {
      res.status(500).json({ message: 'User dont have permission to delete' })
      console.log(' No tiene permisos para eliminar')
      return
    }
    if ((parseInt(id) == userToken.sub)) {
      res.status(500).json({ message: 'User cannot delete himself' })
      console.log(' No tiene permisos para eliminar')
      return
    }
    try {
      await repository.delete(parseInt(id))
      res.sendStatus(204)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }
    console.log('Usuario eliminado', id, userDel)


  }

  // controlador para rescatar informacion de API publica de Github de usuario
  // se debe rescatar utilizando endpoint 
  public readonly getGithub = async (req: Request, res: Response) => {
    const { id } = req.params //id valor del usuario a consultar
    const userToken = req.user as UserTokenPayload
    const repository = new UserRepository(userToken.sub)
    const users = await repository.finById(parseInt(id))
    
    try {
      const { data } = await axios.get('https://api.github.com/users/'+users?.githubAccount)
      console.log(data)
      res.json ({ name: data.name,
                  repos_url: data.repos_url,
                  html_url: data.html_url,
                  username: data.login  })
    } catch (error) {
      if (axios.isAxiosError(error)) {
          console.log(error);
      } else {
          console.log(error);
  }
}

  }

}
