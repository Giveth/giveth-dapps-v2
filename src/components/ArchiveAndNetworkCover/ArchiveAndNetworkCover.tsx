import { FC } from 'react';
import { useAccount } from 'wagmi';
import { ArchiveCover } from './ArchiveCover';
import { WrongNetworkCover } from './WrongNetworkCover';

interface IArchiveAndNetworkCoverProps {
	targetNetwork: number;
	isStream?: boolean;
	isArchived?: boolean;
	isExploited?: boolean;
}

export const ArchiveAndNetworkCover: FC<IArchiveAndNetworkCoverProps> = ({
	isStream,
	targetNetwork,
	isArchived,
	isExploited,
}) => {
	const { chain } = useAccount();
	const chainId = chain?.id;

	if (chainId === undefined || chainId !== targetNetwork)
		return <WrongNetworkCover targetNetwork={targetNetwork} />;

	return isArchived || isExploited ? (
		<ArchiveCover isStream={isStream} isExploited={isExploited} />
	) : null;
};
