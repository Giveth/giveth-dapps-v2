import { P, B, GLink, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { INotification } from '@/features/notification/notification.types';
import type { ReactNode } from 'react';

export const convertRawDataToHTML = (notification: INotification) => {
	const { metadata, notificationType } = notification;
	const { htmlTemplate } = notificationType;
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
				const href = metadata[template.href.substring(1)] || '';
				res.push(
					<StyledGlink key={idx} size='Big' href={href}>
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
