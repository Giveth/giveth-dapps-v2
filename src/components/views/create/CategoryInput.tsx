import React, { useEffect, useState, Fragment } from 'react';
import styled from 'styled-components';
import {
	H5,
	SemiTitle,
	Caption,
	neutralColors,
	SublineBold,
} from '@giveth/ui-design-system';
import { client } from '@/apollo/apolloClient';
import { FETCH_MAIN_CATEGORIES } from '@/apollo/gql/gqlProjects';
import CheckBox from '@/components/Checkbox';
import { maxSelectedCategory } from '@/lib/constants/Categories';
import { ICategory, IMainCategory } from '@/apollo/types/types';
import { mediaQueries } from '@/lib/constants/constants';
import { InputContainer } from '@/components/views/create/Create.sc';

const CategoryInput = (props: {
	value: ICategory[];
	setValue: (category: ICategory[]) => void;
}) => {
	const { value, setValue } = props;
	const isMaxCategories = value.length >= maxSelectedCategory;
	const [allCategories, setAllCategories] = useState<any>();

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

	useEffect(() => {
		const getCategories = async () => {
			const {
				data: { mainCategories },
			}: {
				data: { mainCategories: IMainCategory[] };
			} = await client.query({
				query: FETCH_MAIN_CATEGORIES,
			});

			setAllCategories(mainCategories);
		};
		getCategories();
	}, []);

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
				{allCategories?.map((c: IMainCategory) => {
					return (
						<Fragment key={c.title}>
							<CategoryTitle>{c.title}</CategoryTitle>
							{c.categories.map(i => {
								const checked = value.find(
									el => el.name === i.name,
								);
								return (
									<CategoryItem key={i.value}>
										<CheckBox
											size={20}
											label={i.value!}
											checked={!!checked}
											onChange={e =>
												handleChange(e, i.name)
											}
											disabled={
												isMaxCategories && !checked
											}
										/>
									</CategoryItem>
								);
							})}
						</Fragment>
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

const CategoryItem = styled.div`
	margin-top: 28px;
`;

const CategoriesGrid = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	color: ${neutralColors.gray[800]};
	height: 910px;

	${mediaQueries.tablet} {
		height: 650px;
	}
`;

const CategoryTitle = styled(SemiTitle)`
	max-width: 220px;
	margin-top: 28px;
	margin-bottom: -8px;
	color: ${neutralColors.gray[900]};
`;

export default CategoryInput;
