export function buildUsersPfpInfoQuery(users: string[]) {
	const query = `query {
	  ${users
			.map(user => {
				const _user = user.toLowerCase();
				return `user_${_user}: giversPFPTokens(where: {user: "${_user}" }) {
				id
				user {
					id
				}
				tokenId
				imageIpfs
		  }
		`;
			})
			.join('')}}
  `;
	return query;
}
