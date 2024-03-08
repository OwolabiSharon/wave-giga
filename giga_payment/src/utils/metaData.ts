export class MetaData {
    userID: string;
    accountNumber: string;
    datetime: Date;

    constructor(userID: string, accountNumber: string, datetime: Date) {
        this.userID = userID;
        this.accountNumber = accountNumber;
        this.datetime = datetime;
    }
}

export class Transaction {
    transactionId: string;
    amount: number;
    transactionType: string;
    transactionDate: Date;
    metadata: MetaData;
    flowDirection: string;

    constructor(transactionId: string, amount: number, transactionType: string, transactionDate: Date, metadata: MetaData, flowDirection: string) {
        this.transactionId = transactionId;
        this.amount = amount;
        this.transactionType = transactionType;
        this.transactionDate = transactionDate;
        this.metadata = metadata;
        this.flowDirection = flowDirection;
    }
}

export class AccountNumber {
    userId: string;
    accountName: string;
    accountNumber: string;
    accountBalance: number;
    currencyType: string;
    bankName: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(userId: string, accountName: string, accountNumber: string, accountBalance: number, currencyType: string, bankName: string, createdAt: Date, updatedAt: Date) {
        this.userId = userId;
        this.accountName = accountName;
        this.accountNumber = accountNumber;
        this.accountBalance = accountBalance;
        this.currencyType = currencyType;
        this.bankName = bankName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export class IAccountNumberModel {
    static create(arg0: { userId: string; accountName: string; accountNumber: string; accountBalance: number; currencyType: string; bankName: string; createdAt: Date; updatedAt: Date; }) {
        throw new Error('Method not implemented.');
    }
}

export class ITransaction {
    static create(arg0: { transactionId: string; amount: number; transactionType: string; transactionDate: Date; metadata: MetaData; flowDirection: string; }) {
        throw new Error('Method not implemented.');
    }
}