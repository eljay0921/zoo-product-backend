
import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";

enum SendType {
    None,
    ECoupon,
    DoorToDoor,
    Post,
    Quick,
    Direct,
    Cargo,
    Joint,
    Center,
    Visit,
}

enum SendPayType {
    None,
    Arrived,
    Free,
    Condition,
    Group,
    Individual,
}

registerEnumType(SendType, { name: "SendType" });
registerEnumType(SendPayType, { name: "SendPayType" });

@InputType({isAbstract:true})
@ObjectType()
export class SellingItemInfo {
    @Field(() => SendType, { nullable:true })
    sendType?:SendType

    @Field(() => SendPayType, { nullable:true })
    sendPayType?:SendPayType

    @Field(() => String, { nullable:true })
    sourceMarket?:string

    @Field(() => String, { nullable:true })
    sellerId?:string

    @Field(() => String, { nullable:true })
    sellingItemNo?:string

    @Field(() => String, { nullable:true })
    itemLink?:string
}