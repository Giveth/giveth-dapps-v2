import {
	Overline,
	FlexCenter,
	brandColors,
	IconGIVBack,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';

export const GivBackBadge = () => {
	const { formatMessage } = useIntl();
	return (
		<Wrapper>
			<IconGIVBack color='white' />
			<TextBadge $styleType='Small'>
				{formatMessage({ id: 'label.isGivbackEligible' })}
			</TextBadge>
		</Wrapper>
	);
};

const Wrapper = styled(FlexCenter)`
	height: 30px;
	background: ${brandColors.giv[500]};
	border-radius: 56px;
	color: white;
	padding: 2px 12px 0 10px;
	justify-content: center;
	margin-right: 8px;
`;

const TextBadge = styled(Overline)`
	padding-left: 0.5rem;
	margin-right: 5px;
	text-transform: uppercase;
`;
