import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Extend } from 'src/item/entities/item-extend.entity';
import { AdditionalInfo } from '../json-types/item-additionalInfo.type';
import { SellingItemInfo } from '../json-types/item-sellingItemInfo.type';
import { CategoryInfo } from '../json-types/item-categoryInfo.type';
import { Addoption } from './item-addoption.entity';
import { Image } from './item-image.entity';
import { Selection } from './item-selection.entity';
import { FolderItem } from 'src/folder/entities/folder-item.entity';

// 원본상품
@Entity('item')
export class Item {
  // 개별 DB로 갈 경우 INT로 충분, 통합 DB이면서 파티셔닝(또는 샤딩)할 경우 BIGINT로 고려
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id?: number;

  @Column({ length: 300 })
  name: string;

  @Column({ length: 12 })
  categoryCode: string;

  @Column('simple-json', { nullable: true })
  categoryInfo?: CategoryInfo;

  @Column()
  price: number;

  @Column()
  count: number;

  @Column({ length: 40, nullable: true })
  userCode?: string;

  @Column({ type: 'text', nullable: true })
  describe?: string;

  @Column('simple-json', { nullable: true })
  additionalInfo?: AdditionalInfo;

  @Column('simple-json', { nullable: true })
  sellingItemInfo?: SellingItemInfo;

  @CreateDateColumn()
  createdAt?: Date;

  @CreateDateColumn()
  updatedAt?: Date;

  // relation entities
  @OneToOne(() => Selection, (base) => base.item, {
    cascade: true,
  })
  selection?: Selection;

  @OneToMany(() => Image, (image) => image.item, {
    cascade: true,
  })
  images?: Image[];

  @OneToMany(() => Addoption, (addOption) => addOption.item, {
    cascade: true,
  })
  addOptions?: Addoption[];

  @OneToMany(() => Extend, (ext) => ext.item, {
    cascade: true,
  })
  extends?: Extend[];

  @OneToMany(
    () => FolderItem,
    (userFolderMasterItem) => userFolderMasterItem.item,
    {
      cascade: true,
    },
  )
  folderItems?: FolderItem[];
}
