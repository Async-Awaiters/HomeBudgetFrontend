<template>
    <div class="field_container">
        <component
            :is="fields[fieldName].fieldType"
            :id="fields[fieldName].id"
            v-model="fields[fieldName].value"
            v-bind="fields[fieldName]"
           
            :label="fields[fieldName].label"
            :items="fields[fieldName].items"
            @select-item="selectItem"
            @clear-field="clearSelect"
            :placeholder="fields[fieldName].placeholder"
            :fieldName="fieldName"
            :showButton="fields[fieldName].showButton"
            @add-select="addSelect"
            :selectHasSearch="fields[fieldName].selectHasSearch"
            >
        </component>
        <!-- <p>{{ fields[fieldName].id }}</p> -->
    </div>
</template>

<script>
import Text from '@/Fields/Text.vue';
import Birthdate from '@/Fields/Birthdate.vue';
import CustomSelect from '@/parts/CustomSelect.vue';
import { useformsDataStore } from '@/stores/formsData';

export default {
    components: {
        Text,
        Birthdate,
        CustomSelect
    },
    props: {
        fieldName: String
    },
    data(){
        return {
            fieldTypes: {
                Text,
                Birthdate
            }
        }
    },
    computed: {
        // fieldValue:{
        //     get(){
        //         console.log(this.value)
        //         return this.value
        //     },
        //     set(val){
        //         let oldval = val;
        //     }
        // },
        connector(){
            return this.$root.connector;
        },
        fieldConfig() {
            return this.formsData[this.fieldName];
        },
        field() {
            return this.$root.formsData[this.fieldName];
        },
        fields() {
            const store = useformsDataStore().getAllData
            console.log('store', store)
            return store;
        },
        fieldsActions(){
            
            return useformsDataStore()
        }
        
    },
    methods: {
        selectItem(value){
            console.log(3, value)
            this.fieldsActions.select(value, this.fieldName)
        },
        clearSelect(){
            this.fieldsActions.selectClear(this.fieldName)
        },
        addSelect(value){
            console.log('value', value)
            if(this.fieldName === 'transactionCategory'){
                const data = {
                    Name: value
                }
                this.connector.addCategories(data)
                    .then(res => {
                        console.log('addCategories res', res)
                    })
                    .catch(err => {
                        console.log('addCategories err', err)
                    })
            }
        }
    }

}
</script>

<style lang="scss" scoped>

</style>