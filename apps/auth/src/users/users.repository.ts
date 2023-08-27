import { AbstractRepository, User } from "@app/common";
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
@Injectable()
export class UsersRepository extends AbstractRepository<User>{
    protected readonly logger = new Logger(UsersRepository.name);

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
        entityManaer: EntityManager) {
        super(userRepository, entityManaer);
    }
}