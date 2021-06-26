import {Request, Response, NextFunction, response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

interface IPayload{
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
){
  //Receber o token
  const authToken = request.headers.authorization;

  //Validar se token está preenchido
  if (!authToken){
    return response.status(401).end();
  }  
  const [, token] = authToken.split(" ");
  
  try{
    //Validar se o token é valido
    const {sub } = verify(token, "9197238b7501c1a0938ac80c8131ed56") as IPayload;
    
    //Recuperar informações do usuário
    request.user_id = sub;

    return next();
  }catch(err){
    return response.status(401).end();
  }
}