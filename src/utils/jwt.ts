import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

const signToken = (
  payload: string | object | Buffer,
  expiresIn: SignOptions['expiresIn'] // Correct type for `expiresIn`
): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn });
};

const verifyToken = (token: string): string | JwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};

export { signToken, verifyToken };
