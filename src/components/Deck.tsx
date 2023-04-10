import { useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { setShowFooter, setShowHeader } from '@/features/general/general.slice';
import { useAppDispatch } from '@/features/hooks';

const numberOfSlides = 41;

const DeckIndex = (props: { omittedSlides?: number[] }) => {
	const { omittedSlides } = props;
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(setShowFooter(false));
		dispatch(setShowHeader(false));
	}, []);

	const slidesArray: number[] = Array.from(
		{ length: numberOfSlides },
		(_, i) => i + 1,
	);

	return (
		<Wrapper>
			{slidesArray.map(slide => (
				<Image
					key={slide}
					src={'/images/deck-fundraising/Slide' + slide + '.webp'}
					alt={'deck-fundraising-' + slide}
					width={1280}
					height={720}
					style={{
						display: omittedSlides?.includes(slide)
							? 'none'
							: 'unset',
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

export default DeckIndex;
