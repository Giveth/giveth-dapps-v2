import {
	B,
	H5,
	IconExternalLink24,
	neutralColors,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';
import CalendarBlack from '/public/images/calendar-black.svg';
import CalendarGray from '/public/images/calendar-gray.svg';
import ClockBlack from '/public/images/clock-black.svg';
import Image from 'next/image';
import { GhostButton } from '@/components/styled-components/Button';
import ExternalLink from '@/components/ExternalLink';

interface IProps {
	title: string;
	lecturer: string;
	date: string;
	time: string;
	link: string;
	calendarLink: string;
}

const CalendarItem: FC<IProps> = props => {
	const { title, lecturer, date, time, link, calendarLink } = props;
	return (
		<Wrapper>
			<H5 weight={700}>{title}</H5>
			<Lecturer>by {lecturer}</Lecturer>
			<Separator />
			<DateTime>
				<Image src={CalendarBlack} alt='Calendar black' />
				<B>{date}</B>
				<Image src={ClockBlack} alt='Clock black' />
				<B>{time}</B>
			</DateTime>
			<Buttons>
				<ExternalLink href={link}>
					<GhostButton
						label='LEARN MORE'
						size='large'
						icon={<IconExternalLink24 />}
					/>
				</ExternalLink>
				<ExternalLink href={calendarLink}>
					<GhostButton
						label='Add to calendar'
						size='large'
						color={neutralColors.gray[700]}
						icon={<Image src={CalendarGray} alt='Calendar black' />}
					/>
				</ExternalLink>
			</Buttons>
		</Wrapper>
	);
};

const Buttons = styled.div`
	display: flex;
	margin-top: 16px;
`;

const DateTime = styled.div`
	display: flex;
	gap: 16px;
	align-items: center;
	> img {
		margin-right: -8px;
	}
`;

const Separator = styled.div`
	width: 100%;
	height: 1px;
	background: ${neutralColors.gray[400]};
	margin: 16px 0;
`;

const Lecturer = styled(H5)`
	color: ${neutralColors.gray[700]};
	margin-top: 4px;
`;

const Wrapper = styled.div`
	color: ${neutralColors.gray[900]};
`;

export default CalendarItem;
