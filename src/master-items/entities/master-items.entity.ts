import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MasterItemExtend } from 'src/master-items/entities/master-items-extend.entity';
import { MasterItemAdditionalInfo } from '../json-types/master-items-additionalInfo.type';
import { MasterItemSellingItemInfo } from '../json-types/master-items-sellingItemInfo.type';
import { MasterItemCategoryInfo } from '../json-types/master-items-categoryInfo.type';
import { MasterItemAddoption } from './master-items-addoption.entity';
import { MasterItemImage } from './master-items-image.entity';
import { MasterItemSelectionBase } from './master-items-selection-base.entity';
import { UserFolderMasterItem } from 'src/user-folder/entities/user-folder-master-item.entity';

@Entity('master_item')
export class MasterItem {
  // 개별 DB로 갈 경우 INT로 충분, 통합 DB이면서 파티셔닝(또는 샤딩)할 경우 BIGINT로 고려
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id?: number;

  @Column({ length: 300 })
  name: string;

  @Column({ length: 12 })
  categoryCode: string;

  @Column('simple-json', { nullable: true })
  categoryInfo?: MasterItemCategoryInfo;

  @Column()
  price: number;

  @Column()
  count: number;

  @Column({ length: 40, nullable: true })
  userCode?: string;

  @Column({ type: 'text', nullable: true })
  describe?: string;

  @Column('simple-json', { nullable: true })
  additionalInfo?: MasterItemAdditionalInfo;

  @Column('simple-json', { nullable: true })
  sellingItemInfo?: MasterItemSellingItemInfo;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;

  // relation entities
  @OneToOne(() => MasterItemSelectionBase, (base) => base.masterItem, {
    cascade: true,
  })
  selection?: MasterItemSelectionBase;

  @OneToMany(() => MasterItemImage, (image) => image.masterItem, {
    cascade: true,
  })
  images?: MasterItemImage[];

  @OneToMany(() => MasterItemAddoption, (addOption) => addOption.masterItem, {
    cascade: true,
  })
  addOptions?: MasterItemAddoption[];

  @OneToMany(() => MasterItemExtend, (ext) => ext.masterItem, {
    cascade: true,
  })
  extends?: MasterItemExtend[];

  @OneToMany(
    () => UserFolderMasterItem,
    (userFolderMasterItem) => userFolderMasterItem.masterItem,
    {
      cascade: true,
    },
  )
  userFolderMasterItems?: UserFolderMasterItem[];
}
