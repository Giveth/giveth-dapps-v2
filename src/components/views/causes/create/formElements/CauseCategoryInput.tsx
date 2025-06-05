import { useState } from 'react';
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
import { InputContainer } from '@/components/views/causes/create/Create.sc';
import MainCategoryItem from '@/components/views/create/categoryInput/MainCategoryItem';
import { useAppSelector } from '@/features/hooks';
import {
	ECreateCauseSections,
	EInputs,
} from '@/components/views/causes/create/types';

interface ICategoriesInputProps {
	setActiveCauseSection: (section: ECreateCauseSections) => void;
}

const CauseCategoryInput = ({
	setActiveCauseSection,
}: ICategoriesInputProps) => {
	const { getValues, setValue } = useFormContext();
	const { formatMessage } = useIntl();

	const [selectedCategories, setSelectedCategories] = useState<ICategory[]>(
		getValues(EInputs.categories) || [],
	);

	const allCategories = useAppSelector(state => state.general.mainCategories);

	const handleSelectCategory = (categories: ICategory[]) => {
		setSelectedCategories(categories);
		setValue(EInputs.categories, categories);
	};

	return (
		<InputContainer
			onMouseEnter={() =>
				setActiveCauseSection(ECreateCauseSections.categories)
			}
		>
			<H5>{formatMessage({ id: 'label.please_select_a_category' })}</H5>
			<CaptionContainer>
				{formatMessage({ id: 'label.you_can_choose_up_to' })}{' '}
				{maxSelectedCategory}{' '}
				{formatMessage({ id: 'label.cause.categories_for_your_cause' })}
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

export default CauseCategoryInput;
