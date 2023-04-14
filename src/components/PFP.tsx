import { FC } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import {
	brandColors,
	Subline,
	IconExternalLink16,
} from '@giveth/ui-design-system';
import { convertIPFSToHTTPS } from '@/helpers/blockchain';
import { IconWithTooltip } from './IconWithToolTip';
import { IGiverPFPToken } from '@/apollo/types/types';
import ExternalLink from './ExternalLink';
import Routes from '@/lib/constants/Routes';
// import config from '@/configuration';
import { FlexCenter } from './styled-components/Flex';
interface IPFPProps {
	pfpToken: IGiverPFPToken;
	className?: string;
}

export const PFP: FC<IPFPProps> = ({ pfpToken, className }) => {
	return (
		<IconWithTooltip
			icon={
				<StyledImage
					className={className}
					src={convertIPFSToHTTPS(pfpToken.imageIpfs)}
					width={28}
					height={28}
					alt=''
					id='pfp-avatar'
				/>
			}
			direction='bottom'
		>
			<ExternalLink
				href={Routes.NFT}
				// when the collection is sold out we should replace the href with this:
				// href={
				// 	config.RARIBLE_ADDRESS +
				// 	'token/' +
				// 	pfpToken.id.replace('-', ':')
				// }
			>
				<PFPTooltip>
					<FlexCenter gap='8px'>
						Show off your support for Giveth with a unique Givers
						PFP NFT.
						<IconExternalLink16 />
					</FlexCenter>
				</PFPTooltip>
			</ExternalLink>
		</IconWithTooltip>
	);
};

const StyledImage = styled(Image)`
	transition: box-shadow 0.2s ease, transform 0.2s ease;
	border: 0.2754px solid ${brandColors.mustard[500]};
	/* Pink Shadow */
	box-shadow: 0px 0.76px 4.6px 1.14px rgba(225, 69, 141, 0.3);
	border-radius: 4px;

	&:hover {
		transform: scale(1.2); // Adjust the scale value as desired
		box-shadow: 0px 2px 8px 2px rgba(225, 69, 141, 0.3); // Adjust the shadow on hover if desired
	}
`;

const PFPTooltip = styled(Subline)`
	&:hover {
		color: ${brandColors.pinky[400]};
	}
`;
