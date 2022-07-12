const express = require("express");
const app = express();
const wineRouter = require("./routes/wine");
app.use(express.json());
import * as grpc from "@grpc/grpc-js";
import * as crypto from "crypto";
import { connect, Identity, signers } from "@hyperledger/fabric-gateway";
import { promises as fs } from "fs";
import { TextDecoder } from "util";

const credentials = await fs.readFile(
  "/Users/daria/go/src/github.com/dariaag/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/msp/cacerts/ca.org1.example.com-cert.pem"
);
const identity = { mspId: "Org1MSP", credentials };

const privateKeyPem = await fs.readFile(
  "~/Users/daria/go/src/github.com/dariaag/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/msp/keystore/priv_sk"
);
const privateKey = crypto.createPrivateKey(privateKeyPem);
const signer = signers.newPrivateKeySigner(privateKey);

const client = new grpc.Client(
  "localhost:7051",
  grpc.credentials.createInsecure()
);

const gateway = connect({ identity, signer, client });

const network = gateway.getNetwork("mychannel");
const contract = network.getContract("WineTracking");

const router = express.Router();

app.use("/wine", async (req, res) => {
  try {
    const putResult = await contract.submitTransaction("FetchAsset", "bottle1");
    console.log("Put result:", utf8Decoder.decode(putResult));

    const getResult = await contract.evaluateTransaction(
      "FetchAsset",
      "bottle1"
    );
    console.log("Get result:", utf8Decoder.decode(getResult));
  } catch (err) {
    console.log(err);
  }
});

app.use("/", (req, res) => {
  console.log("main url");
});

app.listen("5000", () => {
  console.log("backend running");
});
