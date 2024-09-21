import styled from 'styled-components';
import { brandColors, neutralColors, P, Flex } from '@giveth/ui-design-system';
import { FC } from 'react';

type TSizes = 'small' | 'medium';
type TTheme = 'default' | 'purple-gray';

interface IToggleButton {
	isOn: boolean;
	toggleOnOff: (isOn: boolean) => void;
	label: string;
	disabled?: boolean;
	className?: string;
	size?: TSizes;
	theme?: TTheme;
}

const ToggleSwitch: FC<IToggleButton> = ({
	isOn,
	toggleOnOff,
	label,
	disabled,
	className,
	size,
	theme,
}) => {
	const handleClick = () => {
		toggleOnOff(!isOn);
	};
	return (
		<Container
			onClick={handleClick}
			$disabled={disabled}
			className={className}
		>
			<InputStyled checked={isOn} type='checkbox' onChange={() => {}} />
			<Switch size={size} theme={theme} $isOn={isOn}>
				<Bullet size={size} theme={theme} $isOn={isOn} />
			</Switch>
			<Caption size={size} className={isOn ? 'active' : ''}>
				{label}
			</Caption>
		</Container>
	);
};

const InputStyled = styled.input`
	opacity: 0;
	width: 0;
	height: 0;
`;

const Bullet = styled.div<{ $isOn: boolean; size?: TSizes; theme?: TTheme }>`
	position: absolute;
	border-radius: 50%;
	width: ${props => (props.size === 'small' ? '10px' : '14px')};
	height: ${props => (props.size === 'small' ? '10px' : '14px')};
	background-color: ${props =>
		props.theme === 'purple-gray' ? 'white' : brandColors.pinky[200]};
	border: 3px solid white;
	left: ${({ $isOn, size }) =>
		$isOn
			? size === 'small'
				? '12px'
				: '15px'
			: size === 'small'
				? '2px'
				: '1px'};
	transition: left 0.2s ease-in-out;
	top: ${props => (props.size === 'small' ? '2px' : '1px')};
`;

const Switch = styled.span<{ $isOn: boolean; size?: TSizes; theme?: TTheme }>`
	position: relative;
	width: ${props => (props.size === 'small' ? '24px' : '30px')};
	height: ${props => (props.size === 'small' ? '14px' : '16px')};
	flex-shrink: 0;
	padding-left: 1px;
	padding-right: 1px;
	border-radius: 50px;
	cursor: pointer;
	background-color: ${props =>
		props.$isOn
			? props.theme === 'purple-gray'
				? brandColors.giv[500]
				: brandColors.pinky[500]
			: props.theme === 'purple-gray'
				? neutralColors.gray[300]
				: neutralColors.gray[700]};
	transition: background-color 0.3s ease-in-out;
`;

const Caption = styled(P)<{ size?: TSizes }>`
	color: ${neutralColors.gray[800]};
	font-weight: 500;
	font-size: ${props => (props.size === 'small' ? '14px' : '16px')};
`;

const Container = styled(Flex)<{ $disabled?: boolean }>`
	pointer-events: ${props => (props.$disabled ? 'none' : 'auto')};
	gap: 8px;
	align-items: center;
	cursor: ${props => (props.$disabled ? 'default' : 'pointer')};
	opacity: ${props => (props.$disabled ? 0.3 : 1)};
`;

export default ToggleSwitch;
