import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto as CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '../../../../libs/common/src/decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { User } from '@app/common';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {

    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        await this.usersService.create(createUserDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getUser(@CurrentUser() user: User) {
        return user;
    }

}
