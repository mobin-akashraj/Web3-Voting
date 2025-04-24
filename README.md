# Web3-Voting
## Blockchain Based E-Voting System

A decentralized and secure voting system built on blockchain technology. This system utilizes smart contracts to ensure transparency, immutability, and fairness in elections. It includes both an admin and voter interface, enabling the management of elections and casting of votes.

## Tech Stack

Blockchain: Ethereum

Smart Contract Language: Solidity

Frontend: HTML, CSS, JavaScript

Development Tools: Ganache, Remix IDE, MetaMask


## Getting Started
### Prerequisites:

Install MetaMask for browser wallet integration.

Install Ganache (for local Ethereum blockchain).

+ https://archive.trufflesuite.com/ganache/

### Steps to Run Locally:

Clone the repository:

+ git clone https://github.com/mobin-akashraj/Web3-Voting.git

+ cd Web3-Voting

+ Start Ganache and keep it running. Note the RPC URL and Chain ID.

+ Add Ganache as a custom network in MetaMask:
  + RPC URL: http://127.0.0.1:7545

  + Chain ID: 1337 or 5777 (whichever Ganache shows)

  + Import a private key from Ganache into MetaMask

+ Open Remix IDE:

  + Create or paste your web3voting.sol smart contract

  + Set compiler version to 0.8.0

  + Deploy using "Injected Provider - MetaMask"

  + Accept the MetaMask prompt

+ After deployment, copy the contract address and ABI (if you made any changes to .sol) and replace it in:

  + index.html
  + admin.js
  + voter.js

+ Open the index.html in your browser.

+ Connect your MetaMask wallet and interact with the system!


## License:
This project is licensed under the MIT License - see the LICENSE file for details.
