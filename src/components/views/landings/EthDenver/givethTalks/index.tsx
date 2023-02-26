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

const GivethTalks = () => {
	return (
		<Wrapper>
			<Talks>
				<H3 weight={700}>Giveth Talks</H3>
				<br />
				<br />
				<Lead>
					If you’d like to hear about our ambitious plans to Build the
					Future of Giving, check out these upcoming presentations at
					ETH Denver!
				</Lead>
				<ButtonStyled
					label='Add all to calendar'
					icon={<Image src={CalendarWhite} alt='Calendar black' />}
					size='small'
				/>
			</Talks>
			<Calendar>
				<CalendarItem
					title='Combating the Metacrisis'
					lecturer='Griff Green'
					date='Mar 03, 2023'
					time='13:00 - 13:15 MST'
				/>
				<CalendarItem
					title='Why DAOs will change the world'
					lecturer='Lauren Luz'
					date='Mar 04, 2023'
					time='10:20 - 10:40 MST'
				/>
			</Calendar>
		</Wrapper>
	);
};

const Calendar = styled.div`
	> :first-of-type {
		margin-bottom: 40px;
	}
`;

const ButtonStyled = styled(Button)`
	margin-top: 24px;
	> span {
		margin-right: 10px;
	}
`;

const Talks = styled.div`
	padding: 40px;
	background: ${brandColors.giv[50]};
	border-radius: 16px;
	max-width: 445px;
	height: fit-content;
`;

const Wrapper = styled.div`
	padding: 40px;
	margin: 0 auto;
	max-width: 1200px;
	display: flex;
	gap: 60px;
	color: ${neutralColors.gray[900]};
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

export default GivethTalks;
