import styled from 'styled-components';
import GetUpdates from '@/components/GetUpdates';
import GIVBacksHeader from '@/components/views/landings/GIVBacks/GIVBacksHeader';

const GIVBacksIndex = () => {
	return (
		<Wrapper>
			<GIVBacksHeader />
			<GetUpdates />
		</Wrapper>
	);
};

const Wrapper = styled.div``;

export default GIVBacksIndex;
