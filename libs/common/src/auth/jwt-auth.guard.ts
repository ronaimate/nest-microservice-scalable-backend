import { Injectable, CanActivate, ExecutionContext, Inject, Logger } from '@nestjs/common';
import { Observable, catchError, map, of, tap } from "rxjs";
import { AUTH_SERVICE } from "../constants/services";
import { ClientProxy } from "@nestjs/microservices";
import { UserDto } from "../dto";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    private readonly logger = new Logger(JwtAuthGuard.name);

    constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,) {

    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const jwt =
            context.switchToHttp().getRequest().cookies?.Authentication;

        if (!jwt) {
            return false;
        }


        return this.authClient.send<UserDto>('authenticate', {
            Authentication: jwt,
        })
            .pipe(
                tap((res) => {
                    context.switchToHttp().getRequest().user = res;
                }),
                map(() => true),
                catchError(() => of(false)),
            );
    }

}