import { brandColors, neutralColors, Lead } from '@giveth/ui-design-system';
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

const Categories = styled.div`
	display: flex;
	flex-direction: row;
	gap: 8px;
	justify-content: center;
	margin: 16px 0 0 0;
`;

const MainCategoryItem = styled.div<{ isSelected?: boolean }>`
	border-radius: 50px;
	background: ${props =>
		!props.isSelected ? neutralColors.gray[300] : brandColors.giv[600]};
	color: ${props => (!props.isSelected ? 'black' : 'white')};
	padding: 16px;
	:hover {
		cursor: pointer;
		color: white;
		background: ${brandColors.giv[600]};
		-webkit-transition: background-color 300ms linear, color 150ms linear;
		-ms-transition: background-color 300ms linear, color 150ms linear;
		transition: background-color 300ms linear, color 150ms linear;
	}
	font-weight: 400;
	text-align: center;
	user-select: none;
`;

export default ProjectsNoResults;
