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
					<>
						<FormattedMessage id='page.faq.is_giveth_recognized_as_an_official_charity.content' />
						<ExternalLink
							href='https://www.sdgimpactfund.org/'
							title='SDG Impact Fund'
						/>
						<FormattedMessage id='page.faq.is_giveth_recognized_as_an_official_charity.content.two' />
					</>
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
							<FormattedMessage id='page.faq.are_there_fees_for_creating_a_project.content.two' />
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
						(e.g.,{' '}
						<ExternalLink
							href='https://etherscan.io'
							title='etherscan.io'
						/>
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
						<ExternalLink
							href={links.COVENANT_DOC}
							title={<FormattedMessage id='label.covenant' />}
						/>{' '}
						<FormattedMessage id='label.and_or' />{' '}
						<ExternalLink
							href={Routes.Terms}
							title={
								<FormattedMessage id='component.title.tos' />
							}
						/>{' '}
						<FormattedMessage id='page.faq.what_types_of_projects_are_prohibited.content.two' />{' '}
						<ExternalLink
							href={links.CANCELLED_PROJECTS_DOCS}
							title={
								<FormattedMessage id='page.faq.what_types_of_projects_are_prohibited.content.three' />
							}
						/>
						.
					</>
				),
			},
			{
				question: 'page.faq.what_was_giveth_trace',
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
						<ExternalLink
							href={links.TRACE}
							title='Giveth TRACE '
						/>
						<FormattedMessage id='page.faq.what_is_a_traceable_project.content.three' />{' '}
						<ExternalLink href={links.TRACES_DOCS} title='Traces' />
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
						<ExternalLink
							href={links.DOCS}
							title={<FormattedMessage id='label.docs' />}
						/>
						<FormattedMessage id='page.faq.i_still_need_more_detail_on_how_giveth_works.content.two' />{' '}
						<ExternalLink
							href={Routes.Join}
							title={<FormattedMessage id='label.join_page' />}
						/>
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
						/>
						{', '}
						<FormattedMessage id='page.faq.i_love_giveth_but_right_now_i_have_no_funds.content.two' />{' '}
					</>
				),
			},
		],
		GIVeconomy: [
			{
				question: 'page.faq.why_is_giveth_launching_a_token',
				answer: (
					<>
						<FormattedMessage id='page.faq.why_is_giveth_launching_a_token.content.one' />{' '}
						<ExternalLink
							href={links.GIVBACK_DOC}
							title={
								<FormattedMessage id='label.givbacks_program' />
							}
						/>{' '}
						<FormattedMessage id='page.faq.why_is_giveth_launching_a_token.content.two' />
					</>
				),
			},
			{
				question: 'page.faq.what_network_is_the_giv_token_on',
				answer: (
					<FormattedMessage id='page.faq.what_network_is_the_giv_token_on.content' />
				),
			},
			{
				question: 'page.faq.why_are_you_using_gnosis_network',
				answer: (
					<FormattedMessage id='page.faq.why_are_you_using_gnosis_network.content' />
				),
			},
			{
				question: 'page.faq.what_can_i_do_with_giv',
				answer: (
					<>
						<FormattedMessage id='page.faq.what_can_i_do_with_giv.content' />{' '}
						<ExternalLink
							href={Routes.GIVeconomy}
							title={<FormattedMessage id='label.here' />}
						/>
						.
					</>
				),
			},
			{
				question: 'page.faq.how_can_i_get_more_giv',
				answer: (
					<>
						<FormattedMessage id='page.faq.how_can_i_get_more_giv.content.one' />{' '}
						<ul>
							<li>
								<FormattedMessage id='label.faq_by.two' />{' '}
								<ExternalLink
									href={Routes.Projects}
									title='donating'
								/>{' '}
								<FormattedMessage id='page.faq.how_can_i_get_more_giv.content.two' />{' '}
								<ExternalLink
									href={links.GIVBACK_DOC}
									title='GIVbacks'
								/>
								.
							</li>
							<li>
								<FormattedMessage id='page.faq.how_can_i_get_more_giv.content.three' />{' '}
								<ExternalLink
									href={Routes.GIVfarm}
									title='GIVfarm'
								/>
								.
							</li>
							<li>
								<FormattedMessage id='page.faq.how_can_i_get_more_giv.content.four' />{' '}
								<ExternalLink
									href={Routes.GIVgarden}
									title='GIVgarden'
								/>
								.
							</li>
							<li>
								<FormattedMessage id='label.faq_by.two' />{' '}
								<ExternalLink
									href={Routes.Join}
									title={
										<FormattedMessage id='page.faq.how_can_i_get_more_giv.content.five' />
									}
								/>
								.
							</li>
						</ul>
					</>
				),
			},
			{
				question: 'page.faq.who_is_eligible_to_receive_givdrop',
				answer: (
					<>
						<FormattedMessage id='page.faq.who_is_eligible_to_receive_givdrop.content.one' />{' '}
						<ExternalLink
							href={Routes.GIVeconomy}
							title='GIVdrop'
						/>
						{', '}
						<FormattedMessage id='page.faq.who_is_eligible_to_receive_givdrop.content.two' />{' '}
						<ExternalLink
							href={links.GIVDROP_DOC}
							title={
								<FormattedMessage id='label.documentation' />
							}
						/>
						.
					</>
				),
			},
			{
				question: 'page.faq.will_there_be_another_givdrop',
				answer: (
					<>
						<FormattedMessage id='page.faq.will_there_be_another_givdrop.content.one' />{' '}
						<ExternalLink
							href={links.GIVBACK_DOC}
							title='GIVbacks'
						/>{' '}
						<FormattedMessage id='page.faq.will_there_be_another_givdrop.content.two' />
					</>
				),
			},
			{
				question: 'page.faq.how_do_i_claim_my_givdrop',
				answer: (
					<>
						<FormattedMessage id='page.faq.how_do_i_claim_my_givdrop.content.one' />{' '}
						<ExternalLink
							href={Routes.GIVeconomy}
							title={<FormattedMessage id='label.here' />}
						/>
						{', '}
						<FormattedMessage id='page.faq.how_do_i_claim_my_givdrop.content.two' />{' '}
						<ExternalLink
							href={links.CLAIM_GIVDROP_DOC}
							title={<FormattedMessage id='label.tutorial' />}
						/>{' '}
						<FormattedMessage id='page.faq.how_do_i_claim_my_givdrop.content.three' />
					</>
				),
			},
			{
				question: 'page.faq.why_cant_i_see_my_claimed_drop',
				answer: (
					<FormattedMessage id='page.faq.why_cant_i_see_my_claimed_drop.content' />
				),
			},
			{
				question: 'page.faq.why_dont_i_have_a_givdrop',
				answer: (
					<FormattedMessage id='page.faq.why_dont_i_have_a_givdrop.content' />
				),
			},
			{
				question: 'page.faq.i_didnt_get_airdrop_can_i_get_one',
				answer: (
					<FormattedMessage id='page.faq.i_didnt_get_airdrop_can_i_get_one.content' />
				),
			},
			{
				question: 'page.faq.im_eligible_for_givdrop_but_lost_keys',
				answer: (
					<>
						<FormattedMessage id='page.faq.im_eligible_for_givdrop_but_lost_keys.content.one' />{' '}
						<ExternalLink
							href={Routes.Support}
							title={
								<FormattedMessage id='page.faq.im_eligible_for_givdrop_but_lost_keys.content.two' />
							}
						/>{' '}
						<FormattedMessage id='page.faq.im_eligible_for_givdrop_but_lost_keys.content.three' />
					</>
				),
			},
			{
				question: 'page.faq.how_do_i_get_involved_in_governance',
				answer: (
					<>
						<ExternalLink
							href={links.DISCORD}
							title={
								<FormattedMessage id='page.faq.how_do_i_get_involved_in_governance.content.one' />
							}
						/>{' '}
						<FormattedMessage id='page.faq.how_do_i_get_involved_in_governance.content.two' />{' '}
						<ExternalLink
							href={Routes.GIVgarden}
							title='GIVgarden'
						/>{' '}
						<FormattedMessage id='page.faq.how_do_i_get_involved_in_governance.content.three' />{' '}
						<ExternalLink
							href={links.DISCOURSE}
							title={<FormattedMessage id='label.forum' />}
						/>
						.
					</>
				),
			},
			{
				question: 'page.faq.what_is_the_givbacks_program',
				answer: (
					<>
						<FormattedMessage id='page.faq.what_is_the_givbacks_program.content.one' />{' '}
						<ExternalLink
							href={links.GIVBACK_DOC}
							title='GIVbacks'
						/>{' '}
						<FormattedMessage id='page.faq.what_is_the_givbacks_program.content.two' />
					</>
				),
			},
			{
				question: 'page.faq.what_is_a_verified_project',
				answer: (
					<>
						<FormattedMessage id='page.faq.what_is_a_verified_project.content' />{' '}
						<a
							href='https://giveth.typeform.com/verification?typeform-source=next.giveth.io'
							target='_blank'
							rel='noreferrer'
						>
							<FormattedMessage id='label.this_form' />
						</a>
						.
					</>
				),
			},
			{
				question: 'page.faq.i_earned_givbacks_but_my_balance_is_zero',
				answer: (
					<>
						<FormattedMessage id='page.faq.i_earned_givbacks_but_my_balance_is_zero.content.one' />{' '}
						<ExternalLink
							href={Routes.GIVgarden}
							title='GIVgarden'
						/>
						, <ExternalLink href={Routes.GIVfarm} title='GIVfarm' />
						, <FormattedMessage id='label.or' />{' '}
						<ExternalLink
							href={Routes.GIVstream}
							title='GIVstream'
						/>{' '}
						<FormattedMessage id='page.faq.i_earned_givbacks_but_my_balance_is_zero.content.two' />{' '}
						<ExternalLink href={Routes.GIVbacks} title='GIVbacks' />{' '}
						<FormattedMessage id='page.faq.i_earned_givbacks_but_my_balance_is_zero.content.three' />
					</>
				),
			},
			{
				question: 'page.faq.what_is_the_givgarden',
				answer: (
					<>
						<FormattedMessage id='label.the.two' />{' '}
						<ExternalLink
							href={Routes.GIVgarden}
							title='GIVgarden'
						/>{' '}
						<FormattedMessage id='page.faq.what_is_the_givgarden.content.one' />{' '}
						<a
							href='https://1hive.gitbook.io/gardens/'
							target='_blank'
							rel='noreferrer'
						>
							<FormattedMessage id='page.faq.what_is_the_givgarden.content.two' />
						</a>
						<FormattedMessage id='page.faq.what_is_the_givgarden.content.three' />{' '}
						<ExternalLink
							href={links.GIVGARDEN_DOC}
							title={
								<FormattedMessage id='label.givgarden_documentation' />
							}
						/>
						.
					</>
				),
			},
			{
				question: 'page.faq.what_is_the_givfarm',
				answer: (
					<>
						<FormattedMessage id='label.the.two' />{' '}
						<ExternalLink href={Routes.GIVfarm} title='GIVfarm' />{' '}
						<FormattedMessage id='page.faq.what_is_the_givfarm.content' />{' '}
						<ExternalLink
							href={links.GIVFARM_DOCS}
							title={formatMessage({
								id: 'label.givfarm_documentation',
							})}
						/>
						.
					</>
				),
			},
			{
				question: 'page.faq.what_is_the_givstream',
				answer: (
					<>
						<FormattedMessage id='label.the.two' />{' '}
						<ExternalLink
							href={Routes.GIVstream}
							title='GIVstream'
						/>{' '}
						<FormattedMessage id='page.faq.what_is_the_givstream.content' />{' '}
						<ExternalLink
							href={links.GIVSTREAM_DOCS}
							title={formatMessage({
								id: 'label.givstream_documentation',
							})}
						/>
						.
					</>
				),
			},
			{
				question: 'page.faq.why_is_there_a_givstream',
				answer: (
					<>
						<FormattedMessage id='page.faq.why_is_there_a_givstream.content.one' />{' '}
						<ExternalLink
							href={Routes.Projects}
							title={formatMessage({
								id: 'label.donate_to_verified_projects',
							})}
						/>
						<FormattedMessage id='page.faq.why_is_there_a_givstream.content.two' />{' '}
						<ExternalLink
							href={Routes.GIVgarden}
							title='GIVgarden'
						/>
						{'  '}
						<FormattedMessage id='page.faq.why_is_there_a_givstream.content.three' />{' '}
						<ExternalLink href={Routes.GIVfarm} title='GIVfarm' />.{' '}
						<FormattedMessage id='page.faq.why_is_there_a_givstream.content.four' />
					</>
				),
			},
			{
				question: 'page.faq.how_do_i_get_a_givstream',
				answer: (
					<>
						<FormattedMessage id='page.faq.how_do_i_get_a_givstream.content.one' />{' '}
						<ExternalLink href={Routes.GIVbacks} title='GIVbacks' />
						<FormattedMessage id='page.faq.how_do_i_get_a_givstream.content.two' />{' '}
						<ExternalLink
							href={Routes.GIVgarden}
							title='GIVgarden'
						/>
						<FormattedMessage id='page.faq.how_do_i_get_a_givstream.content.three' />{' '}
						<ExternalLink href={Routes.GIVfarm} title='GIVfarm' />{' '}
						<FormattedMessage id='page.faq.how_do_i_get_a_givstream.content.four' />{' '}
						<ExternalLink href={Routes.GIVfarm} title='GIVfarm' />{' '}
						<FormattedMessage id='page.faq.how_do_i_get_a_givstream.content.five' />
					</>
				),
			},
			{
				question: 'page.faq.can_i_speed_up_my_givstream',
				answer: (
					<>
						<FormattedMessage id='page.faq.can_i_speed_up_my_givstream.content.one' />{' '}
						<ExternalLink
							href={Routes.GIVstream}
							title='GIVstream'
						/>{' '}
						<FormattedMessage id='page.faq.can_i_speed_up_my_givstream.content.two' />{' '}
						<ExternalLink href={Routes.GIVbacks} title='GIVbacks' />
						, <FormattedMessage id='label.the' />{' '}
						<ExternalLink
							href={Routes.GIVgarden}
							title='GIVgarden'
						/>
						, <FormattedMessage id='label.or' />{' '}
						<FormattedMessage id='label.the' />{' '}
						<ExternalLink href={Routes.GIVfarm} title='GIVfarm' />.{' '}
						<FormattedMessage id='page.faq.can_i_speed_up_my_givstream.content.three' />
					</>
				),
			},
		],
	};
};

export default faqContent;
