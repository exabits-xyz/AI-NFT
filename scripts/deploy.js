const hardhat = require("hardhat");

async function main() {
    const nftMarketContract = await hardhat.ethers.getContractFactory(
        "AiArtNftMarketplace"
    );
    const nftMarket = await nftMarketContract.deploy();

    await nftMarket.deployed();

    console.log("AI ART NFT Contract Address:", nftMarket.address);
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
runMain();
