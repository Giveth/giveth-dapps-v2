import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	ButtonText,
	H6,
	IconX16,
	Lead,
	neutralColors,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { Col, Container, Row } from '@giveth/ui-design-system';
import { Modal } from './Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Flex, FlexCenter } from '../styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';
import { ETheme } from '@/features/general/general.slice';
import { useAppSelector } from '@/features/hooks';
import { SearchInput } from '../SearchInput';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import Routes from '@/lib/constants/Routes';
import { client } from '@/apollo/apolloClient';
import { FETCH_CAMPAIGN_BY_SLUG } from '@/apollo/gql/gqlCampaign';
import { ICampaign, IProject } from '@/apollo/types/types';
import { Shadow } from '../styled-components/Shadow';

const quickLinks = [
	{
		title: 'Top ranking projects',
		query: '?sort=' + EProjectsSortBy.GIVPOWER,
	},
	{
		title: 'Most funded projects',
		query: '?sort=' + EProjectsSortBy.MOST_FUNDED,
	},
	{ title: 'New projects', query: '?sort=' + EProjectsSortBy.NEWEST },
	{
		title: 'Most liked projects',
		query: '?sort=' + EProjectsSortBy.MOST_LIKED,
	},
];

//We should update it manually
const popular_categories = [
	{
		title: 'Community',
		slug: 'community',
	},
	{
		title: 'NGO',
		slug: 'ngo',
	},
	{
		title: 'Technology',
		slug: 'technology',
	},
	{
		title: 'Equality',
		slug: 'equality',
	},
	// {
	// 	title: 'Health & Wellness',
	// 	slug: 'health-and-wellness',
	// },
	// {
	// 	title: 'Finance',
	// 	slug: 'finance',
	// },
	// {
	// 	title: 'Art & Culture',
	// 	slug: 'art-and-culture',
	// },
	// {
	// 	title: 'Economic & Infrastructure',
	// 	slug: 'economic-and-infrastructure',
	// },
	// {
	// 	title: 'Education',
	// 	slug: 'education',
	// },
	// {
	// 	title: 'Environment & Energy',
	// 	slug: 'environment-and-energy',
	// },
	// {
	// 	title: 'Nature',
	// 	slug: 'nature',
	// },
	// {
	// 	title: 'Other',
	// 	slug: 'other',
	// },
];

export const SearchModal: FC<IModal> = ({ setShowModal }) => {
	const [term, setTerm] = useState<string>('');
	const [projects, setProjects] = useState<IProject[]>();
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);
	const { theme } = useAppSelector(state => state.general);
	const { formatMessage } = useIntl();
	const router = useRouter();

	useEffect(() => {
		if (term) {
			router.push(`${Routes.Projects}?term=${term}`);
			closeModal();
		}
	}, [closeModal, router, term]);

	useEffect(() => {
		async function fetchFeaturedCampaign() {
			try {
				const { data } = await client.query({
					query: FETCH_CAMPAIGN_BY_SLUG,
					variables: {},
					fetchPolicy: 'no-cache',
				});
				const campaign: ICampaign = data.findCampaignBySlug;
				setProjects(campaign.relatedProjects);
			} catch (error) {
				console.log('error', error);
			}
		}
		fetchFeaturedCampaign();
	}, []);

	return (
		<StyledModal
			closeModal={closeModal}
			isAnimating={isAnimating}
			theme={theme}
			fullScreen
			hiddenClose
		>
			<SearchModalContainer>
				<CloseModal theme={theme} onClick={closeModal}>
					<ButtonText>
						{formatMessage({ id: 'label.close' })}
					</ButtonText>
					<IconX16 />
				</CloseModal>
				<SearchBox>
					<H6 weight={700}>
						{formatMessage({
							id: 'label.find_awesome_projects_on_giveth',
						})}
					</H6>
					<SearchInput setTerm={setTerm} />
				</SearchBox>
				<Row>
					<Col xs={12} sm={3}>
						<Columns>
							<Title size='large' theme={theme}>
								{formatMessage({ id: 'label.quick_links' })}
							</Title>
							{quickLinks.map((item, idx) => (
								<Link
									key={idx}
									href={Routes.Projects + item.query}
								>
									<Item theme={theme} onClick={closeModal}>
										{item.title}
									</Item>
								</Link>
							))}
						</Columns>
					</Col>
					<Col xs={12} sm={6}>
						<Columns>
							<Title size='large' theme={theme}>
								{formatMessage({
									id: 'label.featured_projects',
								})}
							</Title>
							{projects &&
								projects.length > 0 &&
								projects.slice(0, 4).map((project, idx) => (
									<Link
										key={idx}
										href={
											Routes.Project + '/' + project.slug
										}
									>
										<Item
											theme={theme}
											onClick={closeModal}
										>
											{project.title}
										</Item>
									</Link>
								))}
						</Columns>
					</Col>
					<Col xs={12} sm={3}>
						<Columns>
							<Title size='large' theme={theme}>
								{formatMessage({
									id: 'label.popular_categories',
								})}
							</Title>
							{popular_categories.map((category, idx) => (
								<Link
									key={idx}
									href={Routes.Projects + '/' + category.slug}
								>
									<Item theme={theme} onClick={closeModal}>
										{formatMessage({ id: category.slug })}
									</Item>
								</Link>
							))}
						</Columns>
					</Col>
				</Row>
			</SearchModalContainer>
		</StyledModal>
	);
};

const StyledModal = styled(Modal)`
	background-color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[800]
			: neutralColors.gray[200]};
`;

const CloseModal = styled(FlexCenter)`
	position: absolute;
	top: 16px;
	left: 32px;
	gap: 8px;
	padding: 12px 16px;
	background-color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[700]
			: neutralColors.gray[100]};
	border-radius: 50px;
	box-shadow: ${Shadow.Neutral[400]};
	cursor: pointer;
`;

const SearchModalContainer = styled(Container)`
	padding-top: 96px;
	${mediaQueries.tablet} {
		padding-top: 132px;
	}
	margin-bottom: 48px;
`;

const Columns = styled(Flex)`
	gap: 24px;
	flex-direction: column;
	align-items: center;
	margin-bottom: 48px;
`;

const SearchBox = styled(Flex)`
	flex-direction: column;
	gap: 16px;
	${mediaQueries.tablet} {
		width: 600px;
	}
	margin: 0 auto 80px;
`;

const Title = styled(Lead)`
	margin-bottom: 16px;
	color: ${props =>
		props.theme === ETheme.Dark
			? brandColors.giv[200]
			: neutralColors.gray[700]};
`;

const Item = styled(Lead)`
	color: ${props =>
		props.theme === ETheme.Dark
			? neutralColors.gray[100]
			: neutralColors.gray[900]};
`;
