import { createAction, Property } from '@activepieces/pieces-framework';
import { oracledbCommon, oracledbConnect, warningMarkdown } from '../common';
import { oracledbAuth } from '../..';

export default createAction({
  auth: oracledbAuth,
  name: 'delete_row',
  displayName: 'Delete Row',
  description: 'Deletes one or more rows from a table',
  props: {
    markdown: warningMarkdown,
    table: oracledbCommon.table(),
    search_column: Property.ShortText({
      displayName: 'Search Column',
      required: true,
    }),
    search_value: Property.ShortText({
      displayName: 'Search Value',
      required: true,
    }),
  },
  async run(context) {
    const tableName = context.propsValue.table;
    const searchColumn = context.propsValue.search_column;
    const searchValue = context.propsValue.search_value;

    const queryString = `DELETE FROM ${tableName} WHERE ${searchColumn} = :0`;

    const connection = await oracledbConnect(context.auth, context.propsValue);
    try {
      const result = await connection.execute(queryString, [searchValue]);
      return result;
    } finally {
      await connection.close();
    }
  },
});
