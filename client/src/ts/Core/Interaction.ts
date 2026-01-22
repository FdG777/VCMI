export const SystemAccess = 1000;
export type SystemAccess = typeof SystemAccess;

export const UserAccess = 2000;
export type UserAccess = typeof UserAccess;

export type AccessLevel = SystemAccess | UserAccess;
