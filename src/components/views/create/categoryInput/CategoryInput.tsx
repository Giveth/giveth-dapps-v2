import React, { FC, useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import {
	H5,
	Caption,
	neutralColors,
	SublineBold,
} from '@giveth/ui-design-system';
import { useFormContext } from 'react-hook-form';

import { maxSelectedCategory } from '@/lib/constants/Categories';
import { ICategory } from '@/apollo/types/types';
import { InputContainer } from '@/components/views/create/Create.sc';
import MainCategoryItem from '@/components/views/create/categoryInput/MainCategoryItem';
import { EInputs } from '@/components/views/create/CreateProject';
import { useAppSelector } from '@/features/hooks';

const CategoryInput: FC = () => {
	const { getValues, setValue } = useFormContext();
	const { formatMessage } = useIntl();

	const [selectedCategories, setSelectedCategories] = useState<ICategory[]>(
		getValues(EInputs.categories),
	);

	const allCategories = useAppSelector(state => state.general.mainCategories);

	const handleSelectCategory = (categories: ICategory[]) => {
		setSelectedCategories(categories);
		setValue(EInputs.categories, categories);
	};

	return (
		<InputContainer>
			<H5>{formatMessage({ id: 'label.please_select_a_category' })}</H5>
			<CaptionContainer>
				{formatMessage({ id: 'label.you_can_choose_up_to' })}{' '}
				{maxSelectedCategory}{' '}
				{formatMessage({ id: 'label.categories_for_your_project' })}
				<CategoryCount>
					{selectedCategories.length}/{maxSelectedCategory}
				</CategoryCount>
			</CaptionContainer>
			{allCategories.map(mainCategory => (
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
