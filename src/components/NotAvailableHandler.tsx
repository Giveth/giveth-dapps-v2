import { brandColors } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { FC } from 'react';
import { useRouter } from 'next/router';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import { compareAddresses } from '@/lib/helpers';
import { useAppSelector } from '@/features/hooks';
import NotAvailable from '@/components/NotAvailable';
import Routes from '@/lib/constants/Routes';

interface IProps {
	isCancelled?: boolean;
	ownerAddress?: string;
	isProjectLoading?: boolean;
}

const NotAvailableHandler: FC<IProps> = ({
	ownerAddress,
	isCancelled,
	isProjectLoading,
}) => {
	const { isLoading, userData } = useAppSelector(state => state.user);
	const { formatMessage } = useIntl();
	const router = useRouter();
	const isEditRoute = router?.route.split('/').slice(-1)[0] === 'edit';
	const isVerificationRoute = router?.route.indexOf(Routes.Verification) > -1;
	const isCause = router?.route.indexOf(Routes.Cause) > -1;

	const isOwner = compareAddresses(userData?.walletAddress, ownerAddress);

	const messageId = isCause
		? 'label.cause.cause_not_available'
		: 'label.project_not_available';

	let description: string | JSX.Element = (
		<>
			{formatMessage({ id: messageId })}
			{isCancelled && (
				<>
					<br />
					{formatMessage({
						id: 'label.if_this_a_mistake',
					})}{' '}
					<ExternalLink
						color={brandColors.pinky[500]}
						href={links.DISCORD}
						title='Discord'
					/>
					.
				</>
			)}
		</>
	);

	if ((isEditRoute || isVerificationRoute) && !isOwner && ownerAddress) {
		description = formatMessage({
			id: `label.not_owner_${isEditRoute ? 'edit' : 'verification'}`,
		});
	}

	return (
		<NotAvailable
			isLoading={isProjectLoading || isLoading}
			description={description}
		/>
	);
};

export default NotAvailableHandler;
