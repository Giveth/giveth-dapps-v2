import { useRouter } from 'next/router';
import { brandColors, Lead, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import React from 'react';
import { useIntl } from 'react-intl';
import Routes from '@/lib/constants/Routes';

const DoneContent = () => {
	const { formatMessage } = useIntl();
	const router = useRouter();
	const isCause =
		router.query.tab === 'causes' ||
		router.pathname === '/cause/[causeIdSlug]';
	return (
		<>
			<Lead>
				{formatMessage({
					id: isCause
						? 'label.cause.cause_deactivated'
						: 'label.project_deactivated',
				})}
			</Lead>
			<RedirectLink
				onClick={() =>
					router.push(isCause ? Routes.AllCauses : Routes.AllProjects)
				}
			>
				{formatMessage({
					id: isCause
						? 'label.cause.go_to_causes'
						: 'label.go_to_projects',
				})}
			</RedirectLink>
			<RedirectLink onClick={() => router.push(Routes.MyAccount)}>
				{formatMessage({ id: 'label.back_to_my_account' })}
			</RedirectLink>
		</>
	);
};

const RedirectLink = styled(P)`
	display: block;
	margin-top: 8px;
	color: ${brandColors.pinky[500]};
	cursor: pointer;
`;

export default DoneContent;
