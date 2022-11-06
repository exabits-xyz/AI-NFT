/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");

const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString().trim();

const config = {
    alchemy: "9aa3d95b3bc440fa88ea12eaa4456161", // goerli testnet token
    privateKey,
};

module.exports = {
    solidity: "0.8.4",
    networks: {
        goerli: {
            url: `https://goerli.infura.io/v3/${config.alchemy}`,
            accounts: [config.privateKey],
            chainId: 5,
        },
    },
};
