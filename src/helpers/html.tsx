import {
	P,
	B,
	GLink,
	brandColors,
	IconProfile24,
	IconProfileCompleted24,
	IconAdminNotif24,
	IconFile24,
	IconPublish24,
	IconListed24,
	IconUnlisted24,
	IconDeactivated24,
	IconActivated24,
	IconFormSubmit24,
	IconRejected24,
	IconClaim24,
	IconDonation24,
	IconEmptyCircle24,
	IconHeartFilled24,
	IconStake24,
	IconUnstake24,
	IconVerifiedBadge24,
	IconNotificationOutline24,
	IconGIVBack,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { INotification } from '@/features/notification/notification.types';
import type { ReactNode } from 'react';

export const convertRawDataToHTML = (notification: INotification) => {
	const { metadata, notificationType } = notification;
	const { htmlTemplate } = notificationType;
	if (htmlTemplate[0].type === 'html') {
		return (
			<StyledHtml
				as='span'
				dangerouslySetInnerHTML={{
					__html: metadata['html'],
				}}
			/>
		);
	}
	const res: ReactNode[] = [];
	htmlTemplate.forEach((template: any, idx) => {
		const { content } = template;
		const temp = content?.startsWith('$')
			? metadata[content.substring(1)]
			: content;
		switch (template.type) {
			case 'p':
				res.push(
					<P key={idx} as='span'>
						{temp}
					</P>,
				);
				break;
			case 'b':
				res.push(
					<B key={idx} as='span'>
						{temp}
					</B>,
				);
				break;
			case 'a':
				const href = template.href.startsWith('$')
					? metadata[template.href.substring(1)]
					: template.href;
				res.push(
					<StyledGlink
						key={idx}
						size='Big'
						as='a'
						href={href}
						target='_blank'
					>
						{temp}
					</StyledGlink>,
				);
				break;
			case 'br':
				res.push(<br key={idx} />);
				break;
			default:
				res.push(
					<P as='span' key={idx}>
						{temp}
					</P>,
				);
				break;
		}
		res.push(' ');
	});
	return res;
};

const StyledGlink = styled(GLink)`
	font-weight: 700;
	transition: color 0.1s ease;
	&:hover {
		color: ${brandColors.pinky[500]};
	}
`;

const StyledHtml = styled(P)`
	*:first-child {
		margin-top: 4px;
	}
	a {
		color: ${brandColors.pinky[500]};
		transition: color 0.1s ease;
		&:hover {
			color: ${brandColors.pinky[800]};
		}
	}
`;

export function convertBackendIconsToComponents(icon: string) {
	switch (icon) {
		case 'IconProfile':
			return <IconProfile24 />;
		case 'IconProfileCompleted':
			return <IconProfileCompleted24 />;
		case 'IconAdminNotif':
			return <IconAdminNotif24 />;
		case 'IconFile':
			return <IconFile24 />;
		case 'IconPublish':
			return <IconPublish24 />;
		case 'IconListed':
			return <IconListed24 />;
		case 'IconUnlisted':
			return <IconUnlisted24 />;
		case 'IconDeactivated':
			return <IconDeactivated24 />;
		case 'IconActivated':
			return <IconActivated24 />;
		case 'IconFormSubmit':
			return <IconFormSubmit24 />;
		case 'IconRejected':
			return <IconRejected24 />;
		case 'IconVerifiedBadge':
			return <IconVerifiedBadge24 />;
		case 'IconClaim':
			return <IconClaim24 />;
		case 'IconEmptyCircle':
			return <IconEmptyCircle24 />;
		case 'IconStake':
			return <IconStake24 />;
		case 'IconUnstake':
			return <IconUnstake24 />;
		case 'IconGIVBack':
			return <IconGIVBack size={24} color='currentColor' />;
		case 'IconStake':
			return <IconStake24 />;
		case 'IconDonation':
			return <IconDonation24 />;
		case 'IconFile':
			return <IconFile24 />;
		case 'IconHeartFilled':
			return <IconHeartFilled24 />;
		default:
			return <IconNotificationOutline24 />;
	}
}
