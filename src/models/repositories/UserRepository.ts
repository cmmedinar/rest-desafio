import { PrismaClient } from "@prisma/client";
import { CreateUserDTO, UserDTO, UpdateUserDTO, LoginUserDTO } from "../dto/UserDTO";

const prisma = new PrismaClient()

export default class UserRepository {
  private id: number
  constructor(id: number) {
    this.id = id
  }

  public readonly findAll = async (): Promise<UserDTO[]> => {
    const users = await prisma.user.findMany()
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })
    return usersWithoutPassword
  }

  public readonly finById = async (id: number): Promise<UserDTO | undefined> => {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })
    if (!user) return
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  public readonly findByEmail = async (email: string): Promise<LoginUserDTO | undefined> => {
    const user = await prisma.user.findUnique({
      where: {
        email,
        id: this.id
      }
    })
    if (!user) return
    return user
  }

  public readonly create = async (user: CreateUserDTO): Promise<UserDTO> => {
    const newUser = await prisma.user.create({
      data: user
    })
    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword
  }

  public readonly update = async (id: number, user: UpdateUserDTO): Promise<void> => {
    await prisma.user.updateMany({
      where: {
        id
      },
      data: user
    })
  }

  public readonly delete = async (id: number): Promise<void> => {
    await prisma.user.delete({
      where: {
        id
      }
    })
  }

}