import React, { FC } from 'react';
import styled from 'styled-components';
import { neutralColors, SemiTitle } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { Col, Row } from '@giveth/ui-design-system';
import CheckBox from '@/components/Checkbox';
import { ICategory, IMainCategory } from '@/apollo/types/types';
import { maxSelectedCategory } from '@/lib/constants/Categories';

interface IProps {
	mainCategoryItem: IMainCategory;
	selectedCategories: ICategory[];
	setSelectedCategories: (category: ICategory[]) => void;
}

const MainCategoryItem: FC<IProps> = props => {
	const { mainCategoryItem, selectedCategories, setSelectedCategories } =
		props;

	const isMaxCategories = selectedCategories.length >= maxSelectedCategory;
	const { formatMessage } = useIntl();

	const onChange = (isChecked: boolean, name: string) => {
		const newCategories = [...selectedCategories];
		if (isChecked) {
			newCategories.push({ name });
			setSelectedCategories(newCategories);
		} else {
			const index = selectedCategories.findIndex(
				category => category.name === name,
			);
			newCategories.splice(index, 1);
			setSelectedCategories(newCategories);
		}
	};

	return (
		<Container>
			<CategoryTitle>
				{formatMessage({ id: mainCategoryItem.slug })}
			</CategoryTitle>
			<SubCategoryItems>
				{mainCategoryItem.categories.map(subcategory => {
					const checked = selectedCategories.find(
						el => el.name === subcategory.name,
					);
					return (
						<SubCategory xs={6} sm={3} key={subcategory.value}>
							<CheckBox
								size={20}
								label={formatMessage({ id: subcategory.name! })}
								checked={!!checked}
								onChange={e => onChange(e, subcategory.name)}
								disabled={isMaxCategories && !checked}
							/>
						</SubCategory>
					);
				})}
			</SubCategoryItems>
		</Container>
	);
};

const SubCategory = styled(Col)`
	margin-top: 0;
	padding-right: 0;
`;

const Container = styled.div`
	margin-bottom: 44px;
	margin-top: 28px;
`;

const CategoryTitle = styled(SemiTitle)`
	color: ${neutralColors.gray[900]};
	margin-bottom: 20px;
`;

const SubCategoryItems = styled(Row)`
	gap: 24px 0;
`;

export default MainCategoryItem;
