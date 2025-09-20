export class CreateReferralDto{
 
      
       status: string; // Por ejemplo: 'pendiente', 'pagado', 'cancelado'
       referrerId: number;
       monto: number;
       referredUserId: number;
   
}