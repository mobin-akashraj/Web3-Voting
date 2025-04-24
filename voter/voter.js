const contractAddress = "0x4d4d37229cb6e1154d92766f6237e2e3e5353522"; // Update with your deployed contract address

let web3;
let contract;
let account;

// Update ABI only if you made any changes to web3voting.sol
const contractABI =[
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
];

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            account = accounts[0];
            contract = new web3.eth.Contract(contractABI, contractAddress);

            document.getElementById("wallet-status").innerText = `✅ Connected: ${account}`;

            await checkVoterStatus();

            listCandidates();
        } catch (error) {
            console.error("Error connecting to wallet:", error);
            alert("MetaMask connection failed!");
        }
    } else {
        alert("MetaMask not found. Please install MetaMask.");
    }
}

async function checkVoterStatus() {
    try {
        const isVoter = await contract.methods.isRegisteredVoter(account).call();
        console.log(`Voter Status: ${isVoter}`);

        if (!isVoter) {
            alert("You are NOT a registered voter.");
            return;
        }
    } catch (error) {
        console.error("Error checking voter status:", error);
        alert("Failed to verify voter status.");
    }
}


async function listCandidates() {
    try {
        const candidatesCount = await contract.methods.candidatesCount().call();
        const candidateSelect = document.getElementById("candidate-select");
        candidateSelect.innerHTML = `<option value="">Select a Candidate</option>`;

        for (let i = 1; i <= candidatesCount; i++) {
            const candidate = await contract.methods.candidates(i).call();
            candidateSelect.innerHTML += `
                <option value="${candidate.id}">${candidate.name}</option>`;
        }
    } catch (error) {
        console.error("Error fetching candidates:", error);
        alert("Failed to load candidates.");
    }
}

async function vote() {
    if (!account) {
        alert("Please connect your MetaMask wallet first.");
        return;
    }

    const candidateId = document.getElementById("candidate-select").value;
    if (!candidateId) {
        alert("Please select a candidate.");
        return;
    }

    try {
        const isVoter = await contract.methods.isRegisteredVoter(account).call();
        if (!isVoter) {
            alert("You are NOT registered as a voter.");
            return;
        }

        const alreadyVoted = await contract.methods.hasVoted(account).call();
        if (alreadyVoted) {
            alert("You have already voted.");
            return;
        }

        await contract.methods.vote(candidateId).send({ from: account });
        alert("Vote casted successfully!");

        listCandidates();
        document.getElementById("candidate-select").value = "";
    } catch (error) {
        console.error("Error casting vote:", error);
        alert(`Failed to cast vote: ${error.message}`);
    }
}

async function getResults() {
    try {
        const candidatesCount = await contract.methods.candidatesCount().call();
        const resultsList = document.getElementById("results-list");
        resultsList.innerHTML = "";

        for (let i = 1; i <= candidatesCount; i++) {
            const candidate = await contract.methods.candidates(i).call();
            resultsList.innerHTML += `<li>${candidate.name} - Votes: ${candidate.voteCount}</li>`;
        }
    } catch (error) {
        console.error("Error fetching results:", error);
        alert("Failed to load results.");
    }
}

window.onload = connectWallet;
