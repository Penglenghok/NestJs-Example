import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) { }

    signUp(authCredentialDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.SignUp(authCredentialDto)
    }

    async signIn(authCredentialsDto: AuthCredentialsDto):Promise<{accessToken:string}> {
        const username = await this.userRepository.validateUserPassword(authCredentialsDto);
        if (!username) {
            throw new UnauthorizedException('Invalid Credentials')
        }
        const payload = { username };
        const accessToken = await this.jwtService.sign(payload)
        return { accessToken }
    }

}
