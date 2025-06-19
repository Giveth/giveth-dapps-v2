import {
	Caption,
	IconEye16,
	semanticColors,
	Flex,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

const CauseOwnerBanner = () => {
	return (
		<Wrapper gap='16px' $alignItems='center'>
			<IconEye16 />
			<Caption>
				As the cause owner, only you can see your cause in this view
			</Caption>
		</Wrapper>
	);
};

export default CauseOwnerBanner;

const Wrapper = styled(Flex)`
	padding: 16px;
	background-color: ${semanticColors.blueSky[100]};
	margin-bottom: 16px;
	color: ${semanticColors.blueSky[600]};
	border: 1px solid ${semanticColors.blueSky[600]};
	border-radius: 8px;
`;
