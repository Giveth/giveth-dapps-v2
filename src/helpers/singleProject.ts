import { ICategory, IConvertedCategories } from '@/apollo/types/types';

export function mapCategoriesToMainCategories(categories: ICategory[]) {
	const convertedCategories: IConvertedCategories = {};
	categories.forEach(category => {
		if (!category.mainCategory || !category?.value) return;
		if (convertedCategories.hasOwnProperty(category.mainCategory.title)) {
			convertedCategories[category.mainCategory.title].push({
				value: category.value,
				name: category.name,
			});
		} else {
			convertedCategories[category.mainCategory.title] = [
				{
					value: category.value,
					name: category.name,
				},
			];
		}
	});
	return convertedCategories;
}
