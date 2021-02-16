import { getCustomRepository, getRepository, In } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import CategoriesRepository from '../repositories/CategoriesRepository';
import Category from '../models/Category';

enum Types {
  Income = 'income',
  Outcome = 'outcome',
}

// interface CSVTransaction {
//   title: string;
//   type: Types;
//   value: number;
//   category: string;
// }

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

    // const transactions: CSVTransaction[] = [];
    // const categories:string[] = [];

    // parseCSV.on('data', async line => {
    //   const [title, type, value, category] = line.map((cell: string) =>
    //     cell.trim(),
    //   );
    //   if (!title || !type || !value) return;
    //   categories.push(category);
    //   transactions.push({ title, type, value, category });
    // });

    // await new Promise(resolve => parseCSV.on('end', resolve));

    // const existentCategories = await categoriesRepository.find({
    //   where: {
    //     title: In(categories),
    //   },
    // });

    // const existentCategoriesTitles = existentCategories.map(
    //   (category: Category) => category.title,
    // );

    // const addCategoryTitles = categories
    //   .filter(category => !existentCategoriesTitles.includes(category))
    //   .filter((value, index, self) => self.indexOf(value) === index); //remove duplicados presente no csv
    // self é o proprio array categories
    // indexOf retorna a primeira recorrencia do valor pesquisado

    // const newCategories = categoriesRepository.create(
    //   addCategoryTitles.map(title => ({
    //     title,
    //   })),
    // );

    // await categoriesRepository.save(newCategories);

    // const finalCategories = [...newCategories, ...existentCategories];
    // const createdTransactions = transactionsRepository.create(
    //   transactions.map(transaction => ({
    //     title: transaction.title,
    //     type: transaction.type,
    //     value: transaction.value,
    //     category: finalCategories.find(
    //       category => category.title === transaction.category,
    //     ),
    //   })),
    // );

    // await transactionsRepository.save(createdTransactions);
    // await fs.promises.unlik(csvFilePath);

    // return createdTransactions;

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    // A minha solução fez as inserções uma por uma, e eu abria e fechava varias conexões ao BD para isso (ruim)
    // A solução da rocket (melhor) book insert, pega todos os valores coloca localmente e insere eles de uma vez - uma unica conexão em banco
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
// não usar foreach em loops asincronos, utilizar for of (menos performatico) ou a solução com Promise.all(caso a ordem de inserção
// não seja importante, pois a depender do tempo de processamento, irão ser inseridos fora de ordem))

// se a ordem for importante, feito o desafio que necessita que os registros sejam inseridos em ordem, for of
// Porem o for of é negado por muitos linters, esse desafio não passou nos testes por esse motivo, pois n consegui fazer essa imple
// mentação. Ficou com o Map, porem pelo caracter assincrono, a inserção de dados ficou e ordem errada, atrapalhando na passagem do teste
// porem via postman funcionava (?)
