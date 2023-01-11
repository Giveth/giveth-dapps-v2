import { Button, Container, H3, neutralColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';

const IntroBlock = () => {
	return (
		<Container>
			<IntroBlockContainer>
				<Flex justifyContent='space-around'>
					<IntroTitle>
						<H3 weight={700}>
							Giveth is <UnderlinedText>rewarding</UnderlinedText>{' '}
							and empowering those who give to projects, to
							society, and to the world!
						</H3>
						<ButtonsContainer gap='16px'>
							<Button label='Explore projects' />
							<Button
								buttonType='texty-secondary'
								label='Our mission'
							/>
						</ButtonsContainer>
					</IntroTitle>
					<div>Image</div>
				</Flex>
			</IntroBlockContainer>
		</Container>
	);
};

const IntroBlockContainer = styled.div`
	margin-top: 200px;
	background-color: ${neutralColors.gray[100]};
`;

const IntroTitle = styled.div`
	max-width: 500px;
`;

const UnderlinedText = styled.span`
	text-decoration: underline;
	text-decoration-skip-ink: none;
`;

const ButtonsContainer = styled(Flex)`
	margin-top: 16px;
`;

export default IntroBlock;
