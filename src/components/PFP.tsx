import { FC } from 'react';
import styled, { css } from 'styled-components';
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

export enum EPFPSize {
	SMALL,
	LARGE,
}

interface IPFPProps {
	pfpToken: IGiverPFPToken;
	size?: EPFPSize;
	className?: string;
}

export const PFP: FC<IPFPProps> = ({
	pfpToken,
	size = EPFPSize.SMALL,
	className,
}) => {
	return (
		<IconWithTooltip
			icon={
				<StyledImage
					className={className}
					src={convertIPFSToHTTPS(pfpToken.imageIpfs)}
					width={size === EPFPSize.LARGE ? 180 : 28}
					height={size === EPFPSize.LARGE ? 180 : 28}
					pfpsize={size}
					alt=''
					id='pfp-avatar'
				/>
			}
			direction='right'
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

interface IStyledImageProps {
	pfpsize?: EPFPSize;
}

const StyledImage = styled(Image)<IStyledImageProps>`
	transition: box-shadow 0.2s ease, transform 0.2s ease;
	border: 0.18 solid ${brandColors.mustard[500]};
	border-radius: 4px;
	box-shadow: 0px 0.76px 4.6px 1.14px rgba(225, 69, 141, 0.3);
	&:hover {
		transform: scale(1.2); // Adjust the scale value as desired
	}

	${props =>
		props.pfpsize === EPFPSize.LARGE &&
		css`
			border: 0.2754px solid ${brandColors.mustard[500]};
			box-shadow: 0px 1.15778px 6.9467px 1.73668px #e1458d;
			border-radius: 16px;
		`}
`;

const PFPTooltip = styled(Subline)`
	&:hover {
		color: ${brandColors.pinky[400]};
	}
`;
