// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct CandidatePublic {
        uint id;
        string name;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public hasVoted;
    mapping(address => bool) public registeredVoters;

    uint public candidatesCount;
    address public admin;
    address[] public voters;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Register Voter (Admin only)
    function registerVoter(address _voter) public onlyAdmin {
        require(!registeredVoters[_voter], "Voter is already registered");
        registeredVoters[_voter] = true;
        voters.push(_voter);
    }

    // Add a new candidate (Admin only)
    function addCandidate(string memory _name) public onlyAdmin {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Vote for a candidate (Only registered voters)
    function vote(uint _candidateId) public {
        require(registeredVoters[msg.sender], "You are not registered to vote");
        require(!hasVoted[msg.sender], "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        candidates[_candidateId].voteCount++;
        hasVoted[msg.sender] = true;
    }

    // Get all candidates without vote count
    function getAllCandidates() public view returns (CandidatePublic[] memory) {
        CandidatePublic[] memory candidateList = new CandidatePublic[](candidatesCount);
        for (uint i = 1; i <= candidatesCount; i++) {
            candidateList[i - 1] = CandidatePublic(candidates[i].id, candidates[i].name);
        }
        return candidateList;
    }

    // Get all registered voters (Admin only)
    function getVoters() public view returns (address[] memory) {
        return voters;
    }

    // Check if address is a registered voter
    function isRegisteredVoter(address _voter) public view returns (bool) {
        return registeredVoters[_voter];
    }

    // Check if the sender's wallet is a registered voter
    function amIVoter() public view returns (bool) {
        return registeredVoters[msg.sender];
    }

    // Reset Election (Admin only)
    function resetElection() public onlyAdmin {
        for (uint i = 1; i <= candidatesCount; i++) {
            candidates[i].voteCount = 0;
        }
        for (uint i = 0; i < voters.length; i++) {
            hasVoted[voters[i]] = false;
        }
    }
}
