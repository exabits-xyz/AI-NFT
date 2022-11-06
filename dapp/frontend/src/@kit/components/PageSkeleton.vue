<template>
    <div>
        <slot v-if="loading" name="loading">
            <div class="card">
                <div class="card-body">
                    <a-skeleton active />
                </div>
            </div>
        </slot>
        <slot v-else> </slot>
    </div>
</template>

<script>
export default {
    name: "CfPageSkeleton",
    props: {
        loading: Boolean,
    },
};
</script>
