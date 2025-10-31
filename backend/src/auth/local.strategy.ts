import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-local"; 
import { AuthService } from "./auth.service";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(
        private authService: AuthService
    ) {
        super();
    }

    async validate(username: string, password: string): Promise<any> {
        const user: any = await this.authService.validateUser(+username, password);
        if (!user) {
            console.log('Yes');
            throw new UnauthorizedException();
        }
        console.log('No');
        return user;
    }
}