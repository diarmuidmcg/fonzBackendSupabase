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
import { Profiles } from 'src/profiles/profiles.entity';

@Entity('events')
export class Events extends BaseEntity {
  @Column({ type: 'varchar', length: 150, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  location: string;

  @Column({ type: 'varchar', nullable: true })
  date: string;

  @Column({ type: 'varchar', nullable: true })
  time: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  price: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Profiles, (profile) => profile.hosted_events, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  host: Profiles;

  @ManyToMany(() => Profiles, (profile) => profile.attended_events, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'event_attendees', // table name for the junction table of this relation
    joinColumn: {
      name: 'event',
      referencedColumnName: 'id',
    },
  })
  attendees: Profiles[];
}
