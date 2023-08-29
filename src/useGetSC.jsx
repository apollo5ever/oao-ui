import to from 'await-to-js';
import { useContext } from 'react';
import { LoginContext } from './LoginContext';
import LoggerContext, { LOG } from '@/components/providers/LoggerContext.jsx';

export function useGetSC() {
  const [state, setState] = useContext(LoginContext);
  const logger = useContext(LoggerContext);

  async function getSC(scid, keysstring) {
    if (state.daemon == 'rpc') {
      const deroBridgeApi = state.deroBridgeApiRef.current;

      const [err, res] = await to(
        deroBridgeApi.daemon('get-sc', {
          scid: scid,
          variables: true,
          keysstring: keysstring,
        })
      );
      return res.data.result;
    } else if (state.daemon == 'pools') {
      let data;
      if (keysstring) {
        data = JSON.stringify({
          jsonrpc: '2.0',
          id: '1',
          method: 'DERO.GetSC',
          params: {
            scid: scid,
            code: false,
            variables: true,
            keysstring: keysstring,
          },
        });
      } else {
        data = JSON.stringify({
          jsonrpc: '2.0',
          id: '1',
          method: 'DERO.GetSC',
          params: {
            scid: scid,
            code: false,
            variables: true,
          },
        });
      }

      let res = await fetch(`https://dero-api.mysrv.cloud/json_rpc`, {
        method: 'POST',

        body: data,
        headers: { 'Content-Type': 'application/json' },
      });
      let body = await res.json();
      let scData = body.result;
      console.log(`scData ${scid}`, scData);
      logger(LOG.API, 'useGetSC', `scData ${scid}`, scData);

      return scData;
    }
  }

  return [getSC];
}
