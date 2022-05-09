import { Router } from "express";
import UserController from "../controllers/UserController";

const userRoutes = Router()
const controller = new UserController()

userRoutes.post('/', controller.register)
userRoutes.get('/', controller.getAll)
userRoutes.get('/:id', controller.getById)
userRoutes.get('/github/:id', controller.getGithub)
userRoutes.get('/:id/tasks', controller.getByTask)
userRoutes.put('/:id', controller.update)
userRoutes.delete('/:id', controller.delete)

export default userRoutes


