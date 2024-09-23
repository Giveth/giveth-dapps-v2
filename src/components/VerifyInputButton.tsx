import {
	brandColors,
	Flex,
	IconEmptyCircle,
	semanticColors,
	IconCheckCircleFilled,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { Spinner } from './Spinner';

// import { Container } from './styles';

interface VerifyInputButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	isLoading?: boolean;
	verified?: boolean;
}

const VerifyInputButton: React.FC<VerifyInputButtonProps> = ({
	label,
	isLoading,
	verified,
	...props
}) => {
	return (
		<VerifyInputButtonWrapper type='button' {...props} $verified={verified}>
			<Flex $alignItems='center' gap='8px'>
				{!isLoading && !verified && <IconEmptyCircle />}
				{!isLoading && verified && <IconCheckCircleFilled />}
				{!!isLoading && <Spinner size={16} />}
				<span>{label}</span>
			</Flex>
		</VerifyInputButtonWrapper>
	);
};

export default VerifyInputButton;

type VerifyInputButtonWrapperProps = {
	$verified?: boolean;
};

const VerifyInputButtonWrapper = styled.button<VerifyInputButtonWrapperProps>`
	outline: none;
	cursor: pointer;
	background-color: ${({ $verified }) =>
		$verified ? 'transparent' : brandColors.giv[50]};
	border: 1px solid
		${({ $verified }) =>
			$verified ? semanticColors.jade[500] : brandColors.giv[50]};
	border-radius: 8px;
	padding: 3px 8px;

	span {
		color: ${({ $verified }) =>
			$verified ? semanticColors.jade[500] : brandColors.giv[500]};
		font-size: 10px;
		font-weight: 400;
		line-height: 13.23px;
		text-align: left;
	}

	svg {
		color: ${({ $verified }) =>
			$verified ? semanticColors.jade[500] : brandColors.giv[500]};
	}

	&:disabled {
		opacity: 0.5;
	}
`;
