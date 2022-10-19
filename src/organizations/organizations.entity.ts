import { BaseEntity } from 'src/BaseEntity';
import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { Image } from 'src/images/image.entity';
import { Profiles } from 'src/profiles/profiles.entity';
import { Events } from 'src/events/events.entity';
@Entity('organizations')
export class Organizations extends BaseEntity {
  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  location: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Image, (image) => image.event, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  image: Image[];

  @OneToMany(() => Profiles, (profile) => profile.organization, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  admins: Profiles[];

  @OneToMany(() => Events, (event) => event.organization, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  hosted_events: Events[];
}
