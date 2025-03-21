import {
	IconArchive16,
	IconEdit16,
	IconTrash16,
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
import { slugToProjectDonate } from '@/lib/routeCreators';

interface IStreamActionButtonProps {
	donation: IWalletRecurringDonation;
	refetch: () => void;
	recurringNetworkId: number;
}

export const StreamActionButton: FC<IStreamActionButtonProps> = ({
	donation,
	refetch,
	recurringNetworkId,
}) => {
	const [showModify, setShowModify] = useState(false);
	const [showEnd, setShowEnd] = useState(false);
	const [showArchive, setShowArchive] = useState(false);
	const { chain } = useAccount();
	const { switchChain } = useSwitchChain();

	const chainId = chain?.id;

	const { formatMessage } = useIntl();
	const router = useRouter();

	const options: IOption[] = !donation.isArchived
		? donation.status === ERecurringDonationStatus.ACTIVE
			? [
					{
						label: formatMessage({
							id: 'label.modify_recurring_donation',
						}),
						icon: <IconEdit16 />,
						cb: () => setShowModify(true),
					},
					{
						type: EOptionType.SEPARATOR,
					},
					{
						label: formatMessage({
							id: 'label.end_recurring_donation',
						}),
						icon: <IconTrash16 />,
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
									slugToProjectDonate(
										donation.project.slug,
										true,
									),
								),
						},
						{
							type: EOptionType.SEPARATOR,
						},
						{
							label: capitalizeAllWords(
								formatMessage({ id: 'label.archive_donation' }),
							),
							icon: <IconArchive16 />,
							cb: () => setShowArchive(true),
							color: semanticColors.golden['500'],
						},
					]
				: []
		: [];

	const dropdownStyle = {
		padding: '4px 16px',
		borderRadius: '8px',
	};

	return options.length > 0 ? (
		<Actions
			onClick={() => {
				if (recurringNetworkId !== chainId) {
					switchChain?.({
						chainId: recurringNetworkId,
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
					recurringNetworkId={recurringNetworkId}
				/>
			)}
			{showEnd && (
				<EndStreamModal
					setShowModal={setShowEnd}
					donation={donation}
					refetch={refetch}
					recurringNetworkId={recurringNetworkId}
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
