import { BaseEntity, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class Track extends BaseEntity {
  @PrimaryColumn()
  id: string;
}
