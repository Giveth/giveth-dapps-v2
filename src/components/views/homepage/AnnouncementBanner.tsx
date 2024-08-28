import styled from 'styled-components';
import Image from 'next/image';
import { brandColors, FlexCenter } from '@giveth/ui-design-system';
import ExternalLink from '@/components/ExternalLink';
import gitcoin from '/public/images/gitcoin-grants.png';

const AnnouncementBanner = () => {
	return (
		<Wrapper>
			<PStyled>
				<>
					Donate to Giveth in Gitcoin Grants 21! We are participating
					in 4 QF rounds on Gitcoin.
				</>
				<ImageStyled
					src={gitcoin}
					alt='Gitcoin Grants 21'
					width={20}
					height={20}
				/>
				<div id='announcement-banner'>
					<ExternalLink href='https://x.com/Giveth/status/1823057210643296578'>
						<Purple>Find links to all the rounds</Purple>
					</ExternalLink>
				</div>
				<>and consider making a donation to support our work.</>
			</PStyled>
		</Wrapper>
	);
};

const PStyled = styled.div`
	display: flex;
	gap: 4px;
	@media (max-width: 768px) {
		flex-direction: column;
	}
`;

const Purple = styled.div`
	color: ${brandColors.giv[500]};
`;

const ImageStyled = styled(Image)`
	@media (max-width: 768px) {
		display: none;
	}
`;

const Wrapper = styled(FlexCenter)`
	flex-wrap: wrap;
	padding: 16px;
	text-align: center;
	gap: 4px;
	background: ${brandColors.giv[100]};
	z-index: 99;
	position: sticky;
`;

export default AnnouncementBanner;
