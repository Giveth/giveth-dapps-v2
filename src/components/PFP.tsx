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
import config from '@/configuration';
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
					width={size === EPFPSize.LARGE ? 135 : 24}
					height={size === EPFPSize.LARGE ? 135 : 24}
					PFPsize={size}
					alt=''
					id='pfp-avatar'
				/>
			}
			direction='bottom'
		>
			<ExternalLink
				href={
					config.RARIBLE_ADDRESS +
					'token/' +
					pfpToken.id.replace('-', ':')
				}
			>
				<PFPTooltip>
					<FlexCenter gap='8px'>
						View on Rarible <IconExternalLink16 />
					</FlexCenter>
				</PFPTooltip>
			</ExternalLink>
		</IconWithTooltip>
	);
};

interface IStyledImageProps {
	PFPsize?: EPFPSize;
}

const StyledImage = styled(Image)<IStyledImageProps>`
	transition: box-shadow 0.2s ease;
	border: 0.2754px solid ${brandColors.mustard[500]};
	box-shadow: 0px 0.76px 4.6px 1.14px rgba(225, 69, 141, 0.3);
	border-radius: 4px;

	${props =>
		props.PFPsize === EPFPSize.LARGE &&
		css`
			box-shadow: 0px 1.15778px 6.9467px 1.73668px #e1458d;
			border-radius: 16px;
		`}
`;

const PFPTooltip = styled(Subline)`
	&:hover {
		color: ${brandColors.pinky[400]};
	}
`;
