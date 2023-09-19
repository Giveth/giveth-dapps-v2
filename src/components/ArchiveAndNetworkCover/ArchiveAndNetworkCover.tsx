import { FC } from 'react';
import { useChainId } from 'wagmi';
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
	const chainId = useChainId();

	return chainId === undefined || chainId !== targetNetwork ? (
		<WrongNetworkCover targetNetwork={targetNetwork} />
	) : isArchived || isExploited ? (
		<ArchiveCover isStream={isStream} isExploited={isExploited} />
	) : null;
};
