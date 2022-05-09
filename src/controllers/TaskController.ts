import { Request, Response } from "express"
import { CreateTaskDTO, UpdateTaskDTO, TaskDTO } from "../models/dto/TaskDTO"
import { UserTokenPayload } from "../models/dto/UserDTO"
import TaskRepository from "../models/repositories/TaskRepository"
import { createTaskSchema, updateTaskSchema } from "../models/validators/taskSchemas"

export default class TaskController {
  // Controlador para busqueda de tareas con query o sin query
  // si trae query mostrara solo tareas terminadas o no terminadas del usuario
  public readonly getAll = async (req: Request, res: Response) => {
    const user = req.user as UserTokenPayload
    const repository = new TaskRepository(user.sub)
    const queryTask = req.query.done

    if (queryTask) {
      console.log('si trae query')
      if (queryTask == '1') {
        const doneValue: boolean = true
        try {
          const tasks: TaskDTO[] = await repository.findAllTask(doneValue)
          res.json(tasks)
          return
        } catch (error) {
          console.log(error)
          res.status(500).json({ message: 'Something went wrong' })
        }

      } 
      if (queryTask == '0') {
        const doneValue: boolean = false
        try {
          const tasks: TaskDTO[] = await repository.findAllTask(doneValue)
          res.json(tasks)
          return
        } catch (error) {
          console.log(error)
          res.status(500).json({ message: 'Something went wrong' })
        }
      }
    } else {
      console.log('no trae query o valor es distinto de 0 - 1')
      try {
        const tasks: TaskDTO[] = await repository.findAll()
        res.json(tasks)
      } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Something went wrong' })
      }
      return
    }
  }

  // Controlador para mostrar tareas de un usuario especifico
  public readonly getById = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = req.user as UserTokenPayload
    const repository = new TaskRepository(user.sub)

    try {
      const tasks = await repository.finById(parseInt(id))

      if (!tasks) {
        res.status(404).json({ message: 'Task not fund' })
        return
      }
      res.json(tasks)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }

  }

  // Controlador para crear tareas con el usuario que esta logueado
  public readonly create = async (req: Request, res: Response) => {
    const task = req.body as CreateTaskDTO

    try {
      await createTaskSchema.validateAsync(task)
    } catch (error) {
      res.status(400).json({ messaje: error.message })
      return
    }

    const user = req.user as UserTokenPayload
    const repository = new TaskRepository(user.sub)

    try {

      const newTask = await repository.create(task)
      res.json(newTask)

    } catch (error) {

      if (error.code === 'P2002') {
        res.status(409).json({ message: 'Task alredy exists ' })
        return
      }
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }
  }

  // controladorea para modificar una tarea, no puede duplicar nombre de tarea
  public readonly update = async (req: Request, res: Response) => {
    const { id } = req.params
    const task = req.body as UpdateTaskDTO

    try {
      await updateTaskSchema.validateAsync(task)
    } catch (error) {
      res.status(400).json({ messaje: error.message })
      return
    }

    const user = req.user as UserTokenPayload
    const repository = new TaskRepository(user.sub)

    try {
      await repository.update(parseInt(id), task)
      res.sendStatus(204)
    }
    catch (error) {
      if (error.code === 'P2002') {
        res.status(409).json({ message: 'Task alredy exists ' })
        return
      }
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }

  }

  //controlador para eliminar una tarea
  public readonly delete = async (req: Request, res: Response) => {
    const { id } = req.params

    const user = req.user as UserTokenPayload
    const repository = new TaskRepository(user.sub)

    try {
      await repository.delete(parseInt(id))
      res.sendStatus(204)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Something went wrong' })
    }

  }
}

