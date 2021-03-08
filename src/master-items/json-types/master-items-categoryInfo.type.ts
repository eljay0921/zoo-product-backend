import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType({isAbstract:true})
@ObjectType()
export class MasterItemCategoryInfo {

    @Field(() => String)
    fullCode:string

    @Field(() => String)
    depth1Code:string
    @Field(() => String)
    depth1Name:string

    @Field(() => String)
    depth2Code:string
    @Field(() => String)
    depth2Name:string

    @Field(() => String)
    depth3Code:string
    @Field(() => String)
    depth3Name:string

    @Field(() => String, { nullable:true })
    depth4Code?:string
    @Field(() => String, { nullable:true })
    depth4Name?:string

    @Field(() => String, { nullable:true })
    depth5Code?:string
    @Field(() => String, { nullable:true })
    depth5Name?:string
}