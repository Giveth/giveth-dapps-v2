import {
	IconImage32,
	neutralColors,
	P,
	brandColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import Routes from '@/lib/constants/Routes';
import { FlexCenter } from '../styled-components/Flex';
import { CustomH5 } from './SetProfilePic';

export const NoPFP = () => {
	return (
		<>
			<CustomH5>Your Givers PFP NFTs</CustomH5>
			<NoNFTContainer>
				<FlexCenter direction='column'>
					<IconImage32 color={neutralColors.gray[500]} />
					<br />
					<P>
						This wallet address does not hold any Givers NFTs, yet.
					</P>
					<P>
						<MintLink
							target='_blank'
							rel='noopener noreferrer'
							href={Routes.NFT}
						>
							Learn more about the collection.
						</MintLink>
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

const MintLink = styled.a`
	max-width: fit-content;
	color: ${brandColors.pinky[500]};
`;
