<template>
    <div>
        <section class="page-header-section style-1">
            <div class="container">
                <div class="page-header-content">
                    <div class="page-header-inner">
                        <div class="page-title">
                            <h2>AI Art Generator</h2>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="create-nft-section padding-bottom padding-top">
            <div class="container">
                <div class="section-wrapper"></div>
                <div class="section-wrapper">
                    <div class="row justify-content-center">
                        <div class="col-lg-8">
                            <a-steps :current="currentStep">
                                <a-step title="Step 1: AI Art Generator" />
                                <a-step title="Step 2: Mine Art" />
                            </a-steps>
                        </div>
                    </div>
                    <div
                        class="row justify-content-center mt-5"
                        v-if="currentStep === 0"
                    >
                        <div class="col-lg-8">
                            <div class="create-nft py-5 px-4">
                                <div class="create-nft-form">
                                    <a-alert
                                        v-if="reqErrors"
                                        :message="reqErrors.message"
                                        :description="reqErrors.description"
                                        type="error"
                                        show-icon
                                    />

                                    <a-form-model
                                        ref="newForm"
                                        :model="form"
                                        :rules="rules"
                                    >
                                        <a-form-model-item
                                            ref="pictureCover"
                                            label="Picture"
                                            prop="pic_file_name"
                                        >
                                            <div class="upload-dragger-box">
                                                <CfCropper
                                                    :thumbnailPic="thumbnailPic"
                                                    :pictureLoading="
                                                        pictureLoading
                                                    "
                                                    @success="
                                                        uploadSuccessHanedler
                                                    "
                                                />
                                            </div>
                                        </a-form-model-item>
                                        <a-form-model-item
                                            ref="prompts"
                                            label="Enter Prompts"
                                            prop="prompts"
                                        >
                                            <a-select
                                                mode="tags"
                                                v-model="form.prompts"
                                                placeholder="Write prompts for the AI to work from"
                                                style="width: 100%"
                                                :token-separators="[' ']"
                                            >
                                            </a-select>

                                            <div
                                                class="form-leading-relaxed"
                                                slot="extra"
                                            >
                                                Write prompts for the AI to work
                                                from
                                            </div>
                                        </a-form-model-item>
                                        <a-alert
                                            class="pt-0 pb-2 pl-2 pr-2 m-0"
                                            type="info"
                                            v-if="loading"
                                        >
                                            <template #description>
                                                <p
                                                    class="d-flex p-0 m-0 pl-3 pr-3"
                                                >
                                                    <i
                                                        class="mdi mdi-18px mdi-information-outline pr-2"
                                                    ></i>
                                                    The generation process may
                                                    take 3-5 minutes, please do
                                                    not leave the page.
                                                </p>
                                            </template>
                                        </a-alert>

                                        <div
                                            class="submit-btn-field text-center"
                                        >
                                            <a-button
                                                key="submit"
                                                type="primary"
                                                :loading="loading"
                                                :disabled="
                                                    form.pic_file_name === ''
                                                "
                                                @click="handleOk"
                                            >
                                                Generate
                                            </a-button>
                                        </div>
                                    </a-form-model>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="row justify-content-center mt-5"
                        v-if="currentStep === 1"
                    >
                        <div class="col-lg-8">
                            <div class="create-nft py-4 px-4">
                                <div class="create-nft-form">
                                    <a-alert
                                        v-if="reqErrors"
                                        :message="reqErrors.message"
                                        :description="reqErrors.description"
                                        type="error"
                                        show-icon
                                    />
                                    <div
                                        v-if="generatePictureUrl !== ''"
                                        class="art-show-box"
                                    >
                                        <img :src="generatePictureUrl" />
                                    </div>
                                    <a-form-model-item
                                        ref="name"
                                        label="Nft Name"
                                        prop="name"
                                    >
                                        <a-input
                                            autocomplete="off"
                                            placeholder="Nft Name"
                                            v-model="nftForm.name"
                                            @blur="
                                                () => {
                                                    $refs.name.onFieldBlur();
                                                }
                                            "
                                        />
                                    </a-form-model-item>
                                    <a-form-model-item
                                        ref="price"
                                        label="Price"
                                        prop="price"
                                    >
                                        <a-input
                                            addon-after="ETH"
                                            v-model="nftForm.price"
                                            size="large"
                                            @blur="
                                                () => {
                                                    $refs.price.onFieldBlur();
                                                }
                                            "
                                        />

                                        <div
                                            class="form-leading-relaxed"
                                            slot="extra"
                                        >
                                            Set a price.
                                        </div>
                                    </a-form-model-item>
                                    <a-form-model
                                        ref="nftForm"
                                        :model="nftForm"
                                        :rules="nftRules"
                                    >
                                        <a-form-model-item
                                            ref="description"
                                            label="Description"
                                            prop="description"
                                        >
                                            <a-textarea
                                                placeholder="Nft Description"
                                                :rows="4"
                                                v-model="nftForm.description"
                                                @blur="
                                                    () => {
                                                        $refs.description.onFieldBlur();
                                                    }
                                                "
                                            />
                                        </a-form-model-item>

                                        <div
                                            class="form-leading-relaxed"
                                            slot="extra"
                                        >
                                            Include 3~20 characters to make it
                                            more attractive and easy to find.
                                        </div>

                                        <div
                                            class="submit-btn-field text-center"
                                        >
                                            <a-button
                                                key="submit"
                                                type="primary"
                                                :loading="mintLoading"
                                                @click="handleMint"
                                            >
                                                Mint Item
                                            </a-button>
                                        </div>
                                    </a-form-model>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="hidden-box">
                        <div class="upload-dragger-box mb-4">
                            <div
                                class="upload-result"
                                id="file-upload-result"
                            ></div>

                            <div class="upload-dragger-wrapper">
                                <a-upload-dragger
                                    name="file"
                                    accept=".fbx,.glb,.vrm,.png,.jpeg"
                                >
                                    <p class="ant-upload-text">
                                        Drag and drop a picture here or click
                                    </p>
                                    <p class="ant-upload-hint">
                                        {{ fileTypes }}
                                    </p>
                                    <div class="custom-upload">
                                        <div class="file-btn">
                                            <i
                                                class="icofont-upload-alt mr-2"
                                            ></i>
                                            Upload a file
                                        </div>
                                    </div>
                                </a-upload-dragger>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { uploadHelper } from "../../../helper/uploader";
