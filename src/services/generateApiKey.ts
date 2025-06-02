import crypto from 'crypto';

const generateApiKey = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export default generateApiKey;
