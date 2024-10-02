import { EDirection } from '@/apollo/types/gqlEnums';
import { EOrderBy } from './type';

export const userProjectsPerPage = 12;

export const projectsOrder = {
	by: EOrderBy.CreationDate,
	direction: EDirection.DESC,
};
