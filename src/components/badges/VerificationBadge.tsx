import { IconVerifiedBadge, Overline } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { FlexCenter } from '../styled-components/Flex';

const VerificationBadge = () => {
	const { formatMessage } = useIntl();
	return (
		<Wrapper>
			<IconVerifiedBadge />
			<TextBadge styleType='Small'>
				{formatMessage({ id: 'label.verified' })}
			</TextBadge>
		</Wrapper>
	);
};

const Wrapper = styled(FlexCenter)`
	height: 30px;
	background: rgba(9, 17, 57, 0.6);
	border-radius: 56px;
	color: white;
	padding: 0 12px 0 10px;
	margin-right: 8px;
`;

const TextBadge = styled(Overline)`
	padding-left: 0.5rem;
	margin-right: 5px;
	text-transform: uppercase;
`;

export default VerificationBadge;
