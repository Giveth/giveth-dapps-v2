import { P, B, GLink } from '@giveth/ui-design-system';
import type { ReactNode } from 'react';

export interface IRowDataTemplate {
	type: 'p' | 'b' | 'a' | 'br' | string;
	content: string;
	href?: string;
}

export interface IRowDataMetaData {
	[key: string]: string;
}

export interface IRowData {
	template: IRowDataTemplate[];
	metaData: IRowDataMetaData;
}

export interface INotificationData extends IRowData {
	id: string;
	icon: string;
	time: string;
	quote: string;
	isRead?: boolean;
}

export const convertRawDataToHTML = (RawData: IRowData) => {
	const { template, metaData } = RawData;
	const res: ReactNode[] = [];
	template.forEach((node: any, idx) => {
		const c: string = node.content;
		const temp = c.startsWith('$') ? metaData[c.substring(1)] : c;
		switch (node.type) {
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
				const href = metaData[node.href.substring(1)] || '';
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
