import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { MasterItem } from '../entities/master-items.entity';

@ObjectType()
export class ReadMasterItemsOutput extends CoreOutput {
  @Field((type) => Number, { nullable: true })
  count?: number = 0;

  @Field((type) => [MasterItem], { nullable: true })
  masterItems?: MasterItem[];
}
