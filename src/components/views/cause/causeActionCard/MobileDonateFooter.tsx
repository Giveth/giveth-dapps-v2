import styled from 'styled-components';
import { CausePublicActions } from '@/components/views/cause/causeActionCard/CausePublicActions';
import { Shadow } from '@/components/styled-components/Shadow';

const MobileDonateFooter = () => {
	return (
		<MobileFooter>
			<CausePublicActions />
		</MobileFooter>
	);
};

const MobileFooter = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	position: fixed;
	padding: 16px 24px;
	bottom: 0;
	left: 0;
	background-color: white;
	width: 100%;
	z-index: 10;
	box-shadow: ${Shadow.Neutral[500]};
`;

export default MobileDonateFooter;
