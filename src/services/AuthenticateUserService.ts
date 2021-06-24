import { getCustomRepository } from "typeorm";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { UsersRepositories } from "../repositories/UserRepositories";

interface IAuthenticateRequest{
  email: string;
  password: string;
}
class AuthenticateUserService{

  async execute({email, password}: IAuthenticateRequest){
    const usersRepositories = getCustomRepository(UsersRepositories);

    //Verificar se o e-mail existe
    const user = await usersRepositories.findOne({
      email
    });
    if(!user){
      throw new Error("Email/Password incorrect")
    }  
    //Verificar se senha está correta
    const passwordMatch = await compare(password, user.password);

    //Compare =  Senha: 12345 / 78564123-ASdadsas(hash)
    if(!passwordMatch){
      throw new Error("Email/Password incorrect")
    }
    //Gerar Token 
    const token = sign({
      email: user.email,
    },
    "9197238b7501c1a0938ac80c8131ed56",
    {
      subject: user.id,
      expiresIn: "1d",
    }
    );
    return token;
  }
}
export{AuthenticateUserService}