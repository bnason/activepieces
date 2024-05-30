import { createAction, Property } from '@activepieces/pieces-framework';
import { oracledbCommon, oracledbConnect } from '../common';
import { oracledbAuth } from '../..';
import sqlstring from 'sqlstring';

export default createAction({
  auth: oracledbAuth,
  name: 'insert_row',
  displayName: 'Insert Row',
  description: 'Inserts a new row into a table',
  props: {
    table: oracledbCommon.table(),
    values: Property.Object({
      displayName: 'Values',
      required: true,
    }),
  },
  async run(context) {
    const fields = Object.keys(context.propsValue.values);
    const qsFields = fields.join(',');
    const qsValues = fields.map(() => '?').join(',');
    const qs = `INSERT INTO ${context.propsValue.table} (${qsFields}) VALUES (${qsValues});`;
    const conn = await oracledbConnect(context.auth, context.propsValue);
    try {
      const values = fields.map((f) => context.propsValue.values[f]);
      const result = await conn.execute(qs, values);
      return result;
    } finally {
      await conn.close();
    }
  },
});
