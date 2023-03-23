export function buildUsersPfpInfoQuery(users: string[]) {
	const query = `query {
	  ${users.map(user => {
			const _user = user.toLowerCase();
			return `
		  user_${_user}: giversPFPTokens(
			first: 5
			where: {user: "${_user}" }
		  ) {
				id
				user {
				id
				}
				tokenId
				imageIpfs
		  }
		}
		`;
		})}
  `;
	return query;
}
