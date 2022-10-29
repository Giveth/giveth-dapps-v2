import { FormattedMessage } from 'react-intl';
import Routes from '@/lib/constants/Routes';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';

const faqContent = (formatMessage: any) => {
	return {
		General: [
			{
				question: 'page.faq.what_is_blockchain',
				answer: (
					<>
						<FormattedMessage id='page.faq.what_is_blockchain.content' />
					</>
				),
			},
			{
				question: 'page.faq.what_is_ethereum',
				answer: (
					<>
						<FormattedMessage id='page.faq.what_is_ethereum.content.one' />
						<br />
						<br /> <FormattedMessage id='label.from' />{' '}
						<ExternalLink
							href='https://ethereum.org/en/what-is-ethereum/'
							title='Ethereum.org'
						/>{' '}
					</>
				),
			},
			{
				question: 'page.faq.what_is_torus',
				answer: (
					<>
						<FormattedMessage id='page.faq.what_is_torus.content.one' />{' '}
						<a
							href='https://metamask.io/'
							target='_blank'
							rel='noopener noreferrer'
						>
							Metamask{' '}
						</a>
						<FormattedMessage id='page.faq.what_is_torus.content.two' />{' '}
						<a
							href='https://docs.tor.us'
							target='_blank'
							rel='noopener noreferrer'
						>
							<FormattedMessage id='page.faq.what_is_torus.content.three' />
						</a>
						.{' '}
					</>
				),
			},
			{
				question: 'page.faq.what_is_the_difference_betwee_btc_eth',
				answer: (
					<>
						<FormattedMessage id='page.faq.what_is_the_difference_betwee_btc_eth.content' />
						<br />
						<br /> <FormattedMessage id='label.from' />{' '}
						<a
							href='https://www.cryptocompare.com/coins/guides/what-s-the-difference-between-bitcoin-btc-and-ethereum-eth'
							target='_blank'
							rel='noopener noreferrer'
						>
							cryptocompare.com
						</a>
						.
					</>
				),
			},
			{
				question: 'page.faq.why_donate_crypto',
				answer: (
					<FormattedMessage id='page.faq.why_donate_crypto.content' />
				),
			},
			{
				question: 'page.faq.does_the_irs_recognize_crypto_donations',
				answer: (
					<FormattedMessage id='page.faq.does_the_irs_recognize_crypto_donations.content' />
				),
			},
		],
		Giveth: [
			{
				question: 'page.faq.what_is_giveth',
				answer: (
					<>
						<FormattedMessage id='page.faq.what_is_giveth.content.one' />{' '}
						<b>
							<FormattedMessage id='label.building_the_future_of_giving' />
						</b>{' '}
						<FormattedMessage id='page.faq.what_is_giveth.content.two' />{' '}
						<a
							href='https://giveth.io/'
							target='_blank'
							rel='noopener noreferrer'
						>
							Giveth.io
						</a>{' '}
						<FormattedMessage id='label.and_the.fem' />{' '}
						<a
							href='https://giveth.io/giveconomy'
							target='_blank'
							rel='noopener noreferrer'
						>
							GIVeconomy
						</a>
						. <br />
						<FormattedMessage id='page.faq.what_is_giveth.content.three' />
					</>
				),
			},
			{
				question: 'page.faq.how_is_giveth_funder',
				answer: (
					<>
						<FormattedMessage id='page.faq.how_is_giveth_funder.content.one' />{' '}
						(
						<a
							href='https://panvala.com/'
							target='_blank'
							rel='noopener noreferrer'
						>
							Panvala
						</a>
						,{' '}
						<a
							href='https://gitcoin.co/'
							target='_blank'
							rel='noopener noreferrer'
						>
							Gitcoin
						</a>
						)
						<FormattedMessage id='page.faq.how_is_giveth_funder.content.two' />{' '}
						<ExternalLink
							href={links.SUPPORT_US}
							title={formatMessage({
								id: 'label.donating_to_our_project',
							})}
						/>
						.
					</>
				),
			},
			{
				question:
					'page.faq.is_giveth_recognized_as_an_official_charity',
				answer: (
					<FormattedMessage id='page.faq.is_giveth_recognized_as_an_official_charity.content' />
				),
			},
			{
				question: 'page.faq.is_my_donation_tx_deductible',
				answer: (
					<FormattedMessage id='page.faq.is_my_donation_tx_deductible.content' />
				),
			},
			{
				question: 'page.faq.where_can_i_see_how_giveth_spends',
				answer: (
					<>
						<FormattedMessage id='page.faq.where_can_i_see_how_giveth_spends.content.one' />
						<ul>
							<li>
								<a
									href='https://aragon.1hive.org/#/nrgiv/'
									target='_blank'
									rel='noopener noreferrer'
								>
									<b>nrGIV</b>
								</a>{' '}
								<FormattedMessage id='page.faq.where_can_i_see_how_giveth_spends.content.two' />
							</li>
							<li>
								<a
									href='https://gardens.1hive.org/#/xdai/garden/0xb25f0ee2d26461e2b5b3d3ddafe197a0da677b98'
									target='_blank'
									rel='noopener noreferrer'
								>
									<b>GIVgarden</b>
								</a>{' '}
								<FormattedMessage id='page.faq.where_can_i_see_how_giveth_spends.content.three' />
							</li>
							<li>
								<FormattedMessage id='page.faq.where_can_i_see_how_giveth_spends.content.four' />{' '}
								<a
									href='https://gnosis-safe.io/app/eth:0xf924fF0f192f0c7c073161e0d62CE7635114e74f/balances'
									target='_blank'
									rel='noopener noreferrer'
								>
									<b>Mainnet</b>
								</a>{' '}
								<FormattedMessage id='label.and' />{' '}
								<a
									href='https://gnosis-safe.io/app/gno:0xf924fF0f192f0c7c073161e0d62CE7635114e74f/balances'
									target='_blank'
									rel='noopener noreferrer'
								>
									<b>Gnosis Chain</b>
								</a>{' '}
								<FormattedMessage id='page.faq.where_can_i_see_how_giveth_spends.content.five' />
							</li>
							<li>
								<FormattedMessage id='page.faq.where_can_i_see_how_giveth_spends.content.six' />{' '}
								<a
									href='https://gnosis-safe.io/app/eth:0x4D9339dd97db55e3B9bCBE65dE39fF9c04d1C2cd/balances'
									target='_blank'
									rel='noopener noreferrer'
								>
									<b>Mainnet</b>
								</a>{' '}
								<FormattedMessage id='label.and' />{' '}
								<a
									href='https://gnosis-safe.io/app/gno:0x4D9339dd97db55e3B9bCBE65dE39fF9c04d1C2cd/balances'
									target='_blank'
									rel='noopener noreferrer'
								>
									<b>Gnosis Chain</b>
								</a>{' '}
								<FormattedMessage id='page.faq.where_can_i_see_how_giveth_spends.content.seven' />
							</li>
						</ul>
					</>
				),
			},
			{
				question: 'page.faq.are_there_fees_for_creating_a_project',
				answer: (
					<>
						<FormattedMessage id='page.faq.are_there_fees_for_creating_a_project.content.one' />{' '}
						<a
							href='https://ethereum.org/en/eth/'
							target='_blank'
							rel='noopener noreferrer'
						>
							<FormattedMessage id='page.faq.are_there_fees_for_creating_a_project.content.two' />{' '}
						</a>
						.
					</>
				),
			},
			{
				question:
					'page.faq.what_percentage_of_the_donations_go_directly',
				answer: (
					<>
						<FormattedMessage id='page.faq.what_percentage_of_the_donations_go_directly.content.one' />{' '}
						<a
							href='https://ethereum.org/en/eth/'
							target='_blank'
							rel='noopener noreferrer'
						>
							<FormattedMessage id='page.faq.what_percentage_of_the_donations_go_directly.content.two' />
						</a>
						.
					</>
				),
			},
			{
				question:
					'page.faq.can_i_donate_on_giveth_if_i_dont_have_crypto',
				answer: (
					<>
						<FormattedMessage id='page.faq.can_i_donate_on_giveth_if_i_dont_have_crypto.content.one' />{' '}
						<a
							href='https://www.sdgimpactfund.org/'
							target='_blank'
							rel='noopener noreferrer'
						>
							SDG Impact Fund
						</a>{' '}
						<FormattedMessage id='page.faq.can_i_donate_on_giveth_if_i_dont_have_crypto.content.two' />{' '}
						<a
							href='https://www.sdgimpactfund.org/giveth-foundation'
							target='_blank'
							rel='noopener noreferrer'
						>
							<FormattedMessage id='label.here' />
						</a>
						.{' '}
						<FormattedMessage id='page.faq.can_i_donate_on_giveth_if_i_dont_have_crypto.content.three' />{' '}
						<a
							href='https://medium.com/giveth/giveth-2-0-next-level-community-philanthropy-f7e60d7e78cb'
							target='_blank'
							rel='noopener noreferrer'
						>
							<FormattedMessage id='page.faq.can_i_donate_on_giveth_if_i_dont_have_crypto.content.four' />
						</a>
						.
					</>
				),
			},
			{
				question: 'page.faq.how_do_i_knnow_projects_get_my_money',
				answer: (
					<>
						<FormattedMessage id='page.faq.how_do_i_knnow_projects_get_my_money.content.one' />{' '}
						(i.e{' '}
						<a
							href='https://etherscan.io'
							target='_blank'
							rel='noopener noreferrer'
						>
							etherscan.io
						</a>
						){' '}
						<FormattedMessage id='page.faq.how_do_i_knnow_projects_get_my_money.content.two' />
					</>
				),
			},
			{
				question:
					'page.faq.how_can_i_be_sure_my_donations_make_a_difference',
				answer: (
					<FormattedMessage id='page.faq.how_can_i_be_sure_my_donations_make_a_difference.content' />
				),
			},
			{
				question: 'page.faq.how_do_i_know_the_project_was_completed',
				answer: (
					<FormattedMessage id='page.faq.how_do_i_know_the_project_was_completed.content' />
				),
			},
			{
				question: 'page.faq.is_there_a_max_cap_for_a_single_project',
				answer: (
					<FormattedMessage id='page.faq.is_there_a_max_cap_for_a_single_project.content' />
				),
			},
			{
				question: 'page.faq.what_types_of_projects_are_prohibited',
				answer: (
					<>
						<FormattedMessage id='page.faq.what_types_of_projects_are_prohibited.content.one' />{' '}
						<a
							href='https://docs.giveth.io/whatisgiveth/covenant/'
							target='_blank'
							rel='noopener noreferrer'
						>
							<FormattedMessage id='label.covenant' />
						</a>{' '}
						<FormattedMessage id='label.and_or' />{' '}
						<a
							href='https://giveth.io/tos'
							target='_blank'
							rel='noopener noreferrer'
						>
							<FormattedMessage id='component.title.tos' />
						</a>{' '}
						<FormattedMessage id='page.faq.what_types_of_projects_are_prohibited.content.two' />{' '}
						<a
							href='https://docs.giveth.io/dapps/listedUnlisted/#cancelled-projects'
							target='_blank'
							rel='noopener noreferrer'
						>
							<FormattedMessage id='page.faq.what_types_of_projects_are_prohibited.content.three' />
						</a>
						.
					</>
				),
			},
			{
				question: 'page.faq.what_is_a_traceable_project',
				answer: (
					<>
						<FormattedMessage id='page.faq.what_is_a_traceable_project.content.one' />{' '}
						<ExternalLink href={Routes.Home} title='Giveth.io' />{' '}
						<FormattedMessage id='page.faq.what_is_a_traceable_project.content.two' />{' '}
						<ExternalLink
							href={links.CAMPAIGN_DOCS}
							title={formatMessage({ id: 'label.campaign' })}
						/>{' '}
						<FormattedMessage id='label.on' />{' '}
						<ExternalLink href={links.TRACE} title='Giveth TRACE' />{' '}
						<FormattedMessage id='page.faq.what_is_a_traceable_project.content.three' />{' '}
						<b>
							<FormattedMessage id='label.traceable_project' />
						</b>{' '}
						<FormattedMessage id='page.faq.what_is_a_traceable_project.content.four' />{' '}
						<ExternalLink href={links.TRACES_DOCS} title='Traces' />{' '}
						<FormattedMessage id='page.faq.what_is_a_traceable_project.content.five' />{' '}
						<ExternalLink href={links.TRACES_DOCS} title='Traces' />{' '}
						<FormattedMessage id='page.faq.what_is_a_traceable_project.content.six' />
						{'  '}
						<ExternalLink href={links.TRACE} title='Giveth TRACE' />
						{'  '}
						<FormattedMessage id='page.faq.what_is_a_traceable_project.content.seven' />{' '}
						<ExternalLink href={Routes.Home} title='Giveth.io' />,{' '}
						<FormattedMessage id='page.faq.what_is_a_traceable_project.content.eight' />{' '}
						<ExternalLink
							href={links.MAKE_TRACEABLE_DOCS}
							title={formatMessage({ id: 'label.documentation' })}
						/>
						.
					</>
				),
			},
			{
				question:
					'page.faq.i_still_need_more_detail_on_how_giveth_works',
				answer: (
					<>
						<FormattedMessage id='page.faq.i_still_need_more_detail_on_how_giveth_works.content.one' />{' '}
						<a
							href='https://docs.giveth.io'
							target='_blank'
							rel='noopener noreferrer'
						>
							<FormattedMessage id='label.docs' />
						</a>{' '}
						<FormattedMessage id='page.faq.i_still_need_more_detail_on_how_giveth_works.content.two' />{' '}
						<a
							href='https://giveth.io/join'
							target='_blank'
							rel='noopener noreferrer'
						>
							<FormattedMessage id='label.join_page' />
						</a>
						.
					</>
				),
			},
			{
				question:
					'page.faq.i_love_giveth_but_right_now_i_have_no_funds',
				answer: (
					<>
						<FormattedMessage id='page.faq.i_love_giveth_but_right_now_i_have_no_funds.content.one' />{' '}
						<ExternalLink
							href={Routes.Join}
							title={formatMessage({
								id: 'label.join_us_on_any_social_media',
							})}
						/>{' '}
						<FormattedMessage id='page.faq.i_love_giveth_but_right_now_i_have_no_funds.content.two' />{' '}
					</>
				),
			},
		],
		GIVeconomy: [
			{
				question: 'Why is Giveth launching a token?',
				answer: (
					<>
						Giveth’s mission is to reward & empower those who give
						-- to projects, to society & to the world. The GIV token
						fuels and drives the GIVeconomy and some has been
						already distributed to those who have contributed to
						making Giveth what it is today. Anyone with an Ethereum
						wallet can get GIV via our{' '}
						<a
							href='https://docs.giveth.io/giveconomy/givbacks/'
							target='_blank'
							rel='noreferrer'
						>
							GIVbacks program
						</a>{' '}
						by donating to verified projects. GIV is a governance
						token that allows our community to actively participate
						in shaping the future of Giveth in a decentralized way.
					</>
				),
			},
			{
				question: 'What network is the GIV token on?',
				answer: (
					<>
						GIV was deployed on Ethereum Mainnet and is used most
						heavily on Gnosis Chain (xDai). However, the GIViverse
						is multi-chained and GIV will likely be
						bridged/transferred to other chains and Layer 2
						networks.
					</>
				),
			},
			{
				question: 'Why are you using the Gnosis (xDai) network?',
				answer: (
					<>
						Giveth was part of the creation of Gnosis Chain
						(formerly xDai Network) and loves the low-gas fees!
					</>
				),
			},
			{
				question: 'What can I do with GIV?',
				answer: (
					<>
						With GIV, you can Govern, Donate, Farm & Earn! Explore
						the GIVeconomy{' '}
						<a
							href='https://giveth.io/giveconomy'
							target='_blank'
							rel='noopener noreferrer'
						>
							here
						</a>
						.
					</>
				),
			},
			{
				question: 'How can I get (more) GIV?',
				answer: (
					<>
						You can get GIV by interacting with the GIVeconomy and
						Giveth in several ways:{' '}
						<ul>
							<li>
								By{' '}
								<ExternalLink
									href={Routes.Projects}
									title='donating'
								/>{' '}
								to verified projects and getting{' '}
								<a
									href='https://docs.giveth.io/giveconomy/givbacks/'
									target='_blank'
									rel='noreferrer'
								>
									GIVbacks
								</a>
								.
							</li>
							<li>
								By providing liquidity and staking tokens in the{' '}
								<ExternalLink
									href={Routes.GIVfarm}
									title='GIVfarm'
								/>
								.
							</li>
							<li>
								By wrapping GIV and voting in the{' '}
								<ExternalLink
									href={Routes.GIVgarden}
									title='GIVgarden'
								/>
								.
							</li>
							<li>
								By{' '}
								<a
									href='https://giveth.io/join'
									target='_blank'
									rel='noreferrer'
								>
									becoming a contributor
								</a>
								.
							</li>
						</ul>
					</>
				),
			},
			{
				question: 'Who is eligible to receive the GIVdrop?',
				answer: (
					<>
						Recipients of the GIVdrop include members of the "Giveth
						trusted seed" - our community of crypto philanthropists,
						Giveth users & builders, Blockchain4Good DAO members,
						and other ecosystem partners. Check your{' '}
						<a
							href='https://giveth.io/giveconomy'
							target='_blank'
							rel='noreferrer'
						>
							GIVdrop
						</a>{' '}
						or learn more about eligibility in our{' '}
						<a
							href='https://docs.giveth.io/giveconomy/givdrop/'
							target='_blank'
							rel='noreferrer'
						>
							documentation
						</a>
						.
					</>
				),
			},
			{
				question: 'Will there be another GIVdrop?',
				answer: (
					<>
						No, there are no more GIVdrops planned, but anyone can
						get GIV from{' '}
						<a
							href='https://docs.giveth.io/giveconomy/givbacks/'
							target='_blank'
							rel='noreferrer'
						>
							GIVbacks
						</a>{' '}
						by donating to verified projects on Giveth.
					</>
				),
			},
			{
				question: 'How do I claim my GIVdrop?',
				answer: (
					<>
						You can check your GIVdrop and claim your tokens{' '}
						<a
							href='https://giveth.io/giveconomy'
							target='_blank'
							rel='noreferrer'
						>
							here
						</a>{' '}
						or read our{' '}
						<a
							href='https://docs.giveth.io/giveconomy/givdrop/#claiming-your-givdrop'
							target='_blank'
							rel='noreferrer'
						>
							tutorial
						</a>{' '}
						on how to claim!
					</>
				),
			},
			{
				question:
					"Why can't I see my successfully claimed GIV in my wallet?",
				answer: (
					<>
						The GIVdrop is on Gnosis Chain (xDai). Ensure that your
						wallet is connected to xDai and that you have added GIV
						to your token list! The address for the GIV token on
						xDai is 0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75.
					</>
				),
			},
			{
				question: "Why don't I have a GIVdrop?",
				answer: (
					<>
						The GIVdrop has been sent to our community of crypto
						philanthropists, Giveth users & builders,
						Blockchain4Good DAO members, and other ecosystem
						partners. We have made every effort to include all valid
						addresses in this GIVdrop, at our discretion. Not every
						person who has ever interacted with Giveth is eligible.
						If you did not receive GIV, that is because you were not
						eligible. We will not review past transactions or
						consider other addresses for inclusion. We appreciate
						your understanding.
					</>
				),
			},
			{
				question: "I didn't receive a GIVdrop. Can I get one now?",
				answer: (
					<>
						We have made every effort to include all valid addresses
						in this GIVdrop, at our discretion. Not every person who
						has ever interacted with Giveth is eligible. If you did
						not receive GIV, that is because you were not eligible.
						We will not review past transactions or consider other
						addresses for inclusion. We appreciate your
						understanding.
					</>
				),
			},
			{
				question:
					"I'm eligible for the GIVdrop, but I lost the keys to my address. Can you help?",
				answer: (
					<>
						If you received the GIVdrop but no longer have access to
						the eligible address, it is possible for us to redirect
						the allocation to another ETH address. However, you need
						to prove who you are and that you do have tokens
						allocated to you. If this is you,{' '}
						<a
							href='https://giveth.io/support'
							target='_blank'
							rel='noreferrer'
						>
							reach out to our team
						</a>{' '}
						for support. FYI - If no one on the Giveth team knows
						you, it probably won't work out.
					</>
				),
			},
			{
				question: 'How do I get involved in governance?',
				answer: (
					<>
						<a
							href='https://discord.giveth.io/'
							target='_blank'
							rel='noreferrer'
						>
							Join Discord
						</a>{' '}
						to engage with the community. If you have GIV, wrap it
						in the{' '}
						<ExternalLink
							href={Routes.GIVgarden}
							title='GIVgarden'
						/>{' '}
						to unlock your governance voting power. Keep abreast of
						governance proposals and participate in the discussion
						in our{' '}
						<a
							href='https://forum.giveth.io/'
							target='_blank'
							rel='noreferrer'
						>
							Forum
						</a>
						.
					</>
				),
			},
			{
				question: 'What is the GIVbacks program?',
				answer: (
					<>
						GIVbacks is a revolutionary concept that rewards donors
						to verified projects on Giveth with GIV. Learn more
						about{' '}
						<a
							href='https://docs.giveth.io/giveconomy/givbacks/'
							target='_blank'
							rel='noreferrer'
						>
							GIVbacks
						</a>{' '}
						in our documentation.
					</>
				),
			},
			{
				question: "What is a 'Verified' Project?",
				answer: (
					<>
						'Verified' is a top tier status for projects wishing to
						join the GIVbacks program. The GIVbacks program is a
						revolutionary concept that rewards donors to verified
						projects with GIV tokens. By applying for a 'Verified'
						project status, you will be able to make your project
						stand out and encourage more donations. Getting your
						project verified also builds a relationship of trust
						with your donors by demonstrating your project's
						legitimacy and showing that the funds are being used to
						create positive change. This simple verification process
						requires some additional information about your project
						and the intended impact of your organization. If you
						would like to apply to receive the 'Verified' badge,
						encourage more giving and give back to those who have
						helped you reach your goals, please fill out{' '}
						<a
							href='https://giveth.typeform.com/verification?typeform-source=next.giveth.io'
							target='_blank'
							rel='noreferrer'
						>
							this form
						</a>
						.
					</>
				),
			},
			{
				question:
					'I earned GIVbacks, but the GIVbacks page says my balance is zero. What happened?',
				answer: (
					<>
						When you harvest GIV rewards on Gnosis Chain (xDai) from
						the{' '}
						<ExternalLink
							href={Routes.GIVgarden}
							title='GIVgarden'
						/>
						, <ExternalLink href={Routes.GIVfarm} title='GIVfarm' />
						, or{' '}
						<ExternalLink
							href={Routes.GIVstream}
							title='GIVstream'
						/>{' '}
						pages, you get all liquid GIV allocated to you in our
						token distro in a single transaction. If you earned GIV
						but don't see it on the{' '}
						<ExternalLink href={Routes.GIVbacks} title='GIVbacks' />{' '}
						page you may have already claimed this allocation from
						another page.
					</>
				),
			},
			{
				question: 'What is the GIVgarden?',
				answer: (
					<>
						The{' '}
						<ExternalLink
							href={Routes.GIVgarden}
							title='GIVgarden'
						/>{' '}
						is the Giveth Community’s DAO governance platform,
						developed by{' '}
						<a
							href='https://1hive.gitbook.io/gardens/'
							target='_blank'
							rel='noreferrer'
						>
							1Hive's Gardens team
						</a>
						, where GIV token holders can influence the treasury,
						roadmap and mission of the Giveth ecosystem. To learn
						more, check out the{' '}
						<a
							href='https://docs.giveth.io/giveconomy/givgarden/'
							target='_blank'
							rel='noreferrer'
						>
							GIVgarden documentation
						</a>
						.
					</>
				),
			},
			{
				question: 'What is the GIVfarm?',
				answer: (
					<>
						The{' '}
						<ExternalLink href={Routes.GIVfarm} title='GIVfarm' />{' '}
						is the Giveth liquidity mining program that allows GIV
						holders to provide liquidity and stake tokens to earn
						GIV rewards. To learn more, check out the{' '}
						<ExternalLink
							href={links.GIVFARM_DOCS}
							title='GIVfarm documentation'
						/>
						.
					</>
				),
			},
			{
				question: 'What is the GIVstream?',
				answer: (
					<>
						The{' '}
						<ExternalLink
							href={Routes.GIVstream}
							title='GIVstream'
						/>{' '}
						aligns community members with the long term success of
						Giveth and the GIVeconomy. With the GIVstream, anyone
						who adds value to the GIVeconomy gets GIV continuously
						for up to 5 years. The GIVeconomy starts out small but
						as more value is created, the GIViverse expands -- More
						GIV becomes liquid and more GIV spreads out to our
						community of stakeholders. To learn more, check out the{' '}
						<ExternalLink
							href={links.GIVSTREAM_DOCS}
							title='GIVstream documentation'
						/>
						.
					</>
				),
			},
			{
				question: 'Why is there a GIVstream?',
				answer: (
					<>
						The GIVstream nurtures the GIVeconomy at inception by
						having only 10% of the total supply of GIV liquid and
						transferable to start. As the GIVeconomy grows &
						stabilizes, more GIV become liquid and available for
						everyone. We want to empower those who support the
						Giveth ecosystem with steadily increasing governance
						rights, this includes participants who{' '}
						<ExternalLink
							href={Routes.Projects}
							title='donate to verified projects'
						/>
						, vote in the{' '}
						<ExternalLink
							href={Routes.GIVgarden}
							title='GIVgarden'
						/>{' '}
						or provide liquidity in the{' '}
						<ExternalLink href={Routes.GIVfarm} title='GIVfarm' />.
						Participants benefit from their GIVstream flowing as the
						GIVeconomy flourishes over time, therefore we ensure
						that Giveth is not just governed by people who buy
						tokens on the open market but by those who contribute in
						a more meaningful way.
					</>
				),
			},
			{
				question: 'How do I get a GIVstream?',
				answer: (
					<>
						You can get (or increase) your GIVstream flow-rate on
						Gnosis Chain by donating (on Gnosis (xDai) or Mainnet)
						and getting{' '}
						<ExternalLink href={Routes.GIVbacks} title='GIVbacks' />
						, by wrapping GIV to use in the{' '}
						<ExternalLink
							href={Routes.GIVgarden}
							title='GIVgarden'
						/>
						, or by staking in the{' '}
						<ExternalLink href={Routes.GIVfarm} title='GIVfarm' />{' '}
						on Gnosis (xDai). You can get (or increase) your
						GIVstream flowrate on Ethereum Mainnet by providing
						Mainnet liquidity and staking GIV or LP tokens in the{' '}
						<ExternalLink href={Routes.GIVfarm} title='GIVfarm' />{' '}
						on Mainnet.
					</>
				),
			},
			{
				question: 'Can I speed up my GIVstream?',
				answer: (
					<>
						You can increase your{' '}
						<ExternalLink
							href={Routes.GIVstream}
							title='GIVstream'
						/>{' '}
						flow-rate by participating in the GIVeconomy through{' '}
						<ExternalLink href={Routes.GIVbacks} title='GIVbacks' />{' '}
						, the{' '}
						<ExternalLink
							href={Routes.GIVgarden}
							title='GIVgarden'
						/>
						, or the{' '}
						<ExternalLink href={Routes.GIVfarm} title='GIVfarm' />.
						You cannot, however, accelerate your GIVstream to
						decrease the time remaining. The "GIViverse expansion"
						time period ends on December 23, 2026 and is the same
						for the entire GIVeconomy.
					</>
				),
			},
		],
	};
};

export default faqContent;
