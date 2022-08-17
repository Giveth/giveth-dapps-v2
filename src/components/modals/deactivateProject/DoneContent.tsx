import { useRouter } from 'next/router';
import { brandColors, Lead, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import React from 'react';
import Routes from '@/lib/constants/Routes';

const DoneContent = () => {
	const router = useRouter();
	return (
		<>
			<Lead>
				Your project was successfully deactivated. Thank you for using
				Giveth.
			</Lead>
			<RedirectLink onClick={() => router.push(Routes.Projects)}>
				Go to projects
			</RedirectLink>
			<RedirectLink onClick={() => router.push(Routes.MyAccount)}>
				Back to My account
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
