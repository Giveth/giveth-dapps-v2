import { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
	brandColors,
	GLink,
	neutralColors,
	Overline,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import { useAppSelector } from '@/features/hooks';
import { MenuContainer } from '../menu/Menu.sc';
import { INotificationData } from '@/helpers/html';
import { NotificationBox } from './NotificationBox';
import Routes from '@/lib/constants/Routes';

const NotificationMenu = () => {
	const [isMounted, setIsMounted] = useState(false);
	const theme = useAppSelector(state => state.general.theme);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<NotifsMenuContainer isMounted={isMounted} theme={theme}>
			<NotificationsTitle styleType='Small'>
				NOTIFICATIONS
			</NotificationsTitle>
			<br />
			<br />

			{notifications
				.map(notification => (
					<>
						<NotificationBox
							key={notification.id}
							short={true}
							notification={notification}
						/>
						<br />
					</>
				))
				.slice(0, 5)}
			<br />
			<Link href={Routes.Notification} passHref>
				<AllNotificationsLink color={brandColors.pinky[500]}>
					All notifications
				</AllNotificationsLink>
			</Link>
		</NotifsMenuContainer>
	);
};

export default NotificationMenu;

const NotifsMenuContainer = styled(MenuContainer)`
	height: unset;
	overflow-y: auto;
`;

const NotificationsTitle = styled(Overline)`
	color: ${neutralColors.gray[700]};
`;

const AllNotificationsLink = styled(GLink)`
	display: flex;
	justify-content: center;
	color: ${brandColors.pinky[500]};
`;

