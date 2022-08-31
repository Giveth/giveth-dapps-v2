import { useState } from 'react';
import ToggleSwitch from '@/components/ToggleSwitch';

const ToggleReceiveNotifications = () => {
	const [isOn, setIsOn] = useState(false);
	return (
		<ToggleSwitch
			isOn={isOn}
			toggleOnOff={setIsOn}
			caption='I’d like to receive all notifications'
		/>
	);
};

export default ToggleReceiveNotifications;
