import { ICategory, IDonation, IProject, IProjectUpdate } from './types'

export interface IFetchAllProjects {
  projects: IProject[]
  totalCount: number
  categories: ICategory[]
}

export interface IProjectBySlug {
  project: IProject
}

export interface IFetchProjectUpdates {
  projectUpdate: IProjectUpdate
}

export interface IDonationsByProjectId {
  donations: IDonation[]
  totalCount: number
}

export interface IUserByAddress {
  id?: string
  firstName?: string
  lastName?: string
  name?: string
  email?: string
  avatar?: string
  walletAddress?: string
  url?: string
  location?: string
  token?: string
}
