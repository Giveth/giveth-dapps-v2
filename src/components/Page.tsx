import React from 'react';
import Router from 'next/router';

// Track client-side page views with Segment
declare global {
	interface Window {
		analytics: any;
	}
}

Router.events.on('routeChangeComplete', url => {
	window.analytics.page(url);
});

const Page = ({ children }: { children: React.ReactNode }) => (
	<div>{children}</div>
);

export default Page;
