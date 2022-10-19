import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from 'src/BaseEntity';

import { Profiles } from 'src/profiles/profiles.entity';
import { Events } from 'src/events/events.entity';

@Entity({ name: 'images' })
export class Image extends BaseEntity {
  @Column({ name: 'url' })
  url: string;

  @Column()
  public key: string;

  @ManyToOne(() => Profiles, (profile) => profile.image, {
    onDelete: 'CASCADE',
  })
  profile: Profiles;

  @ManyToOne(() => Events, (event) => event.image, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  event: Events;
}
