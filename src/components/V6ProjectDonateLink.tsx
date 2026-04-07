import Link, { LinkProps } from 'next/link';
import { CSSProperties, MouseEvent, ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';
import V6ProjectQFRedirectModal from '@/components/modals/V6ProjectQFRedirectModal';
import { v6QfRedirectQueryOptions } from '@/services/v6QF';

interface IV6ProjectDonateLinkProps extends LinkProps {
	children: ReactNode;
	projectId?: number | string;
	className?: string;
	id?: string;
	style?: CSSProperties;
	onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

const shouldInterceptDonateClick = (event: MouseEvent<HTMLAnchorElement>) => {
	return (
		event.button === 0 &&
		!event.defaultPrevented &&
		!event.metaKey &&
		!event.ctrlKey &&
		!event.shiftKey &&
		!event.altKey
	);
};

export const V6ProjectDonateLink = ({
	children,
	projectId,
	href,
	onClick,
	...linkProps
}: IV6ProjectDonateLinkProps) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [redirectUrl, setRedirectUrl] = useState<string>();
	const [showRedirectModal, setShowRedirectModal] = useState(false);
	const [isChecking, setIsChecking] = useState(false);

	return (
		<>
			<Link
				href={href}
				{...linkProps}
				onClick={async event => {
					onClick?.(event);
					if (
						!shouldInterceptDonateClick(event) ||
						!projectId ||
						typeof href !== 'string'
					) {
						return;
					}

					event.preventDefault();
					setIsChecking(true);

					try {
						const redirectInfo = await queryClient.fetchQuery(
							v6QfRedirectQueryOptions(Number(projectId)),
						);
						if (redirectInfo?.redirectUrl) {
							setRedirectUrl(redirectInfo.redirectUrl);
							setShowRedirectModal(true);
							return;
						}
					} catch {
						// Fall through to normal navigation on error
					} finally {
						setIsChecking(false);
					}

					router.push(href);
				}}
				aria-busy={isChecking || undefined}
			>
				{children}
			</Link>
			{showRedirectModal && redirectUrl && (
				<V6ProjectQFRedirectModal
					setShowModal={setShowRedirectModal}
					redirectUrl={redirectUrl}
				/>
			)}
		</>
	);
};

export default V6ProjectDonateLink;
