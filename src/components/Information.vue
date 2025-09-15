<template>
    <div
        :class="typeOfInfo ? 'error' : 'info'"
        class="information"
        >
        <p>{{ infoText }}</p>
    </div>
</template>

<script>
import { useUIDataStore } from '@/stores/UIData';

    export default {
        name: 'Information',
        computed: {
            infoText(){
                return useUIDataStore().$state.infoNotifications.text
            },
            typeOfInfo(){
                return useUIDataStore().$state.infoNotifications.isError
            }
        }  
    }
</script>

<style lang="scss" scoped>
.information {
    position: absolute;
    top: 0;
    right: 0;
    // min-width: 300px;
    padding: 20px;
    width: clamp(300px, 50%, 500px);
    border-radius: 6px;
}

.info {
    background-color: #A8E4A0;
}
.error {
    background-color: #f47171;
}
</style>