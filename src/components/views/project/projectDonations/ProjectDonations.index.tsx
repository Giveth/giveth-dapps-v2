import styled from 'styled-components';
import { mediaQueries } from '@giveth/ui-design-system';
import { captureException } from '@sentry/nextjs';
import { useEffect, useState } from 'react';
import ProjectTotalFundCard from './ProjectTotalFundCard';
import ProjectDonationTable from './ProjectDonationTable';
import { client } from '@/apollo/apolloClient';
import { FETCH_PROJECT_DONATIONS } from '@/apollo/gql/gqlDonations';
import { EDonationStatus, ESortby, EDirection } from '@/apollo/types/gqlEnums';
import {
	IDonationsByProjectId,
	IDonationsByProjectIdGQL,
} from '@/apollo/types/gqlTypes';
import { showToastError } from '@/lib/helpers';
import { useProjectContext } from '@/context/project.context';

const donationsPerPage = 10;

const ProjectDonationsIndex = () => {
	const [donationInfo, setDonationInfo] = useState<IDonationsByProjectId>();

	const { projectData, isAdmin } = useProjectContext();
	const { id = '' } = projectData || {};

	useEffect(() => {
		if (!id) return;
		client
			.query({
				query: FETCH_PROJECT_DONATIONS,
				variables: {
					projectId: parseInt(id),
					skip: 0,
					take: donationsPerPage,
					status: isAdmin ? null : EDonationStatus.VERIFIED,
					orderBy: {
						field: ESortby.CREATIONDATE,
						direction: EDirection.DESC,
					},
				},
			})
			.then((res: IDonationsByProjectIdGQL) => {
				const donationsByProjectId = res.data.donationsByProjectId;
				setDonationInfo(donationsByProjectId);
			})
			.catch((error: unknown) => {
				showToastError(error);
				captureException(error, {
					tags: {
						section: 'fetchProjectDonation',
					},
				});
			});
	}, [id]);

	return (
		<Wrapper>
			<ProjectTotalFundCard />
			{donationInfo?.totalCount && donationInfo?.donations && (
				<ProjectDonationTable
					donations={donationInfo?.donations}
					totalDonations={donationInfo?.totalCount || 0}
				/>
			)}
		</Wrapper>
	);
};

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 100px;
	gap: 40px;
	${mediaQueries.desktop} {
		align-items: flex-start;
		flex-direction: row-reverse;
	}
`;

export default ProjectDonationsIndex;
