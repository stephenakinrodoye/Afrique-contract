import { ethers } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers";
//import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { AfriqueProfile } from "../typechain";

describe("AfriqueProfile Contract", function () {
    this.timeout(50000);

    let afriqueProfile: AfriqueProfile;
    let owner: any;
    let user: any;

    beforeEach(async function () {
        try {
        
           this.timeout(50000); 
            [owner, user] = await ethers.getSigners();

           const AfriqueProfileFactory = await ethers.getContractFactory("AfriqueProfile");
           afriqueProfile = (await AfriqueProfileFactory.deploy(owner.address)) as AfriqueProfile;
           await afriqueProfile.deployed();

           await console.log("Deployed contract successfully ")
        } catch (error: any) {
            console.log('Error deploying contarct :',  error)
        }
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
    /*

    it('should return false if user profile does not exist', async function () {
        // Act
        const profileExists = await afriqueProfile.userProfileExists(await owner.getAddress());
        console.log(profileExists);
        // Assert
        expect(profileExists).to.equal(false);
    });
    it('should not allow editing a profile if it does not exist', async function () {
        // Arrange
        const newName = ethers.utils.formatBytes32String('New Name');
        const newWebsite = ethers.utils.formatBytes32String('https://newwebsite.com');
        const newBio = 'Updated bio.';

        // Act and Assert
        await expect(afriqueProfile.connect(owner).editProfile(newName, newWebsite, newBio)).to.be.revertedWith(
            'You don\'t have a profile'
        );
    });
    */
//
    it("Should deploy the contract and mint a token", async function () {
        try {
            const ownerAddress = await owner.getAddress();
            //Create profile for user
            const name = ethers.utils.formatBytes32String("token");
            const website = ethers.utils.formatBytes32String("https://john.com");
            const displayPicture = ethers.utils.formatBytes32String("ipfs://image.jpg");
            const profileWallPapper = ethers.utils.formatBytes32String("ipfs://wallpaper.jpg");
            const bio = "Hello, I'm token.";

            const profileCreation = await expect(afriqueProfile.createProfile(name, website, displayPicture, profileWallPapper, bio))
                .to.emit(afriqueProfile, "Transfer")
                .withArgs(ethers.constants.AddressZero, ownerAddress, 0);

            const userProfile = await afriqueProfile.userProfiles(ownerAddress);
            expect(userProfile.exists).to.be.true;

            console.log(await profileCreation, userProfile, 'profile creation')
            // Mint a token for the user
            const emitedToken =  await afriqueProfile.connect(owner).mintToken("ipfs://QmTokenURIHash");
            console.log(emitedToken,'Token')
            // Check if the token was minted successfully 

            const userTokens = await afriqueProfile.userProfiles(ownerAddress);

            //expect(userTokens.length).to.equal(1);

            const tokenId = userTokens;
           //const tokenURI = await afriqueProfile.tokenURI(tokenId);

            // Add more assertions as needed

            console.log("Token Minted Successfully:", tokenId);
        } catch (error) {
            console.error("Error running test:", error);
            throw error;
        }
    });
    /*
    it('Should check if a profile exists', async function ()  {
        const profileOwner = await ethers.getSigner(owner.address);

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

    it('fails to create a new profile when the user already has an existing profile', async function   () {
        // Act
        try {
            await afriqueProfile.createProfile(
                'Existing Profile Name',
                'Existing Profile Website',
                'Existing Display Picture',
                'Existing Profile WallPapper',
                'Existing Profile Bio'
            );
            expect.fail('Expected an exception');
        } catch (error: any) {
            // Assert
            expect(error.message).to.contain('Profile already exists');
        }
    });

    it('creates a new profile with invalid input parameters', async  function ()  {
        // Act
        try {
            await afriqueProfile.createProfile(
                'Invalid Profile Name',
                'Invalid Profile Website',
                'Invalid Display Picture',
                'Invalid Profile WallPapper',
                'Invalid Profile Bio'
            );
            expect.fail('Expected an exception');
        } catch (error: any) {
            // 
            const userProfile = await afriqueProfile.userProfiles(owner.address);
            expect(error.message).to.contain('revert');
            expect(userProfile.exists).to.be.false;
        }
    });


    it("should not allow creating a duplicate profile", async function () {
        // Create profile for user1
        await afriqueProfile.connect(user).createProfile("John", "www.john.com", "dp1", "wp1", "A bio");

        // Try creating a profile again for user1 (should fail)
        await expect(afriqueProfile.connect(user).createProfile("Duplicate", "", "", "", "")).to.be.revertedWith("Profile already exists");
    });


    it("should not allow creating a profile if it already exists", async function () {
        await afriqueProfile.connect(await owner).createProfile("John", "", "", "", "Bio");

        await expect(
            afriqueProfile.connect(await owner).createProfile("AnotherJohn", "", "", "", "AnotherBio")
        ).to.be.revertedWith("Profile already exists");
    });

    it('Should transfer a token', async () => {
        const profileOwner1 = await ethers.getSigner(owner.address);
        const profileOwner2 = await ethers.getSigner(owner.address);

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
        const tokenId: any = await afriqueProfile.connect(profileOwner1).mintToken('ipfs://tokenURIHash');

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

    it("should return the correct token URI", async function () {
        // Create profile for user1
        await afriqueProfile.createProfile("John", "www.john.com", "dp1", "wp1", "A bio");

        // Mint a token for user1
        const tokenId: any = await afriqueProfile.mintToken("tokenURI");

        // Check if the token URI is correct
        const tokenURI = await afriqueProfile.tokenURI(tokenId);
        expect(tokenURI).to.equal("tokenURI");
    });

    it("should withdraw a token from a profile", async function () {
        // Create profile for user1
        await afriqueProfile.createProfile("John", "www.john.com", "dp1", "wp1", "A bio");

        // Mint a token for user1
        const tokenId: any = await afriqueProfile.mintToken("tokenURI");

        // Withdraw the token from the profile
        await afriqueProfile.withdraw(tokenId);

        // Check if the token is no longer associated with the profile
        const mintedTokens = await afriqueProfile.userProfiles(user).mintedTokens;
        expect(mintedTokens).to.not.include(tokenId);
    });

    it("should transfer minted tokens after profile edit", async function () {
        // Create profile for user1
        await afriqueProfile.createProfile("John", "www.john.com", "dp1", "wp1", "A bio");

        // Mint a token for user1
        const tokenId = await afriqueProfile.mintToken("tokenURI");

        // Edit profile for user1
        await afriqueProfile.connect(user).editProfile("John Doe", "www.johndoe.com", "Updated bio");

        // Check if the token is still associated with the updated profile
        const mintedTokens = await afriqueProfile.userProfiles(user.address).mintedTokens;
        expect(mintedTokens).to.include(tokenId);
    });
    */
});



/*
import { ethers, waffle } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers";
//import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { AfriqueProfile } from "../typechain/contracts/Afrique_backend.sol";

describe("AfriqueProfile Contract", function () {
  this.timeout(50000);

  let afriqueProfile: AfriqueProfile;
  let owner: Signer;
  let user1: Signer;
    beforeEach(async function () {
        this.timeout(50000); // Set a higher timeout value for beforeEach as well
        [owner, user1] = await ethers.getSigners();
        console.log(owner.address, user1)
        console.log('Before Profile deploy')
        const AfriqueProfileFactory = await ethers.getContractFactory("AfriqueProfile");
        afriqueProfile = (await AfriqueProfileFactory.deploy(owner.getAddress())) as AfriqueProfile;
        await afriqueProfile.deployed();
        console.log("After profile deploy : ", owner.getAddress(), user1.getAddress())

    });

    it('Should deploy the contract', async () => {
        expect(afriqueProfile.address).to.not.equal(0);
    });

    it('should create a new profile', async () => {
        const ownerAddress = await owner.getAddress();
        // Arrange
        const name = ethers.utils.formatBytes32String('John Doe');
        const website = ethers.utils.formatBytes32String('https://example.com');
        const displayPicture = ethers.utils.formatBytes32String('dp_hash');
        const profileWallPapper = ethers.utils.formatBytes32String('wallpaper_hash');
        const bio = 'A blockchain enthusiast.';

        // Act
        await expect(afriqueProfile.connect(owner).createProfile(name, website, displayPicture, profileWallPapper, bio))
            .to.emit(afriqueProfile, "Transfer")
            .withArgs(ethers.constants.AddressZero, ownerAddress, 0);

        // Assert
        const userProfile = await afriqueProfile.userProfiles(ownerAddress);
        expect(userProfile.exists).to.be.true;
        expect(userProfile.name).to.equal(name);
        expect(userProfile.website).to.equal(website);
        expect(userProfile.displayPicture).to.equal(displayPicture);
        expect(userProfile.profileWallPapper).to.equal(profileWallPapper);
        expect(userProfile.bio).to.equal(bio);
    });

    it('should revert if profile already exists', async () => {
        // Arrange
        const name = ethers.utils.formatBytes32String('John Doe');
        const website = ethers.utils.formatBytes32String('https://example.com');
        const displayPicture = ethers.utils.formatBytes32String('dp_hash');
        const profileWallPapper = ethers.utils.formatBytes32String('wallpaper_hash');
        const bio = 'A blockchain enthusiast.';

        // Act (create profile once)
        await expect(afriqueProfile.connect(owner).createProfile(name, website, displayPicture, profileWallPapper, bio))
            .to.emit(afriqueProfile, "Transfer");

        // Act and Assert (try creating the profile again)
        await expect(afriqueProfile.connect(owner).createProfile(name, website, displayPicture, profileWallPapper, bio))
.to.emit(afriqueProfile, "Transfer").to.be.revertedWith('Profile already exists');
    });

    it('should not allow editing a profile if it does not exist', async () => {
        // Arrange
        const newName = ethers.utils.formatBytes32String('New Name');
        const newWebsite = ethers.utils.formatBytes32String('https://newwebsite.com');
        const newBio = 'Updated bio.';

        // Act and Assert
        await expect(afriqueProfile.connect(owner).editProfile(newName, newWebsite, newBio)).to.be.revertedWith(
            'You don\'t have a profile'
        );
    });

    it('should return false if user profile does not exist', async () => {
        // Act
        const profileExists = await afriqueProfile.userProfileExists(await owner.getAddress());
        console.log(profileExists);
        // Assert
        expect(profileExists).to.equal(false);
    });

    //
    it("should edit an existing profile", async function () {
        await afriqueProfile.connect(user1).createProfile("John", "", "", "", "Bio");

        const newName = ethers.utils.formatBytes32String("NewName");
        const newWebsite = ethers.utils.formatBytes32String("NewWebsite");
        const newBio = "NewBio";

        await afriqueProfile.connect(owner).editProfile(newName, newWebsite, newBio);

        const userProfile = await afriqueProfile.userProfiles(await user1.getAddress());
        console.log(userProfile,'userProfile')
        expect(userProfile.name).to.equal(newName);
        expect(userProfile.website).to.equal(newWebsite);
        expect(userProfile.bio).to.equal(newBio);
    });

    it("should not allow creating a profile if it already exists", async function () {
        await afriqueProfile.connect( await owner).createProfile("John", "", "", "", "Bio");

        await expect(
            afriqueProfile.connect(await owner).createProfile("AnotherJohn", "", "", "", "AnotherBio")
        ).to.be.revertedWith("Profile already exists");
    });

    //

});


// To run the tests, use a test runner like Mocha
    it("should allow creating a profile", async function () {
        const ownerAddress = await owner.getAddress();

        const name = ethers.utils.formatBytes32String("John");
        const website = ethers.utils.formatBytes32String("https://john.com");
        const displayPicture = ethers.utils.formatBytes32String("ipfs://image.jpg");
        const profileWallPapper = ethers.utils.formatBytes32String("ipfs://wallpaper.jpg");
        const bio = "Hello, I'm John.";

        await expect(afriqueProfile.connect(user1).createProfile(name, website, displayPicture, profileWallPapper, bio))
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
        const profileOwner = await ethers.getSigner(afriqueProfile);

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