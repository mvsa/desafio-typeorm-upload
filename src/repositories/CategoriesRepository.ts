import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async checkIfAlreadyExists(title: string): Promise<Category | null> {
    const findCategorieByName = await this.findOne({
      where: { title },
    });
    return findCategorieByName || null;
  }
}

export default CategoriesRepository;
