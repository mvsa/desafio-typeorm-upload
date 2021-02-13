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

    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const oldCategorie = await categoriesRepository.checkIfAlreadyExists(
      category,
    );

    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();
      const { total } = balance;
      if (value > total) {
        throw new AppError('Not enough money!', 400);
      }
    }

    if (!oldCategorie) {
      const newCategorie = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(newCategorie);

      categoryID = newCategorie.id;
    } else {
      categoryID = oldCategorie.id;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      category_id: categoryID,
      type,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
