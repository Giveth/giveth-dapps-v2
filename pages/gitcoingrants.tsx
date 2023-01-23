import Link from 'next/link';
import { Button, H4, Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';
import useDetectDevice from '@/hooks/useDetectDevice';
import { mediaQueries } from '@/lib/constants/constants';

const GitcoinGrants = () => {
	const { isDesktop, isTablet } = useDetectDevice();
	const gitcoinGrantAlpha =
		'https://grant-explorer.gitcoin.co/#/round/1/0xd95a1969c41112cee9a2c931e849bcef36a16f4c/0xb746c0f648f9b930ea4568cf8741067a7fc7eb3928ac13cced8076212cf3cf37-0xd95a1969c41112cee9a2c931e849bcef36a16f4c';
	const refiGrant =
		'https://grant-explorer.gitcoin.co/#/round/1/0x1b165fe4da6bc58ab8370ddc763d367d29f50ef0/0x0d85d55a968bc9929c4f7ddfef2e6008b4ad8b77be65f7c08e89eab7cb760cc6-0x1b165fe4da6bc58ab8370ddc763d367d29f50ef0 ';
	return (
		<Container>
			<GitcoinContainer>
				<Link
					href={gitcoinGrantAlpha}
					target='_blank'
					rel='noopener noreferrer'
				>
					<img
						alt='gitcoin alpha is here'
						style={{ objectFit: 'cover' }}
						src={
							isTablet
								? '/images/banners/gitcoin-alpha-banner-md.png'
								: isDesktop
								? '/images/banners/gitcoin-alpha-banner_3.png'
								: '/images/banners/gitcoin-alpha-banner_2_mobile.png'
						}
					/>
				</Link>
			</GitcoinContainer>
			<FirstSection>
				<H4>We’d love your support in Gitcoin Grants</H4>
				<Lead>
					We are participating in the Gitcoin Program Alpha Round - a
					set of 3 Quadratic Funding grants rounds that will allocate
					a $1M total matching pool to Open Source, Ethereum
					Infrastructure, and Climate Solutions.
				</Lead>
				<Lead>
					{' '}
					With Quadratic Funding, number of contributors matters more
					than amount funded, so even donations as little as $1 can
					make huge difference! Support us with your donation on
					Gitcoin between Jan 18 and Feb 1 to help us Build the Future
					of Giving!
				</Lead>
			</FirstSection>
			<Section>
				<Description>
					<H4>Donate to Giveth in the OSS round</H4>
					<Lead>
						Giveth is a zero-fee crypto donation platform using web3
						to transform the way we fund public goods. Last quarter
						we launched decentralized project curation on our
						platform (GIVpower), and now we are setting our sights
						on NFTs, Quadratic Funding & DAOifying nonprofits.
					</Lead>
					<Link
						href={gitcoinGrantAlpha}
						target='_blank'
						rel='noopener noreferrer'
					>
						<Button
							size='small'
							buttonType='primary'
							label={'Donate Now'}
						/>
					</Link>
				</Description>
				<img
					alt='gitcoin alpha is here'
					src='/images/banners/giveth-gitcoin-alpha.png'
				/>
			</Section>
			<Section>
				<Description>
					<H4>
						Support ReFi DAO x Commons Stack in Climate Solutions
					</H4>
					<Lead>
						ReFi DAO and Commons Stack are raising $100k to
						kickstart a ReFi Commons “incubator”. Their plan is to
						accelerate the growth of local startup communities by
						helping them build and launch their own bottom-up
						regenerative economies.
					</Lead>
					<Link
						href={refiGrant}
						target='_blank'
						rel='noopener noreferrer'
					>
						<Button
							size='small'
							buttonType='primary'
							label={'Donate Now'}
						/>
					</Link>
				</Description>
				<img
					alt='gitcoin alpha is here'
					src='/images/banners/refi-gitcoin-alpha.png'
				/>
			</Section>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	background: white;
	align-items: center;
	text-align: left;
	padding: 30px;

	${mediaQueries.laptopS} {
		margin: 160px 40px 40px;
		padding: 80px;
	}
`;

const GitcoinContainer = styled.div`
	display: flex;
	position: relative;
	cursor: pointer;
	border-radius: 12px;
	flex-direction: column;
	text-align: left;
	align-items: center;
	margin: 64px 32px;
	object-fit: contain;
	img {
		border-radius: 12px;
		width: 100%;
	}
	${mediaQueries.laptopS} {
		img {
			width: 1500px;
		}
	}
	${mediaQueries.tablet} {
		img {
			width: 100%;
		}
	}
`;

const Section = styled.div`
	display: flex;
	justify-content: space-between;
	flex-direction: column-reverse;
	margin: 60px 0;
	gap: 30px;
	img {
		object-fit: contain;
		width: 100%;
	}
	${mediaQueries.laptopS} {
		flex-direction: row;
		img {
			width: 460px;
		}
	}
`;

const FirstSection = styled.div`
	display: flex;
	align-items: flex-start;
	flex-direction: column;
	max-width: 1500px;
	gap: 20px;
`;

const Description = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
	max-width: 1000px;
	button {
		margin: 20px 0 0 0;
		width: 100%;
	}
	${mediaQueries.laptopS} {
		button {
			margin: 20px 0 0 0;
			width: 500px;
		}
	}
`;

export default GitcoinGrants;
