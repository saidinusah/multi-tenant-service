import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../roles.decorator";

@Injectable()
export class HasRole implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const { user } = context?.switchToHttp().getRequest();
    if (!requiredRoles) return true;

    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}
