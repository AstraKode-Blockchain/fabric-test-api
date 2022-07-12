/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

// Deterministic JSON.stringify()
const stringify = require("json-stringify-deterministic");
const sortKeysRecursive = require("sort-keys-recursive");
const { Contract } = require("fabric-contract-api");

class WineTracking extends Contract {
  statusEnum = ["bottled", "packaged", "shipped", "delivered", "sold"]; //enum for status
  async InitLedger(ctx) {
    const assets = [
      {
        ID: "bottle1",
        name: "vermentino",
        origin: "Toscana",
        status: this.statusEnum[0],
        holder: "wineyard",
        location: "",
      },
      {
        ID: "bottle2",
        name: "chianti",
        origin: "Toscana",
        status: this.statusEnum[0],
        holder: "wineyard",
        location: "",
      },
    ];

    for (const asset of assets) {
      asset.docType = "asset";
      // example of how to write to world state deterministically
      // use convetion of alphabetic order
      // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
      // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
      await ctx.stub.putState(
        asset.ID,
        Buffer.from(stringify(sortKeysRecursive(asset)))
      );
    }
  }

  async CreateAsset(ctx, id, name, origin) {
    const exists = await this.AssetExists(ctx, id);
    if (exists) {
      throw new Error(`The asset ${id} already exists`);
    }

    const asset = {
      ID: id,
      name: name,
      origin: origin,
      status: this.statusEnum[0],
      holder: "",
      location: "",
    };
    //we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(asset)))
    );
    return JSON.stringify(asset);
  }

  async AssetExists(ctx, id) {
    const assetJSON = await ctx.stub.getState(id);
    return assetJSON && assetJSON.length > 0;
  }

  async UpdateAssetStatus(ctx, id, status) {
    const exists = await this.AssetExists(ctx, id);
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }

    const assetString = await this.FetchAsset(ctx, id);
    const asset = JSON.parse(assetString);
    // overwriting original asset with new asset
    const index = parseInt(status);
    asset.status = this.statusEnum[index];
    // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(asset)))
    );
    return asset;
  }

  async FetchAsset(ctx, id) {
    const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
    if (!assetJSON || assetJSON.length === 0) {
      throw new Error(`The asset ${id} does not exist`);
    }
    return assetJSON.toString();
  }

  async TransferAsset(ctx, id, newHolder) {
    const assetString = await this.FetchAsset(ctx, id);
    const asset = JSON.parse(assetString);
    const oldHolder = asset.holder;
    asset.holder = newHolder;
    // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(asset)))
    );
    return oldHolder;
  }
}
module.exports = WineTracking;
