import { RoleType } from './roles';

export interface Role {
	name: RoleType,
};

export interface User {
	userName: string,
	roles: Role[],
}