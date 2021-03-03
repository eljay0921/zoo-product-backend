import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";

enum Tax {
    Taxation,
    TaxFree,
}

registerEnumType(Tax, { name: "Tax" });

@InputType({isAbstract:true})
@ObjectType()
export class AdditionalInfo {
    @Field(() => Tax, { nullable:true })
    tax?:Tax

    @Field(() => String, { nullable:true })
    origin?:string

    @Field(() => String, { nullable:true })
    brand?:string
}