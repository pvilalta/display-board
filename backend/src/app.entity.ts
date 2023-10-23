import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class Timing {
  @Column({ nullable: true })
  id: string;

  @Column({ nullable: true })
  startDate: string;

  @Column({ nullable: true })
  endDate: string;
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayId: string;

  @Column()
  text: string;

  @Column()
  color: string;

  @Column()
  motion: string;

  @Column({ type: 'json', nullable: true })
  timing?: Timing[];
}
