/********************************************************************************
 *   Ledger Node JS API
 *   (c) 2016-2017 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ********************************************************************************/
import type Transport from "@ledgerhq/hw-transport";
import { Common, GetPublicKeyResult, SignTransactionResult, GetVersionResult, buildBip32KeyPayload, splitPath } from "hw-app-obsidian-common";

export { GetPublicKeyResult, SignTransactionResult, GetVersionResult };

/**
 * Kadena API
 *
 * @example
 * import Kadena from "hw-app-kda";
 * const kda = new Kadena(transport)
 */

export default class Kadena extends Common {
  
  constructor(transport: Transport) {
    super(transport, "KDA");
  }

  /**
    * Sign a transaction with the key at a BIP32 path.
    *
    * @param txn - The transaction; this can be any of a node Buffer, Uint8Array, or a hexadecimal string, encoding the form of the transaction appropriate for hashing and signing.
    * @param path - the path to use when signing the transaction.
    */
  async signHash(
    path: string,
    hash: string | Buffer | Uint8Array,
  ): Promise<SignTransactionResult> {
    const paths = splitPath(path);
    const cla = 0x00;
    const ins = 0x04;
    const p1 = 0;
    const p2 = 0;
    const rawHash = typeof hash == "string" ?
      (hash.length == 64 ? Buffer.from(hash, "hex") : Buffer.from(hash, "base64")) : Buffer.from(hash);
    // Bip32key payload same as getPublicKey
    const bip32KeyPayload = buildBip32KeyPayload(path);
    // These are just squashed together
    const payload = Buffer.concat([rawHash, bip32KeyPayload])
    // TODO batch this since the payload length can be uint32le.max long
    const response = await this.sendChunks(cla, ins, p1, p2, payload);
    // TODO check this
    const signature = response.slice(0,-2).toString("hex");
    return {
      signature,
    };
  }
}

