import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import CategoriesRepository from '../repositories/CategoriesRepository';

import TransactionsRepository from '../repositories/TransactionsRepository';

enum Types {
  Income = 'income',
  Outcome = 'outcome',
}

interface RequestDTO {
  title: string;
  value: number;
  type: Types;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: RequestDTO): Promise<Transaction> {
    let categoryID;
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    // importou o repositorio padrão - não criou um custom
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    // let tranCategorie = await categoryRepository.findOne({   não precisoou usar um repository custom
    //   where:{
    //     title:category
    //   }
    // })
    const oldCategorie = await categoriesRepository.checkIfAlreadyExists(
      category,
    );

    // const { total } = await transactionsRepository.getBalance();
    // if (type === 'outcome' && total < value) {
    //   throw new AppError('Not enough money!', 400);
    // }

    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();
      const { total } = balance;
      if (value > total) {
        throw new AppError('Not enough money!', 400);
      }
    }

    if (!oldCategorie) {
      // tranCategorie  = categoriesRepository.create({
      const newCategorie = categoriesRepository.create({
        title: category,
      });

      // await categoriesRepository.save(tranCategorie);
      await categoriesRepository.save(newCategorie);

      categoryID = newCategorie.id;
    } else {
      categoryID = oldCategorie.id;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      category_id: categoryID, // não passou esse
      // category:tranCategorie
      type,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
