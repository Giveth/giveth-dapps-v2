import Head from 'next/head';
import { IProject } from '@/apollo/types/types';
import { htmlToText } from '@/lib/helpers';
import type { FC } from 'react';

export interface IMetaTags {
	title: string;
	desc: string;
	image: string;
	url: string;
	type?: string;
}
export const GeneralMetatags: FC<{ info: IMetaTags }> = ({ info }) => {
	return (
		<Head>
			<title>{info.title}</title>
			<meta name='title' content={info.title} />
			<meta name='description' content={info.desc} />

			<meta property='og:type' content={info.type || 'website'} />
			<meta property='og:url' content={info.url} />
			<meta property='og:title' content={info.title} />
			<meta property='og:description' content={info.desc} />
			<meta property='og:image' content={info.image} />

			<meta property='twitter:card' content='summary_large_image' />
			<meta property='twitter:url' content={info.url} />
			<meta property='twitter:title' content={info.title} />
			<meta property='twitter:description' content={info.desc} />
			<meta property='twitter:image' content={info.image} />
			<meta name='twitter:card' content='summary_large_image' />
		</Head>
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
