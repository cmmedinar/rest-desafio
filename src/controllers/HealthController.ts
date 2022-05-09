import { Request, Response } from 'express'

export default class HealthController {
  public readonly info = (_req: Request, res: Response) => {
    res.json({
      name: process.env.npm_package_name,
      version: process.env.npm_package_version
    })

  }

  public readonly ping = (_req: Request, res: Response) => {
    res.send('pong')
  }
}
