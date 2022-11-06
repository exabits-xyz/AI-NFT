<template>
    <div>
        <a-alert
            v-show="settings.show"
            :message="settings.message"
            :description="settings.description"
            show-icon
            type="error"
        >
        </a-alert>
    </div>
</template>
<script>
export default {
    name: "CfAlert",
    props: {
        settings: {
            type: Object,
        },
    },
};
</script>
