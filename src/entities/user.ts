import { IUser } from '@/apollo/types/types';

export default class User implements IUser {
	id!: string;
	firstName?: string;
	lastName?: string;
	name?: string;
	email?: string;
	avatar?: string;
	walletAddress!: string;
	url?: string;
	location?: string;
	token!: string;
	loginType!: string;
	confirmed!: boolean;
	projectsCount?: number;
	totalReceived?: number;
	totalDonated?: number;
	likedProjectsCount?: number;
	donationsCount?: number;

	constructor(initUser: User) {
		if (initUser) {
			this.parseInitUser(initUser);
		}
	}

	parseInitUser(initUser: User) {
		this.walletAddress = initUser.walletAddress;
		this.id = initUser.id;
		this.token = initUser.token;
		this.parseDbUser(initUser);
	}

	parseDbUser(dbUser: User) {
		this.avatar = dbUser.avatar;
		this.email = dbUser.email;
		this.id = dbUser.id;
		this.firstName = dbUser.firstName;
		this.lastName = dbUser.lastName;
		this.location = dbUser.location;
		this.name = dbUser.name;
		this.url = dbUser.url;
		this.projectsCount = dbUser.projectsCount;
		this.totalReceived = dbUser.totalReceived;
		this.totalDonated = dbUser.totalDonated;
		this.likedProjectsCount = dbUser.likedProjectsCount;
		this.donationsCount = dbUser.donationsCount;
	}

	setUserId(userId: string) {
		this.id = userId;
	}

	setToken(token: string) {
		this.token = token;
	}

	addWalletAddress(address: string) {
		this.walletAddress = address;
	}

	getName() {
		return this.name ? this.name.toUpperCase() : '';
		// return this.name ? this.name.toUpperCase() : shortenAddress(this.walletAddress)
		// return /(.+)@(.+){2,}\.(.+){2,}/.test(this.name)
		//         ? this.name?.toUpperCase()
		//         : this.name
	}
}
