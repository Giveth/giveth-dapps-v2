import {
	IconEdit16,
	IconEye16,
	IconUpdate16,
	IconWalletOutline16,
	semanticColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { type FC, useState } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { useAccount, useSwitchChain } from 'wagmi';
import { Dropdown, EOptionType, IOption } from '@/components/Dropdown';
import { capitalizeAllWords } from '@/lib/helpers';
import { ModifyStreamModal } from './ModifyStreamModal/ModifyStreamModal';
import {
	IWalletRecurringDonation,
	ERecurringDonationStatus,
} from '@/apollo/types/types';
import { EndStreamModal } from './EndStreamModal';
import { ArchiveStreamModal } from './ArchiveStreamModal';
import config from '@/configuration';
import { slugToProjectDonate } from '@/lib/routeCreators';

interface IStreamActionButtonProps {
	donation: IWalletRecurringDonation;
	refetch: () => void;
}

export const StreamActionButton: FC<IStreamActionButtonProps> = ({
	donation,
	refetch,
}) => {
	const [showModify, setShowModify] = useState(false);
	const [showEnd, setShowEnd] = useState(false);
	const [showArchive, setShowArchive] = useState(false);
	const { chain } = useAccount();
	const { switchChain } = useSwitchChain();

	const chainId = chain?.id;

	const { formatMessage } = useIntl();
	const router = useRouter();

	const options: IOption[] =
		donation.status === ERecurringDonationStatus.ACTIVE
			? [
					{
						label: formatMessage({
							id: 'label.modify_recurring_donation',
						}),
						icon: <IconEye16 />,
						cb: () => setShowModify(true),
					},
					{
						type: EOptionType.SEPARATOR,
					},
					{
						label: formatMessage({
							id: 'label.end_recurring_donation',
						}),
						icon: <IconUpdate16 />,
						cb: () => setShowEnd(true),
						color: semanticColors.punch['500'],
					},
				]
			: donation.status === ERecurringDonationStatus.ENDED
				? [
						{
							label: formatMessage({
								id: 'label.start_new_donation',
							}),
							icon: <IconEdit16 />,
							cb: () =>
								router.push(
									slugToProjectDonate(donation.project.slug) +
										'?tab=recurring',
								),
						},
						{
							type: EOptionType.SEPARATOR,
						},
						{
							label: capitalizeAllWords(
								formatMessage({ id: 'label.archive_donation' }),
							),
							icon: <IconWalletOutline16 />,
							cb: () => setShowArchive(true),
							color: semanticColors.golden['500'],
						},
					]
				: [];

	const dropdownStyle = {
		padding: '4px 16px',
		borderRadius: '8px',
	};

	return options.length > 0 ? (
		<Actions
			onClick={() => {
				if (chainId !== config.OPTIMISM_NETWORK_NUMBER) {
					switchChain?.({
						chainId: config.OPTIMISM_NETWORK_NUMBER,
					});
				}
			}}
		>
			<Dropdown
				style={dropdownStyle}
				label=''
				options={options}
				stickToRight
			/>
			{showModify && (
				<ModifyStreamModal
					setShowModal={setShowModify}
					donation={donation}
					refetch={refetch}
				/>
			)}
			{showEnd && (
				<EndStreamModal
					setShowModal={setShowEnd}
					donation={donation}
					refetch={refetch}
				/>
			)}
			{showArchive && (
				<ArchiveStreamModal
					setShowModal={setShowArchive}
					donation={donation}
					refetch={refetch}
				/>
			)}
		</Actions>
	) : null;
};

const Actions = styled.div`
	cursor: pointer;
	border-radius: 8px;
	padding: 8px 10px;
	:hover {
		background-color: white;
	}
`;
