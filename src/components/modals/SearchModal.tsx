import React, { FC } from 'react';
import styled from 'styled-components';
import { H6, Lead } from '@giveth/ui-design-system';
import { Modal } from './Modal';
import { IModal } from '@/types/common';
import { useModalAnimation } from '@/hooks/useModalAnimation';
import { Col, Container, Row } from '../Grid';
import { Flex } from '../styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';

export const SearchModal: FC<IModal> = ({ setShowModal }) => {
	const { isAnimating, closeModal } = useModalAnimation(setShowModal);

	return (
		<Modal closeModal={closeModal} isAnimating={isAnimating} fullScreen>
			<SearchModalContainer>
				<SearchBox>
					<H6>Find awesome projects on Giveth</H6>
					<div>search bar</div>
				</SearchBox>
			</SearchModalContainer>
			<Row>
				<Col xs={12} sm={4}>
					<Lead size='large'>Quick links</Lead>
					<Lead>Top ranking projects</Lead>
				</Col>
			</Row>
		</Modal>
	);
};

const SearchModalContainer = styled(Container)`
	padding-top: 132px;
	padding-bottom: 80px;
`;

const SearchBox = styled(Flex)`
	flex-direction: column;
	gap: 16px;
	${mediaQueries.tablet} {
		width: 600px;
	}
	margin: auto;
`;
