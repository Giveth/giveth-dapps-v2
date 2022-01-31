import React, { useState } from 'react';
import { H5, Caption, brandColors } from '@giveth/ui-design-system';
import { InputContainer } from './Create.sc';
import CheckBox from '@/components/Checkbox';
import { categoryList, maxSelectedCategory } from '@/lib/constants/Categories';
import styled from 'styled-components';

const CategoryInput = (props: any) => {
	const [categories, setCategories] = useState<any>([]);

	const handleChange = (value: any) => {
		const categoriesCp = categories;
		// Remove it, it's already there
		const found = categoriesCp.findIndex(
			(el: any) => el.name === value.name,
		);
		if (found >= 0) {
			return setCategories(
				categoriesCp?.filter((el: any) => el.name !== value.name),
			);
		}
		const newCategories = [...categories, value];
		const isMaxCategories = newCategories.length > maxSelectedCategory;
		if (isMaxCategories) {
			return alert('only 5 categories allowed');
		}
		setCategories(newCategories);
	};
	return (
		<>
			<H5>Please select a category.</H5>
			<div>
				<CaptionContainer>
					You can choose up to 4 category for your project.
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
