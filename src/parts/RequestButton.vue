<template>
    <div class="request-button">
        <button
            @click="$emit('reqest-call')"
            class="request-button_btn"
            >
            <span v-if="loading" class="loader"></span>
            <p v-else class="request-button_text">
                <slot></slot>
            </p>
        </button>
    </div>
</template>

<script>
    export default {
        props: {
            loading: Boolean
        }
    }
</script>

<style lang="scss" scoped>
.request-button {
    &_btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        
    }

    &_text {
        text-align: center;
    }
}
.loader {
    width: 30px;
    height: 30px;
    border: 5px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
} 
</style>