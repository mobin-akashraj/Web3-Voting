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
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    modifier onlyRegisteredVoter() {
        require(registeredVoters[msg.sender], "You are not a registered voter.");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addCandidate(string memory _name) public onlyAdmin {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function registerVoter(address _voter) public onlyAdmin {
        registeredVoters[_voter] = true;
        voters.push(_voter);
    }

    function vote(uint _candidateId) public onlyRegisteredVoter {
        require(!hasVoted[msg.sender], "You have already voted.");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID.");

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;
    }

    function resetElection() public onlyAdmin {
        for (uint i = 1; i <= candidatesCount; i++) {
            delete candidates[i];
        }
        candidatesCount = 0;

        for (uint i = 0; i < voters.length; i++) {
            hasVoted[voters[i]] = false;
            registeredVoters[voters[i]] = false;
        }
        delete voters;
    }

    function getAllCandidates() public view returns (CandidatePublic[] memory) {
        CandidatePublic[] memory result = new CandidatePublic[](candidatesCount);
        for (uint i = 1; i <= candidatesCount; i++) {
            result[i - 1] = CandidatePublic(candidates[i].id, candidates[i].name);
        }
        return result;
    }

    function getVoters() public view returns (address[] memory) {
        return voters;
    }

    function isRegisteredVoter(address _voter) public view returns (bool) {
        return registeredVoters[_voter];
    }

    function hasVotedStatus(address _voter) public view returns (bool) {
        return hasVoted[_voter];
    }

    function amIVoter() public view returns (bool) {
        return registeredVoters[msg.sender];
    }
}
