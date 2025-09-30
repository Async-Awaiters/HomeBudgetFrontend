<template>
    <div class="switch-panel">
        <ul class="switch-panel_list">
            <li 
                v-for="item in items"
                :key="item.nameId"
                @click="selectItem(item)"
                :class="item.id === selectedItem?.id ? 'selected' : ''"
                class="switch-panel_list-item"
                >{{ item.name }}

            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            items: Array
        },
        data(){
            return {
                selectedItem: this.items[0]
                // selectedItem: null
            }
        },
        computed(){
            
        },
        methods: {
            selectItem(e){
                this.$emit('select-item', e)
                this.selectedItem = e
            }
        },
        addClass(item){
            if(!this.selectItem && item.initialSelect){
                return item
            }else {
                return item.id === this.selectItem.id
            }
        },
        mounted() {
            if(this.selectItem){
                this.$emit('select-item', this.selectedItem)
            }
        },
    }
</script>

<style lang="scss" scoped>
.switch-panel {
    background-color:  #DCDCDC;
    height: 40px;
    border-radius: 8px;
    margin-bottom: 30px;

    &_list {
        list-style-type: none;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        height: 100%;
        
        &-item {
            cursor: pointer;
            font-weight: 600;

        }
    }
}

.selected {
    color: #4285B4;
    // text-shadow: #4285B4 1px 0 4px;
}
</style>