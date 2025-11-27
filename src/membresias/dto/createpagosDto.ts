import { IsNotEmpty, IsString } from "class-validator";

export class CreatemembresiaDto{
 
  
           nombre_plan: string;
           recurrencia: 'Mensual'  ;
           nivel_acceso: string; // Ej: 'Premium', 'Básico'
           descripcion_beneficios: string;
           id_producto:number
       
         
 
   
   
 
   

}