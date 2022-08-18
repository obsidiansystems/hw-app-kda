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
import { Common, GetPublicKeyResult, SignTransactionResult, GetVersionResult } from "hw-app-obsidian-common";

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
    * Sign a transaction hash with the key at a BIP32 path.
    *
    * @param hash - The transaction hash; this can be any of a node Buffer, Uint8Array, a hexadecimal string, or a base64 encoded string.
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
    if (rawHash.length != 32) {
      throw new TypeError("Hash is not 32 bytes");
    } else {
      // Bip32key payload same as getPublicKey
      const bip32KeyPayload = buildBip32KeyPayload(path);
      // These are just squashed together
      const payload = Buffer.concat([rawHash, bip32KeyPayload])
      const response = await this.sendChunks(cla, ins, p1, p2, payload);
      const signature = response.slice(0,-2).toString("hex");
      return {
        signature,
      };
    }
  }
}

// TODO: Use splitPath and buildBip32KeyPayload from hw-app-obsidian-common
function splitPath(path: string): number[] {
  const result: number[] = [];
  const components = path.split("/");
  components.forEach((element) => {
    let number = parseInt(element, 10);

    if (isNaN(number)) {
      return; // FIXME shouldn't it throws instead?
    }

    if (element.length > 1 && element[element.length - 1] === "'") {
      number += 0x80000000;
    }

    result.push(number);
  });
  return result;
}

function buildBip32KeyPayload(path: string): Buffer {
  const paths = splitPath(path);
  // Bip32Key payload is:
  // 1 byte with number of elements in u32 array path
  // Followed by the u32 array itself
  const payload = Buffer.alloc(1 + paths.length * 4);
  payload[0] = paths.length
  paths.forEach((element, index) => {
    payload.writeUInt32LE(element, 1 + 4 * index);
  });
  return payload
}
