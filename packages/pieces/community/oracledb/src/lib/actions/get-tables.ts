import { createAction } from '@activepieces/pieces-framework';
import { oracledbConnect, oracledbGetTableNames } from '../common';
import { oracledbAuth } from '../..';

export default createAction({
  auth: oracledbAuth,
  name: 'get_tables',
  displayName: 'Get Tables',
  description: 'Returns a list of tables in the database',
  props: {},
  async run(context) {
    const conn = await oracledbConnect(context.auth, context.propsValue);
    try {
      const tables = await oracledbGetTableNames(conn);
      return { tables };
    } finally {
      await conn.close();
    }
  },
});
