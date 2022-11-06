require("chai");
const { ethers } = require("hardhat");
describe("AiArtNftMarketplace Test", function () {
    it("Create NFTS and bring them to market", async () => {
        // Simulated deployment of NFT marketplace contracts
        const nftMarket = await ethers.getContractFactory(
            "AiArtNftMarketplace"
        );
        const market = await nftMarket.deploy();
        await market.deployed(); // Wait for market contract deployment
        const marketAddress = market.address; // Get the market contract deployment address

        // Deploy a simulated NFT contract
        const nftContract = await ethers.getContractFactory(
            "AINFT-Marketplace"
        );
        const nft = await nftContract.deploy(marketAddress);
        await nft.deployed();
        const nftContractAddress = nft.address; // Get the NFT contract deployment address

        let listingPrice = await market.getListingPrice(); // Get the market price

        listingPrice = listingPrice.toString();
        // Convert the transaction price posted to the market to ETH instead of Gwei
        const auctionPrice = ethers.utils.parseUnits("100", "ether");

        // Create two NFT tokens
        await nft.createToken(
            "https://console.exabits.xyz/resources/images/logo.png"
        );
        await nft.createToken(
            "https://console.exabits.xyz/resources/images/logo-256.png"
        );

        // Push two NFTS to the market for trading
        await market.createMarketItem(nftContractAddress, 1, auctionPrice, {
            value: listingPrice,
        });
        await market.createMarketItem(nftContractAddress, 2, auctionPrice, {
            value: listingPrice,
        });
        /*
            In the real world, users will interact with the contract through a digital wallet such as Metamask.
            In the test environment, the local address provided by Hardhat is used for interaction
        */
        const [_, buyerAddress] = await ethers.getSigners();

        // Perform a Token (i.e. NFT) sale to another user
        await market
            .connect(buyerAddress)
            .createMarketSale(nftContractAddress, 1, { value: auctionPrice });

        // Query and return the unsold NFTS
        let arrayItems = await market.fetchMarketItems();

        arrayItems = await Promise.all(
            arrayItems.map(async (i) => {
                const tokenUri = await nft.tokenURI(i.tokenId);
                return {
                    price: i.price.toString(),
                    tokenId: i.tokenId.toString(),
                    seller: i.seller,
                    owner: i.owner,
                    tokenUri,
                };
            })
        );
        console.log("Unsold NFTS:", arrayItems);
    });
});
