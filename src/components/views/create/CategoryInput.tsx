import React from 'react';
import { H5, Caption, brandColors } from '@giveth/ui-design-system';
import { InputContainer } from './Create.sc';
import { Regular_Input } from '@/components/styled-components/Input';
import { categoryList } from '@/lib/constants/Categories';
import styled from 'styled-components';

const CategoryInput = (props: any) => {
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
					{categoryList.map(i => {
						return <div>{i.value}</div>;
					})}
				</CatgegoriesGrid>
			</InputContainer>
		</>
	);
};

const Input = styled(Regular_Input)``;

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
		padding: 20px;
	}
`;

export default CategoryInput;
