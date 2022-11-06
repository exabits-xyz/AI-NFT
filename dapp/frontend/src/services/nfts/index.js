import { marketaddress } from "../../configs";
import axios from "axios";
import aiNftMarket from "../../contracts/AiArtNftMarketplace.sol/AiArtNftMarketplace.json";
import { ethers } from "ethers";
import { useStorage } from "@/helper/storage";
const marketStorage = useStorage("market");

export const nftsApi = () => {
    const mynft = async () => {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const marketContract = new ethers.Contract(
            marketaddress,
            aiNftMarket.abi,
            signer
        );
        /* eslint-disable */
        return new Promise(async (resolve, reject) => {
            try {
                let data = null;
                try {
                    data = await marketContract.fetchMyNFTs();
                    const items = await Promise.all(
                        data.map(async (i) => {
                            const tokenURI = await marketContract.tokenURI(
                                i.tokenId
                            );
                            const price = ethers.utils.formatUnits(
                                i.price.toString(),
                                "ether"
                            );
                            const item = {
                                price,
                                tokenId: i.tokenId.toNumber(),
                                seller: i.seller,
                                image: tokenURI,
                                // image: meta.data.image,
                                // tokenURI,
                            };
                            return item;
                        })
                    );

                    resolve({
                        result: items,
                    });
                } catch (error) {
                    reject(error || "Error marketplaceContract.fetchMyNFTs");
                }
            } catch (error) {
                reject(error);
            }
        });
    };
    const mine = (data) => {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const marketContract = new ethers.Contract(
            marketaddress,
            aiNftMarket.abi,
            signer
        );
        /* eslint-disable */
        return new Promise(async (resolve, reject) => {
            try {
                let listingPrice = await marketContract.getListingPrice(); // Get the market price
                listingPrice = listingPrice.toString();

                // Convert the transaction price posted to the market to ETH instead of Gwei
                const auctionPrice = ethers.utils.parseUnits(
                    data.price.toString(),
                    "ether"
                );

                let transaction = null;
                try {
                    transaction = await marketContract.createToken(
                        data.uri,
                        auctionPrice,
                        {
                            value: listingPrice,
                        }
                    );
                } catch (error) {
                    reject(error || "Error while creating token");
                }

                if (!transaction) return;
                try {
                    await transaction.wait();
                } catch (error) {
                    reject(error || "Error while transaction.wait");
                }
                resolve({
                    result: transaction,
                });
            } catch (error) {
                reject(error);
            }
        });
    };

    const getById = (tokenId) => {
        tokenId = parseInt(tokenId, 10);
        const marketNftsList = marketStorage.get() || [];
        const current = marketNftsList.find(
            (item) => parseInt(item.tokenId, 10) === tokenId
        );
        return new Promise(async (resolve, reject) => {
            try {
                if (current) {
                    resolve(current);
                } else {
                    reject({
                        message: "not found",
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    };
    const getNftMetas = async (uri) => {
        try {
            const meta = await axios.get(uri);
            return meta.data;
        } catch (error) {
            return {};
        }
    };
    const get = async () => {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const marketContract = new ethers.Contract(
            marketaddress,
            aiNftMarket.abi,
            signer
        );

        /* eslint-disable */
        return new Promise(async (resolve, reject) => {
            try {
                const data = await marketContract.fetchMarketItems();

                const items = await Promise.all(
                    data.map(async (i) => {
                        const tokenId = i.tokenId.toNumber();
                        const tokenUri = await marketContract.tokenURI(
                            i.tokenId
                        );
                        if (tokenId > 0) {
                            const {
                                name = "",
                                description = "",
                                tokenURI = tokenUri,
                                attributes = [],
                            } = await getNftMetas(tokenUri);

                            const price = ethers.utils.formatUnits(
                                i.price.toString(),
                                "ether"
                            );
                            const item = {
                                price,
                                tokenId: i.tokenId.toNumber(),
                                seller: i.seller,
                                owner: i.owner,
                                image: tokenURI,
                                name,
                                description,
                                attributes,
                            };
                            return item;
                        } else {
                            return {
                                tokenId,
                            };
                        }
                    })
                );

                const arrayList = items.filter((item) => item.name);

                const newItems = [];
                for (const item of arrayList) {
                    newItems.unshift(item);
                }

                marketStorage.save(newItems);
                resolve(newItems);
            } catch (error) {
                reject(error);
            }
        });
    };
    return { mine, get, mynft, getById };
};
