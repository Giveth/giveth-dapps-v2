import styled from 'styled-components';
import { useRouter } from 'next/router';
import { brandColors, FlexCenter } from '@giveth/ui-design-system';
import { FormattedMessage } from 'react-intl';
import Routes from '@/lib/constants/Routes';

const VerifyEmailBanner = () => {
	const router = useRouter();
	return (
		<Wrapper>
			<PStyled>
				<FormattedMessage
					id='label.email_verify_banner'
					values={{
						button: chunks => (
							<button
								type='button'
								onClick={() => {
									router.push({ pathname: Routes.MyAccount });
								}}
							>
								{chunks}
							</button>
						),
					}}
				/>
			</PStyled>
		</Wrapper>
	);
};

const PStyled = styled.div`
	display: flex;
	gap: 4px;
	@media (max-width: 768px) {
		flex-direction: column;
	}

	& button {
		background: none;
		border: none;
		padding: 0;
		font-size: 16px;
		color: ${brandColors.giv[500]};
		cursor: pointer;
	}
`;

const Wrapper = styled(FlexCenter)`
	flex-wrap: wrap;
	padding: 16px;
	text-align: center;
	gap: 4px;
	background: ${brandColors.mustard[200]};
	z-index: 99;
	position: sticky;
`;

export default VerifyEmailBanner;
