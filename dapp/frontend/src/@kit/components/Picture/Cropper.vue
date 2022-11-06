<template>
    <div>
        <div class="upload-dragger-plugin">
            <div v-if="thumbnailPic" class="upload-cropper-thumb">
                <img :src="thumbnailPic" />
            </div>
            <div
                class="upload-dragger-wrapper cropper-wrap"
                :class="{ 'has-picture': thumbnailPic }"
            >
                <a-upload-dragger
                    name="file"
                    accept=".jpg,.png,.jpeg"
                    :file-list="picsList"
                    :before-upload="beforeUpload"
                >
                    <p class="ant-upload-drag-icon">
                        <a-icon type="picture" />
                    </p>
                    <p class="ant-upload-text">
                        Drag and drop a picture here or click
                    </p>
                    <p class="ant-upload-hint">
                        {{ fileTypes }}
                    </p>
                </a-upload-dragger>
            </div>
        </div>

        <a-modal
            v-model="visible"
            :class="modalOpts.class"
            :title="modalOpts.title"
            :maskClosable="false"
            centered
            :destroyOnClose="true"
            :closable="false"
        >
            <template slot="footer">
                <a-button
                    key="submit"
                    type="primary"
                    :loading="loading"
                    @click="handleOk"
                >
                    Ok
                </a-button>
            </template>

            <CfAlert :settings="error" />
            <a-alert
                v-if="reqErrors"
                :message="reqErrors.message"
                :description="reqErrors.description"
                type="error"
                show-icon
            />
            <div class="card-body">
                <div class="upload-cropper-box">
                    <div class="row">
                        <div class="col-lg-8">
                            <div class="img-container">
                                <VueCropper
                                    ref="cropper"
                                    :img="option.img"
                                    :outputSize="option.size"
                                    :outputType="option.outputType"
                                    :info="true"
                                    :full="option.full"
                                    :fixed="fixed"
                                    :fixed-number="fixedNumber"
                                    :can-move="option.canMove"
                                    :can-move-box="option.canMoveBox"
                                    :fixed-box="option.fixedBox"
                                    :original="option.original"
                                    :auto-crop="option.autoCrop"
                                    :auto-crop-width="option.autoCropWidth"
                                    :auto-crop-height="option.autoCropHeight"
                                    :center-box="option.centerBox"
                                    @real-time="realTime"
                                    :high="option.high"
                                    :max-img-size="option.max"
                                    @img-load="imgLoad"
                                ></VueCropper>
                            </div>
                        </div>
                        <div class="col-lg-4" ref="previewBox">
                            <div class="show-preview" :style="previewStyle">
                                <div :style="previews.div">
                                    <img
                                        :src="previews.url"
                                        :style="previews.img"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a-modal>
    </div>
</template>
<script>
import CfAlert from "@/@kit/components/Alert";

import { VueCropper } from "vue-cropper";
import { mapActions, mapGetters } from "vuex";
export default {
    name: "CfCropper",
    props: {
        fileTypes: {
            type: String,
            default: "jpg, jpeg, png",
        },
        type: {
            type: String,
            default: "picture",
        },
        thumbnailPic: {
            type: String,
            default: "",
        },
        pictureLoading: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            loading: false,
            visible: false,
            modalOpts: {},
            picsList: [],
            previewStyle: {},
            files: null,
            fixed: true,
            fixedNumber: [1, 1],
            option: {
                outputSize: 1,
                full: false,
                outputType: "jpeg",
                canMove: true,
                fixed: false,
                fixedBox: true,
                original: false,
                canMoveBox: true,
                autoCrop: true,
                maxImgSize: 5000,
                autoCropWidth: 512,
                autoCropHeight: 512,
                centerBox: false,
                mode: "cover",
                high: true,
                max: 99999,
                scale: 1,
            },
            error: {
                message: "",
                description: "",
                show: false,
            },
            previews: {},
        };
    },
    components: {
        CfAlert,
        VueCropper,
    },
    computed: {
        ...mapGetters("requestProvider", ["reqErrors"]),
    },
    methods: {
        ...mapActions("requestProvider", ["syncData", "reqInit"]),
        showModal(actionInfo, initData) {
            const dialogClass = actionInfo.dialogClass || "modal-lg";
            this.modalOpts = {
                title: actionInfo.dialogTitle || actionInfo.title,
                class: `${dialogClass} modal-scrollable`,
            };
            const actionType = actionInfo.actionType;
            this.actionType = actionType;

            this.init();
        },
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
            this.visible = true;
        },
        beforeUpload(file) {
            this.picsList = [file];
            const arrayFiles = this.fileTypes
                .split(", ")
                .map((item) => `image/${item}`);
            const isAllow = arrayFiles.includes(file.type);
            this.error.show = false;
            this.loading = true;
            if (!isAllow) {
                this.error = {
                    message: "Upload Error",
                    description: `The file format is incorrect`,
                    show: true,
                };
                this.loading = false;
                return false;
            }
            const isLt100M = file.size / 1024 / 1024 < 10;
            if (!isLt100M) {
                this.error = {
                    message: "Upload Error",
                    description: `The file size exceeds 10MB`,
                    show: true,
                };
                this.loading = false;
                return false;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                let filedata;
                if (typeof e.target.result === "object") {
                    filedata = window.URL.createObjectURL(
                        new Blob([e.target.result])
                    );
                } else {
                    filedata = e.target.result;
                }
                this.option.img = filedata;
                this.loading = false;
                this.showModal({
                    title: `Cropper Picture`,
                    actionType: "init",
                });
            };
            reader.readAsArrayBuffer(file);

            return false;
        },
        finished(formData, fileDetail) {
            this.$emit("success", formData, fileDetail);
            this.visible = false;
        },
        realTime(data) {
            const previews = data;
            const previewBoxWidth = this.$refs.previewBox.clientWidth - 30;
            const previewWidth = previewBoxWidth > 480 ? 480 : previewBoxWidth;
            this.previewStyle = {
                width: previews.w + "px",
                height: previews.h + "px",
                overflow: "hidden",
                zoom: previewWidth / previews.w,
            };
            this.previews = data;
        },
        imgLoad(msg) {},
        handleOk(e) {
            this.loading = true;
            this.$refs.cropper.getCropBlob((data) => {
                const file = this.picsList[0];
                const formData = new FormData();
                const blob = new Blob([data], {
                    type: "image/png, image/jpeg",
                });
                formData.append("init_image", blob, file.name);

                const beginUpload = async () => {
                    this.finished(formData, {
                        name: file.name,
                        data: blob,
                    });
                    this.loading = false;
                };

                beginUpload();
            });
        },
    },
};
</script>
