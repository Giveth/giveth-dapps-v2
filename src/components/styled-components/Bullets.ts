import styled from 'styled-components';

export const Bullets = styled.ul<{ image?: string }>`
	padding-left: 17px;
	li {
		list-style-image: ${props =>
			props.image
				? `url(${props.image})`
				: `url(/images/bullets/bullet_purple.svg) !important`};
	}
	> li {
		margin-top: 16px;
	}
	a {
		text-decoration: underline;
	}
`;
