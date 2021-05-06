import { Injectable } from '@nestjs/common';
import {
  getDatabaseName,
  sendQuery,
} from './database/connection/mariadb.adapter';
import { CommonOutput } from './dtos/output.dto';
@Injectable()
export class CommonService {
  async checkUser(id: string, pw: string): Promise<boolean> {
    // TODO : chekc user id & password
    return true;
  }

  async checkUserDatabase(id: string): Promise<CommonOutput> {
    const dbName = getDatabaseName(id);
    const query = `SHOW DATABASES LIKE '${dbName}'`;
    const result = await sendQuery(query);
    if (result.ok && result.result.length > 0) {
      return {
        ok: true,
        message: `Database ${dbName} exists.`,
      };
    } else {
      return {
        ok: false,
        message: `Database ${dbName} not exists.`,
      };
    }
  }

  async createUserDatabase(id: string): Promise<CommonOutput> {
    const userDBName = `ProductManage_${id}`;

    const createDBQuery = `CREATE DATABASE ${userDBName};`;
    const createResult = await sendQuery(createDBQuery);
    if (!createResult.ok) {
      return {
        ok: false,
        error: createResult.error,
      };
    }

    const dbEngineAndOptions =
      'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 KEY_BLOCK_SIZE=8';
    const createTablesQuery = `
            CREATE TABLE ${userDBName}.\`market_templates\` (
                \`id\` int(11) NOT NULL AUTO_INCREMENT\,
                \`marketCode\` varchar(1) NOT NULL\,
                \`marketSubCode\` varchar(4) NOT NULL\,
                \`smid\` int(11) NOT NULL\,
                \`marketID\` varchar(40) NOT NULL\,
                \`name\` varchar(100) NOT NULL\,
                \`description\` varchar(100) NOT NULL\,
                \`baseInfo\` text NOT NULL\,
                \`basicExtendInfo\` text DEFAULT NULL\,
                \`extendInfo\` text DEFAULT NULL\,
                \`deliveryInfo\` text DEFAULT NULL\,
                \`addServiceInfo\` text DEFAULT NULL\,
                \`etcInfo\` text DEFAULT NULL\,
                \`createdAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6)\,
                \`updatedAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6)\,
                PRIMARY KEY (\`id\`)
            ) ${dbEngineAndOptions};

            CREATE TABLE ${userDBName}.\`master_item\` (
                \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
                \`name\` varchar(300) NOT NULL,
                \`categoryCode\` varchar(12) NOT NULL,
                \`categoryInfo\` text DEFAULT NULL,
                \`price\` int(11) NOT NULL,
                \`count\` int(11) NOT NULL,
                \`userCode\` varchar(40) DEFAULT NULL,
                \`description\` text DEFAULT NULL,
                \`additionalInfo\` text DEFAULT NULL,
                \`sellingItemInfo\` text DEFAULT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
                PRIMARY KEY (\`id\`)
              ) ${dbEngineAndOptions};

            CREATE TABLE ${userDBName}.\`master_addoption\` (
                \`order\` smallint(6) NOT NULL,
                \`name\` varchar(100) NOT NULL,
                \`value\` varchar(100) NOT NULL,
                \`count\` int(11) NOT NULL,
                \`price\` int(11) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
                \`masterItemId\` int(10) unsigned NOT NULL,
                PRIMARY KEY (\`order\`,\`masterItemId\`),
                KEY \`master_addoption_ibfk_id\` (\`masterItemId\`),
                CONSTRAINT \`master_addoption_ibfk_id\` FOREIGN KEY (\`masterItemId\`) REFERENCES \`master_item\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
              ) ${dbEngineAndOptions};
              
              
            CREATE TABLE ${userDBName}.\`master_extend\` (
                \`marketCode\` char(1) NOT NULL,
                \`marketSubCode\` char(4) NOT NULL,
                \`info\` varchar(255) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
                \`masterItemId\` int(10) unsigned NOT NULL,
                PRIMARY KEY (\`marketCode\`,\`marketSubCode\`,\`masterItemId\`),
                KEY \`master_extend_ibfk_id\` (\`masterItemId\`),
                CONSTRAINT \`master_extend_ibfk_id\` FOREIGN KEY (\`masterItemId\`) REFERENCES \`master_item\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
              ) ${dbEngineAndOptions};
              
              
            CREATE TABLE ${userDBName}.\`master_image\` (
                \`order\` tinyint(4) NOT NULL,
                \`url\` varchar(1000) NOT NULL,
                \`extendInfo\` text DEFAULT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
                \`masterItemId\` int(10) unsigned NOT NULL,
                PRIMARY KEY (\`order\`,\`masterItemId\`),
                KEY \`master_image_ibfk_id\` (\`masterItemId\`),
                CONSTRAINT \`master_image_ibfk_id\` FOREIGN KEY (\`masterItemId\`) REFERENCES \`master_item\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
              ) ${dbEngineAndOptions};
              
              
            CREATE TABLE ${userDBName}.\`master_selection\` (
                \`selectionId\` int(10) unsigned NOT NULL AUTO_INCREMENT,
                \`type\` int(11) NOT NULL,
                \`options\` text NOT NULL,
                \`createAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
                \`masterItemId\` int(10) unsigned DEFAULT NULL,
                PRIMARY KEY (\`selectionId\`),
                UNIQUE KEY \`REL_3c665db984c5a94e12bc4781b0\` (\`masterItemId\`),
                CONSTRAINT \`master_selection_ibfk_id\` FOREIGN KEY (\`masterItemId\`) REFERENCES \`master_item\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
              ) ${dbEngineAndOptions};
              
              
            CREATE TABLE ${userDBName}.\`selection_detail\` (
                \`order\` smallint(6) NOT NULL,
                \`count\` int(11) NOT NULL,
                \`price\` int(11) NOT NULL,
                \`values\` text DEFAULT NULL,
                \`userCode\` varchar(40) DEFAULT NULL,
                \`extendInfo\` text DEFAULT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
                \`selectionBaseSelectionId\` int(10) unsigned NOT NULL,
                PRIMARY KEY (\`order\`,\`selectionBaseSelectionId\`),
                KEY \`selection_detail_ibfk_selectionId\` (\`selectionBaseSelectionId\`),
                CONSTRAINT \`selection_detail_ibfk_selectionId\` FOREIGN KEY (\`selectionBaseSelectionId\`) REFERENCES \`master_selection\` (\`selectionId\`) ON DELETE CASCADE ON UPDATE NO ACTION
              ) ${dbEngineAndOptions}; 
            `;

    const createTableResult = await sendQuery(createTablesQuery);
    return {
      ok: createTableResult.ok,
      message: `# CREATE TABLES : ${userDBName}`,
      error: createResult.error,
    };
  }

  async truncateUserDatabase(id: string): Promise<CommonOutput> {
    const userDBName = getDatabaseName(id);
    const query = `
        set FOREIGN_KEY_CHECKS = 0;
        TRUNCATE TABLE ${userDBName}.selection_detail;
        TRUNCATE TABLE ${userDBName}.master_selection;
        TRUNCATE TABLE ${userDBName}.master_addoption;
        TRUNCATE TABLE ${userDBName}.master_extend;
        TRUNCATE TABLE ${userDBName}.master_image;
        TRUNCATE TABLE ${userDBName}.master_item;
        TRUNCATE TABLE ${userDBName}.market_templates;
        set FOREIGN_KEY_CHECKS = 1;`;

    const truncateResult = await sendQuery(query);
    return {
      ok: truncateResult.ok,
      message: `# TRUNCATE TABLES : ${userDBName}`,
      error: truncateResult.error,
    };
  }
}
