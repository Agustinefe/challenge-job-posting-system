import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Skill } from './skills.entity';
import { slugify } from '../../common/utils/slugify';

@Entity('jobs')
export class Job {
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

  @Column()
  salary: number;

  @Column()
  @Index()
  country: string;

  @ManyToMany(() => Skill, { eager: false })
  @JoinTable()
  skills: Skill[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.slug = slugify(this.name);
    }
  }
}
