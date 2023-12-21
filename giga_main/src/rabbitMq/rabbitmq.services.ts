import Rabbit from './setup';
import UserModel from '../models/user.model';

const rabbit = new Rabbit();  

const addCard = async () => {
    //function to do something with the data in the rabbit mq message(add card)
    async function processData(data: any) {
        // Perform custom actions with the data

        //rabbit.publishMessage('addCardResponse', "user not found");
        const user = await UserModel.findById(data.userId);

        if (!user) {
            rabbit.publishMessage('addCardResponse', "user not found");
        }
        else{
            // Associate the credit card with the user
            user.creditCard = data.card.token;

             // Save the changes to the user document
             await user.save();
             rabbit.publishMessage('addCardResponse', "credit card setup");
         }
    }
      
    // Call consumeMessage and pass the processData function

    rabbit.consumeMessage('addCard');
};

const getUser = async () => {
    //function to do something with the data in the rabbit mq message(add card)
    async function processData(data: any) {
        // Perform custom actions with the data

        const user = await UserModel.findById(data.userId);

        if (!user) {
            rabbit.publishMessage('getUserResponse', "user not found");
        }
        else{
            rabbit.publishMessage('getUserResponse', user);
        }
    }
    
    // Call consumeMessage and pass the processData function

    rabbit.consumeMessage('getUser', processData);
};

const rateUser = async () => {
    //function to do something with the data in the rabbit mq message(add card)
    async function processData(data: any) {

        const user = await UserModel.findById(data.userId);

        if (!user) {
            rabbit.publishMessage('rateUserResponse', "user not found");
        }
        else{
            user.ratings.push(data.rating)
            rabbit.publishMessage('rateUserResponse', user);
            user.save()
        }
    }
    
    // Call consumeMessage and pass the processData function

    rabbit.consumeMessage('rateUser', processData);
};

const createAccount = async () => {
    //function to do something with the data in the rabbit mq message(add card)
    async function processData(data: any) {

        const user = await UserModel.findById(data.accountInfo.user);

        if (!user) {
            rabbit.publishMessage('rateUserResponse', "user not found");
        }
        else{
            user.taxiProfile = data.accountInfo._id
            user.taxiProfileType = data.type
            user.save()
        }
    }
    
    // Call consumeMessage and pass the processData function

    rabbit.consumeMessage('createTaxiProfile', processData);
};

export default {
    addCard,
    getUser,
    rateUser,
    createAccount
};
