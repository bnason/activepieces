import { createAction, Property } from '@activepieces/pieces-framework';
import { oracledbConnect, warningMarkdown } from '../common';
import { oracledbAuth } from '../..';

export default createAction({
  auth: oracledbAuth,
  name: 'execute_query',
  displayName: 'Execute Query',
  description: 'Executes a query on the mysql database and returns the results',
  props: {
    markdown: warningMarkdown,
    query: Property.ShortText({
      displayName: 'Query',
      description: 'The query string to execute, use :N for arguments to avoid SQL injection.',
      required: true,
    }),
    args: Property.Array({
      displayName: 'Arguments',
      description: 'Arguments to use in the query, if any. Should be in the same order as the :N in the query string..',
      required: false,
    }),
  },
  async run(context) {
    const conn = await oracledbConnect(context.auth, context.propsValue);
    try {
      const results = await conn.execute(
        context.propsValue.query,
        context.propsValue.args || []
      );
      return Array.isArray(results) ? { results } : results;
    } finally {
      await conn.close();
    }
  },
});
