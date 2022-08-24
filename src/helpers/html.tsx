import { P, B, GLink } from '@giveth/ui-design-system';
import type { ReactNode } from 'react';

export interface IRowDataTemplate {
	type: 'p' | 'b' | 'a' | string;
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
	icon: string;
	time: string;
	quote: string;
	isRead?: boolean;
}

export const convertRawDataToHTML = (RawData: IRowData) => {
	const { template, metaData } = RawData;
	const res: ReactNode[] = [];
	template.forEach((node: any) => {
		const c: string = node.content;
		const temp = c.startsWith('$') ? metaData[c.substring(1)] : c;
		switch (node.type) {
			case 'p':
				res.push(<P as='span'>{temp}</P>);
				break;
			case 'b':
				res.push(<B as='span'>{temp}</B>);
				break;
			case 'a':
				const href = metaData[node.href.substring(1)] || '';
				res.push(
					<GLink size='Big' href={href}>
						{temp}
					</GLink>,
				);
				break;
			default:
				res.push(<P as='span'>{temp}</P>);
				break;
		}
		res.push(' ');
	});
	return res;
};
