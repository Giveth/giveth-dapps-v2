import styled from 'styled-components';
import { FlexCenter } from '@/components/styled-components/Flex';
import { WrappedSpinner } from '@/components/Spinner';

export default function LoadingVerification() {
	return (
		<Container>
			<WrappedSpinner size={250} />
		</Container>
	);
}

const Container = styled(FlexCenter)`
	height: 100%;
`;
