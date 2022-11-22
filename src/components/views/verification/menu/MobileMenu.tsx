import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { B, neutralColors } from '@giveth/ui-design-system';
import Image from 'next/image';
import { useState } from 'react';
import { useVerificationData } from '@/context/verification.context';
import { Shadow } from '@/components/styled-components/Shadow';
import { StepsProgressBar } from '@/components/views/verification/Common';
import menuList from '@/components/views/verification/menu/menuList';
import MenuModal from '@/components/views/verification/menu/MenuModal';
import MenuIcon from '/public/images/menu/drawer_menu_black.svg';

const MobileMenu = () => {
	const [showMenu, setShowMenu] = useState(false);

	const { step, verificationData } = useVerificationData();
	const { project } = verificationData || {};
	const { title } = project || {};
	const { formatMessage } = useIntl();

	return (
		<>
			<Wrapper>
				<MenuSection onClick={() => setShowMenu(true)}>
					{menuList[step]}
					<Image src={MenuIcon} alt='Menu icon' />
				</MenuSection>
				<StatusSection>
					<B>{formatMessage({ id: 'label.verified_status_for' })}</B>
					<B>{title}</B>
					<StepsProgressBar />
				</StatusSection>
			</Wrapper>
			{showMenu && <MenuModal setShowModal={setShowMenu} />}
		</>
	);
};

const MenuSection = styled(B)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
`;

const StatusSection = styled.div`
	> :first-child {
		color: ${neutralColors.gray[700]};
		margin-bottom: 16px;
	}
	> :last-child {
		margin-top: 25px;
	}
`;

const Wrapper = styled.div`
	> * {
		background: white;
		border-radius: 16px;
		box-shadow: ${Shadow.Neutral[400]};
		padding: 24px;
		margin-bottom: 24px;
	}
`;

export default MobileMenu;
