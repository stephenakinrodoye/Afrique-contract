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
    
