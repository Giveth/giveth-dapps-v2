import React from 'react';
import { IProject } from '@/apollo/types/types';
import { htmlToText } from '@/lib/helpers';

export const HomeMeta = () => {
	return (
		<>
			<meta name='title' content='Giveth' />
			<meta
				name='description'
				content='Donate crypto directly to for-good projects.'
			/>

			<meta property='og:type' content='website' />
			<meta property='og:url' content='https://giveth.io/' />
			<meta property='og:title' content='Giveth' />
			<meta
				property='og:description'
				content='Donate crypto directly to for-good projects.'
			/>
			<meta
				property='og:image'
				content='https://giveth.mypinata.cloud/ipfs/QmQ9sfdevs9vS7czBXBfDaRRPhU8a6T5gXxF3NDGSnQe1c'
			/>

			<meta property='twitter:card' content='summary_large_image' />
			<meta property='twitter:url' content='https://giveth.io/' />
			<meta property='twitter:title' content='Giveth' />
			<meta
				property='twitter:description'
				content='Donate crypto directly to for-good projects.'
			/>
			<meta
				property='twitter:image'
				content='https://giveth.mypinata.cloud/ipfs/QmQ9sfdevs9vS7czBXBfDaRRPhU8a6T5gXxF3NDGSnQe1c'
			/>
			<meta name='twitter:card' content='summary_large_image' />
		</>
	);
};

export const ProjectsMeta = () => {
	return (
		<>
			<meta name='title' content='Projects | Giveth' />
			<meta
				name='description'
				content='Support for-good projects, nonprofits & charities with
					crypto donations. Give directly with zero added fees. Get
					rewarded when you donate to verified projects!'
			/>

			<meta property='og:type' content='website' />
			<meta property='og:url' content='https://giveth.io/' />
			<meta property='og:title' content='Projects | Giveth' />
			<meta
				property='og:description'
				content='Support for-good projects, nonprofits & charities with
					crypto donations. Give directly with zero added fees. Get
					rewarded when you donate to verified projects!'
			/>
			<meta
				property='og:image'
				content='https://giveth.mypinata.cloud/ipfs/QmQ9sfdevs9vS7czBXBfDaRRPhU8a6T5gXxF3NDGSnQe1c'
			/>

			<meta property='twitter:card' content='summary_large_image' />
			<meta property='twitter:url' content='https://giveth.io/' />
			<meta property='twitter:title' content='Projects | Giveth' />
			<meta
				property='twitter:description'
				content='Support for-good projects, nonprofits & charities with
					crypto donations. Give directly with zero added fees. Get
					rewarded when you donate to verified projects!'
			/>
			<meta
				property='twitter:image'
				content='https://giveth.mypinata.cloud/ipfs/QmQ9sfdevs9vS7czBXBfDaRRPhU8a6T5gXxF3NDGSnQe1c'
			/>
			<meta name='twitter:card' content='summary_large_image' />
		</>
	);
};

export const GiveconomyMeta = () => {
	return (
		<>
			<meta name='title' content='GIVeconomy' />
			<meta
				name='description'
				content='The GIVeconomy empowers our collective to build the Future of Giving.'
			/>

			<meta property='og:type' content='website' />
			<meta property='og:url' content='https://giveth.io/' />
			<meta property='og:title' content='GIVeconomy' />
			<meta
				property='og:description'
				content='The GIVeconomy empowers our collective to build the Future of Giving.'
			/>
			<meta
				property='og:image'
				content='https://i.ibb.co/HTbdCdd/Thumbnail.png'
			/>

			<meta property='twitter:card' content='summary_large_image' />
			<meta property='twitter:url' content='https://giveth.io/' />
			<meta property='twitter:title' content='GIVeconomy' />
			<meta
				property='twitter:description'
				content='The GIVeconomy empowers our collective to build the Future of Giving.'
			/>
			<meta
				property='twitter:image'
				content='https://i.ibb.co/HTbdCdd/Thumbnail.png'
			/>
			<meta name='twitter:card' content='summary_large_image' />
		</>
	);
};

export const ProjectMeta = (props: {
	project?: IProject;
	preTitle?: string;
}) => {
	const { project, preTitle } = props;
	const metaDescription = htmlToText(project?.description?.slice(0, 100));
	return (
		<>
			<meta
				name='title'
				content={(preTitle || '') + ' ' + project?.title}
			/>
			<meta name='description' content={metaDescription} />
			<meta property='og:type' content='website' />
			<meta
				property='og:title'
				content={(preTitle || '') + ' ' + project?.title}
			/>
			<meta property='og:description' content={metaDescription} />
			<meta property='og:image' content={project?.image} />
			<meta property='twitter:card' content='summary_large_image' />
			<meta
				property='twitter:title'
				content={(preTitle || '') + ' ' + project?.title}
			/>
			<meta property='twitter:description' content={metaDescription} />
			<meta property='twitter:image' content={project?.image} />
		</>
	);
};
