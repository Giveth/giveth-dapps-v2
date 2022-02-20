import React, { useState } from 'react';
import { H5, Caption, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

import { InputContainer } from './Create.sc';
import CheckBox from '@/components/Checkbox';
import { categoryList, maxSelectedCategory } from '@/lib/constants/Categories';
import { ICategory } from '@/apollo/types/types';
import { gToast, ToastType } from '@/components/toasts';

const CategoryInput = (props: any) => {
	const { setValue } = props;
	const [categories, setCategories] = useState<any>([]);
	const [list, setList] = useState<any>(null);

	const handleChange = (value: any) => {
		const categoriesCp = categories;
		// Remove it, it's already there
		const found = categoriesCp.findIndex(
			(el: any) => el.name === value.name,
		);
		const categoriesList = { ...list };
		if (found >= 0) {
			delete categoriesList[value.name];
			setList(categoriesList);
			setValue(categoriesList);
			return setCategories(
				categoriesCp?.filter((el: ICategory) => el.name !== value.name),
			);
		}
		const newCategories = [...categories, value];
		categoriesList[value.name] = true;
		const isMaxCategories = newCategories.length > maxSelectedCategory;
		if (isMaxCategories) {
			return gToast(`only ${maxSelectedCategory} categories allowed`, {
				type: ToastType.DANGER,
				position: 'top-center',
			});
		}
		// With whole category object
		setCategories(newCategories);
		// Parsed for mutation
		setList(categoriesList);
		setValue(categoriesList);
	};

	return (
		<>
			<H5>Please select a category.</H5>
			<div>
				<CaptionContainer>
					You can choose up to {maxSelectedCategory} category for your
					project.
				</CaptionContainer>
			</div>
			<InputContainer>
				<CatgegoriesGrid>
					{categoryList.map((i, index) => {
						const checked = categories.find(
							(el: any) => el.name === i.name,
						);
						return (
							<CheckBox
								key={index}
								title={i.value}
								checked={!!checked}
								onChange={() => handleChange(i)}
							/>
						);
					})}
				</CatgegoriesGrid>
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
const CatgegoriesGrid = styled.div`
	display: grid;
	grid-template-columns: auto auto auto;
	padding: 10px 10px 22px 10px;
	div {
		padding: 10px 0;
	}
`;

export default CategoryInput;