import { utilHelper } from "@/helper/utility";
import CfCropper from "@/@kit/components/Picture/Cropper";
import router from "@/router";
export default {
    name: "AiArtGenerator",
    data() {
        return {
            module: "nfts",
            modalOpts: {},
            filesList: [],
            loading: false,
            formData: null,
            fileTypes: "png,jpeg,jpg",
            thumbnailPic: null,
            pictureLoading: false,
            uploadError: null,
            timer: false,
            error: {
                message: "",
                description: "",
                show: false,
            },
            form: {
                prompts: undefined,
                pic_file_name: "",
            },
            nftForm: {
                fileid: "",
                name: "",
                price: 1,
                description: "",
                attributes: [],
            },
            mintLoading: false,
            currentStep: 0,
            generatePictureData: null,
            generatePictureUrl: "",
            oldPicture: {
                id: "",
            },
            rules: {
                pic_file_name: [
                    {
                        required: true,
                        message: "Please upload a picture",
                        trigger: "blur",
                    },
                ],
                prompts: [
                    {
                        required: true,
                        message: "Please enter prompts",
                        trigger: "blur",
                    },
                ],
            },
            nftRules: {
                name: [
                    {
                        required: true,
                        message: "Please input nft name",
                        trigger: "blur",
                    },
                ],
                price: [
                    {
                        required: true,
                        message: "Please input nft price",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    components: { CfCropper },
    mounted() {
        this.init();
    },
    computed: {
        ...mapGetters("requestProvider", ["reqErrors"]),
    },
    methods: {
        ...mapActions("requestProvider", ["reqData", "reqInit", "syncData"]),
        init() {
            this.error = {
                message: "",
                description: "",
                show: false,
            };
            this.loading = false;
            this.reqInit({
                module: this.module,
            });
        },
        uploadSuccessHanedler(formData, fileinfo) {
            const fileName = fileinfo.name;
            this.formData = formData;
            this.loadPicture(fileinfo.data);
            this.form.pic_file_name = fileName;
        },

        async handleOk() {
            this.loading = true;
            this.$refs.newForm.validate(async (valid) => {
                if (!valid) {
                    this.loading = false;
                    return false;
                }
                if (this.form.pic_file_name === "") {
                    this.loading = false;
                    return false;
                }
                const formData = this.formData;
                const strPrompts = this.form.prompts.join(" ");
                formData.append("prompts", strPrompts);
                formData.append("width", 512);
                formData.append("height", 512);
                formData.append("max_iterations", 100);
                const result = await this.syncData({
                    module: "picture",
                    method: "upload",
                    data: {
                        form: formData,
                    },
                });
                if (result.status === 200) {
                    this.generate();
                }
            });
        },
        generate() {
            this.loadFirst(true, () => {
                fetch("/generate")
                    .then(function (response) {
                        return response.text();
                    })
                    .then(function (data) {});
                this.generateResult();
            });
        },
        generateResult() {
            if (this.timer) {
                clearInterval(this.timer);
            }
            this.timer = setInterval(() => {
                this.loadFirst(false, (data) => {
                    if (data.length > 0 && data[0].id !== this.oldPicture.id) {
                        this.oldPicture = data[0];
                        this.loadResult();
                    }
                });
                // this.loadResult();
            }, 15 * 1000);
        },
        loadPicture(filedata) {
            this.pictureLoading = true;
            const blob = new Blob([filedata], {
                type: "application/png;charset=utf-8",
            });
            const url = window.URL.createObjectURL(blob);
            this.thumbnailPic = url;
            this.pictureLoading = false;
        },
        loadFirst(isFirst, finishedFn) {
            const url = `/outputs_first?r=${Math.random()}`;
            this.reqData({
                module: "picture",
                method: "generates",
                data: {
                    id: url,
                },
                success: (res) => {
                    let arrayList = [];
                    if (res.status === 200) {
                        arrayList = res.data || [];
                    }
                    if (arrayList.length > 0 && isFirst) {
                        const newPicture = arrayList[0];
                        this.oldPicture = newPicture;
                    }
                    finishedFn(arrayList);
                },
                complated: () => {
                    finishedFn([]);
                },
            });
        },
        loadResult() {
            const url = `/latest_output?r=${Math.random()}`;
            this.reqData({
                module: "picture",
                method: "generate",
                data: {
                    id: url,
                },
                success: (res) => {
                    if (res.status === 200) {
                        const blob = new Blob([res.data], {
                            type: "image/png, image/jpeg",
                        });
                        const url = window.URL.createObjectURL(blob);
                        this.generatePictureUrl = url;

                        if (this.timer) {
                            clearInterval(this.timer);
                        }
                        this.uploadFile(blob);
                    }
                },
                complated: () => {
                    this.loading = false;
                },
            });
        },
        handleMint() {
            this.mintLoading = true;
            this.$refs.nftForm.validate((valid) => {
                if (!valid) {
                    this.loading = false;
                    return false;
                }
                if (this.nftForm.fileid === "") {
                    this.mintLoading = false;
                    return false;
                }

                const nftForm = utilHelper.deepCopy(this.nftForm);

                this.reqData({
                    module: "filemanage",
                    method: "metas",
                    data: {
                        form: nftForm,
                    },
                    success: (res) => {
                        nftForm.uri = res.uri;
                        this.mine(nftForm);
                    },
                    complated: (res) => {
                        this.mintLoading = false;
                    },
                });
            });
        },
        mine(data) {
            const { uri = "", price = 0 } = data || {};
            if (uri === "" || price === 0) {
                this.mintLoading = false;
            } else {
                const nftData = {
                    uri,
                    price,
                };
                this.reqData({
                    module: "nfts",
                    method: "mine",
                    data: {
                        form: nftData,
                    },
                    success: (res) => {
                        this.getNfts(() => {
                            this.$message.success("Nft mine success");
                            router.push(`/`);
                            this.mintLoading = false;
                        });
                    },
                    complated: (res) => {
                        this.mintLoading = false;
                    },
                });
            }
        },
        getNfts(callback) {
            this.reqData({
                module: "nfts",
                method: "get",
                data: null,
                success: (res) => {
                    callback();
                },
                complated: (res) => {
                    callback();
                },
            });
        },
        uploadFile(blob) {
            // const formData = new FormData();
            // formData.append("file", blob, `art_${Math.random()}`);
            const file = new File([blob], `art_${Math.random()}.jpeg`);
            file.error = (e) => {};
            file.success = (result) => {
                if (result.fileid) {
                    this.nftForm.fileid = result.fileid;

                    const attrs = {
                        trait_type: "extension",
                        value: result.extension,
                    };
                    this.nftForm.attributes[0] = attrs;

                    this.currentStep = 1;
                    this.loading = false;
                }
            };
            try {
                uploadHelper.uploadAndTrackFiles([file]);
            } catch (error) {}
        },
    },
};
</script>
