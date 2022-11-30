import { brandColors, neutralColors, Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';
import Link from 'next/link';
import { FlexCenter } from '@/components/styled-components/Flex';
import { mediaQueries, searchSuggestions } from '@/lib/constants/constants';
import { IMainCategory } from '@/apollo/types/types';
import Routes from '@/lib/constants/Routes';
import { useProjectsContext } from '@/context/projects.context';

const ProjectsNoResults = (props: { mainCategories: IMainCategory[] }) => {
	const { setVariables } = useProjectsContext();

	const handleSearch = (searchTerm?: string) =>
		setVariables(prevVariables => ({ ...prevVariables, searchTerm }));

	return (
		<Wrapper>
			<Content>It seems we couldn’t find any result!</Content>
			<LeadMedium>Try another keyword or broaden your search</LeadMedium>
			<GrayLead>Try these</GrayLead>
			<Categories>
				{searchSuggestions.map((suggestion, index) => {
					return (
						<SuggestionItem
							key={index}
							onClick={() => {
								handleSearch(suggestion);
							}}
						>
							{suggestion}
						</SuggestionItem>
					);
				})}
			</Categories>
			<GrayLead>Or go back to main categories</GrayLead>
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
							<MainCategoryItem
								onClick={() => {
									setVariables(prevVariables => ({
										...prevVariables,
										sortingBy: undefined,
										filters: undefined,
									}));
								}}
							>
								{category.title}
							</MainCategoryItem>
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

const GrayLead = styled(LeadMedium)`
	color: ${neutralColors.gray[600]};
	margin: 60px 0 0 0;
`;

const Categories = styled(FlexCenter)`
	flex-direction: column;
	gap: 8px;
	margin: 16px;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const MainCategoryItem = styled.div<{ isSelected?: boolean }>`
	cursor: pointer;
	min-width: 400px;
	border-radius: 50px;
	font-size: 17px;
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
		font-size: 16px;
	}
`;

const SuggestionItem = styled.div`
	font-size: 20px;
	color: ${neutralColors.gray[500]};
	cursor: pointer;
	padding: 0 15px;
	:hover {
		color: ${neutralColors.gray[700]};
		transition: color 300ms linear, color 150ms linear;
	}
	${mediaQueries.tablet} {
		font-size: 16px;
	}
`;

export default ProjectsNoResults;
