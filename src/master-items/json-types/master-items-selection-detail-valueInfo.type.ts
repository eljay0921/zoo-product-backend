import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

// 무게 단위
enum weightUnit {
  mg, // 밀리그램
  g, // 그램
  kg, // 킬로그램
  t, // 톤
  kt, // 킬로톤
  gr, // 그레인
  oz, // 온스
  lb, // 파운드
  don, // 돈 (3.75g)
  nyang, // 냥 (37.5g)
  geun, // 근 (600g)
  gwan, // 관 (3.75kg)
}

// 부피/용량 단위
enum capacityUnit {
  cc, // 씨씨
  ml, // 밀리리터
  dl, // 데시리터
  l, // 리터
  cm3, // 세제곱 센티미터
  m3, // 세제곱 미터
  in3, // 세제곱 인치
  ft3, // 세제곱 피트
  yd3, // 세제곱 야드
  gal, // 갤런
  bbl, // 배럴
  oz, // 온스
  hop, // 홉
  doe, // 되
  mal, // 말
}

registerEnumType(weightUnit, { name: 'weightUnit' });
registerEnumType(capacityUnit, { name: 'capacityUnit' });

@InputType({ isAbstract: true })
@ObjectType()
export class MasterItemSelectionDetailValueInfo {
  @Field(() => Number, { nullable: true })
  weight?: number;

  @Field(() => weightUnit, { nullable: true })
  weightUnit?: weightUnit;

  @Field(() => Number, { nullable: true })
  capacity?: number;

  @Field(() => capacityUnit, { nullable: true })
  capacityUnit?: capacityUnit;
}
