<template>
    <div>
        <slot v-if="errors" name="errors">
            <a-alert
                message="Error"
                :description="errors.message"
                show-icon
                type="warning"
                class="mb-2"
            >
            </a-alert>
        </slot>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "CfWidgetContainer",
    props: {
        errors: Object,
    },
};
</script>
