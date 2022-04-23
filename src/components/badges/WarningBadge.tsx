import Image from 'next/image';
import WarningIcon from '../../../public/images/icons/warning_filled.svg';

const WarningBadge = () => {
	return <Image src={WarningIcon} alt='Warning icon' />;
};

export default WarningBadge;
