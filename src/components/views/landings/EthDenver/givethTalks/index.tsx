import styled from 'styled-components';
import {
	brandColors,
	Button,
	H3,
	Lead,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import CalendarWhite from '/public/images/calendar-white.svg';
import Image from 'next/image';
import CalendarItem from '@/components/views/landings/EthDenver/givethTalks/CalendarItem';
import { Col, Container, Row } from '@/components/Grid';

const GivethTalks = () => {
	return (
		<Wrapper>
			<Row>
				<Talks xs={12} md={6} xl={4}>
					<H3 weight={700}>Giveth Talks</H3>
					<br />
					<br />
					<Lead>
						If you’d like to hear about our ambitious plans to Build
						the Future of Giving, check out these upcoming
						presentations at ETH Denver!
					</Lead>
					<a
						href='https://calendar.google.com/calendar/u/0?cid=Z2l2ZXRoZXRoZGVudmVyQGdtYWlsLmNvbQ'
						target='_blank'
						rel='noreferrer'
					>
						<ButtonStyled
							label='Add all to calendar'
							icon={
								<Image
									src={CalendarWhite}
									alt='Calendar black'
								/>
							}
							size='small'
						/>
					</a>
				</Talks>
				<Calendar xs={12} md={6} xl={8}>
					<CalendarItem
						title='Combating the Metacrisis'
						lecturer='Griff Green'
						date='Mar 03, 2023'
						time='13:00 - 13:15 MST'
						link='https://events.ethdenver.com/eden23/attendease/networking/experience/9dfae4fa-a017-47bb-837c-e2b7b8da8468/af96b57b-a734-45c0-918f-f32bb030cbcc'
					/>
					<CalendarItem
						title='Why DAOs will change the world'
						lecturer='Lauren Luz'
						date='Mar 04, 2023'
						time='10:20 - 10:40 MST'
						link='https://events.ethdenver.com/eden23/attendease/networking/experience/3185f05e-1283-47c4-b1cd-c456c3b6af3a/dd50c09c-f707-4389-a60a-75c2d37c2aa5'
					/>
				</Calendar>
			</Row>
		</Wrapper>
	);
};

const Calendar = styled(Col)`
	> :first-of-type {
		margin-bottom: 40px;
	}
	${mediaQueries.laptopS} {
		padding-left: 60px;
	}
`;

const ButtonStyled = styled(Button)`
	margin-top: 24px;
	> span {
		margin-right: 10px;
	}
`;

const Talks = styled(Col)`
	padding: 40px;
	background: ${brandColors.giv[50]};
	border-radius: 16px;
	height: fit-content;
`;

const Wrapper = styled(Container)`
	padding-top: 40px;
	padding-bottom: 40px;
	color: ${neutralColors.gray[900]};
`;

export default GivethTalks;
