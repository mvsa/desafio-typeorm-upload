import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const income = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((sum, element) => sum + element.value, 0);

    const outcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((sum, element) => sum + element.value, 0);

    const total = income - outcome;
    const balance = { income, outcome, total };
    return balance;
  }
}

// const {income, outcome} =  transactions.reduce((accumulator, transaction)=>{
//   switch(transaction.type){
//     case "income":
//       accumulator.income += Number(transaction.value);
//       break;

//     case "outcome":
//     accumulator.income += Number(transaction.value);
//     break;
//   }
//     return accumulator;
// },{
//   income: 0,
//   outcome: 0,
//   total: 0
// }
// );
//  const total = income - outcome;
// return { income, outcome, total };
// }

export default TransactionsRepository;
