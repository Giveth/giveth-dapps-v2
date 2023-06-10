import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { neutralColors, SublineBold } from '@giveth/ui-design-system';
import ProjectBadge from './ProjectBadge';
import { mediaQueries } from '@/lib/constants/constants';
import { Flex } from '@/components/styled-components/Flex';
import { ICategory } from '@/apollo/types/types';

interface ICategoryBadges {
	categories: ICategory[];
}

const ProjectCategoriesBadges = ({ categories }: ICategoryBadges) => {
	const [data, setData] = useState(null);

	useEffect(() => {
		const setCategories = () => {
			const groupedData = categories.reduce((acc: any, item: any) => {
				const mainCategoryTitle = item.mainCategory.title;

				if (!acc[mainCategoryTitle]) {
					acc[mainCategoryTitle] = [];
				}

				acc[mainCategoryTitle].push(item);

				return acc;
			}, {});
			setData(groupedData);
		};
		setCategories();
	}, []);

	if (!data) return null;

	return (
		<Container>
			{Object.entries(data).map(([mainCategory, subcategories]: any) => (
				<div key={mainCategory}>
					<SublineBold color={neutralColors.gray[900]}>
						{mainCategory}
					</SublineBold>
					<SubCategories>
						{subcategories?.map(
							(subcategory: any, index: number) => (
								<Badge key={index}>
									<ProjectBadge
										badgeText={subcategory.value}
										wrapperColor='transparent'
										textColor={neutralColors.gray[900]}
										borderColor={neutralColors.gray[900]}
									/>
								</Badge>
							),
						)}
					</SubCategories>
				</div>
			))}
		</Container>
	);
};

const Container = styled(Flex)`
	gap: 24px;
	flex-direction: column;

	${mediaQueries.desktop} {
		flex-direction: row;
	}
`;

const SubCategories = styled(Flex)`
	gap: 12px;
	flex-wrap: wrap;
`;

const Badge = styled(Flex)`
	margin: 12px 0 0 0;
	* {
		text-transform: uppercase;
	}
`;

export default ProjectCategoriesBadges;
