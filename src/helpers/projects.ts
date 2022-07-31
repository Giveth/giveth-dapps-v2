import { ICategory, IConvertedCategories } from '@/apollo/types/types';

export function mapCategoriesToMainCategories(categories: ICategory[]) {
	const convertedCategories: IConvertedCategories = {};
	categories.forEach(category => {
		if (convertedCategories.hasOwnProperty(category.mainCategory.title)) {
			convertedCategories[category.mainCategory.title].push(
				category.name,
			);
		} else {
			convertedCategories[category.mainCategory.title] = [category.name];
		}
	});
	return convertedCategories;
}
