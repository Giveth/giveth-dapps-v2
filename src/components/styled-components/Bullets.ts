import styled from 'styled-components';

export const Bullets = styled.ul<{ image?: string }>`
	padding-left: 17px;
	list-style-image: ${props =>
		props.image
			? `url(${props.image})`
			: `url(/images/bullets/bullet_purple.svg)`};
	> li {
		margin-top: 16px;
	}
`;
