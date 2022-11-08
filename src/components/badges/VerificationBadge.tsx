import Image from 'next/image';
import { IconVerifiedBadge, Overline } from '@giveth/ui-design-system';
import styled from 'styled-components';

import { useIntl } from 'react-intl';
import { FlexCenter } from '../styled-components/Flex';
import TraceIcon from '/public/images/trace.svg';

const VerificationBadge = (props: { verified?: boolean; trace?: boolean }) => {
	const { formatMessage } = useIntl();
	const { verified, trace } = props;
	const text = verified
		? formatMessage({ id: 'label.verified' })
		: trace
		? 'TRACE'
		: '';

	return (
		<Wrapper>
			{verified ? (
				<IconVerifiedBadge />
			) : trace ? (
				<Image src={TraceIcon} alt='badge icon' />
			) : null}
			<TextBadge styleType='Small'>{text}</TextBadge>
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
