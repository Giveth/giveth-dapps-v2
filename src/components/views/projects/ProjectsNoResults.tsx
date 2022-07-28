import { brandColors, neutralColors, Lead } from '@giveth/ui-design-system';
import { FlexCenter } from '@/components/styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';
import styled from 'styled-components';
import Link from 'next/link';
import { IMainCategory } from '@/apollo/types/types';
import Routes from '@/lib/constants/Routes';

const ProjectsNoResults = (props: { mainCategories: IMainCategory[] }) => {
	return (
		<Wrapper>
			<Content>It seems we couldn’t find any result!</Content>
			<LeadMedium>Try another keyword or broaden your search</LeadMedium>
			<GreayLead>Or go back to main categories</GreayLead>
			<Categories>
				{props.mainCategories.map((category, index) => {
					return (
						<Link
							key={`category-${index}`}
							href={
								category.slug === 'all'
									? Routes.Projects
									: `/projects/${category.slug}`
							}
							passHref
						>
							<a>
								<MainCategoryItem>
									{category.title}
								</MainCategoryItem>
							</a>
						</Link>
					);
				})}
			</Categories>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	text-align: center;
	margin: 128px auto;
	color: ${brandColors.deep[500]};
	position: relative;
`;

const Content = styled(Lead)`
	margin-top: 24px;
	margin-bottom: 8px;
`;

const LeadMedium = styled(Lead)`
	font-weight: 400;
	font-size: 20px;
	color: ${neutralColors.gray[700]};
`;

const GreayLead = styled(LeadMedium)`
	color: ${neutralColors.gray[600]};
	margin: 60px 0 0 0;
`;

const Categories = styled(FlexCenter)`
	flex-direction: column;
	gap: 8px;
	margin: 16px 0 0 0;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const MainCategoryItem = styled.div<{ isSelected?: boolean }>`
	cursor: pointer;
	min-width: 400px;
	border-radius: 50px;
	background: ${props =>
		!props.isSelected ? neutralColors.gray[300] : brandColors.giv[600]};
	color: ${props => (!props.isSelected ? 'black' : 'white')};
	padding: 16px;
	:hover {
		color: white;
		background: ${brandColors.giv[600]};
		transition: background-color 300ms linear, color 150ms linear;
	}
	font-weight: 400;
	text-align: center;
	user-select: none;
	${mediaQueries.tablet} {
		width: 100%;
		min-width: 100%;
	}
`;

export default ProjectsNoResults;
