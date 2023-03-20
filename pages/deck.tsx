import { useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { setShowFooter, setShowHeader } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';

const DeckRoute = () => {
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setShowFooter(false));
		dispatch(setShowHeader(false));
	}, []);

	const slidesArray = Array.from(Array(40).keys());

	return (
		<Wrapper>
			{slidesArray.map(slide => (
				<Image
					key={slide}
					src={
						'/images/deck-fundraising/Slide' + (slide + 1) + '.webp'
					}
					alt={'deck-fundraising-' + slide}
					width={1280}
					height={720}
					style={{
						display:
							slide === 17 || slide === 18 ? 'none' : 'unset',
					}}
				/>
			))}
		</Wrapper>
	);
};

const Wrapper = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	> img {
		width: 100%;
		height: auto;
	}
`;

export default DeckRoute;
