import {
	H2,
	brandColors,
	Lead,
	D3,
	deviceSize,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';

import PartnershipsCard from './PartnershipsCard';
import { mediaQueries } from '@/lib/constants/constants';
import { Arc } from '@/components/styled-components/Arc';
import { PartnershipArray, IPartner } from '@/content/Partnerships';

const PartnershipsIndex = () => {
	const { formatMessage } = useIntl();

	function sortPartners(x: IPartner, y: IPartner) {
		return x.title.localeCompare(y.title);
	}

	const sortedPartnerships = PartnershipArray.sort(sortPartners);

	return (
		<div style={{ position: 'relative', overflow: 'hidden' }}>
			<MustardArc />
			<MustardDot />
			<PurpleArc />
			<Wrapper>
				<Title>
					{formatMessage({ id: 'component.title.partnerships' })}
				</Title>
				<Caption>
					{formatMessage({ id: 'label.we_have_many_partnerships' })}
				</Caption>
				<PartnershipsContainer>
					<OurPartners>
						{formatMessage({
							id: 'label.our_partners_and_friends',
						})}
					</OurPartners>
					{sortedPartnerships.map((partner: IPartner) => (
						<PartnershipsCard
							key={partner.title}
							description={formatMessage({
								id: partner.description,
							})}
							link={partner.link}
							icon={partner.icon}
							title={partner.title}
						/>
					))}
				</PartnershipsContainer>
			</Wrapper>
		</div>
	);
};

const OurPartners = styled(H2)`
	display: flex;
	align-items: center;
	text-align: left;
	padding-right: 45px;
	margin: 16px 0;

	${mediaQueries.tablet} {
		height: 393px;
		margin: 0;
		width: 326px;
	}
`;

const PartnershipsContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 24px;
	margin-top: 150px;
	justify-content: center;
`;

const MustardArc = styled(Arc)`
	border-width: 90px;
	border-color: transparent transparent ${brandColors.mustard[500]}
		transparent;
	top: 100px;
	right: -230px;
	width: 450px;
	height: 450px;
	transform: rotate(31deg);
	z-index: 0;
`;

const MustardDot = styled(Arc)`
	border-width: 50px;
	border-color: ${brandColors.mustard[500]};
	top: 235px;
	right: 150px;
	width: 100px;
	height: 100px;
	z-index: 0;
`;

const PurpleArc = styled(Arc)`
	border-width: 100px;
	border-color: ${brandColors.giv[500]} ${brandColors.giv[500]} transparent
		transparent;
	top: 650px;
	left: -450px;
	width: 700px;
	height: 700px;
	transform: rotate(45deg);
	z-index: 0;
	opacity: 0.2;
`;

const Caption = styled(Lead)`
	max-width: 368px;
	margin: 0 auto;
`;

const Title = styled(D3)`
	margin-bottom: 24px;
	@media only screen and (max-width: ${deviceSize.tablet}px) {
		font-size: 3.5rem;
	}
`;

const Wrapper = styled.div`
	color: ${brandColors.giv[700]};
	text-align: center;
	position: relative;
	padding: 190px 18px 85px;
	${mediaQueries.tablet} {
		padding: 190px 149px;
	}
`;

export default PartnershipsIndex;
