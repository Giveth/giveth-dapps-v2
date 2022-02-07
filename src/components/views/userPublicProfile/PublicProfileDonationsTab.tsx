import { client } from '@/apollo/apolloClient';
import { WALLET_DONATIONS } from '@/apollo/gql/gqlDonations';
import { IUserProjects } from '@/apollo/types/gqlTypes';
import { IWalletDonation, IProject } from '@/apollo/types/types';
import ProjectCard from '@/components/project-card/ProjectCard';
import { formatDate, smallFormatDate } from '@/lib/helpers';
import {
	B,
	brandColors,
	Container,
	neutralColors,
	P,
	SublineBold,
} from '@giveth/ui-design-system';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Row } from '../../styled-components/Grid';
import { ProjectsContainer } from '../projects/ProjectsIndex';
import { IUserPublicProfileView } from './UserPublicProfile.view';

const PublicProfileDonationsTab: FC<IUserPublicProfileView> = ({ user }) => {
	const [loading, setLoading] = useState(false);
	const [donations, setDonations] = useState<IWalletDonation[]>([]);
	useEffect(() => {
		if (!user) return;
		const fetchUserDonations = async () => {
			setLoading(true);
			const { data: userDonations } = await client.query({
				query: WALLET_DONATIONS,
				variables: { fromWalletAddresses: [user.walletAddress] },
				fetchPolicy: 'network-only',
			});
			setLoading(false);
			if (userDonations?.donationsFromWallets) {
				const donationsFromWallets: IWalletDonation[] =
					userDonations.donationsFromWallets;
				setDonations(donationsFromWallets);
			}
			console.log('userDonations', userDonations);
		};
		fetchUserDonations();
	}, [user]);

	return (
		<>
			{loading && <div>Loading</div>}
			<DonationTable donations={donations} />
		</>
	);
};

export default PublicProfileDonationsTab;

interface DonationTable {
	donations: IWalletDonation[];
}
const DonationTable: FC<DonationTable> = ({ donations }) => {
	return (
		<DonationTablecontainer>
			<B>Donated at</B>
			<B>Project</B>
			<B>Currency</B>
			<B>Amount</B>
			{donations.map(donation => (
				<>
					<P>{smallFormatDate(new Date(donation.createdAt))}</P>
					<B>{donation.project.title}</B>
					<SublineBold>{donation.currency}</SublineBold>
					<P>{donation.amount}</P>
				</>
			))}
		</DonationTablecontainer>
	);
};

const DonationTablecontainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 5fr 1fr 1fr;
`;
