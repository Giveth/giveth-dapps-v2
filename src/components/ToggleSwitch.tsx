import styled from 'styled-components';
import { brandColors, neutralColors, P } from '@giveth/ui-design-system';
import { FC } from 'react';

interface IToggleButton {
	isOn: boolean;
	toggleOnOff: (isOn: boolean) => void;
	caption: string;
}

const ToggleSwitch: FC<IToggleButton> = ({ isOn, toggleOnOff, caption }) => {
	const handleClick = () => {
		toggleOnOff(!isOn);
	};
	return (
		<Container onClick={handleClick}>
			<InputStyled checked={isOn} type='checkbox' />
			<Switch isOn={isOn}>
				<Bullet isOn={isOn} />
			</Switch>
			<Caption>{caption}</Caption>
		</Container>
	);
};

const InputStyled = styled.input`
	opacity: 0;
	width: 0;
	height: 0;
`;

const Bullet = styled.div<{ isOn: boolean }>`
	position: absolute;
	border-radius: 50%;
	width: 14px;
	height: 14px;
	background: ${brandColors.pinky[200]};
	border: 3px solid white;
	left: ${props => (props.isOn ? '15px' : '1px')};
	transition: left 0.2s ease-in-out;
	top: 1px;
`;

const Switch = styled.span<{ isOn: boolean }>`
	position: relative;
	width: 30px;
	height: 16px;
	flex-shrink: 0;
	padding-left: 1px;
	padding-right: 1px;
	border-radius: 50px;
	cursor: pointer;
	background: ${props =>
		props.isOn ? brandColors.pinky[500] : neutralColors.gray[700]};
	transition: background 0.3s ease-in-out;
`;

const Caption = styled(P)`
	color: ${neutralColors.gray[800]};
`;

const Container = styled.div`
	display: flex;
	gap: 25px;
	align-items: center;
	cursor: pointer;
`;

export default ToggleSwitch;
