export interface BaseUserDTO {
  id?: number
  firstName: string
  lastName: string
  email: string
  admin: boolean
  githubAccount: string
}

export interface UserDTO extends BaseUserDTO {
  id: number
}

export interface CreateUserDTO extends BaseUserDTO {
  password: string
}

export interface UpdateUserDTO extends Partial<BaseUserDTO> {
  sub: number
  admin: boolean
}

export interface LoginUserDTO extends UserDTO {
  password: string
}

export interface UserTokenPayload {
  sub: number
  email: string
  exp: number
  iat: number
}