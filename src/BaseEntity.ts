// this file is the default that all new tables will automatically have

import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
