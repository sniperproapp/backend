import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
 
import { Repository } from 'typeorm';
 
import  storage = require( '../utils/cloud_storage');
import { Video_paid } from './video_paid.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class Video_paidService {
    constructor(
        @InjectRepository(Video_paid) private video_paidRepository:Repository<Video_paid>,
        @InjectRepository(User) private userRepository:Repository<User>
    
    ){}
   

    findAll(){
        return this.video_paidRepository.find();
    }
 

 
}
