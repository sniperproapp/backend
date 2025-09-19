// src/referral/referral.entity.ts

import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
 

@Entity()
export class Referral {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string; // Por ejemplo: 'pendiente', 'pagado', 'cancelado'

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Relación: la referencia pertenece a un usuario que refiere.
  @ManyToOne(() => User, user => user.referrals)
  @JoinColumn({ name: 'referrerId' })
  referrer: User;

  @Column()
  referrerId: number;

  // Relación: la referencia pertenece a un usuario que fue referido.
  @ManyToOne(() => User)
  @JoinColumn({ name: 'referredUserId' })
  referredUser: User;

  @Column()
  referredUserId: number;
}