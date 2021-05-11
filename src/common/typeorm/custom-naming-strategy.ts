import { DefaultNamingStrategy, Table, NamingStrategyInterface } from 'typeorm';
import crypto from 'crypto';

export class CustomNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface {
  foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    referencedTablePath?: string,
    referencedColumnNames?: string[],
  ): string {
    tableOrName =
      typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

    // console.log('#1', tableOrName);
    // console.log('#2', columnNames);
    // console.log('#3', referencedTablePath);
    // console.log('#4', referencedColumnNames);

    // const name = columnNames.reduce(
    //   (name, column) => {
    //       console.log('##', name, column);
    //       return `${name}_${column}_${tableOrName}_${referencedTablePath}`;
    //     }
    // );

    const name = `${tableOrName}_ibfk_${columnNames.join('_')}`;
    // console.log('#5', name);

    return name;
    // return `fk_${crypto.createHash('md5').update(name).digest('hex')}`;
  }

  uniqueConstraintName(
    tableOrName: Table | string,
    columnNames: string[],
  ): string {
    tableOrName =
      typeof tableOrName === 'string' ? tableOrName : tableOrName.name;
    const name = `${tableOrName}_ibuk_${columnNames.join('_')}`;
    return name;
  }
}
