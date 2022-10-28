import { P, B, GLink } from '@giveth/ui-design-system';
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
					<GLink key={idx} size='Big' href={href}>
						{temp}
					</GLink>,
				);
				break;
			case 'br':
				res.push(<br />);
				break;
			default:
				res.push(<P as='span'>{temp}</P>);
				break;
		}
		res.push(' ');
	});
	return res;
};
