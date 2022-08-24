import styled from 'styled-components';
import { brandColors, neutralColors, P } from '@giveth/ui-design-system';
import { FC } from 'react';

interface IToggleButton {
	isOn: boolean;
	toggleOnOff: (isOn: boolean) => void;
	caption: string;
}

const ToggleButton: FC<IToggleButton> = ({ isOn, toggleOnOff, caption }) => {
	const handleClick = () => {
		toggleOnOff(!isOn);
	};
	return (
		<Container>
			<Button onClick={handleClick} isOn={isOn}>
				<Bullet isOn={isOn} />
			</Button>
			<Caption>{caption}</Caption>
		</Container>
	);
};

const Bullet = styled.div<{ isOn: boolean }>`
	border-radius: 50%;
	width: 14px;
	height: 14px;
	background: ${brandColors.pinky[200]};
	border: 3px solid white;
	float: ${props => (props.isOn ? 'right' : 'left')};
`;

const Button = styled.button<{ isOn: boolean }>`
	width: 30px;
	height: 16px;
	padding-left: 1px;
	padding-right: 1px;
	border-radius: 50px;
	border: unset;
	background: ${props =>
		props.isOn ? brandColors.pinky[500] : neutralColors.gray[700]};
`;

const Caption = styled(P)`
	color: ${neutralColors.gray[800]};
`;

const Container = styled.div`
	display: flex;
	gap: 25px;
	align-items: center;
`;

export default ToggleButton;
