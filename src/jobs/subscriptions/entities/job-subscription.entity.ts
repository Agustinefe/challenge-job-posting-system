import { slugify } from '../../../common/utils/slugify';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('job-subscriptions')
export class JobSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ type: 'text', nullable: true })
  searchPattern: string | null;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.searchPattern) {
      this.searchPattern = slugify(this.searchPattern);
    }
  }
}
