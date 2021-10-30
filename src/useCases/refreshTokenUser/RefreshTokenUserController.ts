import { Request, Response } from "express";
import { RefreshTokenUserUseCase } from "./RefreshTokenUserUseCase";


class RefreshTokenUserController {

  async handle(request: Request, response: Response) {
    const { refresh_token } = request.body
    const refreshTokenUseCase = new RefreshTokenUserUseCase()

    const token = await refreshTokenUseCase.execute(refresh_token)

    return response.json(token)

  }

}

export { RefreshTokenUserController }