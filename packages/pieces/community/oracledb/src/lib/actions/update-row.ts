import { createAction, Property } from '@activepieces/pieces-framework';
import { oracledbCommon, oracledbConnect } from '../common';
import { oracledbAuth } from '../..';
import sqlstring from 'sqlstring';

export default createAction({
  auth: oracledbAuth,
  name: 'update_row',
  displayName: 'Update Row',
  description: 'Updates one or more rows in a table',
  props: {
    table: oracledbCommon.table(),
    values: Property.Object({
      displayName: 'Values',
      required: true,
    }),
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
    const fields = Object.keys(context.propsValue.values);
    const qsValues = fields.map((f, index) => f + `= :${index}}`).join(',');
    const qs = `UPDATE ${context.propsValue.table} SET ${qsValues} WHERE ${sqlstring.escape(context.propsValue.search_column)} = :${qsValues.length}`;
    const conn = await oracledbConnect(context.auth, context.propsValue);
    try {
    const values = fields.map((f) => context.propsValue.values[f]);
      const result = await conn.execute(qs, [
        ...values,
        context.propsValue.search_value,
      ]);
      return result;
    } finally {
      await conn.close();
    }
  },
});
