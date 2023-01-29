import styled from 'styled-components';

export const OvalVerticalGradient = styled.div`
	position: absolute;
	background: radial-gradient(
		rgba(142, 45, 226, 0.6) 0%,
		rgba(74, 0, 224, 0.6)
	);
	filter: blur(80px);
	height: 477px;
	width: 340px;
	top: 20%;
	left: 20%;
`;

export const OvalHorizontalGradient = styled.div`
	position: absolute;
	background: radial-gradient(
		rgba(142, 45, 226, 0.6) 0%,
		rgba(74, 0, 224, 0.6)
	);
	filter: blur(80px);
	height: 300px;
	width: 500px;
	bottom: 20%;
	right: 20%;
`;
