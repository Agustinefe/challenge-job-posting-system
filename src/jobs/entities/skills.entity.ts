import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToMany,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';
import { Job } from './job.entity';
import { slugify } from '../../common/utils/slugify';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
    select: false,
  })
  slug: string;

  @ManyToMany(() => Job, (job) => job.skills)
  jobs: Job[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.slug = slugify(this.name);
    }
  }
}
