import styled from 'styled-components';
import Image from 'next/image';
import { brandColors, FlexCenter } from '@giveth/ui-design-system';
import ExternalLink from '@/components/ExternalLink';

const AnnouncementBanner = () => {
	return (
		<Wrapper>
			<PStyled>
				<>
					Have you donated on Giveth recently? Take 30 seconds and
					fill out the
				</>
				<div id='announcement-banner'>
					<ExternalLink href='https://giveth.typeform.com/donorsurvey2024'>
						<Purple>2024 Donor Survey</Purple>
					</ExternalLink>
				</div>
				<>to help us improve the Giveth platform.</>
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
