import Image from 'next/image';
import { H6 } from '@giveth/ui-design-system';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LightBulbIcon from '../../../../public/images/icons/lightbulb.svg';
import { ProjectGuidelineModal } from '@/components/modals/ProjectGuidelineModal';
import Routes from '@/lib/constants/Routes';

const Guidelines = () => {
	const [showGuidelineModal, setShowGuidelineModal] = useState(false);

	const router = useRouter();
	const isCreateMode = router.pathname.includes(Routes.CreateProject);

	useEffect(() => {
		if (isCreateMode) {
			setShowGuidelineModal(true);
		}
	}, []);

	return (
		<>
			<div onClick={() => setShowGuidelineModal(true)}>
				<Image src={LightBulbIcon} alt='Light Bulb Icon' />
				<H6>Submission guidelines</H6>
			</div>
			{showGuidelineModal && (
				<ProjectGuidelineModal setShowModal={setShowGuidelineModal} />
			)}
		</>
	);
};

export default Guidelines;
