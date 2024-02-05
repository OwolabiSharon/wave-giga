import {BankDetails} from '../models/bankDetails.model';
import httpStatus from 'http-status';
import generateTransactionReference from '../utils/payment';
import ApiError from '../utils/ApiError';


const addBankDetails = async (data: any) => {
    try {
        const bankDetails = await BankDetails.create({
            name: data.name ,
            bankName: data.bankName,
            accountNumber: data.accountNumber
        });
    
        return bankDetails
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Definitely an error from your input');
    }
    
    
}

const kyc = async (data: any) => {
    
  const response = "data added";
  return response;
  }


export default {
    addBankDetails, 
    kyc
 };
