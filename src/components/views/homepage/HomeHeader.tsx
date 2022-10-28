import { useRouter } from 'next/router';
import { H1, brandColors, Button, Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { FlexCenter } from '@/components/styled-components/Flex';
import Routes from '@/lib/constants/Routes';
import { Arc } from '@/components/styled-components/Arc';
import { mediaQueries } from '@/lib/constants/constants';
import Links from '@/lib/constants/links';
import { useIntl } from 'react-intl';

const HomeHeader = () => {
	const { formatMessage } = useIntl();
	const router = useRouter();

	const welcomeTitle = formatMessage({
		id: 'page.home.bigscreen.title',
	});

	return (
		<Wrapper>
			<Title weight={700}>{welcomeTitle}</Title>
			<Subtitle>
				{formatMessage({
					id: 'page.home.bigscreen.get_rewarded',
				})}
			</Subtitle>
			<MatchingPoolButton
				buttonType='primary'
				size='large'
				label={formatMessage({
					id: 'page.home.bigscreen.donate_button',
				})}
				onClick={() => router.push(Links.GIVETH_MATCHING)}
			/>
			<SeeProjects
				buttonType='texty'
				size='large'
				label={formatMessage({
					id: 'page.home.bigscreen.see_projects',
				})}
				onClick={() => router.push(Routes.Projects)}
			/>
			<MustardArc />
		</Wrapper>
	);
};

const Title = styled(H1)`
	margin-bottom: 0.5rem;
	padding-top: 3rem;
`;

const Subtitle = styled(Lead)`
	margin: 23px 0;
	padding-bottom: 30px;
`;

const MatchingPoolButton = styled(Button)`
	height: 66px;
	padding: 0 80px;
	text-transform: uppercase;
`;

const SeeProjects = styled(Button)`
	height: 66px;
	color: ${brandColors.mustard[500]};
	text-transform: uppercase;
	a {
		font-weight: 400;
	}

	&:hover {
		background-color: transparent;
		color: ${brandColors.mustard[500]};
	}
`;

const MustardArc = styled(Arc)`
	border-width: 60px;
	border-color: ${brandColors.mustard[500]};
	top: 150px;
	left: -250px;
	width: 360px;
	height: 360px;
	display: none;

	${mediaQueries.tablet} {
		display: unset;
	}
`;

const Wrapper = styled(FlexCenter)`
	height: 650px;
	text-align: center;
	background: ${brandColors.giv[500]};
	color: white;
	flex-direction: column;
	z-index: 2;
	position: relative;
	background-image: url('/images/GIV_homepage.svg');
`;

export default HomeHeader;
