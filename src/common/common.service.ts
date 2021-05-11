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

    CREATE TABLE ${userDBName}.\`folder\` (
      \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
      \`parentId\` int(10) unsigned DEFAULT NULL,
      \`name\` varchar(40) NOT NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
      PRIMARY KEY (\`id\`)
    ) ${dbEngineAndOptions};
    
    CREATE TABLE ${userDBName}.\`item\` (
      \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
      \`name\` varchar(300) NOT NULL,
      \`categoryCode\` varchar(12) NOT NULL,
      \`categoryInfo\` text DEFAULT NULL,
      \`price\` int(11) NOT NULL,
      \`count\` int(11) NOT NULL,
      \`userCode\` varchar(40) DEFAULT NULL,
      \`describe\` text DEFAULT NULL,
      \`additionalInfo\` text DEFAULT NULL,
      \`sellingItemInfo\` text DEFAULT NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
      PRIMARY KEY (\`id\`)
      ) ${dbEngineAndOptions};    
    
    CREATE TABLE ${userDBName}.\`template\` (
      \`id\` int(11) NOT NULL AUTO_INCREMENT,
      \`marketCode\` varchar(1) NOT NULL,
      \`marketSubCode\` varchar(4) DEFAULT NULL,
      \`smid\` int(11) NOT NULL,
      \`marketID\` varchar(40) NOT NULL,
      \`name\` varchar(100) NOT NULL,
      \`description\` varchar(100) NOT NULL,
      \`baseInfo\` text NOT NULL,
      \`basicExtendInfo\` text DEFAULT NULL,
      \`extendInfo\` text DEFAULT NULL,
      \`deliveryInfo\` text DEFAULT NULL,
      \`addServiceInfo\` text DEFAULT NULL,
      \`etcInfo\` text DEFAULT NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
      PRIMARY KEY (\`id\`)
      ) ${dbEngineAndOptions};    
    
    CREATE TABLE ${userDBName}.\`folder_item\` (
      \`createdAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
      \`updatedAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
      \`folderId\` int(10) unsigned NOT NULL,
      \`itemId\` int(10) unsigned NOT NULL,
      PRIMARY KEY (\`folderId\`,\`itemId\`),
      KEY \`folder_item_ibfk_itemId\` (\`itemId\`),
      CONSTRAINT \`folder_item_ibfk_folderId\` FOREIGN KEY (\`folderId\`) REFERENCES \`folder\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
      CONSTRAINT \`folder_item_ibfk_itemId\` FOREIGN KEY (\`itemId\`) REFERENCES \`item\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ${dbEngineAndOptions};    
    
    CREATE TABLE ${userDBName}.\`item_addoption\` (
      \`order\` smallint(6) NOT NULL,
      \`name\` varchar(100) NOT NULL,
      \`value\` varchar(100) NOT NULL,
      \`count\` int(11) NOT NULL,
      \`price\` int(11) NOT NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
      \`itemId\` int(10) unsigned NOT NULL,
      PRIMARY KEY (\`order\`,\`itemId\`),
      KEY \`item_addoption_ibfk_itemId\` (\`itemId\`),
      CONSTRAINT \`item_addoption_ibfk_itemId\` FOREIGN KEY (\`itemId\`) REFERENCES \`item\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ${dbEngineAndOptions};    
    
    CREATE TABLE ${userDBName}.\`item_extend\` (
      \`marketCode\` char(1) NOT NULL,
      \`marketSubCode\` char(4) NOT NULL,
      \`info\` varchar(255) NOT NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
      \`itemId\` int(10) unsigned NOT NULL,
      PRIMARY KEY (\`marketCode\`,\`marketSubCode\`,\`itemId\`),
      KEY \`item_extend_ibfk_itemId\` (\`itemId\`),
      CONSTRAINT \`item_extend_ibfk_itemId\` FOREIGN KEY (\`itemId\`) REFERENCES \`item\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ${dbEngineAndOptions};    
    
    CREATE TABLE ${userDBName}.\`item_image\` (
      \`order\` tinyint(4) NOT NULL,
      \`url\` varchar(1000) NOT NULL,
      \`extend\` text DEFAULT NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
      \`itemId\` int(10) unsigned NOT NULL,
      PRIMARY KEY (\`order\`,\`itemId\`),
      KEY \`item_image_ibfk_itemId\` (\`itemId\`),
      CONSTRAINT \`item_image_ibfk_itemId\` FOREIGN KEY (\`itemId\`) REFERENCES \`item\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ${dbEngineAndOptions};    
    
    CREATE TABLE ${userDBName}.\`item_selection\` (
      \`id\` int(10) unsigned NOT NULL AUTO_INCREMENT,
      \`type\` int(11) NOT NULL,
      \`options\` text NOT NULL,
      \`createAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
      \`itemId\` int(10) unsigned DEFAULT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`REL_a78ad8a5853555a0ca22052c5c\` (\`itemId\`),
      CONSTRAINT \`item_selection_ibfk_itemId\` FOREIGN KEY (\`itemId\`) REFERENCES \`item\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ${dbEngineAndOptions};    
    
    CREATE TABLE ${userDBName}.\`item_selection_detail\` (
      \`order\` smallint(6) NOT NULL,
      \`count\` int(11) NOT NULL,
      \`price\` int(11) NOT NULL,
      \`values\` text DEFAULT NULL,
      \`userCode\` varchar(40) DEFAULT NULL,
      \`extendInfo\` text DEFAULT NULL,
      \`createdAt\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
      \`selectionId\` int(10) unsigned NOT NULL,
      PRIMARY KEY (\`order\`,\`selectionId\`),
      KEY \`item_selection_detail_ibfk_selectionId\` (\`selectionId\`),
      CONSTRAINT \`item_selection_detail_ibfk_selectionId\` FOREIGN KEY (\`selectionId\`) REFERENCES \`item_selection\` (\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
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
        TRUNCATE TABLE ${userDBName}.user_folder_master_item;
        TRUNCATE TABLE ${userDBName}.user_folder;
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
