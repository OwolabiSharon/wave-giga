import Flutterwave from 'flutterwave-node-v3';
import { EventSender } from '../utils/eventSystem';
import httpStatus from 'http-status';
import generateTransactionReference from '../utils/payment';
import ApiError from '../utils/ApiError';

const flutterwave = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
const eventSender = new EventSender();

interface createChargeDetailsPayload {
    /*data required to create a charge
    tx_ref: string;
    amount: The amount to charge the customer.
    currency: The currency to charge in. Defaults to NGN.
    redirect_url: The URL to redirect the customer to after payment is done.
    customer: An object containing the customer details. An email is required, and you can also pass a name and phonenumber
    meta (optional): An object containing any extra information to store alongside the transaction 
    customizations (optional): An object containing options to customize the look of the payment modal. You can set a title, logo, and description
    subaccounts (optional): An array of objects containing the subaccount IDs to split the payment into. See Split payment for more on this.
    payment_options
 */
    amount: number;
    customer: {
        userId: string;
        email: string;
        phonenumber: string;
        name?: string;
    };
    subaccounts: Array<object>;
}

class chargeService {
    async createCharge(payload: createChargeDetailsPayload) {
        try {
            const {amount, customer, subaccounts} = payload;
            const tx_ref = generateTransactionReference();
            const redirect_url = process.env.REDIRECT_URL;
            const meta = {
                consumer_email: customer.email,
                consumer_id: customer.userId,
                consumer_phonenumber: customer.phonenumber,
            }
            const chargePayload= {
                tx_ref,
                amount,
                currency: 'NGN',
                redirect_url,
                customer,
                meta,
                subaccounts
            }
            const response = await flutterwave.Charge.create(chargePayload);
            return response;
        } catch (error:any) {
            throw new ApiError(httpStatus.BAD_REQUEST, error.message);
        }
    }

    async transferFunds(payload: any) {
        try {
            const details = {
                account_bank: payload.account_bank,
                account_number: payload.account_number,
                amount: payload.amount,
                currency: "NGN",
                narration: "Withdrawal from giga account",
                reference: "withdrawal" + generateTransactionReference(),
            };
            const data = flutterwave.Transfer.initiate(details)
                .then(console.log)
                .catch(console.log);
            return data
        } catch (error:any) {
            throw new ApiError(httpStatus.BAD_REQUEST, error.message);
        }
    }

    async paymentWebhook(payload: any) {
        try {
            if (payload.event === "transfer.completed") {
                eventSender.sendEvent({
                    name: 'reduceBalance',
                    service: 'eccommerce', // Assuming 'user' is the service name
                    payload: {amount: payload.data.amount, account_number: payload.data.account_number },
                })
                
                eventSender.sendEvent({
                    name: 'reduceBalance',
                    service: 'taxi_Driver', // Assuming 'user' is the service name
                    payload: {amount: payload.data.amount, account_number: payload.data.account_number },
                })

                eventSender.sendEvent({
                    name: 'reduceBalance',
                    service: 'hotel', // Assuming 'user' is the service name
                    payload: {amount: payload.data.amount, account_number: payload.data.account_number },
                })
            }
        } catch (error:any) {
            throw new ApiError(httpStatus.BAD_REQUEST, error.message);
        }
    }
}  
export default new chargeService();