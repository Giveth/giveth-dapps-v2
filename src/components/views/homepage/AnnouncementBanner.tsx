import styled from 'styled-components';
import Image from 'next/image';
import {
	brandColors,
	FlexCenter,
	semanticColors,
} from '@giveth/ui-design-system';
import ExternalLink from '@/components/ExternalLink';

const AnnouncementBanner = () => {
	return (
		<Wrapper>
			<PStyled>
				<>
					Try out our new Recurring Donations feature for a chance to
					to WIN PRIZES this summer! 🏆
				</>
				<>
					<ExternalLink href='https://blog.giveth.io/recurring-donation-rally-win-big-this-sumer-with-recurring-donations-on-giveth-092798f8b988'>
						<Purple>
							Read up on the contest details on the Giveth blog.
						</Purple>
					</ExternalLink>
				</>
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
	background: ${semanticColors.jade[100]};
	z-index: 99;
	position: sticky;
`;

export default AnnouncementBanner;
