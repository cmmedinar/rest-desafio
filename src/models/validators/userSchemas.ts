import Joi from 'joi'
import { UpdateUserDTO } from '../dto/UserDTO'

export const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

export const registerSchema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  admin: Joi.boolean().required(),
  githubAccount: Joi.string()
})

export const updateUserSchema: Joi.ObjectSchema<UpdateUserDTO> = Joi.object().keys({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  admin: Joi.boolean(),
  githubAccount: Joi.string()
})
