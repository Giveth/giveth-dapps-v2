import styled from 'styled-components';

export const Bullets = styled.ul<{ image?: string }>`
	padding-left: 17px;
	> li {
		margin-top: 16px;
		list-style-image: ${props =>
			props.image
				? `url(${props.image})`
				: `url(/images/bullets/bullet_purple.svg) !important`};
	}
	a {
		text-decoration: underline;
	}
`;

export const OrderedBullets = styled.ol`
	padding-left: 17px;
	> li {
		padding-left: 10px;
		margin-top: 16px;
	}
	a {
		text-decoration: underline;
	}
`;
