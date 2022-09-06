import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	H5,
	Caption,
	neutralColors,
	SublineBold,
} from '@giveth/ui-design-system';
import { captureException } from '@sentry/nextjs';
import { useFormContext } from 'react-hook-form';

import { client } from '@/apollo/apolloClient';
import { FETCH_MAIN_CATEGORIES } from '@/apollo/gql/gqlProjects';
import { maxSelectedCategory } from '@/lib/constants/Categories';
import { ICategory, IMainCategory } from '@/apollo/types/types';
import { InputContainer } from '@/components/views/create/Create.sc';
import MainCategoryItem from '@/components/views/create/categoryInput/MainCategoryItem';
import { showToastError } from '@/lib/helpers';
import { EInputs } from '@/components/views/create/CreateProject';

const CategoryInput: FC = () => {
	const { getValues, setValue } = useFormContext();

	const [allCategories, setAllCategories] = useState<IMainCategory[]>();
	const [selectedCategories, setSelectedCategories] = useState<ICategory[]>(
		getValues(EInputs.categories),
	);

	const handleSelectCategory = (categories: ICategory[]) => {
		setSelectedCategories(categories);
		setValue(EInputs.categories, categories);
	};

	useEffect(() => {
		const getCategories = async () => {
			try {
				const { data } = await client.query({
					query: FETCH_MAIN_CATEGORIES,
				});
				setAllCategories(data.mainCategories);
			} catch (err) {
				showToastError(err);
				captureException(err, {
					tags: { section: 'createProjectFetchCategories' },
				});
			}
		};
		getCategories().then();
	}, []);

	return (
		<InputContainer>
			<H5>Please select a category.</H5>
			<CaptionContainer>
				You can choose up to {maxSelectedCategory} categories for your
				project.
				<CategoryCount>
					{selectedCategories.length}/{maxSelectedCategory}
				</CategoryCount>
			</CaptionContainer>
			{allCategories?.map(mainCategory => (
				<MainCategoryItem
					key={mainCategory.title}
					mainCategoryItem={mainCategory}
					selectedCategories={selectedCategories}
					setSelectedCategories={handleSelectCategory}
				/>
			))}
		</InputContainer>
	);
};

const CategoryCount = styled(SublineBold)`
	display: flex;
	justify-content: center;
	align-items: center;
	background: ${neutralColors.gray[300]};
	padding: 6px 10px;
	margin-left: 16px;
	border-radius: 64px;
	color: ${neutralColors.gray[700]};
`;

const CaptionContainer = styled(Caption)`
	display: flex;
	align-items: center;
	margin-top: 8.5px;
`;

export default CategoryInput;
