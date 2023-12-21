import speakeasy from 'speakeasy';
import Token from 'src/models/token.model';

const companyName = process.env.COMPANY_NAME || 'waveTest';
const algorithmType = process.env.TWO_FACTOR_AUTH_ALGORITHM ;

interface TwoFactorAuthDetails {
  secretKey: string;
  otpAuthURL: string;
}


const randomDigit = () => Math.floor(1000 + Math.random() * 9000);

const randomString = (length: any) => Math.round(
  // eslint-disable-next-line no-restricted-properties
  Math.pow(36, length + 1) - Math.random() * Math.pow(36, length),
)
  .toString(36)
  .slice(1);

const generateChangeToken = () => `${randomString(16)}-${randomString(16)}-${randomString(16)}`;



//for the 2fa generation

//recheck and log data (Test date at 10/07/2023 timeStamp 11:54 )
const generateTwoFactorAuthDetails = (): TwoFactorAuthDetails => {
  const secretKey = speakeasy.generateSecret({ length: 20 }).base32;

  const otpAuthURL = speakeasy.otpauthURL({
    secret: secretKey,
    label: companyName,
    algorithm: algorithmType as unknown as speakeasy.Algorithm,
    digits: 6,
    period: 30,
  });
  return { secretKey, otpAuthURL};
};

const verifyTwoFactorAuthCode = (secretKey: string, code: string): boolean => {
  const verificationResult = speakeasy.totp.verify({
    secret: secretKey,
    encoding: 'base32',
    token: code,
  });
  return verificationResult !== null;
  
};





export {
  randomString,
  randomDigit,
  generateChangeToken,
  generateTwoFactorAuthDetails,
  verifyTwoFactorAuthCode,
};