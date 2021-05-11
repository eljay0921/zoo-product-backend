import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CommonOutput } from 'src/common/dtos/output.dto';
import { getManager, Repository } from 'typeorm';
import { Template } from './entities/template.entity';

@Injectable()
export class TemplateService {

  private readonly templateRepo: Repository<Template>;
  constructor(@Inject(REQUEST) private readonly request) {
    this.templateRepo = getManager(
      this.request.dbname,
    ).getRepository(Template);
  }

  async getMarketTemplate(
    templateId: number,
  ): Promise<CommonOutput> {
    try {

      const marketTemplate = await this.templateRepo.findOne({
        id: templateId,
      });

      if (marketTemplate) {
        return {
          ok: true,
          data: marketTemplate,
        };
      } else {
        return {
          ok: false
        };
      }
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async getMarketTemplates(
    marketCode: string,
    marketSubCode?: string,
  ): Promise<CommonOutput> {
    try {

      let marketTemplates;
      if(marketSubCode) {
        marketTemplates = await this.templateRepo.find({marketCode, marketSubCode});
      } else {
        marketTemplates = await this.templateRepo.find({marketCode});
      }

      if (marketTemplates) {
        return {
          ok: true,
          count: marketTemplates.length,
          data: marketTemplates,
        };
      } else {
        return {
          ok: false
        };
      }
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async insertMarketTemplate(
    marketTemplatesInput: Template,
  ): Promise<CommonOutput> {
    try {
      const result = await this.templateRepo.insert(
        this.templateRepo.create(marketTemplatesInput),
      );
      return {
        ok: true,
        data:{
          templateId: result.raw.insertId,
        }
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async deleteMarketTemplate(id: number): Promise<CommonOutput> {
    try {
      await this.templateRepo.delete({id});
      return {
        ok: true
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }
}
