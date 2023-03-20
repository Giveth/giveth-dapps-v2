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
import { Col, Container, Row } from '@giveth/ui-design-system';
import CalendarItem from '@/components/views/landings/EthDenver/givethTalks/CalendarItem';
import { Flex } from '@/components/styled-components/Flex';

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
					<Flex flexDirection='column' gap='40px'>
						<CalendarItem
							title='Combating the Metacrisis'
							lecturer='Griff Green'
							date='Mar 03, 2023'
							time='13:00 - 13:15 MST'
							link='https://events.ethdenver.com/eden23/attendease/networking/experience/9dfae4fa-a017-47bb-837c-e2b7b8da8468/af96b57b-a734-45c0-918f-f32bb030cbcc'
							calendarLink='https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=MGYxZ25uNWJjc25qdmVpdWFzMHQxNmk0YnIgZ2l2ZXRoZXRoZGVudmVyQG0&tmsrc=givethethdenver%40gmail.com'
						/>
						<CalendarItem
							title='Public Goods Pizza Party'
							lecturer='Griff Green'
							date='FRI, MAR 3'
							time='17:00 - 20:00 MST'
							link='https://www.eventbrite.com/e/public-goods-pizza-party-registration-554833029527'
							calendarLink='https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=M2EzOGd2NXNmaHNqcTF0amN1YzFmYWNxNTkgZ2l2ZXRoZXRoZGVudmVyQG0&tmsrc=givethethdenver%40gmail.com'
						/>
						<CalendarItem
							title='Why DAOs will change the world'
							lecturer='Lauren Luz'
							date='Mar 04, 2023'
							time='10:20 - 10:40 MST'
							link='https://events.ethdenver.com/eden23/attendease/networking/experience/3185f05e-1283-47c4-b1cd-c456c3b6af3a/dd50c09c-f707-4389-a60a-75c2d37c2aa5'
							calendarLink='https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=MjAwN3Nwc2dvbGhuNWh2N3B1cjdiZDg5c24gZ2l2ZXRoZXRoZGVudmVyQG0&tmsrc=givethethdenver%40gmail.com'
						/>
						<CalendarItem
							title='DAO it like you mean it'
							lecturer='Lauren Luz'
							date='Feb 28, 2023'
							time='2:05 - 2:45pm MST'
							link='https://events.ethdenver.com/eden23/attendease/networking/experience/bf427728-b151-4edf-ab90-f501a3d84970/212d0aa6-f013-45af-8b31-f98155087c88'
							calendarLink='https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=NzNwdHI2ZmNrMHI5ZW8xc25rODUzdDhkMTUgZ2l2ZXRoZXRoZGVudmVyQG0&tmsrc=givethethdenver%40gmail.com'
						/>
						<CalendarItem
							title='Dissecting Sustainable DAO Governance and Effective Operations'
							lecturer='Griff Green'
							date='Feb 28, 2023'
							time='3:40PM MST'
							link='https://events.ethdenver.com/eden23/attendease/networking/experience/bf427728-b151-4edf-ab90-f501a3d84970/212d0aa6-f013-45af-8b31-f98155087c88'
							calendarLink='https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=NzBlNG85YTUyMGFucTI3c3M2MjBmM2YxMjUgZ2l2ZXRoZXRoZGVudmVyQG0&tmsrc=givethethdenver%40gmail.com'
						/>
					</Flex>
				</Calendar>
			</Row>
		</Wrapper>
	);
};

const Calendar = styled(Col)`
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
