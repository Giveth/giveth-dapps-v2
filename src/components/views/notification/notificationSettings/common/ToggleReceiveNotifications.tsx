import { useState } from 'react';
import ToggleButton from '@/components/ToggleButton';

const ToggleReceiveNotifications = () => {
	const [isOn, setIsOn] = useState(false);
	return (
		<ToggleButton
			isOn={isOn}
			toggleOnOff={setIsOn}
			caption='I’d like to receive all notifications'
		/>
	);
};

export default ToggleReceiveNotifications;
