import { brandColors, Button, H6, Lead } from '@giveth/ui-design-system';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';
import { ContentSeparator, BtnContainer } from './VerificationIndex';

const BeforeStart = () => {
	return (
		<>
			<div>
				<H6 weight={700}>Before you start</H6>
				<Lead>
					<br />
					Giveth would like to offer you the opportunity to reward
					your contributors with GIVbacks! By applying for a verified
					project status, you will be able to make your project stand
					out and encourage donations.
					<br />
					<br />
					Once your project is verified, the givers who donate to your
					project will be rewarded with GIV tokens which they can use
					to participate in the GIVeconomy.
					<br />
					<br />
					The simple{' '}
					<ExternalLink
						href={links.VERIFICATION_DOCS}
						color={brandColors.pinky[500]}
						title='verification process'
					/>{' '}
					requires some additional information about your project and
					the intended impact of your organization. If you would like
					to apply to receive the &apos;Verified&apos; badge, empower
					more Givers and also give back to those who have helped you
					reach your goals, please fill out this form.
				</Lead>
			</div>
			<div>
				<ContentSeparator />
				<BtnContainer>
					<Button disabled label='<     PREVIOUS' />
					<Button label='NEXT     >' />
				</BtnContainer>
			</div>
		</>
	);
};

export default BeforeStart;
