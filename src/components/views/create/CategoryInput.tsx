import React from 'react';
import {
	H5,
	Caption,
	brandColors,
	neutralColors,
	SublineBold,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

import CheckBox from '@/components/Checkbox';
import { categoryList, maxSelectedCategory } from '@/lib/constants/Categories';
import { ICategory } from '@/apollo/types/types';
import { mediaQueries } from '@/lib/constants/constants';
import { InputContainer } from '@/components/views/create/Create.sc';

const CategoryInput = (props: {
	value: ICategory[];
	setValue: (category: ICategory[]) => void;
}) => {
	const { value, setValue } = props;
	const isMaxCategories = value.length >= maxSelectedCategory;

	const handleChange = (isChecked: boolean, name: string) => {
		const newCategories = [...value];
		if (isChecked) {
			newCategories.push({ name });
			setValue(newCategories);
		} else {
			const index = value.findIndex(
				(category: ICategory) => category.name === name,
			);
			newCategories.splice(index, 1);
			setValue(newCategories);
		}
	};

	return (
		<InputContainer>
			<H5>Please select a category.</H5>
			<CaptionContainer>
				You can choose up to {maxSelectedCategory} categories for your
				project.
				<CategoryCount>
					{value.length}/{maxSelectedCategory}
				</CategoryCount>
			</CaptionContainer>
			<CategoriesGrid>
				{categoryList.map(i => {
					const checked = value.find(el => el.name === i.name);
					return (
						<CheckBox
							key={i.value}
							title={i.value}
							checked={!!checked}
							onChange={e => handleChange(e, i.name)}
							disabled={isMaxCategories && !checked}
						/>
					);
				})}
			</CategoriesGrid>
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

const CategoriesGrid = styled.div`
	display: grid;
	grid-template-columns: auto;
	padding: 10px 10px 22px 10px;
	color: ${brandColors.deep[900]};
	> div {
		margin: 11px 0;
	}

	${mediaQueries.tablet} {
		grid-template-columns: auto auto auto !important;
	}
	${mediaQueries.mobileM} {
		grid-template-columns: auto auto;
	}
`;

export default CategoryInput;
