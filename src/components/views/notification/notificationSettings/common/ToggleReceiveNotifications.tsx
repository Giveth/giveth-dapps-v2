import { useState } from 'react';
import ToggleSwitch from '@/components/ToggleSwitch';

const ToggleReceiveNotifications = () => {
	const [isOn, setIsOn] = useState(false);
	return (
		<ToggleSwitch
			isOn={isOn}
			toggleOnOff={setIsOn}
			label='I’d like to receive all notifications'
		/>
	);
};

export default ToggleReceiveNotifications;
