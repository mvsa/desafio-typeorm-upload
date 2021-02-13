import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

enum Types {
  Income = 'income',
  Outcome = 'outcome',
}

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();

    const csvFilePath = path.join(uploadConfig.directory, fileName);

    const readCSVStream = fs.createReadStream(csvFilePath);

    const lines: string[] = [];

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    parseCSV.on('data', line => {
      lines.push(line);
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const createPromise = lines.map(async line => {
      const importedTransaction = await createTransaction.execute({
        title: line[0],
        type: line[1] as Types,
        value: parseInt(line[2], 10),
        category: line[3],
      });
      return importedTransaction;
    });

    const importedTransactions = await Promise.all(createPromise);
    return importedTransactions;
  }
}

export default ImportTransactionsService;
// não usar foreach em loops asincronos, utilizar for of (menos performatico, ou essa solução(caso a ordem de inserção
// não seja importante, pois a depender do tempo de processamento, irão ser inseridos fora de ordem))
