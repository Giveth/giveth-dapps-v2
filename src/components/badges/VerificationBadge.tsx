import Image from 'next/image';

import { FlexCenter } from '../styled-components/Grid';
import TraceIcon from '/public//images/trace.svg';
import VerifiedIcon from '/public//images/verified.svg';
import { brandColors, Overline } from '@giveth/ui-design-system';
import styled from 'styled-components';

const VerificationBadge = (props: { verified?: boolean; trace?: boolean }) => {
	const { verified, trace } = props;
	const text = verified ? 'VERIFIED' : trace ? 'TRACE' : '';
	const icon = verified ? VerifiedIcon : trace ? TraceIcon : '';
	return (
		<Wrapper>
			<Image src={icon} alt='badge icon' />
			<Overline className='pl-2'>{text}</Overline>
		</Wrapper>
	);
};

const Wrapper = styled(FlexCenter)`
	height: 30px;
	background: ${brandColors.deep[900]};
	border-radius: 56px;
	color: white;
	padding: 0 12px 0 10px;
	margin-right: 8px;
`;

export default VerificationBadge;
