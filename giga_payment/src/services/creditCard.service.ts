import { CreditCard, ICreditCard } from '../models/creditCard.model';
import { AccountNumber, IAccountNumber} from '../models/account.model';
import httpStatus from 'http-status';
import generateTransactionReference from '../utils/payment';
import ApiError from '../utils/ApiError';
import Flutterwave from 'flutterwave-node-v3';
import { EventSender } from '../utils/eventSystem'; 

const flutterwave = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
const eventSender = new EventSender();

interface ChargeDetails {
    card_number: string;
    cvv: string;
    expiry_month: string;
    expiry_year: string;
    currency: string;
    amount: string;
    fullname: string;
    email: string;
    tx_ref: string;
    enckey: string;
    redirect_url: string;
    authorization?: {
      mode: string;
      fields?: string[];
      pin: number;
    };
}
  
const datas = generateTransactionReference
// console.log(datas);

const createCard = async (cardNumber: string, cardHolderName: string, cardExpiryMonth: string, cardExpiryYear: string, cardCVV: string, email: string, pin: number)=> {
  // Create the credit card
  try {
    const redirect_url=process.env.REDIRECT_URL_CREATE_CARD
    const details: ChargeDetails = {
      card_number: cardNumber,
      cvv: cardCVV,
      expiry_month: cardExpiryMonth,
      expiry_year: cardExpiryYear,
      currency: "NGN",
      amount: "50",
      fullname: cardHolderName,
      email,
        "tx_ref": generateTransactionReference(),
        "enckey": 'FLWSECK_TEST8f058b3579bb',
      
  };

      const response = await flutterwave.Charge.card(details);
      console.log(response);
      
      if (response.meta.authorization.mode === 'pin') {
        let payload2: ChargeDetails = { ...details }
        console.log("hey");
        
      payload2.authorization = {
          "mode": "pin",
          "pin": pin
      }
      console.log("hey33");
      const reCallCharge = await flutterwave.Charge.card(payload2)
      return {
        response: reCallCharge
    };
  }
  // For 3DS or VBV transactions, redirect users to their issue to authorize the transaction
  if (response.meta.authorization.mode === 'redirect') {

      var url = response.meta.authorization.redirect
      open(url)
  }
    return response;
  } catch (error) {
    console.log('Payment error:', error);
    throw new ApiError(httpStatus.BAD_REQUEST, error as string);
  }
};

const validateTransaction = async (flutterwaveReference: string, otp: string, userId: string) => {
    const callValidate = await flutterwave.Charge.validate({
        "otp": otp,
        "flw_ref": flutterwaveReference
    })
    const transactionId = callValidate.data.id;
    const verifyTransaction = await flutterwave.Transaction.verify({
        id: transactionId.toString()
    });
    console.log(verifyTransaction)
    
    const creditCard = await CreditCard.create({
        token: verifyTransaction?.data.card.token 
    });
    eventSender.sendEvent({
      name: '/main/v1/addCard',
      service: 'user', // Assuming 'user' is the service name
      payload: {data: creditCard, userId: userId },
    })
    return verifyTransaction
}

const payFee = async (data: any) => {
    const details = {
        token: data.token,
        currency: "NGN",
        country: "NG",
        amount: data.amount,
        email: "generic@yahoo.com",
        tx_ref: generateTransactionReference(),
        narration: data.narration,
    };
  const response = await flutterwave.Tokenized.charge(details);
  if (response.status === "success") {
    if (data.payment_type === "taxi") {
      eventSender.sendEvent({
        name: 'increaseBalance',
        service: 'taxi_Drive', // Assuming 'user' is the service name
        payload: {id: data.id, amount: data.amount },
      })
    } else if (data.payment_type === "ecommerce") {
      eventSender.sendEvent({
        name: 'increaseBalance',
        service: 'ecommerce', // Assuming 'user' is the service name
        payload: {id: data.id, amount: data.amount },
      })
    }
  }
  
  
  return response;
}

const createAccountDetails = async (data: any) => {
  
  const accountDetails = {
    userId: data.id,
    accountName: data.accountName,
    accountNumber: data.accountNumber,
    currencyType: "NGN",
    bankName: data.bankName
  };

  const response = await AccountNumber.create(accountDetails);
  
  return response;
};


export default {
    createCard, 
    validateTransaction,
  payFee,
  createAccountDetails
};
