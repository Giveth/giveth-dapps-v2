import { IMainCategory } from '@/apollo/types/types';

export const getMainCategorySlug = (category: IMainCategory) =>
	category.slug === 'all' ? undefined : category.slug;
