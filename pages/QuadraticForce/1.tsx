import { GetServerSideProps } from 'next';
import React from 'react';
// import { pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/TextLayer.css';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function Test() {
	return (
		<div>
			<p> Waiting </p>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async () => {
	return {
		redirect: {
			destination: '/assets/GivethQF.Marketing.pdf',
			permanent: false,
		},
	};
};
