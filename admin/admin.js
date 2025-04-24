const contractAddress = "0x4d4d37229cb6e1154d92766f6237e2e3e5353522"; // Update contract address

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "addCandidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_voter",
				"type": "address"
			}
		],
		"name": "registerVoter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "resetElection",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_candidateId",
				"type": "uint256"
			}
		],
		"name": "vote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "amIVoter",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "candidates",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "candidatesCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllCandidates",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					}
				],
				"internalType": "struct Voting.CandidatePublic[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getVoters",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasVoted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_voter",
				"type": "address"
			}
		],
		"name": "hasVotedStatus",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_voter",
				"type": "address"
			}
		],
		"name": "isRegisteredVoter",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "registeredVoters",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "voters",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];  // Update ABI only if you made any change to the web3voting.sol

let web3;
let contract;
let account;

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            account = accounts[0];
            contract = new web3.eth.Contract(contractABI, contractAddress);
            document.getElementById("wallet-status").innerText = `Connected: ${account}`;
            listCandidates();
            listVoters();
        } catch (error) {
            document.getElementById("wallet-status").innerText = `Error connecting to wallet: ${error.message}`;
        }
    } else {
        document.getElementById("wallet-status").innerText = "MetaMask not found. Please install MetaMask.";
    }
}

async function addCandidate() {
    const candidateNameInput = document.getElementById("candidateName");
    const candidateName = candidateNameInput.value;
    const statusElement = document.getElementById("add-status");

    if (!candidateName) {
        statusElement.innerText = "Candidate name is required!";
        return;
    }

    try {
        await contract.methods.addCandidate(candidateName).send({ from: account });
        statusElement.innerText = `Candidate "${candidateName}" added successfully!`;

        candidateNameInput.value = "";

        listCandidates();
    } catch (error) {
        statusElement.innerText = `Failed to add candidate: ${error.message}`;
    }
}


async function registerVoter() {
    const voterAddressInput = document.getElementById("voterAddress");
    const voterAddress = voterAddressInput.value;
    const statusElement = document.getElementById("register-status");

    if (!web3.utils.isAddress(voterAddress)) {
        statusElement.innerText = "Invalid Ethereum address!";
        return;
    }

    try {
        await contract.methods.registerVoter(voterAddress).send({ from: account });
        statusElement.innerText = `Voter ${voterAddress} registered successfully!`;

        voterAddressInput.value = "";

        listVoters();
    } catch (error) {
        statusElement.innerText = `Failed to register voter: ${error.message}`;
    }
}


async function listCandidates() {
    try {
        const candidates = await contract.methods.getAllCandidates().call();
        const candidateList = document.getElementById("candidate-list");
        candidateList.innerHTML = "";
        candidates.forEach(candidate => {
            candidateList.innerHTML += `<li>${candidate.id}. ${candidate.name}</li>`;
        });
    } catch (error) {
        console.error("Error fetching candidates:", error);
    }
}

async function listVoters() {
    try {
        const voters = await contract.methods.getVoters().call();
        const voterList = document.getElementById("voter-list");
        voterList.innerHTML = "";

        if (voters.length === 0) {
            voterList.innerHTML = "<li>No voters registered yet.</li>";
        } else {
            voters.forEach((voter, index) => {
                voterList.innerHTML += `<li>${index + 1}. ${voter}</li>`;
            });
        }

        console.log("Voter List:", voters);
        return voters;
    } catch (error) {
        console.error("Error fetching voters:", error);
        return [];
    }
}


async function resetElection() {
    const statusElement = document.getElementById("reset-status");
    try {
        await contract.methods.resetElection().send({ from: account });
        statusElement.innerText = "Election reset successfully!";
        listCandidates();
        listVoters();
    } catch (error) {
        statusElement.innerText = `Failed to reset election: ${error.message}`;
    }
}

window.onload = connectWallet;
