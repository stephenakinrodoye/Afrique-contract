// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract AfriqueProfile is ERC721URIStorage, ERC721Enumerable, Ownable {
    using Strings for uint256;

    constructor(address initialOwner) ERC721("Afrique", "AFQ") Ownable(initialOwner) {
        // Additional initialization
    }

    function _update(address to, uint256 tokenId, address auth) internal virtual override(ERC721, ERC721Enumerable) returns (address) {
        return ERC721._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal virtual override(ERC721, ERC721Enumerable) {
        ERC721._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage, ERC721) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    struct UserProfile {
        bytes32 name;
        bytes32 website;
        bytes32 displayPicture;
        bytes32 profileWallPapper;
        string bio;
        bool exists;
        uint256[] mintedTokens;
    }

    uint256 private tokenIdCounter;
    bytes32 private constant TOKEN_NAME = "Afrique";
    bytes32 private constant TOKEN_IDENTIFIER = "AFQ";

    mapping(address => UserProfile) public userProfiles;

    modifier onlyExistingProfileOwners() {
        require(userProfiles[msg.sender].exists, "You don't have a profile");
        _;
    }

    function withdraw(uint256 tokenId) public onlyProfileOwner(msg.sender) {
        // function implementation
    }

    function bytes32ToString(bytes32 data) internal pure returns (string memory) {
        bytes memory bytesString = new bytes(32);
        for (uint256 i = 0; i < 32; i++) {
            bytesString[i] = data[i];
        }
        return string(bytesString);
    }

    function createProfile(
      bytes32 name,
      bytes32 website,
      bytes32 displayPicture,
      bytes32 profileWallPapper,
      string memory bio
   ) external returns (UserProfile memory) {
      require(!userProfiles[msg.sender].exists, "Profile already exists");

      uint256 tokenId = tokenIdCounter;
      _mint(msg.sender, tokenId);
      tokenIdCounter++;
      
      userProfiles[msg.sender] = UserProfile({
          name: name,
          website: website,
          displayPicture: displayPicture,
          profileWallPapper: profileWallPapper,
          bio: bio,
          exists: true,
          mintedTokens: new uint256[](1)
      });
      
      userProfiles[msg.sender].mintedTokens[0] = tokenId;
      
      return userProfiles[msg.sender];
   }

    function _mintProfile(address to) internal {

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

    function _mintToken(address to, string memory tokenURI) internal returns (uint256) {
        uint256 tokenId = tokenIdCounter;
        _mint(to, tokenId);
        tokenIdCounter++;
        _setTokenURI(tokenId, tokenURI);

        userProfiles[to].mintedTokens.push(tokenId);
        return tokenId;
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721, IERC721) onlyProfileOwner(from) {
        super.transferFrom(from, to, tokenId);
        _updateMintedTokens(from, to, tokenId);
    }

    modifier onlyProfileOwner(address profileAddress) {
        require(userProfiles[profileAddress].exists, "Profile does not exist");
        require(profileAddress == msg.sender, "Profile not yours");
        _;
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
