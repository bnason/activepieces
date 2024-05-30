import { createAction, Property } from '@activepieces/pieces-framework';
import { oracledbCommon, oracledbConnect, sanitizeColumnName, warningMarkdown } from '../common';
import { oracledbAuth } from '../..';
import OracleDB from 'oracledb';

export default createAction({
  auth: oracledbAuth,
  name: 'find_rows',
  displayName: 'Find Rows',
  description: 'Reads rows from a table',
  props: {
    markdown: warningMarkdown,
    table: oracledbCommon.table(),
    condition: Property.ShortText({
      displayName: 'Condition',
      description: 'SQL condition, can also include logic operators, etc.',
      required: true,
    }),
    args: Property.Array({
      displayName: 'Arguments',
      description: 'Arguments can be used using :N in the condition',
      required: false,
    }),
    columns: Property.Array({
      displayName: 'Columns',
      description: 'Specify the columns you want to select',
      required: false,
    }),
  },
  async run(context) {
    const columns = (!context.propsValue.columns?.length) ? ['*'] : (context.propsValue.columns as string[]);
    const qsColumns = columns.join(',');

    const qs = `SELECT ${qsColumns} FROM ${context.propsValue.table} WHERE ${context.propsValue.condition}`;
    const conn = await oracledbConnect(context.auth, context.propsValue);

    try {
      const results = await conn.execute(qs, context.propsValue.args as OracleDB.BindParameters);
      return { results: results };
    } finally {
      await conn.close();
    }
  },
});
