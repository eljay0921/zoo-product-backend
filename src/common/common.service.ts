import { Injectable } from '@nestjs/common';
import { DB_HOST, DB_PSWD, DB_USER } from './database/mariadb-constants';

const mariadb = require('mariadb');

@Injectable()
export class CommonService {
    async checkUser(id:string, pw:string): Promise<boolean> {
        // TODO : chekc user id & password
        return true;
    }

    async checkUserDatabase(id: string): Promise<boolean> {
        const conn = await mariadb.createConnection({
            host: DB_HOST, 
            user: DB_USER, 
            password: DB_PSWD,
        });

        try {
            const userDBName = `ProductManage_${id}`;
            const result = await conn.query(`SHOW DATABASES LIKE '${userDBName}'`);
            const resultJson = JSON.parse(JSON.stringify(result));
            return resultJson.length > 0;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            if(conn) {
                conn.close();
            }
        }        
    }

    async createUserDatabase(id: string): Promise<boolean> {
        const conn = await mariadb.createConnection({
            host: DB_HOST, 
            user: DB_USER, 
            password: DB_PSWD,
            multipleStatements: true,
        });
        try {
            const userDBName = `ProductManage_${id}`;
            const dbEngineAndOptions = 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 KEY_BLOCK_SIZE=8';

            await conn.query(`CREATE DATABASE ${userDBName};`).then(results => {
                console.log('# CREATE DB : ', results);
            });

            await conn.query(`
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
              
            `);
            
          return true;
        } catch (err) {
          console.log(err);
          return false;
        } finally {
            if(conn) {
                conn.close();
            }
        }
    }

    async truncateUserDatabase(id: string): Promise<boolean> {
        const conn = await mariadb.createConnection({
            host: DB_HOST, 
            user: DB_USER, 
            password: DB_PSWD,
            multipleStatements: true,
        });
        try {
            const userDBName = `ProductManage_${id}`;

            await conn.query(`
                set FOREIGN_KEY_CHECKS = 0;

                TRUNCATE TABLE ${userDBName}.selection_detail;
                TRUNCATE TABLE ${userDBName}.master_selection;
                TRUNCATE TABLE ${userDBName}.master_addoption;
                TRUNCATE TABLE ${userDBName}.master_extend;
                TRUNCATE TABLE ${userDBName}.master_image;
                TRUNCATE TABLE ${userDBName}.master_item;
                TRUNCATE TABLE ${userDBName}.market_templates;

                set FOREIGN_KEY_CHECKS = 1;
            `).then(result => {
                console.log('# TRUNCATE TABLES : ', result);
            })

            return true;
        } catch (err) {
            console.log(err);
            return false;
        } finally {
            if (conn) {
                conn.close();
            }
        }
    }
}
