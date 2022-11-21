import { createContext, ReactNode, useState } from 'react';
import { IPowerBoostingWithUserGIVpower } from '@/components/views/project/projectGIVPower';

interface IBoostersData {
	powerBoostings: IPowerBoostingWithUserGIVpower[];
	totalPowerBoosting: string;
	totalCount: number;
}

const ProjectContext = createContext({});

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
	const [boostersData, setBoostersData] = useState<IBoostersData>();
	const [isBoostingsLoading, setIsBoostingsLoading] = useState(false);

	return (
		<ProjectContext.Provider
			value={{
				boostersData,
				setBoostersData,
				isBoostingsLoading,
				setIsBoostingsLoading,
			}}
		>
			{children}
		</ProjectContext.Provider>
	);
};
