import { Double } from "typeorm";
import { CreateInventarioMembresiaDto } from "./inventario";

export class UpdateProductsDto{
  

       id_producto:string;
       name: string;
       description: string;
       price?: string;
       image1?: string;
       fecha:string;
       stok:string;
       ismenbresia:boolean;
       nombre_plan:string;
       recurrencia:string;
       estad: string;
       detalles : CreateInventarioMembresiaDto;
      
} 