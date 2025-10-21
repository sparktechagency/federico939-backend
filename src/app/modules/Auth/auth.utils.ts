import jwt, { JwtPayload } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: {
    userId: string;
    email?: string;
    role: string;
    userCode?: string;
    phone?: string;
  },
  secret: string,
  expiresIn: string | number,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
