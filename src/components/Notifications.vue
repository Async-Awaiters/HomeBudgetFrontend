<template>
    <div class="notifications">
        <ul class="notifications_list">
            <li
                v-for="notification in notifications"
                :key="notification" 
                class="notifications_list-item"
                >{{ notification }}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                notifications: [1,2,3,4,5,6,7,8,9,10,11,12]
            }
        }
    }
</script>

<style lang="scss" scoped>
.notifications {
    background-color: #fff;
    width: 400px;
    border-radius: 4px;
    padding: 20px;
    -webkit-box-shadow: 0px 8px 12px 4px rgba(34, 60, 80, 0.2);
    -moz-box-shadow: 0px 8px 12px 4px rgba(34, 60, 80, 0.2);
    box-shadow: 0px 8px 12px 4px rgba(34, 60, 80, 0.2);

    &_list {
        list-style-type: none;
        
        &-item {
            cursor: pointer;
        }
    }
}
</style>