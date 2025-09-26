import { SetMetadata } from '@nestjs/common';
import { Role } from '../enum/user-role.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
