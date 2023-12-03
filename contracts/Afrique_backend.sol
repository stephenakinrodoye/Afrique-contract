// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract AfriqueProfile is ERC721URIStorage, ERC721Enumerable, Ownable {
    
    struct UserProfile {
        bytes32 name;
        bytes32 website;
        bytes32 displayPicture;
        bytes32 profileWallPapper;
        string bio;
        bool exists;
        uint256[] mintedTokens;
    }

    uint256 private _tokenIdCounter;
    bytes32 private constant _TOKEN_NAME = "Afrique";
    bytes32 private constant _TOKEN_IDENTIFIER = "AFQ";

    mapping(address => UserProfile) public userProfiles;

    modifier onlyExistingProfileOwners() {
        require(userProfiles[msg.sender].exists, "You don't have a profile");
        _;
    }

    modifier onlyProfileOwner(address profileAddress) {
        require(userProfiles[profileAddress].exists, "Profile does not exist");
        require(profileAddress == msg.sender, "Profile not yours");
        _;
    }

    constructor() ERC721(_TOKEN_NAME, _TOKEN_IDENTIFIER) {}

    function createProfile(
        bytes32 name,
        bytes32 website,
        bytes32 displayPicture,
        bytes32 profileWallPapper,
        string memory bio
    ) external {
        require(!userProfiles[msg.sender].exists, "Profile already exists");

        userProfiles[msg.sender] = UserProfile(
            name,
            website,
            displayPicture,
            profileWallPapper,
            bio,
            true,
            new uint256[](0)
        );

        _mintProfile(msg.sender);
    }

    function editProfile(
        bytes32 newName,
        bytes32 newWebsite,
        string memory newBio
    ) external onlyExistingProfileOwners {
        userProfiles[msg.sender].name = newName;
        userProfiles[msg.sender].website = newWebsite;
        userProfiles[msg.sender].bio = newBio;
    }

    function userProfileExists(address profileAddress) external view returns (bool) {
        return userProfiles[profileAddress].exists;
    }

    function mintToken(string memory tokenURI) public onlyExistingProfileOwners returns (uint256) {
        uint256 tokenId = _mintToken(msg.sender, tokenURI);

        return tokenId;
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override onlyProfileOwner(from) {
        super.transferFrom(from, to, tokenId);

        _updateMintedTokens(from, to, tokenId);
    }

    function _mintProfile(address to) internal {
        uint256 tokenId = _tokenIdCounter;
        _mint(to, tokenId);
        _tokenIdCounter++;

        userProfiles[to].mintedTokens.push(tokenId);
    }

    function _mintToken(address to, string memory tokenURI) internal returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _mint(to, tokenId);
        _tokenIdCounter++;
        _setTokenURI(tokenId, tokenURI);

        userProfiles[to].mintedTokens.push(tokenId);

        return tokenId;
    }

    function _updateMintedTokens(
        address from,
        address to,
        uint256 tokenId
    ) internal {
        if (from != to) {
            _removeTokenFromProfile(from, tokenId);
        }

        _addTokenToProfile(to, tokenId);
    }

    function _addTokenToProfile(address user, uint256 tokenId) internal {
        userProfiles[user].mintedTokens.push(tokenId);
    }

    function _removeTokenFromProfile(address user, uint256 tokenId) internal {
        uint256[] storage mintedTokens = userProfiles[user].mintedTokens;

        for (uint256 i = 0; i < mintedTokens.length; i++) {
            if (mintedTokens[i] == tokenId) {
                mintedTokens[i] = mintedTokens[mintedTokens.length - 1];
                mintedTokens.pop();
                break;
            }
        }
    }
}