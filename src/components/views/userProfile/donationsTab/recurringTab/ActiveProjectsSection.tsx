import { H5, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useState } from 'react';
import { Flex } from '@/components/styled-components/Flex';
import ToggleSwitch from '@/components/ToggleSwitch';

export const ActiveProjectsSection = () => {
	const [showArchive, setShowArchive] = useState(false);
	return (
		<Wrapper>
			<Flex justifyContent='space-between'>
				<H5 weight={900}>Active projects</H5>
				<Flex gap='24px'>
					<StyledToggleSwitch
						isOn={showArchive}
						label='Switch to Archive Donations'
						toggleOnOff={() => setShowArchive(archive => !archive)}
					/>
				</Flex>
			</Flex>
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	gap: 12px;
	background-color: ${neutralColors.gray[100]};
	padding: 24px;
	border-radius: 12px;
`;

const StyledToggleSwitch = styled(ToggleSwitch)`
	flex-direction: row-reverse;
`;
