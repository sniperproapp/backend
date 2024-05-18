import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Zoom } from './zoom.entity';
import { Repository } from 'typeorm';
 
import  storage = require( '../utils/cloud_storage');

@Injectable()
export class ZoomService {
    constructor(
        @InjectRepository(Zoom) private zoomRepository:Repository<Zoom>
    
    ){}
   

    findAll(){
        return this.zoomRepository.find();
    }
 

 
}
