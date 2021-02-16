import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface RequestDTO {
  id: string;
}
// não precisava criar essa interface

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne(id);
    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }
    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
