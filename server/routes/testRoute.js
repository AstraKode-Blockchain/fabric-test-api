const express = require("express");

const grpc = require("@grpc/grpc-js");
const crypto = require("crypto");
const pkg = require("@hyperledger/fabric-gateway");
const { connect, Identity, signers, Proposal } = pkg;
const fs = require("fs/promises");

const router = express.Router();

//fetch asset by id
router.get("/:id", async (req, res) => {
  const root_cert = await fs.readFile(
    "/Users/daria/go/src/github.com/dariaag/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"
  );
  const identity = { mspId: "Org1MSP", credentials: root_cert };

  const privateKeyPem = await fs.readFile(
    "/Users/daria/go/src/github.com/dariaag/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key"
  );
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  const signer = signers.newPrivateKeySigner(privateKey);

  const ssl_creds = grpc.credentials.createSsl(root_cert);
  const client = new grpc.Client("localhost:7051", ssl_creds);

  const gateway = connect({ identity, signer, client });

  const network = gateway.getNetwork("mychannel");
  const contract = network.getContract("basic");
  const assetId = req.params.id;
  try {
    const putResult = await contract.submitTransaction("FetchAsset", assetId);
    console.log("Put result:", utf8Decoder.decode(putResult));

    const getResult = await contract.evaluateTransaction(
      "FetchAsset",
      assetId
    );
    console.log("Get result:", utf8Decoder.decode(getResult));
    // const proposalOptions = {
    //   arguments: ["bottle1"],
    //   endorsingOrganizations: ["Org1MSP"],
    // };
    // const proposal = contract.newProposal("FetchAsset", proposalOptions);
    // const transaction = await proposal.endorse();
    // const commit = await transaction.submit();

    // const result = transaction.getResult();
    // console.log(result);
    // const status = await commit.getStatus();
  } catch (err) {
    console.log(err);
  }
});
//create asset
router.post("/", async (req, res) => {
  const root_cert = await fs.readFile(
    "/Users/daria/go/src/github.com/dariaag/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"
  );
  const identity = { mspId: "Org1MSP", credentials: root_cert };

  const privateKeyPem = await fs.readFile(
    "/Users/daria/go/src/github.com/dariaag/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key"
  );
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  const signer = signers.newPrivateKeySigner(privateKey);

  const ssl_creds = grpc.credentials.createSsl(root_cert);
  const client = new grpc.Client("localhost:7051", ssl_creds);

  const gateway = connect({ identity, signer, client });

  const network = gateway.getNetwork("mychannel");
  const contract = network.getContract("basic");
  const newAsset = req.body;
  try {
    const args = [newAsset.id, newAsset.name, newAsset.origin]
    const putResult = await contract.submitTransaction("CreateAsset", args);
    console.log("Put result:", utf8Decoder.decode(putResult));

    const getResult = await contract.evaluateTransaction(
      "CreateAsset",
      args
    );
    console.log("Get result:", utf8Decoder.decode(getResult));
  
  } catch (err) {
    console.log(err);
  }
});
// change asset status
router.patch("/:id", async (req, res) => {
  const root_cert = await fs.readFile(
    "/Users/daria/go/src/github.com/dariaag/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"
  );
  const identity = { mspId: "Org1MSP", credentials: root_cert };

  const privateKeyPem = await fs.readFile(
    "/Users/daria/go/src/github.com/dariaag/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key"
  );
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  const signer = signers.newPrivateKeySigner(privateKey);

  const ssl_creds = grpc.credentials.createSsl(root_cert);
  const client = new grpc.Client("localhost:7051", ssl_creds);

  const gateway = connect({ identity, signer, client });

  const network = gateway.getNetwork("mychannel");
  const contract = network.getContract("basic");
  const assetId = req.params.id;
  const assetStatus = req.body.status;
  try {
    const args = [assetId, assetStatus]
    const putResult = await contract.submitTransaction("UpdateAssetStatus", args);
    console.log("Put result:", utf8Decoder.decode(putResult));

    const getResult = await contract.evaluateTransaction(
      "UpdateAssetStatus",
      args
    );
    console.log("Get result:", utf8Decoder.decode(getResult));
  
  } catch (err) {
    console.log(err);
  }
});
// transfer asset ownership
router.patch("/transfer/:id", async (req, res) => {
  const root_cert = await fs.readFile(
    "/Users/daria/go/src/github.com/dariaag/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"
  );
  const identity = { mspId: "Org1MSP", credentials: root_cert };

  const privateKeyPem = await fs.readFile(
    "/Users/daria/go/src/github.com/dariaag/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key"
  );
  const privateKey = crypto.createPrivateKey(privateKeyPem);
  const signer = signers.newPrivateKeySigner(privateKey);

  const ssl_creds = grpc.credentials.createSsl(root_cert);
  const client = new grpc.Client("localhost:7051", ssl_creds);

  const gateway = connect({ identity, signer, client });

  const network = gateway.getNetwork("mychannel");
  const contract = network.getContract("basic");
  const assetId = req.params.id;
  const assetHolder = req.body.holder;
  try {
    const args = [assetId, assetHolder]
    const putResult = await contract.submitTransaction("TransferAsset", args);
    console.log("Put result:", utf8Decoder.decode(putResult));

    const getResult = await contract.evaluateTransaction(
      "TransferAsset",
      args
    );
    console.log("Get result:", utf8Decoder.decode(getResult));
  
  } catch (err) {
    console.log(err);
  }
});


module.exports = router;
