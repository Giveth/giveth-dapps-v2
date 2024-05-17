import styled from 'styled-components';
import Image from 'next/image';
import { brandColors, FlexCenter } from '@giveth/ui-design-system';
import ExternalLink from '@/components/ExternalLink';
import Regen from '/public/images/regen-token.png';

const FundraisingBanner = () => {
	return (
		<Wrapper>
			<PStyled>
				<>The Giveth website is experiencing high traffic due to the </>
				<>
					<ExternalLink href='https://paragraph.xyz/@regen/introducing-regen'>
						<Purple>$REGEN token announcement.</Purple>
					</ExternalLink>
					<ImageStyled
						src={Regen}
						alt='Gitcoin Grants'
						width={24}
						height={24}
					/>
				</>
				<>You may experience slow loading times, we're working on it.</>
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
	background: ${brandColors.mustard[300]};
	z-index: 99;
	position: sticky;
`;

export default FundraisingBanner;
