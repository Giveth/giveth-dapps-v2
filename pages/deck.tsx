import { useEffect } from 'react';
import styled from 'styled-components';
import { Container } from '@giveth/ui-design-system';
import { setShowFooter, setShowHeader } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';

const deckPDFUrl =
	'https://giveth.mypinata.cloud/ipfs/QmRZvjuUR8DWowN6GZTWz6wfoqSdkdBsYm2gesHqN8j82v';

const DeckRoute = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setShowFooter(false));
		dispatch(setShowHeader(false));
	}, []);

	return (
		<Wrapper>
			<object
				data={deckPDFUrl}
				type='application/pdf'
				width='100%'
				height='100%'
			>
				<ContainerStyled>
					Link to the PDF <a href={deckPDFUrl}>here!</a>
				</ContainerStyled>
			</object>
		</Wrapper>
	);
};

const ContainerStyled = styled(Container)`
	margin-top: 200px;
	> a {
		color: blue;
		font-weight: bold;
	}
`;

const Wrapper = styled.div`
	height: 99.5vh;
`;

export default DeckRoute;
