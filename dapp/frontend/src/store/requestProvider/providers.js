import { usersApi } from "@/services/users";
import { nftsApi } from "../../services/nfts";
import { filemanageApi } from "../../services/filemanage";
const usersServices = usersApi();
const nftsServices = nftsApi();
const filemanageServices = filemanageApi();
const providers = {
    users: {
        nonce: (data, primary = 0) => {
            return usersServices.nonce(primary);
        },
        connect: (data, primary = 0) => {
            return usersServices.connect(primary, data);
        },
    },
    nfts: {
        mine: (data, primary = 0) => {
            return nftsServices.mine(data);
        },
        get: (data = null, primary = 0) => {
            return nftsServices.get();
        },
        mynft: (data = null, primary = 0) => {
            return nftsServices.mynft();
        },
        getId: (data = null, primary = 0) => {
            return nftsServices.getById(primary);
        },
    },
    picture: {
        upload: (data = null, id = 0) => {
            return filemanageServices.uploadConfig(data);
        },
        generate: (data = null, url) => {
            return filemanageServices.loadPicture(url);
        },
        generates: (data = null, url) => {
            return filemanageServices.loadPictures(url);
        },
    },
    filemanage: {
        metas: (data, primary = 0) => {
            return filemanageServices.metas(data);
        },
        uploadPicture: (data, primary = 0) => {
            return filemanageServices.uploadPicture(data);
        },
    },
};

export default providers;
