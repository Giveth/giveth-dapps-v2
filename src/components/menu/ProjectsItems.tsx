import { GLink } from '@giveth/ui-design-system';
import Link from 'next/link';
import { FC } from 'react';
import { useIntl } from 'react-intl';

import { useAppSelector } from '@/features/hooks';
import links from '@/lib/constants/links';
import Routes from '@/lib/constants/Routes';
import { ItemRow } from './common';
import { Item } from './Item';

interface IProjectsItems {
	item: {
		name: string;
		label: string;
		url: string;
	};
}

export const projectsItems = {
	explore: [
		{
			name: 'Projects',
			url: Routes.AllProjects,
			label: 'label.projects',
		},
		{
			name: 'Causes',
			url: Routes.AllCauses,
			label: 'label.causes',
		},
		{
			name: 'Quadratic Funding',
			url: Routes.QFProjects,
			label: 'component.qf_middle_banner.title',
		},
	],
};

export const ProjectsItems = () => {
	return (
		<>
			{projectsItems.explore.map((item, idx) =>
				item.url !== links.FEEDBACK ? (
					<Link key={idx} href={item.url}>
						<ProjectsItem item={item} />
					</Link>
				) : (
					<a
						key={idx}
						href={item.url}
						target='_blank'
						rel='noreferrer noopener'
					>
						<ProjectsItem item={item} />
					</a>
				),
			)}
		</>
	);
};

export const ProjectsItem: FC<IProjectsItems> = ({ item }) => {
	const theme = useAppSelector(state => state.general.theme);
	const { formatMessage } = useIntl();

	return (
		<Item baseTheme={theme}>
			<ItemRow>
				<GLink>{formatMessage({ id: item.label })}</GLink>
			</ItemRow>
		</Item>
	);
};
