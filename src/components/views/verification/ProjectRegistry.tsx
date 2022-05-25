import { H6, Lead, neutralColors, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import RadioTitle from '../donate/RadioTitle';

export default function ProjectRegistry() {
	return (
		<>
			<H6 weight={700}>Project registry</H6>
			<br />
			<RadioSectionContainer>
				<RadioSectionTitle>
					Is your project part of a registered non-profit
					organization?
				</RadioSectionTitle>
				<RadioSectionSubTitle>
					Having obtained non-profit status is not a requirement but
					it is helpful for the verification process
				</RadioSectionSubTitle>
				<div style={{ display: 'flex', gap: '160px' }}>
					<RadioTitle
						title='Yes'
						toggleRadio={() => null}
						isSelected={true}
					/>
					<RadioTitle
						title='No'
						toggleRadio={() => null}
						isSelected={false}
					/>
				</div>
			</RadioSectionContainer>
		</>
	);
}

const RadioSectionContainer = styled.div`
	width: 100%;
	background-color: ${neutralColors.gray[200]};
	border-radius: 16px;
	padding: 16px 24px;
`;
const RadioSectionTitle = styled(Lead)`
	color: ${neutralColors.gray[900]};
	margin-bottom: 8px;
`;

const RadioSectionSubTitle = styled(P)`
	color: ${neutralColors.gray[700]};
	margin-bottom: 8px;
`;
