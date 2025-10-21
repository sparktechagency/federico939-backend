import crypto from 'crypto';

export const cryptoToken = (numb: number = 32) => {
  return crypto.randomBytes(numb).toString('hex');
};

export default cryptoToken;
