import jwt from "jsonwebtoken";
import { systemConfig } from "../Configs/systemConfig.js";

export const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        systemConfig.jwt.secret,
        {
            expiresIn: systemConfig.jwt.expiresIn
        }
    )
}

export const verifyToken = (token) => {
  return jwt.verify(
    token,
    systemConfig.jwt.secret
  );
};