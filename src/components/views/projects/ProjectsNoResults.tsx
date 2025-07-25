import {
	brandColors,
	neutralColors,
	Lead,
	FlexCenter,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { mediaQueries, searchSuggestions } from '@/lib/constants/constants';
import Routes from '@/lib/constants/Routes';
import { useProjectsContext } from '@/context/projects.context';
import { useAppSelector } from '@/features/hooks';

const ProjectsNoResults = () => {
	const mainCategories = useAppSelector(
		state => state.general.mainCategories,
	);
	const { formatMessage } = useIntl();
	const { isQF, isCauses } = useProjectsContext();
	const router = useRouter();

	const handleSearch = (searchTerm?: string) => {
		router.push({
			pathname: isCauses
				? Routes.Causes + '/all'
				: Routes.Projects + '/all',
			query: { searchTerm: searchTerm },
		});
	};

	return (
		<Wrapper>
			<Content>
				{formatMessage({
					id: isCauses
						? 'label.cause.there_are_no_causes_matching_your_search'
						: 'label.there_are_no_projects_matching_your_search',
				})}
			</Content>
			<LeadMedium>
				{formatMessage({
					id: 'label.try_removing_some_filters_keyword',
				})}
			</LeadMedium>
			{!isQF && (
				<>
					<GrayLead>
						{formatMessage({ id: 'label.try_these' })}
					</GrayLead>
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
					<GrayLead>
						{formatMessage({
							id: 'label.or_go_back_to_main_categories',
						})}
					</GrayLead>
					<Categories>
						{mainCategories?.map((category, index) => {
							return (
								<Link
									key={`category-${index}`}
									href={`${Routes.Projects}/${category.slug}`}
								>
									<MainCategoryItem
										onClick={() => {
											const updatedQuery = {
												...router.query,
											};
											delete updatedQuery.sortingBy;
											delete updatedQuery.filters;
											router.push({
												pathname: router.pathname,
												query: updatedQuery,
											});
										}}
									>
										{formatMessage({ id: category.slug })}
									</MainCategoryItem>
								</Link>
							);
						})}
					</Categories>
				</>
			)}
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
	flex-wrap: wrap;
	gap: 8px;
	margin: 16px;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const MainCategoryItem = styled.div<{ $isSelected?: boolean }>`
	cursor: pointer;
	min-width: 400px;
	border-radius: 50px;
	font-size: 17px;
	background: ${props =>
		!props.$isSelected ? neutralColors.gray[300] : brandColors.giv[600]};
	color: ${props => (!props.$isSelected ? 'black' : 'white')};
	padding: 16px;
	&:hover {
		color: white;
		background: ${brandColors.giv[600]};
		transition:
			background-color 300ms linear,
			color 150ms linear;
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
	&:hover {
		color: ${neutralColors.gray[700]};
		transition:
			color 300ms linear,
			color 150ms linear;
	}
	${mediaQueries.tablet} {
		font-size: 16px;
	}
`;

export default ProjectsNoResults;
