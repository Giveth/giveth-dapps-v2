import {
	IconImage32,
	neutralColors,
	P,
	brandColors,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import styled from 'styled-components';
import Routes from '@/lib/constants/Routes';
import { FlexCenter } from '../styled-components/Flex';
import { CustomH5 } from './SetProfilePic';

export const NoPFP = () => {
	return (
		<>
			<CustomH5>Your Unique Giveth’s PFP Artwork</CustomH5>
			<NoNFTContainer>
				<FlexCenter direction='column'>
					<IconImage32 color={neutralColors.gray[500]} />
					<br />
					<P>Sorry!!</P>
					<P>
						This wallet address does not have a unique Giveth’s NFT
						Yet.
					</P>
					<P>
						<MintLink href={Routes.NFT}>Mint </MintLink>
						yours now on the NFT minter page.
					</P>
				</FlexCenter>
			</NoNFTContainer>
		</>
	);
};

const NoNFTContainer = styled(FlexCenter)`
	flex-direction: column;
	border: 1px dotted ${neutralColors.gray[400]};
	margin: 24px 0 16px 0;
	padding: 64px 20px;
	color: ${brandColors.deep[500]};
	img {
		margin: 0 0 30px 0;
	}
	span {
		cursor: pointer;
		color: ${brandColors.pinky[500]};
	}
`;

const MintLink = styled(Link)`
	max-width: fit-content;
	color: ${brandColors.pinky[500]};
`;
