import React, { useState } from 'react';
import styled from 'styled-components';
import GivSavingsAccountDetailsTabs from './GivSavingsAccountDetailsTabs';
import GIVsavingsBalanceChart from './GivSavingsCharts/GIVsavingsBalanceChart';

const ProjectGivSavingsIndex = () => {
	const [selectedChartTab, setSelectedChartTab] = useState(0);
	return (
		<div>
			<GivSavingsAccountDetailsTabs
				selectedChartTab={selectedChartTab}
				setSelectedChartTab={setSelectedChartTab}
			/>
			<TabsContainer>
				{selectedChartTab === 0 && <GIVsavingsBalanceChart />}
			</TabsContainer>
		</div>
	);
};

export default ProjectGivSavingsIndex;

const TabsContainer = styled.div`
	margin-top: 32px;
`;
