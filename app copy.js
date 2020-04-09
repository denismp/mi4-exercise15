const Web3 = require("web3");
const solc = require("solc");
const fs = require("fs");

const PROVIDER_URL = "https://ropsten.infura.io/v3/2c64faa795c242d083706a5e3105e830";
const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));

const contractCode = fs.readFileSync("./ArrayOfFacts.sol").toString();

let standardCompilerInput = {
    language: "Solidity",
    sources: {
        contract: {
            content: contractCode
        }
    },
    settings: {
        outputSelection: {
            "*": {
                "*": ["abi", "evm.bytecode"]
            }
        }
    }
}

standardCompilerInput = JSON.stringify(standardCompilerInput);

let compiledContract = solc.compile(standardCompilerInput);
compiledContract = JSON.parse(compiledContract);
compiledContract = compiledContract["contracts"]["contract"]["ArrayOfFacts"];

const privateKey = "0x7EB2255581AED1C929A291B65BC3A37FB70BA8C6783FFFABE18D8C6EC5DCFFC1";

console.log(compiledContract);

web3.eth.accounts.wallet.add(privateKey);
const ABI = compiledContract["abi"];
const BYTECODE = "0x" + compiledContract["evm"]["bytecode"]["object"];

//======================= Comment out deploy code =====================
// let contract = new web3.eth.Contract(ABI, null, {
//     data: BYTECODE,
//     from: web3.eth.accounts.wallet[0].address,
//     gas: 4600000
// });

// contract
//     .deploy()
//     .send()
//     .then(contractInstance => {
//         console.log("Contract created at " + contractInstance.options.address);
//     });
//=====================================================================
const contractAddress = "0x8E8D5eaF1A17BFCc9b9d33bE05BE238255c92FDA";
const fact = "China Grapples With Mystery Pneumonia-Like Illness 01/06/2020";

const contract = new web3.eth.Contract(ABI, contractAddress);
contract.methods
    .add(fact)
    .send(
        {
            from: web3.eth.accounts.wallet[0].address,
            gas: 46000000
        },
        (err, transactionID) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Transaction Hash: " + transactionID);
            }
        }
        ) 
        .then(transaction => {
            console.log("Transaction Information:");
            console.log(transaction);
        });