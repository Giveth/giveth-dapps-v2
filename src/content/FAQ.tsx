import Routes from '@/lib/constants/Routes';
import ExternalLink from '@/components/ExternalLink';
import links from '@/lib/constants/links';

const faqContent = {
	General: [
		{
			question: 'What is Blockchain?',
			answer: (
				<>
					In simple terms, a blockchain is a method of storing and
					transferring information. It can be considered a kind of
					database that is not stored in a single computer. Instead,
					many identical copies are distributed in several computers
					called nodes. Information on a blockchain is stored in a
					continuous chain of blocks with each block containing
					essential information (for example, transactions) and the
					cryptographic hash of the previous block. To change the
					information in any block, you have to make changes to all
					subsequent blocks. The content of the blocks is verified by
					the consensus of all nodes in the network. These two
					features makes it very difficult to alter any information
					already included in the blocks, and this difficulty
					increases with the number of nodes in the network.
				</>
			),
		},
		{
			question: 'What is Ethereum?',
			answer: (
				<>
					"It's the world's programmable blockchain. Ethereum builds
					on Bitcoin's innovation, with some big differences. Both let
					you use digital money without payment providers or banks.
					But Ethereum is programmable, so you can also use it for
					lots of different digital assets – even Bitcoin! This also
					means Ethereum is for more than payments. It's a marketplace
					of financial services, games and apps that can't steal your
					data or censor you." <br />
					<br /> From{' '}
					<ExternalLink
						href='https://ethereum.org/en/what-is-ethereum/'
						title='Ethereum.org'
					/>{' '}
					website
				</>
			),
		},
		{
			question: 'What is Tor.us?',
			answer: (
				<>
					Tor.us is the non-crypto savvy way to sign in to, and use
					Giveth.io. It is our wallet option alongside{' '}
					<a
						href='https://metamask.io/'
						target='_blank'
						rel='noopener noreferrer'
					>
						Metamask
					</a>
					. For a more detailed answer, see{' '}
					<a
						href='https://docs.tor.us'
						target='_blank'
						rel='noopener noreferrer'
					>
						Tor.us documentation
					</a>
					.{' '}
				</>
			),
		},
		{
			question: 'What is the difference between Bitcoin and Ethereum?',
			answer: (
				<>
					Bitcoin is intended to function as decentralized means of
					value transfer whereas Ethereum is a protocol that allows
					users to develop decentralized applications on top of a
					blockchain network. As prominent Ethereum developer Vlad
					Zamfir has confirmed on several occasions, Ethereum is “not
					money.” Ethereum’s native token, Ether (ETH) exists in order
					to facilitate the process of building and deploying
					distributed applications. Meanwhile, the Bitcoin currency
					exists on the Bitcoin blockchain to facilitate peer-to-peer
					(P2P) exchange of uncensorable, non-confiscatable money.
					<br />
					<br /> From{' '}
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
			question: 'Why donate cryptocurrency?',
			answer: (
				<>
					Cryptocurrency knows no borders and marginalizes no one. It
					can not be taken from you if you alone hold your keys.
					Another advantage: When you donate with crypto, you do not
					realize capital gains from the crypto you hold, and you can
					deduct it from your taxes. In other words, donating your
					crypto can often reduce your tax burden. Would you rather
					donate to the tax agency or your favorite cause?
				</>
			),
		},
		{
			question: 'Does the IRS recognize cryptocurrency donations?',
			answer: (
				<>
					The IRS classifies cryptocurrencies as property, so
					cryptocurrency donations to 501c3 organizations receive the
					same tax treatment as stocks.
				</>
			),
		},
	],
	Giveth: [
		{
			question: 'What is Giveth?',
			answer: (
				<>
					Giveth is a community focused on{' '}
					<b>Building the Future of Giving</b> using blockchain
					technology. There are a lot of projects in the Giveth
					Galaxy, but the core two projects are:{' '}
					<a
						href='https://giveth.io/'
						target='_blank'
						rel='noopener noreferrer'
					>
						Giveth.io
					</a>{' '}
					and the{' '}
					<a
						href='https://giveth.io/giveconomy'
						target='_blank'
						rel='noopener noreferrer'
					>
						GIVeconomy
					</a>
					. <br />
					You can use Giveth to donate to projects or also propose
					projects that need funding, all using cryptocurrency and
					soon fiat currencies! We aim to foster a large network of
					organizations and to build a bright, transparent and
					decentralized Future of Giving.
				</>
			),
		},
		{
			question: 'How is Giveth funded?',
			answer: (
				<>
					Giveth has been adding value to Ethereum since 2016, funded
					solely by donations and a few grants programs (i.e{' '}
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
					). Our community has come this far without the help of any
					investors. You can support us by{' '}
					<ExternalLink
						href={links.SUPPORT_US}
						title='donating to our project'
					/>
					.
				</>
			),
		},
		{
			question: 'Is Giveth recognized as an official charity?',
			answer: (
				<>
					With the help of SDG impact fund the Giveth DAO and
					community based organizational structure is represented as a
					non-profit 501c3 in the United States. We are a
					community-led project and will not derive any direct profit
					from the platform. We guarantee all funds will get recycled
					back into the Community that is ensuring the Giveth Platform
					becomes adopted widely.
				</>
			),
		},
		{
			question: 'Is my donation tax deductible?',
			answer: (
				<>
					We do not support donors in obtaining tax deductions and if
					a donor receives GIVbacks for donating to a verified
					project, we can not guarantee that the donation is legally
					tax deductible.
				</>
			),
		},
		{
			question:
				'Where can I see in detail how Giveth is spending their funds?',
			answer: (
				<>
					One of the core values of Giveth is transparency. We invite
					everyone to have a look at our finances. Funding,
					expenditures and payments relating to Giveth's Treasuries
					can be seen in many places, including:
					<ul>
						<li>
							<a
								href='https://aragon.1hive.org/#/nrgiv/'
								target='_blank'
								rel='noopener noreferrer'
							>
								<b>nrGIV</b>
							</a>{' '}
							for Contributor Expenses and GIVbacks
						</li>
						<li>
							<a
								href='https://gardens.1hive.org/#/xdai/garden/0xb25f0ee2d26461e2b5b3d3ddafe197a0da677b98'
								target='_blank'
								rel='noopener noreferrer'
							>
								<b>GIVgarden</b>
							</a>{' '}
							for community initiatives and external funding
							requests
						</li>
						<li>
							Giveth Liquidity Multisig on{' '}
							<a
								href='https://gnosis-safe.io/app/eth:0xf924fF0f192f0c7c073161e0d62CE7635114e74f/balances'
								target='_blank'
								rel='noopener noreferrer'
							>
								<b>Mainnet</b>
							</a>{' '}
							and{' '}
							<a
								href='https://gnosis-safe.io/app/gno:0xf924fF0f192f0c7c073161e0d62CE7635114e74f/balances'
								target='_blank'
								rel='noopener noreferrer'
							>
								<b>Gnosis Chain</b>
							</a>{' '}
							for Liquidity creation for $GIV
						</li>
						<li>
							Giveth Main Multisig on{' '}
							<a
								href='https://gnosis-safe.io/app/eth:0x4D9339dd97db55e3B9bCBE65dE39fF9c04d1C2cd/balances'
								target='_blank'
								rel='noopener noreferrer'
							>
								<b>Mainnet</b>
							</a>{' '}
							and{' '}
							<a
								href='https://gnosis-safe.io/app/gno:0x4D9339dd97db55e3B9bCBE65dE39fF9c04d1C2cd/balances'
								target='_blank'
								rel='noopener noreferrer'
							>
								<b>Gnosis Chain</b>
							</a>{' '}
							for Grants and Donations to Giveth
						</li>
					</ul>
				</>
			),
		},
		{
			question: 'Are there fees for creating a project?',
			answer: (
				<>
					Nope! Giveth will never charge any additional fees for
					creating projects on our platform. If you create a project
					on Giveth.io it creates an entry in our database that
					directly points to your chosen Ethereum wallet. You can do
					this as well with a brand new account that holds zero funds.
					There are minor fees when using the ethereum network, and if
					you use other exchanges or services, there are likely
					associated fees. To learn more, read up on some of the{' '}
					<a
						href='https://ethereum.org/en/eth/'
						target='_blank'
						rel='noopener noreferrer'
					>
						foundation mechanics of Ethereum
					</a>
					.
				</>
			),
		},
		{
			question:
				'What percentage of the donations go directly to the project?',
			answer: (
				<>
					100% of funds raised on Giveth go directly to the project.
					Giveth does not charge fees to givers or makers. There are
					minor fees when using the ethereum network, and if you use
					other exchanges or services, there are likely associated
					fees. To learn more about fees and how Ethereum works, visit{' '}
					<a
						href='https://ethereum.org/en/eth/'
						target='_blank'
						rel='noopener noreferrer'
					>
						their website
					</a>
					.
				</>
			),
		},
		{
			question: "Can I donate on Giveth if I don't have crypto?",
			answer: (
				<>
					Fiat integration (donate funds from your credit card or bank
					account) is coming soon! Stay tuned... Giveth has also
					partnered with{' '}
					<a
						href='https://www.sdgimpactfund.org/'
						target='_blank'
						rel='noopener noreferrer'
					>
						SDG Impact Fund
					</a>{' '}
					to make it possible for donors to contribute tax-deductible
					donations, in fiat or crypto, to altruistic projects on the
					blockchain. This is a major development in finance
					innovation to effectively care for the commons. We are very
					close to having fiat options integrated with the Dapp. Until
					then, fiat donations will accepted{' '}
					<a
						href='https://www.sdgimpactfund.org/giveth-foundation'
						target='_blank'
						rel='noopener noreferrer'
					>
						here
					</a>
					. To learn more about the partnership between Giveth and the
					SDG Impact Fund, please refer to{' '}
					<a
						href='https://medium.com/giveth/giveth-2-0-next-level-community-philanthropy-f7e60d7e78cb'
						target='_blank'
						rel='noopener noreferrer'
					>
						this blog post
					</a>
					.
				</>
			),
		},
		{
			question:
				'I’m a donor. How do I know projects are getting my money?',
			answer: (
				<>
					Each project description page shows a list of all donations
					made to that project and by who. Giveth.io does not collect
					any fees and your donation is sent directly to the project's
					provided wallet address. You can also find your donation on
					the blockchain by the link to the transaction on a block
					explorer (i.e{' '}
					<a
						href='https://etherscan.io'
						target='_blank'
						rel='noopener noreferrer'
					>
						etherscan.io
					</a>
					) after you make a successful donation.
				</>
			),
		},
		{
			question: 'How can I be sure my donations are making a difference?',
			answer: (
				<>
					We believe that every human being should be able to
					transparently see their funds create good in the world.
					Transparency is the key to staying focused on the work at
					hand. Project owners will be responsible for providing
					updates on how donations to their project are used.
				</>
			),
		},
		{
			question:
				'How do I know the project I contributed to was completed?',
			answer: (
				<>
					Each project has the opportunity to post updates as its
					status changes, and donors who contributed to that project
					will receive notifications when a project owner posts an
					update. Donors can log back on to Giveth to see photos,
					written updates, and sometimes videos of a given project.
					Updates are the responsibility of the project owner, Giveth
					has no direct control in facilitating these updates.
				</>
			),
		},
		{
			question: 'Is there a maximum funding cap for a single project?',
			answer: (
				<>
					There is no maximum funding cap for projects. However,
					projects are encouraged to define specific funding
					requirements for better transparency.
				</>
			),
		},
		{
			question: 'What types of projects are prohibited?',
			answer: (
				<>
					Projects that are found to exhibit "unacceptable behaviour"
					and/or violate our{' '}
					<a
						href='https://docs.giveth.io/whatisgiveth/covenant/'
						target='_blank'
						rel='noopener noreferrer'
					>
						Covenant
					</a>{' '}
					and/or{' '}
					<a
						href='https://giveth.io/tos'
						target='_blank'
						rel='noopener noreferrer'
					>
						Terms of Use
					</a>{' '}
					are considered prohibited and will be cancelled immediately
					and an email will be send to the project owner. Learn more
					in our{' '}
					<a
						href='https://docs.giveth.io/dapps/listedUnlisted/#cancelled-projects'
						target='_blank'
						rel='noopener noreferrer'
					>
						documentation article
					</a>
					.
				</>
			),
		},
		{
			question: 'What is a Traceable project?',
			answer: (
				<>
					A project on{' '}
					<ExternalLink href={Routes.Home} title='Giveth.io' /> that
					has been verified can choose to become a{' '}
					<ExternalLink href={links.CAMPAIGN_DOCS} title='Campaign' />{' '}
					on <ExternalLink href={links.TRACE} title='Giveth TRACE' />,
					thus becoming a <b>Traceable project</b>. This enables
					project creators to manage their donations transparently
					using{' '}
					<ExternalLink href={links.TRACES_DOCS} title='Traces' />.
					Traces specify how the project is using their donations to
					achieve the goals of the overarching Campaigns. Upgrading
					giveth.io projects to Campaigns enables project creators to
					specify parts of their project requiring funding as
					different types of{' '}
					<ExternalLink href={links.TRACES_DOCS} title='Traces' />.
					Donors benefit from being able to choose to fund either
					specific Traces or the overarching Campaign, and are able to
					trace the flow of their donations. A traceable project
					appears on both{' '}
					<ExternalLink href={links.TRACE} title='Giveth TRACE' /> (as
					a Campaign) and{' '}
					<ExternalLink href={Routes.Home} title='Giveth.io' />,
					allowing for double exposure! To learn how to make your
					project traceable, visit our{' '}
					<ExternalLink
						href={links.MAKE_TRACEABLE_DOCS}
						title='documentation'
					/>
					.
				</>
			),
		},
		{
			question:
				'I still need more detail on how Giveth works. Where can I find this?',
			answer: (
				<>
					For information about how Giveth works, its governance
					structure, developer documentation and user guides for the
					Donation Application please have a look at the{' '}
					<a
						href='https://docs.giveth.io'
						target='_blank'
						rel='noopener noreferrer'
					>
						docs
					</a>
					. You're always very welcome to join our chatrooms. Please
					visit the{' '}
					<a
						href='https://giveth.io/join'
						target='_blank'
						rel='noopener noreferrer'
					>
						Join Page
					</a>
					.
				</>
			),
		},
		{
			question:
				'I love Giveth but right now I have no funds to donate, how else can I contribute?',
			answer: (
				<>
					We are a very inclusive Community and would love for you to
					join and see how you can get involved.{' '}
					<ExternalLink
						href={Routes.Join}
						title='Join us on any of our social channels'
					/>{' '}
					and come talk to us!
				</>
			),
		},
	],
	GIVeconomy: [
		{
			question: 'Why is Giveth launching a token?',
			answer: (
				<>
					Giveth’s mission is to reward & empower those who give -- to
					projects, to society & to the world. The GIV token fuels and
					drives the GIVeconomy and some has been already distributed
					to those who have contributed to making Giveth what it is
					today. Anyone with an Ethereum wallet can get GIV via our{' '}
					<a
						href='https://docs.giveth.io/giveconomy/givbacks/'
						target='_blank'
						rel='noreferrer'
					>
						GIVbacks program
					</a>{' '}
					by donating to verified projects. GIV is a governance token
					that allows our community to actively participate in shaping
					the future of Giveth in a decentralized way.
				</>
			),
		},
		{
			question: 'What network is the GIV token on?',
			answer: (
				<>
					GIV was deployed on Ethereum Mainnet and is used most
					heavily on Gnosis Chain (xDai). However, the GIViverse is
					multi-chained and GIV will likely be bridged/transferred to
					other chains and Layer 2 networks.
				</>
			),
		},
		{
			question: 'Why are you using the Gnosis (xDai) network?',
			answer: (
				<>
					Giveth was part of the creation of Gnosis Chain (formerly
					xDai Network) and loves the low-gas fees!
				</>
			),
		},
		{
			question: 'What can I do with GIV?',
			answer: (
				<>
					With GIV, you can Govern, Donate, Farm & Earn! Explore the
					GIVeconomy{' '}
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
					Giveth users & builders, Blockchain4Good DAO members, and
					other ecosystem partners. Check your{' '}
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
					No, there are no more GIVdrops planned, but anyone can get
					GIV from{' '}
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
					wallet is connected to xDai and that you have added GIV to
					your token list! The address for the GIV token on xDai is
					0x4f4F9b8D5B4d0Dc10506e5551B0513B61fD59e75.
				</>
			),
		},
		{
			question: "Why don't I have a GIVdrop?",
			answer: (
				<>
					The GIVdrop has been sent to our community of crypto
					philanthropists, Giveth users & builders, Blockchain4Good
					DAO members, and other ecosystem partners. We have made
					every effort to include all valid addresses in this GIVdrop,
					at our discretion. Not every person who has ever interacted
					with Giveth is eligible. If you did not receive GIV, that is
					because you were not eligible. We will not review past
					transactions or consider other addresses for inclusion. We
					appreciate your understanding.
				</>
			),
		},
		{
			question: "I didn't receive a GIVdrop. Can I get one now?",
			answer: (
				<>
					We have made every effort to include all valid addresses in
					this GIVdrop, at our discretion. Not every person who has
					ever interacted with Giveth is eligible. If you did not
					receive GIV, that is because you were not eligible. We will
					not review past transactions or consider other addresses for
					inclusion. We appreciate your understanding.
				</>
			),
		},
		{
			question:
				"I'm eligible for the GIVdrop, but I lost the keys to my address. Can you help?",
			answer: (
				<>
					If you received the GIVdrop but no longer have access to the
					eligible address, it is possible for us to redirect the
					allocation to another ETH address. However, you need to
					prove who you are and that you do have tokens allocated to
					you. If this is you,{' '}
					<a
						href='https://giveth.io/support'
						target='_blank'
						rel='noreferrer'
					>
						reach out to our team
					</a>{' '}
					for support. FYI - If no one on the Giveth team knows you,
					it probably won't work out.
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
					to engage with the community. If you have GIV, wrap it in
					the{' '}
					<ExternalLink href={Routes.GIVgarden} title='GIVgarden' />{' '}
					to unlock your governance voting power. Keep abreast of
					governance proposals and participate in the discussion in
					our{' '}
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
					GIVbacks is a revolutionary concept that rewards donors to
					verified projects on Giveth with GIV. Learn more about{' '}
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
					'Verified' is a top tier status for projects wishing to join
					the GIVbacks program. The GIVbacks program is a
					revolutionary concept that rewards donors to verified
					projects with GIV tokens. By applying for a 'Verified'
					project status, you will be able to make your project stand
					out and encourage more donations. Getting your project
					verified also builds a relationship of trust with your
					donors by demonstrating your project's legitimacy and
					showing that the funds are being used to create positive
					change. This simple verification process requires some
					additional information about your project and the intended
					impact of your organization. If you would like to apply to
					receive the 'Verified' badge, encourage more giving and give
					back to those who have helped you reach your goals, please
					fill out{' '}
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
					When you harvest GIV rewards on Gnosis Chain (xDai) from the{' '}
					<ExternalLink href={Routes.GIVgarden} title='GIVgarden' />
					, <ExternalLink href={Routes.GIVfarm} title='GIVfarm' />, or{' '}
					<ExternalLink href={Routes.GIVstream} title='GIVstream' />{' '}
					pages, you get all liquid GIV allocated to you in our token
					distro in a single transaction. If you earned GIV but don't
					see it on the{' '}
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
					<ExternalLink href={Routes.GIVgarden} title='GIVgarden' />{' '}
					is the Giveth Community’s DAO governance platform, developed
					by{' '}
					<a
						href='https://1hive.gitbook.io/gardens/'
						target='_blank'
						rel='noreferrer'
					>
						1Hive's Gardens team
					</a>
					, where GIV token holders can influence the treasury,
					roadmap and mission of the Giveth ecosystem. To learn more,
					check out the{' '}
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
					The <ExternalLink href={Routes.GIVfarm} title='GIVfarm' />{' '}
					is the Giveth liquidity mining program that allows GIV
					holders to provide liquidity and stake tokens to earn GIV
					rewards. To learn more, check out the{' '}
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
					<ExternalLink href={Routes.GIVstream} title='GIVstream' />{' '}
					aligns community members with the long term success of
					Giveth and the GIVeconomy. With the GIVstream, anyone who
					adds value to the GIVeconomy gets GIV continuously for up to
					5 years. The GIVeconomy starts out small but as more value
					is created, the GIViverse expands -- More GIV becomes liquid
					and more GIV spreads out to our community of stakeholders.
					To learn more, check out the{' '}
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
					The GIVstream nurtures the GIVeconomy at inception by having
					only 10% of the total supply of GIV liquid and transferable
					to start. As the GIVeconomy grows & stabilizes, more GIV
					become liquid and available for everyone. We want to empower
					those who support the Giveth ecosystem with steadily
					increasing governance rights, this includes participants who{' '}
					<ExternalLink
						href={Routes.Projects}
						title='donate to verified projects'
					/>
					, vote in the{' '}
					<ExternalLink href={Routes.GIVgarden} title='GIVgarden' />{' '}
					or provide liquidity in the{' '}
					<ExternalLink href={Routes.GIVfarm} title='GIVfarm' />.
					Participants benefit from their GIVstream flowing as the
					GIVeconomy flourishes over time, therefore we ensure that
					Giveth is not just governed by people who buy tokens on the
					open market but by those who contribute in a more meaningful
					way.
				</>
			),
		},
		{
			question: 'How do I get a GIVstream?',
			answer: (
				<>
					You can get (or increase) your GIVstream flow-rate on Gnosis
					Chain by donating (on Gnosis (xDai) or Mainnet) and getting{' '}
					<ExternalLink href={Routes.GIVbacks} title='GIVbacks' />, by
					wrapping GIV to use in the{' '}
					<ExternalLink href={Routes.GIVgarden} title='GIVgarden' />,
					or by staking in the{' '}
					<ExternalLink href={Routes.GIVfarm} title='GIVfarm' /> on
					Gnosis (xDai). You can get (or increase) your GIVstream
					flowrate on Ethereum Mainnet by providing Mainnet liquidity
					and staking GIV or LP tokens in the{' '}
					<ExternalLink href={Routes.GIVfarm} title='GIVfarm' /> on
					Mainnet.
				</>
			),
		},
		{
			question: 'Can I speed up my GIVstream?',
			answer: (
				<>
					You can increase your{' '}
					<ExternalLink href={Routes.GIVstream} title='GIVstream' />{' '}
					flow-rate by participating in the GIVeconomy through{' '}
					<ExternalLink href={Routes.GIVbacks} title='GIVbacks' /> ,
					the{' '}
					<ExternalLink href={Routes.GIVgarden} title='GIVgarden' />,
					or the{' '}
					<ExternalLink href={Routes.GIVfarm} title='GIVfarm' />. You
					cannot, however, accelerate your GIVstream to decrease the
					time remaining. The "GIViverse expansion" time period ends
					on December 23, 2026 and is the same for the entire
					GIVeconomy.
				</>
			),
		},
	],
};

export default faqContent;
