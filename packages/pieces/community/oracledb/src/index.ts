import {
  PieceAuth,
  Property,
  createPiece,
} from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';
import actions from './lib/actions';

export const oracledbAuth = PieceAuth.CustomAuth({
  props: {
    user: Property.ShortText({
      displayName: 'Username',
      required: true,
      description: 'The username to use for connecting to the oracledb server',
    }),
    password: PieceAuth.SecretText({
      displayName: 'Password',
      description: 'The password to use to identify at the oracledb server',
      required: true,
    }),
    connectString: Property.ShortText({
      displayName: 'Connect String',
      required: true,
      description: 'The connectString or address of the oracledb server',
    }),
  },
  required: true,
});

export const oracle = createPiece({
  displayName: "OracleDB",
  auth: oracledbAuth,
  minimumSupportedRelease: '0.20.0',
  logoUrl: "https://cdn.activepieces.com/pieces/oracledb.png",
  categories: [PieceCategory.DEVELOPER_TOOLS],
  authors: ["bnason"],
  actions,
  triggers: [],
});
