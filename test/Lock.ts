import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers";
//import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { AfriqueProfile } from "../typechain";

describe("AfriqueProfile Contract", function () {
  this.timeout(50000);

  let afriqueProfile: AfriqueProfile;
  let owner: Signer;
  let user: Signer;

    beforeEach(async function () {
        this.timeout(50000); // Set a higher timeout value for beforeEach as well
        [owner, user] = await ethers.getSigners();

        const AfriqueProfileFactory = await ethers.getContractFactory("AfriqueProfile");
        afriqueProfile = (await AfriqueProfileFactory.deploy(owner.getAddress())) as AfriqueProfile;
        await afriqueProfile.deployed();
    });

    it('Should deploy the contract', async () => {
        expect(afriqueProfile.address).to.not.equal(0);
    });

    it("should allow creating a profile", async function () {
        const ownerAddress = await owner.getAddress();

        const name = ethers.utils.formatBytes32String("John");
        const website = ethers.utils.formatBytes32String("https://john.com");
        const displayPicture = ethers.utils.formatBytes32String("ipfs://image.jpg");
        const profileWallPapper = ethers.utils.formatBytes32String("ipfs://wallpaper.jpg");
        const bio = "Hello, I'm John.";

        await expect(afriqueProfile.createProfile(name, website, displayPicture, profileWallPapper, bio))
            .to.emit(afriqueProfile, "Transfer")
            .withArgs(ethers.constants.AddressZero, ownerAddress, 0);

        const userProfile = await afriqueProfile.userProfiles(ownerAddress);
        expect(userProfile.exists).to.be.true;
        expect(userProfile.name).to.equal(name);
        expect(userProfile.website).to.equal(website);
        expect(userProfile.displayPicture).to.equal(displayPicture);
        expect(userProfile.profileWallPapper).to.equal(profileWallPapper);
        expect(userProfile.bio).to.equal(bio);
    });

    it('Should check if a profile exists', async () => {
        const profileOwner = await ethers.getSigner('0xFD218FB22b7aFFf6b996E51Eb190e1a5b407209A');

        // Print the profile information
        const userProfileBefore = await afriqueProfile.userProfiles(profileOwner.address);
        console.log("Profile Before:", userProfileBefore);

        // Create a profile before checking its existence
        await afriqueProfile.connect(profileOwner).createProfile(
            ethers.utils.formatBytes32String('John Doe'),
            ethers.utils.formatBytes32String('https://example.com'),
            ethers.utils.formatBytes32String('ipfs://displayPictureHash'),
            ethers.utils.formatBytes32String('ipfs://profileWallPapperHash'),
            'Hello, I am John Doe.'
        );

        // Print the profile information after creation
        const userProfileAfter = await afriqueProfile.userProfiles(profileOwner.address);
        console.log("Profile After:", userProfileAfter);

        const profileExists = await afriqueProfile.userProfileExists(profileOwner.address);
        expect(profileExists).to.equal(true);
    });


 

    /*
    it('Should transfer a token', async () => {
        const profileOwner1 = await ethers.getSigner(0); // Replace with the actual signer
        const profileOwner2 = await ethers.getSigner(1); // Replace with another signer

        // Create profiles for both owners
        await afriqueProfile.connect(profileOwner1).createProfile(
            'John Doe',
            'https://example.com',
            'ipfs://displayPictureHash',
            'ipfs://profileWallPapperHash',
            'Hello, I am John Doe.'
        );

        await afriqueProfile.connect(profileOwner2).createProfile(
            'Jane Doe',
            'https://example.com/jane',
            'ipfs://janeDisplayPictureHash',
            'ipfs://janeProfileWallPapperHash',
            'Hello, I am Jane Doe.'
        );

        // Mint a token for the first owner
        const tokenId = await afriqueProfile.connect(profileOwner1).mintToken('ipfs://tokenURIHash');

        // Transfer the token to the second owner
        await afriqueProfile.connect(profileOwner1).transferFrom(profileOwner1.address, profileOwner2.address, tokenId);

        // Check the updated profiles and token ownership
        const ownerOfToken = await afriqueProfile.ownerOf(tokenId);
        expect(ownerOfToken).to.equal(profileOwner2.address);

        const mintedTokensOwner1 = await afriqueProfile.userProfiles(profileOwner1.address).mintedTokens();
        expect(mintedTokensOwner1.length).to.equal(0);

        const mintedTokensOwner2 = await afriqueProfile.userProfiles(profileOwner2.address).mintedTokens();
        expect(mintedTokensOwner2.length).to.equal(1);
        expect(mintedTokensOwner2[0]).to.equal(tokenId);
    });
    */  

});

