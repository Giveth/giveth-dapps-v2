import GIVPowerHeader from './GIVPowerHeader';
import GIVPowerTable from './GIVPowerTable';
import NoBoost from '@/components/views/project/projectGIVPower/NoBoost';

const hasGivPower = false;

const ProjectGIVPowerIndex = () => {
	return (
		<>
			<GIVPowerHeader />
			{hasGivPower ? <GIVPowerTable /> : <NoBoost />}
		</>
	);
};

export default ProjectGIVPowerIndex;
