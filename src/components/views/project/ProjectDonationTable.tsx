import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
	neutralColors,
	brandColors,
	H6,
	Subline,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

import SearchBox from '@/components/SearchBox';
import { formatDateFromString, formatTxLink } from '@/lib/helpers';
import linkIcon from '/public/images/external_link.svg';
import donorProfileIcon from '/public/images/default_donor.svg';
import ExternalLink from '@/components/ExternalLink';
import { initializeApollo } from '@/apollo/apolloClient';
import { FETCH_PROJECT_DONATIONS } from '@/apollo/gql/gqlDonations';
import { IDonationsByProjectId } from '@/apollo/types/gqlTypes';
import Pagination from '@/components/Pagination';

const ProjectDonationTable = (props: {
	donations: IDonationsByProjectId;
	projectId: string;
}) => {
	const { donations, totalCount } = props.donations;
	const [activeTab, setActiveTab] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const [nDonations, setNDonations] = useState(donations);

	const firstRender = useRef(true);

	useEffect(() => {
		const fetchDonations = () => {
			initializeApollo()
				.query({
					query: FETCH_PROJECT_DONATIONS,
					variables: {
						projectId: parseInt(props.projectId),
						take: donations.length,
						skip: currentPage * donations.length,
					},
				})
				.then(
					(res: {
						data: { donationsByProjectId: IDonationsByProjectId };
					}) => {
						setNDonations(res.data.donationsByProjectId.donations);
					},
				)
				.catch(console.log);
		};

		if (firstRender.current) firstRender.current = false;
		else fetchDonations();
	}, [currentPage, donations.length, props.projectId]);

	return (
		<Wrapper>
			<UpperSection>
				<Tabs>
					<Tab
						onClick={() => setActiveTab(0)}
						className={activeTab === 0 ? 'active' : ''}
					>
						Donations
					</Tab>
					<Tab
						onClick={() => setActiveTab(1)}
						className={activeTab === 1 ? 'active' : ''}
					>
						Traces
					</Tab>
				</Tabs>
				{/*TODO implement search func*/}
				<SearchBox onChange={() => {}} value='' reset={() => {}} />
			</UpperSection>

			{activeTab === 0 && (
				<DonationSection>
					<Table>
						<thead>
							<TableRow>
								<TableHead>DATE</TableHead>
								<TableHead>DONOR</TableHead>
								<TableHead>AMOUNT</TableHead>
								<TableHead>TX</TableHead>
							</TableRow>
						</thead>
						<tbody>
							{(nDonations || donations).map(i => {
								return (
									<TableRow key={i.id}>
										<TableData>
											{formatDateFromString(i.createdAt)}
										</TableData>
										<TableDonor>
											<Image
												src={donorProfileIcon}
												alt='user image'
											/>
											<div>
												{i.user?.name ||
													i.fromWalletAddress}
											</div>
										</TableDonor>
										<TableData>
											<div>
												{i.amount + ' ' + i.currency}
											</div>
											<UsdValue>
												{i.valueUsd &&
													i.valueUsd + ' USD'}
											</UsdValue>
										</TableData>
										<td>
											<ExternalLink
												href={formatTxLink(
													i.transactionNetworkId,
													i.transactionId,
												)}
											>
												<Image
													src={linkIcon}
													alt='link icon'
												/>
											</ExternalLink>
										</td>
									</TableRow>
								);
							})}
						</tbody>
					</Table>
					<Pagination
						currentPage={currentPage}
						totalCount={totalCount}
						setPage={setCurrentPage}
						itemPerPage={donations.length}
					/>
				</DonationSection>
			)}
		</Wrapper>
	);
};

const Table = styled.table`
	margin-bottom: 32px;
	border-collapse: collapse;
`;

const UsdValue = styled(Subline)`
	color: ${neutralColors.gray[500]};
`;

const TableRow = styled.tr`
	border-bottom: 1px solid ${neutralColors.gray[300]};
	height: 58px;
`;

const TableData = styled.td`
	height: 58px;
	color: ${brandColors.deep[800]};
	font-size: 14px;
	line-height: 150%;
	padding-right: 35px;
`;

const TableDonor = styled(TableData)`
	color: ${brandColors.pinky[500]};
	display: flex;
	align-items: center;
	gap: 8px;
`;

const TableHead = styled.th`
	font-weight: 500;
	color: ${brandColors.giv[800]};
	font-size: 10px;
	line-height: 13px;
	text-align: left;
`;

const DonationSection = styled.div`
	margin-top: 30px;
`;

const Tab = styled(H6)`
	font-weight: 400;
	cursor: pointer;

	&.active {
		font-weight: 700;
	}
`;

const Tabs = styled.div`
	display: flex;
	gap: 16px;

	> h6:nth-of-type(2) {
		border-left: 2px solid ${neutralColors.gray[300]};
		padding-left: 16px;
	}
`;

const UpperSection = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 30px;
	align-items: center;
	max-width: 750px;
`;

const Wrapper = styled.div`
	margin-top: 50px;
`;

export default ProjectDonationTable;