const notifications: INotificationData[] = [
	{
		id: '1',
		icon: '',
		template: [
			{
				type: 'p',
				content: 'you staked',
			},
			{
				type: 'b',
				content: '$amount',
			},
			{
				type: 'p',
				content: 'on',
			},
			{
				type: 'a',
				content: '$farm',
				href: '$href1',
			},
		],
		metaData: {
			amount: '400.2',
			farm: 'givfarm',
			href1: '/givfarm',
		},
		time: '1661256071107',
		quote: 'hey bro, how are you?',
	},
	{
		id: '2',
		icon: '',
		template: [
			{
				type: 'p',
				content: 'you staked',
			},
			{
				type: 'b',
				content: '$amount',
			},
			{
				type: 'b',
				content: 'GIV tokens',
			},
			{
				type: 'p',
				content: 'on',
			},
			{
				type: 'a',
				content: '$farm',
				href: '$href',
			},
			{
				type: 'p',
				content: 'for',
			},
			{
				type: 'b',
				content: '$apr',
			},
			{
				type: 'b',
				content: 'APR',
			},
		],
		metaData: {
			amount: '400.2',
			farm: 'givfarm',
			href: '/givfarm',
			apr: '18.2%',
		},
		time: '1661256071107',
		quote: 'hey bro, how are you?\ngood, an you?',
	},

	{
		id: '3',
		icon: '',
		template: [
			{
				type: 'p',
				content: 'you staked',
			},
			{
				type: 'b',
				content: '$amount',
			},
			{
				type: 'p',
				content: 'on',
			},
			{
				type: 'a',
				content: '$farm',
				href: '$href1',
			},
		],
		metaData: {
			amount: '400.2',
			farm: 'givfarm',
			href1: '/givfarm',
		},
		time: '1661256071107',
		quote: 'hey bro, how are you?',
	},
	{
		id: '4',
		icon: '',
		template: [
			{
				type: 'p',
				content: 'you staked',
			},
			{
				type: 'b',
				content: '$amount',
			},
			{
				type: 'p',
				content: 'on',
			},
			{
				type: 'a',
				content: '$farm',
				href: '$href1',
			},
		],
		metaData: {
			amount: '400.2',
			farm: 'givfarm',
			href1: '/givfarm',
		},
		time: '1661256071107',
		quote: 'hey bro, how are you?',
	},
	{
		id: '5',
		icon: '',
		template: [
			{
				type: 'p',
				content: 'you staked',
			},
			{
				type: 'b',
				content: '$amount',
			},
			{
				type: 'p',
				content: 'on',
			},
			{
				type: 'a',
				content: '$farm',
				href: '$href1',
			},
		],
		metaData: {
			amount: '400.2',
			farm: 'givfarm',
			href1: '/givfarm',
		},
		time: '1661256071107',
		quote: 'hey bro, how are you?',
	},
	{
		id: '6',
		icon: '',
		template: [
			{
				type: 'p',
				content: 'you staked',
			},
			{
				type: 'b',
				content: '$amount',
			},
			{
				type: 'p',
				content: 'on',
			},
			{
				type: 'a',
				content: '$farm',
				href: '$href1',
			},
		],
		metaData: {
			amount: '400.2',
			farm: 'givfarm',
			href1: '/givfarm',
		},
		time: '1661256071107',
		quote: 'hey bro, how are you?',
	},
	{
		id: '7',
		icon: '',
		template: [
			{
				type: 'p',
				content: 'you staked',
			},
			{
				type: 'b',
				content: '$amount',
			},
			{
				type: 'p',
				content: 'on',
			},
			{
				type: 'a',
				content: '$farm',
				href: '$href1',
			},
		],
		metaData: {
			amount: '400.2',
			farm: 'givfarm',
			href1: '/givfarm',
		},
		time: '1661256071107',
		quote: 'hey bro, how are you?',
	},
	{
		id: '8',
		icon: '',
		template: [
			{
				type: 'p',
				content: 'you staked',
			},
			{
				type: 'b',
				content: '$amount',
			},
			{
				type: 'p',
				content: 'on',
			},
			{
				type: 'a',
				content: '$farm',
				href: '$href1',
			},
		],
		metaData: {
			amount: '400.2',
			farm: 'givfarm',
			href1: '/givfarm',
		},
		time: '1661256071107',
		quote: 'hey bro, how are you?',
	},
	{
		id: '9',
		icon: '',
		template: [
			{
				type: 'p',
				content: 'you staked',
			},
			{
				type: 'b',
				content: '$amount',
			},
			{
				type: 'p',
				content: 'on',
			},
			{
				type: 'a',
				content: '$farm',
				href: '$href1',
			},
		],
		metaData: {
			amount: '400.2',
			farm: 'givfarm',
			href1: '/givfarm',
		},
		time: '1661256071107',
		quote: 'hey bro, how are you?',
	},
	{
		id: '10',
		icon: '',
		template: [
			{
				type: 'p',
				content: 'you staked',
			},
			{
				type: 'b',
				content: '$amount',
			},
			{
				type: 'p',
				content: 'on',
			},
			{
				type: 'a',
				content: '$farm',
				href: '$href1',
			},
		],
		metaData: {
			amount: '400.2',
			farm: 'givfarm',
			href1: '/givfarm',
		},
		time: '1661256071107',
		quote: 'hey bro, how are you?',
	},
	{
		id: '11',
		icon: '',
		template: [
			{
				type: 'p',
				content: 'you staked',
			},
			{
				type: 'b',
				content: '$amount',
			},
			{
				type: 'p',
				content: 'on',
			},
			{
				type: 'a',
				content: '$farm',
				href: '$href1',
			},
		],
		metaData: {
			amount: '400.2',
			farm: 'givfarm',
			href1: '/givfarm',
		},
		time: '1661256071107',
		quote: 'hey bro, how are you?',
	},
	{
		id: '12',
		icon: '',
		template: [
			{
				type: 'p',
				content: 'you staked',
			},
			{
				type: 'b',
				content: '$amount',
			},
			{
				type: 'p',
				content: 'on',
			},
			{
				type: 'a',
				content: '$farm',
				href: '$href1',
			},
		],
		metaData: {
			amount: '400.2',
			farm: 'givfarm',
			href1: '/givfarm',
		},
		time: '1661256071107',
		quote: 'hey bro, how are you?',
	},
];
