import { FC } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { brandColors } from '@giveth/ui-design-system';
import { convertIPFSToHTTPS } from '@/helpers/blockchain';
interface IPFPProps {
	imageIpfs: string;
	className?: string;
}

export const PFP: FC<IPFPProps> = ({ imageIpfs, className }) => {
	return (
		<StyledImage
			className={className}
			src={convertIPFSToHTTPS(imageIpfs)}
			width={24}
			height={24}
			alt=''
			id='pfp-avatar'
		/>
	);
};

const StyledImage = styled(Image)`
	transition: box-shadow 0.2s ease;
	border: 0.2754px solid ${brandColors.mustard[500]};
	/* Pink Shadow */
	box-shadow: 0px 0.76px 4.6px 1.14px rgba(225, 69, 141, 0.3);
	border-radius: 4px;
`;
