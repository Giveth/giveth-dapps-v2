import React, { FC, useRef, useState } from 'react';
import styled from 'styled-components';
import {
	neutralColors,
	IconChevronDown24,
	IconChevronUp24,
} from '@giveth/ui-design-system';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

const DropdownContainer = styled.div`
	position: relative;
	display: inline-block;
`;

const DropdownButton = styled.button`
	display: flex;
	flex-direction: row;
	align-items: center;
	background-color: ${neutralColors.gray[100]};
	color: black;
	padding: 10px;
	font-size: 16px;
	border-radius: 8px;
	border: 1px solid ${neutralColors.gray[400]};
	cursor: pointer;
`;

const DropdownContent = styled.div<{ $show: boolean }>`
	display: ${props => (props.$show ? 'block' : 'none')};
	position: absolute;
	background-color: #f9f9f9;
	min-width: 160px;
	box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
	z-index: 1;
`;

const DropdownItem = styled.a`
	color: black;
	padding: 12px 16px;
	text-decoration: none;
	display: block;
	cursor: pointer;
	&:hover {
		background: ${neutralColors.gray[300]};
	}
`;

const IconWrapper = styled.div`
	pointer-events: none;
	width: 24px;
	height: 24px;
`;

interface DropdownProps {
	items: any[];
	label: string;
	select: (item: number) => void;
	selection: any;
}

const expirationLabels = ['3 Days', '1 Week', '1 Month'];

export const Dropdown: FC<DropdownProps> = ({
	items,
	label,
	select,
	selection,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(prevShow => !prevShow);
	};

	const containerRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useOnClickOutside(
		() => setIsOpen(false),
		isOpen,
		dropdownRef,
		containerRef,
	);

	return (
		<DropdownContainer ref={containerRef}>
			<DropdownButton onClick={toggleDropdown}>
				{expirationLabels[selection] || label}
				<IconWrapper>
					{isOpen ? <IconChevronUp24 /> : <IconChevronDown24 />}
				</IconWrapper>
			</DropdownButton>
			<DropdownContent $show={isOpen} ref={dropdownRef}>
				{items.map((item, index) => (
					<DropdownItem
						onClick={() => {
							select!(index);
							setIsOpen(false);
						}}
						key={index}
					>
						{expirationLabels[index]}
					</DropdownItem>
				))}
			</DropdownContent>
		</DropdownContainer>
	);
};
