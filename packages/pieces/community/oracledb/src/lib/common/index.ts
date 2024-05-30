import {
  PiecePropValueSchema,
  Property,
  StaticPropsValue,
} from '@activepieces/pieces-framework';
import OracleDB from 'oracledb';
import { oracledbAuth } from '../..';
import sqlstring from 'sqlstring';

OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

export const warningMarkdown = Property.MarkDown({
  value: `
  **DO NOT** use dynamic input directly in the query string or column names.
  \n
  Use **:N** in the query and dynamic values in args/values for parameterized queries to prevent **SQL injection**.`
});

export async function oracledbConnect(
  auth: PiecePropValueSchema<typeof oracledbAuth>,
  propsValue: StaticPropsValue<any>
): Promise<OracleDB.Connection> {
  const conn = await OracleDB.getConnection({
    user: auth.user,
    password: auth.password,
    connectString: auth.connectString,
  });
  return conn;
}

export async function oracledbGetTableNames(conn: OracleDB.Connection): Promise<string[]> {
  const result = await conn.execute<{ TABLE_NAME: string }>('SELECT TABLE_NAME FROM USER_TABLES');
  if (!result.rows) {
    return [];
  }
  return result.rows.map((row) => row.TABLE_NAME);
}

export const oracledbCommon = {
  table: (required = true) =>
    Property.Dropdown({
      displayName: 'Table',
      required,
      refreshers: [],
      options: async ({ auth }) => {
        if (!auth) {
          return {
            disabled: true,
            placeholder: 'Connect to your database first',
            options: [],
          };
        }
        const conn = await oracledbConnect(
          auth as PiecePropValueSchema<typeof oracledbAuth>,
          { auth }
        );
        const tables = await oracledbGetTableNames(conn);
        await conn.close();
        return {
          disabled: false,
          options: tables.map((table) => {
            return {
              label: table,
              value: table,
            };
          }),
        };
      },
    }),
};


export function sanitizeColumnName(name: string | undefined): string {
  if ( name == '*') {
    return name;
  }
  return sqlstring.escapeId(name);
}
