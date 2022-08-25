import { FC } from 'react';
import { Lead } from '@giveth/ui-design-system';
import Image from 'next/image';
import styled from 'styled-components';
import { SectionSubtitle } from './common.sc';
import { GrayBarTiny } from '@/components/views/notification/notification.sc';
import ArrowUp from '/public/images/arrow_up_black.svg';
import ArrowDown from '/public/images/arrow_down_black.svg';

interface ISectionHeader {
	title: string;
	description: string;
	isOpen?: boolean;
	onClick?: () => void;
}

const SectionHeader: FC<ISectionHeader> = props => {
	const { title, description, isOpen, onClick } = props;
	const isOpenable = typeof onClick === 'function';
	return (
		<>
			<Container isOpenable={isOpenable} onClick={onClick}>
				<div>
					<Lead size='large'>{title}</Lead>
					<SectionSubtitle>{description}</SectionSubtitle>
				</div>
				{isOpenable && (
					<div>
						<Image src={isOpen ? ArrowDown : ArrowUp} alt='arrow' />
					</div>
				)}
			</Container>
			{isOpen && <GrayBarTiny />}
		</>
	);
};

const Container = styled.div<{ isOpenable: boolean }>`
	display: flex;
	justify-content: space-between;
	cursor: ${({ isOpenable }) => (isOpenable ? 'pointer' : 'default')};
`;

export default SectionHeader;
