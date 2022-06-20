import React, { FC } from 'react';
import {
	B,
	brandColors,
	Button,
	Caption,
	H4,
	H5,
	H6,
	IconHelp,
	IconRocketInSpace32,
	IconSpark,
	Lead,
	neutralColors,
	OulineButton,
	Subline,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

import { Flex } from '../styled-components/Flex';
import { IconWithTooltip } from '../IconWithToolTip';

interface IGIVpowerDescCardProps {}

export const GIVpowerDescCard: FC<IGIVpowerDescCardProps> = () => {
	return (
		<>
			<RegenStreamContainer>
				<HeaderRow justifyContent='space-between' wrap={1}>
					<Flex gap='8px'>
						<LogoContainer>
							<IconRocketInSpace32 size={40} />
						</LogoContainer>
						<H5>Increase your reward</H5>
					</Flex>
				</HeaderRow>
				<Subtitle>Lock your tokens to get more GIVpower</Subtitle>
				<Box>
					<Flex gap='12px' alignItems='baseline'>
						<AverageLabel>Average multiplier</AverageLabel>
						<AverageValue>
							~x1
							<HelpContainer>
								<IconWithTooltip
									icon={<IconHelp size={16} />}
									direction={'right'}
								>
									<HelpToolTip>Fill Me!</HelpToolTip>
								</IconWithTooltip>
							</HelpContainer>
						</AverageValue>
					</Flex>
					<Flex justifyContent='space-between'>
						<Key>
							APR
							<HelpContainer>
								<IconWithTooltip
									icon={<IconHelp size={16} />}
									direction={'right'}
								>
									<HelpToolTip>
										This is you rate of return for this set
										of GIV tokens.
									</HelpToolTip>
								</IconWithTooltip>
							</HelpContainer>
						</Key>
						<Value>
							0%
							<ValueIcon>
								<IconSpark size={16} />
							</ValueIcon>
						</Value>
					</Flex>
					<Flex justifyContent='space-between'>
						<Key>
							Locked GIV
							<HelpContainer>
								<IconWithTooltip
									icon={<IconHelp size={16} />}
									direction={'right'}
								>
									<HelpToolTip>Fill Me!</HelpToolTip>
								</IconWithTooltip>
							</HelpContainer>
						</Key>
						<Value>0</Value>
					</Flex>
					<Flex justifyContent='space-between'>
						<Key>
							Available to lock
							<HelpContainer>
								<IconWithTooltip
									icon={<IconHelp size={16} />}
									direction={'right'}
								>
									<HelpToolTip>Fill Me!</HelpToolTip>
								</IconWithTooltip>
							</HelpContainer>
						</Key>
						<Value>0 GIV</Value>
					</Flex>
					<LastRow justifyContent='space-between'>
						<LastKey>
							GIVpower
							<HelpContainer>
								<IconWithTooltip
									icon={<IconHelp size={16} />}
									direction={'right'}
								>
									<HelpToolTip>Fill Me!</HelpToolTip>
								</IconWithTooltip>
							</HelpContainer>
						</LastKey>
						<Value>0</Value>
					</LastRow>
				</Box>
				<FooterRow wrap={1}>
					<OulineButton label='Lockup details' size='small' />
					<IncreaseButton
						label='Increase your reward'
						onClick={() => console.log('clicked')}
						buttonType='primary'
						disabled={false}
						size='small'
					/>
				</FooterRow>
			</RegenStreamContainer>
		</>
	);
};

const RegenStreamContainer = styled(Flex)`
	height: 488px;
	background-color: ${brandColors.giv[700]};
	border-radius: 8px;
	padding: 24px;
	position: relative;
	flex-direction: column;
	justify-content: space-between;
	overflow: hidden;
`;

const HeaderRow = styled(Flex)``;

const LogoContainer = styled.div`
	color: ${brandColors.mustard[500]};
`;

const Subtitle = styled(Lead)``;

const Box = styled(Flex)`
	border: 2px solid ${brandColors.giv[500]};
	border-radius: 8px;
	padding: 16px;
	flex-direction: column;
	gap: 16px;
	color: ${brandColors.giv['000']};
`;

const FooterRow = styled(Flex)`
	/* margin-top: 90px; */
	padding-top: 24px;
	justify-content: space-between;
	align-items: center;
`;

const IncreaseButton = styled(Button)`
	width: auto;
	padding-left: 32px;
	padding-right: 32px;
`;

const AverageLabel = styled(H6)`
	color: ${brandColors.giv[200]};
`;

const AverageValue = styled(H4)`
	position: relative;
`;

const Key = styled(Caption)`
	position: relative;
`;

const LastRow = styled(Flex)`
	padding-top: 16px;
	border-top: 2px solid ${brandColors.giv[500]};
`;

const LastKey = styled(B)`
	position: relative;
`;

const HelpContainer = styled.div`
	position: absolute;
	top: 1px;
	right: -24px;
	cursor: pointer;
	&:hover {
		color: ${brandColors.giv[200]};
	}
`;

const HelpToolTip = styled(Subline)`
	color: ${neutralColors.gray[100]};
	width: 160px;
`;

const Value = styled(B)`
	position: relative;
`;

const ValueIcon = styled.div`
	position: absolute;
	top: 3px;
	left: -18px;
	cursor: pointer;
	color: ${brandColors.mustard[500]};
	&:hover {
		color: ${brandColors.mustard[400]};
	}
`;
