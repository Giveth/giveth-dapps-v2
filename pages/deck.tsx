import { useEffect } from 'react';
import styled from 'styled-components';
import { setShowFooter, setShowHeader } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';

const deckPDFUrl =
	'https://docs.google.com/gview?embedded=true&url=https://giveth.mypinata.cloud/ipfs/QmRZvjuUR8DWowN6GZTWz6wfoqSdkdBsYm2gesHqN8j82v';

const DeckRoute = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setShowFooter(false));
		dispatch(setShowHeader(false));
	}, []);

	return (
		<Wrapper>
			<iframe
				width='100%'
				height='100%'
				src={deckPDFUrl}
				title='PDF View'
			/>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	height: 100vh;
	overflow: hidden;
`;

export default DeckRoute;
