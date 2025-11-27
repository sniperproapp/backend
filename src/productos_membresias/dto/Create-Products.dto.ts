import { Inventario } from "src/inventario/Inventario.entity";
import { Double } from "typeorm";
import { CreateInventarioMembresiaDto } from "./inventario";

export class CreateProductsMembresiaDto{


    name: string;
    description: string;
    price?: number;
    image1?: string;
    fecha:string;
    stok:number;
    ismenbresia:boolean;
    nombre_plan:string;
    recurrencia:string;
    estad: number;
    detalles : CreateInventarioMembresiaDto;
   
    
}