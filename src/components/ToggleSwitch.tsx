import styled from 'styled-components';
import { brandColors, neutralColors, P, Flex } from '@giveth/ui-design-system';
import { FC } from 'react';

interface IToggleButton {
	isOn: boolean;
	toggleOnOff: (isOn: boolean) => void;
	label: string;
	disabled?: boolean;
	className?: string;
}

const ToggleSwitch: FC<IToggleButton> = ({
	isOn,
	toggleOnOff,
	label,
	disabled,
	className,
}) => {
	const handleClick = () => {
		toggleOnOff(!isOn);
	};
	return (
		<Container
			onClick={handleClick}
			disabled={disabled}
			className={className}
		>
			<InputStyled checked={isOn} type='checkbox' />
			<Switch $isOn={isOn}>
				<Bullet $isOn={isOn} />
			</Switch>
			<Caption>{label}</Caption>
		</Container>
	);
};

const InputStyled = styled.input`
	opacity: 0;
	width: 0;
	height: 0;
`;

const Bullet = styled.div<{ $isOn: boolean }>`
	position: absolute;
	border-radius: 50%;
	width: 14px;
	height: 14px;
	background-color: ${brandColors.pinky[200]};
	border: 3px solid white;
	left: ${props => (props.$isOn ? '15px' : '1px')};
	transition: left 0.2s ease-in-out;
	top: 1px;
`;

const Switch = styled.span<{ $isOn: boolean }>`
	position: relative;
	width: 30px;
	height: 16px;
	flex-shrink: 0;
	padding-left: 1px;
	padding-right: 1px;
	border-radius: 50px;
	cursor: pointer;
	background-color: ${props =>
		props.$isOn ? brandColors.pinky[500] : neutralColors.gray[700]};
	transition: background-color 0.3s ease-in-out;
`;

const Caption = styled(P)`
	color: ${neutralColors.gray[800]};
`;

const Container = styled(Flex)<{ disabled?: boolean }>`
	gap: 8px;
	align-items: center;
	cursor: pointer;
	opacity: ${props => (props.disabled ? 0.3 : 1)};
`;

export default ToggleSwitch;
