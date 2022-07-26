import { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import {
	Subline,
	H2,
	neutralColors,
	H5,
	brandColors,
} from '@giveth/ui-design-system';

import WalletIcon from '/public/images/wallet_donate_tab.svg';
import { Shadow } from '@/components/styled-components/Shadow';
import { IProject } from '@/apollo/types/types';

import { IconGnosisChain } from '@/components/Icons/GnosisChain';
import { IconEthereum } from '@/components/Icons/Eth';

import config from '@/configuration';

const { SECONDARY_NETWORK } = config;
const gnosisId = SECONDARY_NETWORK.id;

interface IAddressRender {
	item: any;
	index?: number;
	isSharedAddress?: boolean;
}

const ProjectTotalFundCard = (props: { project?: IProject }) => {
	const { totalDonations, addresses, traceCampaignId, totalTraceDonations } =
		props.project || {};

	const [sharedAddress, setSharedAddress] = useState<string | undefined>(
		undefined,
	);

	const renderAddress = ({
		item,
		index,
		isSharedAddress,
	}: IAddressRender) => {
		// we may need to change this in the future if we allow more networks config for addresses
		return (
			<BottomSection>
				<Image src={WalletIcon} alt='wallet icon' />
				<AddressContainer key={index}>
					{isSharedAddress ? (
						<>
							<Subline>{item.address}</Subline>
							<IconEthereum size={16} />
							<IconGnosisChain size={16} />
						</>
					) : (
						<>
							<Subline>{item.address}</Subline>
							{item.networkId === gnosisId ? (
								<IconGnosisChain size={16} />
							) : (
								// defaults to eth icon while we add more networks
								<IconEthereum size={16} />
							)}
						</>
					)}
				</AddressContainer>
			</BottomSection>
		);
	};

	const checkAddresses = () => {
		// We should change this check if more networks are added in the future
		const onlyAddresses = addresses?.map(item => {
			if (item.isRecipient) {
				return item.address;
			}
		});
		const addressesDuplicated = onlyAddresses?.some((item, index) => {
			return onlyAddresses.indexOf(item) != index;
		});
		if (addressesDuplicated) {
			setSharedAddress(addresses && addresses[0].address);
		}
	};

	useEffect(() => {
		checkAddresses();
	}, [props.project]);

	return (
		<Wrapper>
			<UpperSection>
				<div>
					<Subline>All time funding received</Subline>
					<TotalFund>{'$' + totalDonations}</TotalFund>
				</div>
				{!!traceCampaignId && (
					<div>
						<Subline>Funding from Traces</Subline>
						<FromTraces>{'$' + totalTraceDonations}</FromTraces>
					</div>
				)}
			</UpperSection>
			{sharedAddress
				? renderAddress({
						item: { address: sharedAddress },
						isSharedAddress: true,
				  })
				: addresses?.map((item, index) => {
						return renderAddress({ item, index });
				  })}
		</Wrapper>
	);
};

const Wrapper = styled.div`
	background: white;
	border-radius: 12px;
	box-shadow: ${Shadow.Neutral[400]};
	overflow: hidden;
`;

const UpperSection = styled.div`
	padding: 24px 21px 16px 21px;
	color: ${brandColors.deep[800]};
	text-transform: uppercase;
	display: flex;
	flex-wrap: wrap;
	gap: 40px 150px;
`;

const TotalFund = styled(H2)`
	font-weight: 700;
`;

const FromTraces = styled(H5)`
	margin-top: 12px;
	font-weight: 400;
`;

const BottomSection = styled.div`
	background: ${neutralColors.gray[200]};
	padding: 9.5px 22px;
	display: flex;
	gap: 8px;
	color: ${neutralColors.gray[500]};
`;

const AddressContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-around;
	gap: 8px;
`;

export default ProjectTotalFundCard;
