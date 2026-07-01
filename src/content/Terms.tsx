// Source of truth for the Giveth Terms of Use shown at /tos.
// Each section has a numbered title and a list of blocks: a plain string renders
// as a paragraph, a nested string array renders as a bulleted list.
type TermsSection = {
	title: string;
	description: (string | string[])[];
};

const termsArray: TermsSection[] = [
	{
		title: '1. Introduction',
		description: [
			`These terms and conditions (these "Terms") constitute a binding legal agreement between each individual, entity, group or association ("Users", "You") who views, interacts, links to or otherwise uses or derives any benefit from "giveth.io" and all related subdomains (the "Site", "Website" or the "Platform") and Giveth Association, a Swiss non-profit association (Verein) registered in Zug, Switzerland ("Giveth", "We", "Our" or "Us") and each of its successors and assigns.`,
			`The Platform provides a permissionless, blockchain-based environment that allows users to make and receive donations using smart contracts ("Smart Contracts").`,
			`Please read these Terms carefully before using the Platform. These Terms apply to any person accessing the Platform and by using the Platform you agree to be bound by them. If you do not want to be bound by them, you should not access the Platform. By using the Platform in any capacity, you agree that you have read and understood these Terms.`,
		],
	},
	{
		title: '2. Modifications',
		description: [
			`Giveth reserves the right to modify these Terms at any time at its sole discretion. The most current version will be posted on our website. We may notify users of material changes via email or platform announcement. Continued use of the Platform after any modification constitutes your acceptance of the updated Terms.`,
		],
	},
	{
		title: '3. Eligibility',
		description: [
			`By accessing and using the Platform you represent and warrant that you:`,
			[
				`Are of the legal age in your jurisdiction to do so, with no legal impediment or incapability;`,
				`Have read and understood the risks of using the Platform, and are solely responsible for your actions;`,
				`Are acting on your own account as principal and not as trustee, agent or otherwise on behalf of any other person or entity;`,
				`Have had the opportunity to seek legal, financial, or other advice that you deem appropriate prior to using the Platform;`,
				`Will only use the Platform with legally obtained digital assets that belong to you, with full legal and beneficial title to any such assets;`,
				`Are not the subject of economic or trade sanctions administered or enforced by any governmental authority, including but not limited to the U.S. Office of Foreign Assets Control (OFAC), the Swiss State Secretariat for Economic Affairs (SECO), or the European Union, nor are you listed on any sanctions list or designated as a Specially Designated National or Blocked Person; and`,
				`Are not a citizen, resident, or entity organized in a jurisdiction subject to comprehensive sanctions by the United States, the European Union, or Switzerland.`,
			],
			`Your access to the Platform may be restricted based on your jurisdiction. You must not use the Platform if you are located in or a citizen or resident of any jurisdiction subject to comprehensive sanctions enforced by Switzerland (SECO), the European Union, or the United States (OFAC), or any jurisdiction in which use of the Platform would be illegal or otherwise violate any applicable law. We reserve the right to implement technical controls to restrict access from any such jurisdiction.`,
			`You represent that you are not a resident of any restricted territory and have not used any technical means including any virtual private network (VPN) to disguise or manipulate your geographical location to access the Platform.`,
		],
	},
	{
		title: '4. Privacy Policy',
		description: [
			`The Platform may directly or indirectly collect and temporarily store personally identifiable information for operational purposes, including for the purpose of identifying blockchain addresses or IP addresses that may indicate use of the Platform from prohibited jurisdictions or by sanctioned persons.`,
			`We use the information we collect to detect, prevent, and mitigate financial crime and other illicit or harmful activities on the Platform. For these purposes, we may share information with blockchain analytics providers solely to help us promote the safety, security, and integrity of the Platform. We do not retain information any longer than necessary for these purposes.`,
			`Please note that when you use the Platform, you are interacting with public blockchain infrastructure, which provides transparency into your transactions. Giveth does not control and is not responsible for any information you make public on the blockchain by taking actions through the Platform.`,
		],
	},
	{
		title: '5. Non-Custodial Platform',
		description: [
			`The Platform is a purely non-custodial application. Giveth does not at any time have custody, possession, or control of your digital assets. You are solely responsible for the security of your private keys and wallet credentials.`,
			`This Agreement does not create or impose any fiduciary duties on Giveth. To the fullest extent permitted by law, you acknowledge and agree that Giveth owes no fiduciary duties or liabilities to you or any other party, and that to the extent any such duties or liabilities may exist at law, those duties and liabilities are hereby irrevocably disclaimed, waived, and eliminated.`,
		],
	},
	{
		title: '6. Assumption of Risk',
		description: [
			`By accessing and using the Platform, you represent that you are sufficiently familiar with blockchain-based systems and understand the inherent risks associated with using them, including that blockchain-based transactions are irreversible.`,
			`You further acknowledge and accept the following risks:`,
			[
				`Any smart contracts you interact with are entirely your own responsibility; Giveth is not a party to those contracts;`,
				`At any time, your access to your digital assets may be suspended or terminated, or there may be delays which may result in your assets diminishing in value;`,
				`There may be technical problems, cyber attacks, or other events which could result in the definitive loss of your funds; and`,
				`The Platform may be suspended or terminated for any reason, which may limit your access to your digital assets.`,
			],
			`You expressly agree that Giveth is not responsible for any of these risks and cannot be held liable for any resulting losses. You understand and agree to assume full responsibility for all risks of accessing and using the Platform.`,
		],
	},
	{
		title: '7. Duties of the User',
		description: [
			`You agree to comply with all applicable domestic and international laws, statutes, and regulations applicable to your use of the Platform. As a condition to accessing or using the Platform, you:`,
			[
				`Will only use the Platform for lawful purposes and in accordance with these Terms;`,
				`Will ensure that all information you provide on the Platform is current, complete, and accurate; and`,
				`Will maintain the security and confidentiality of your cryptographic private keys.`,
			],
			`You further agree to exercise diligence against any fraudulent behavior or fake information put in place by third parties in connection with the Platform.`,
		],
	},
	{
		title: '8. Prohibited Activities',
		description: [
			`You agree not to engage in, or attempt to engage in, any of the following:`,
			[
				`Sanctions Violations — Any transaction or activity involving persons or entities subject to sanctions programs maintained by OFAC, SECO, the EU, or any other applicable governmental authority;`,
				`Money Laundering or Terrorist Financing — Use of the Platform to conceal, transfer, or legitimize proceeds of criminal activity or to finance terrorism or extremist organizations;`,
				`Intellectual Property Infringement — Activity that infringes on any copyright, trademark, patent, or other proprietary rights;`,
				`Cyberattacks — Any attempt to interfere with or compromise the integrity or security of the Platform or any related systems;`,
				`Fraud and Misrepresentation — Providing false, inaccurate, or misleading information to Giveth or any other user;`,
				`Harm of Other Users — Use of the Platform in any manner that could interfere with, disrupt, or negatively affect other users' access or use; and`,
				`Any Other Unlawful Conduct — Any activity that violates applicable laws or regulations in any relevant jurisdiction.`,
			],
		],
	},
	{
		title: '9. AML and Sanctions Compliance',
		description: [
			`Giveth is committed to preventing the use of its Platform for money laundering, terrorist financing, or sanctions evasion. In furtherance of this commitment:`,
			[
				`Giveth observes applicable sanctions programs including those administered by OFAC, SECO, and the EU;`,
				`Giveth may restrict access to the Platform from jurisdictions subject to comprehensive sanctions or designated as high-risk by the Financial Action Task Force (FATF);`,
				`Giveth may require identity verification of project creators or recipients participating in funding rounds or grant programs, as determined by the Executive Committee on a program-by-program basis; and`,
				`Giveth reserves the right to refuse, suspend, or terminate access to the Platform where it reasonably suspects a violation of applicable laws has occurred.`,
			],
		],
	},
	{
		title: '10. Whistleblower and Anti-Corruption',
		description: [
			`Giveth is committed to ethical conduct and zero tolerance for fraud, bribery, and corruption. Any person who becomes aware of conduct that may violate applicable anti-corruption laws or this Agreement is encouraged to report it in good faith to info@giveth.io. Giveth will not retaliate against any person who makes a report in good faith.`,
		],
	},
	{
		title: '11. Compliance and Tax Obligations',
		description: [
			`The Platform may not be available or appropriate for use in all jurisdictions. By accessing the Platform, you agree that you are solely and entirely responsible for compliance with all laws and regulations applicable to you.`,
			`Your use of the Platform may result in tax consequences. It is your sole responsibility to determine, report, and remit any applicable taxes to the relevant authorities.`,
		],
	},
	{
		title: '12. Non-Solicitation; No Investment Advice',
		description: [
			`All transactions you submit through the Platform are considered unsolicited. Giveth has not provided you with any investment advice in connection with any transaction and does not conduct a suitability review of any transaction you submit. All information provided by the Platform is for informational purposes only and should not be construed as investment advice.`,
		],
	},
	{
		title: '13. Third-Party Links',
		description: [
			`The Platform may contain links to third-party websites. We have no control over third-party websites and accept no legal responsibility for any content or information contained in them. Your use of a third-party site is governed by the terms of that site. We are not liable for any loss of funds that may occur by clicking links to third-party websites.`,
		],
	},
	{
		title: '14. Intellectual Property',
		description: [
			`Giveth owns all intellectual property rights in the Platform and its contents, except where licensed under open-source terms. You are granted a limited, non-exclusive, non-transferable license to access and use the Platform solely in accordance with these Terms.`,
			`By submitting content to the Platform, you grant Giveth a worldwide, royalty-free, irrevocable license to use, copy, distribute, and publish such content for the purposes of operating and promoting the Platform.`,
		],
	},
	{
		title: '15. Disclaimers',
		description: [
			`The Platform is provided on an "as is" and "as available" basis without warranties of any kind, express or implied. Giveth does not warrant that the Platform will be uninterrupted, error-free, or free of harmful components. We reserve the right to limit the availability of the Platform to any person, geographic area, or jurisdiction at any time and at our sole discretion.`,
		],
	},
	{
		title: '16. Limitation of Liability',
		description: [
			`To the fullest extent permitted by applicable law, Giveth and its Executive Committee members, officers, contributors, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Platform. This limitation of liability applies regardless of whether the alleged liability is based on contract, tort, negligence, strict liability, or any other basis.`,
		],
	},
	{
		title: '17. Indemnification',
		description: [
			`You agree to indemnify, defend, and hold harmless Giveth and its Executive Committee members, officers, contributors, and agents from and against any claims, damages, losses, and expenses (including legal fees) arising from your use of the Platform, your violation of these Terms, or your violation of any applicable law or third-party rights.`,
		],
	},
	{
		title: '18. Severability',
		description: [
			`If any provision of these Terms is found to be void, unenforceable, or invalid, it will be severed from these Terms, leaving the remainder in full force and effect. All disclaimers, indemnities, and exclusions shall survive termination of these Terms.`,
		],
	},
	{
		title: '19. Governing Law and Dispute Resolution',
		description: [
			`This Agreement shall be governed by and construed in accordance with Swiss law. Any disputes arising from or in connection with this Agreement shall first be submitted to good-faith settlement negotiations via email to info@giveth.io. Disputes not resolved within 60 days shall be subject to the exclusive jurisdiction of the courts of Zug, Switzerland, unless the Executive Committee elects to refer the matter to online arbitration in accordance with Giveth's Articles of Association.`,
		],
	},
	{
		title: '20. Termination',
		description: [
			`Giveth reserves the right to suspend or terminate your access to the Platform at any time, with or without notice, if Giveth reasonably believes you have violated these Terms, applicable law, or any sanctions or AML obligations. Upon termination, all rights granted to you under these Terms will immediately cease. Sections 6, 10, 16, 17, 18, and 19 shall survive any termination of these Terms.`,
		],
	},
	{
		title: '21. Entire Agreement',
		description: [
			`These Terms set out the entire agreement between you and Giveth with respect to your use of the Platform and supersede any and all prior or contemporaneous representations, communications, or agreements made between you and Giveth.`,
		],
	},
];

export default termsArray;
