import React, { Dispatch, SetStateAction } from 'react';
import { H5, Caption, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

import { InputContainer } from './Create.sc';
import CheckBox from '@/components/Checkbox';
import { categoryList, maxSelectedCategory } from '@/lib/constants/Categories';
import { ICategory } from '@/apollo/types/types';
import { showToastError } from '@/lib/helpers';
import { mediaQueries } from '@/utils/constants';

const CategoryInput = (props: {
	value: ICategory[];
	setValue: Dispatch<SetStateAction<ICategory[]>>;
}) => {
	const { value, setValue } = props;

	const handleChange = (isChecked: boolean, name: string) => {
		const newCategories = [...value];

		if (isChecked) {
			const isMaxCategories = newCategories.length >= maxSelectedCategory;
			if (isMaxCategories) {
				return showToastError(
					`only ${maxSelectedCategory} categories allowed`,
				);
			}
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
		<>
			<br />
			<H5>Please select a category.</H5>
			<div>
				<CaptionContainer>
					You can choose up to {maxSelectedCategory} category for your
					project.
				</CaptionContainer>
			</div>
			<InputContainer>
				<CategoriesGrid>
					{categoryList.map(i => {
						const checked = value.find(
							(el: ICategory) => el.name === i.name,
						);
						return (
							<CheckBox
								key={i.value}
								title={i.value}
								checked={!!checked}
								onChange={e => handleChange(e, i.name)}
							/>
						);
					})}
				</CategoriesGrid>
			</InputContainer>
		</>
	);
};

const CaptionContainer = styled(Caption)`
	height: 18px;
	margin: 8.5px 0 0 0;
	span {
		cursor: pointer;
		color: ${brandColors.pinky[500]};
	}
`;

const CategoriesGrid = styled.div`
	display: grid;
	grid-template-columns: auto;
	padding: 10px 10px 22px 10px;
	div {
		padding: 10px 0;
	}

	${mediaQueries.tablet} {
		grid-template-columns: auto auto auto !important;
	}
	${mediaQueries.mobileM} {
		grid-template-columns: auto auto;
	}
`;

export default CategoryInput;
