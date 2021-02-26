import { InputType, ObjectType, OmitType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Photo } from "../entities/photo.entity";

@InputType()
export class CreatePhotoInput extends OmitType(Photo, ['id', 'user']) {}

@ObjectType()
export class CreatePhotoOutput extends CoreOutput {}