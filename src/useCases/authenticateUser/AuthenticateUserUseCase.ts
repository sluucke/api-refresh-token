import { compare } from 'bcryptjs'
import { client } from "../../prisma/client"
import { GenerateRefreshToken } from '../../provider/GenerateRefreshToken'
import { GenerateTokenProvider } from '../../provider/GenerateTokenProvider'

interface IRequest {
  username: string;
  password: string;
}


class AuthenticateUserUseCase {
  async execute({ username, password }: IRequest) {
    // Verify if user exists
    const userAlreadyExists = await client.user.findFirst({
      where: {
        username
      }
    })

    if (!userAlreadyExists) {
      throw new Error('User or password incorrect!')
    }

    // Verifiy if password is correct
    const passwordMatch = await compare(password, userAlreadyExists.password)

    if (!passwordMatch) {
      throw new Error('User or password incorrect!')
    }

    // Generate user token with JWT
    const generateTokenProvider = new GenerateTokenProvider()
    const token = await generateTokenProvider.execute(userAlreadyExists.id)

    await client.refreshToken.deleteMany({
      where: {
        userId: userAlreadyExists.id
      }
    })

    const generateRefreshToken = new GenerateRefreshToken()
    const refreshToken = await generateRefreshToken.execute(userAlreadyExists.id)

    return { token, refreshToken }
  }
}


export { AuthenticateUserUseCase }