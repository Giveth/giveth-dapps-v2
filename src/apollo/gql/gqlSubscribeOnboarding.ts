import { gql } from '@apollo/client';

export const SUBSCRIBE_ONBOARDING = gql`
	query ($email: String!) {
		subscribeOnboarding(email: $email)
	}
`;
