import styled from 'styled-components';
import GetUpdates from '@/components/GetUpdates';
import GIVBacksHeader from '@/components/views/landings/GIVBacks/GIVBacksHeader';
import YouKnowHow from '@/components/views/landings/GIVBacks/YouKnowHow';

const GIVBacksIndex = () => {
	return (
		<Wrapper>
			<GIVBacksHeader />
			<YouKnowHow />
			<GetUpdates />
		</Wrapper>
	);
};

const Wrapper = styled.div``;

export default GIVBacksIndex;
