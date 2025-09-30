<template>
    <div class="custom-button">
        <v-btn 
            @click="$emit('click-on-button')"
            :disabled="disabled"
            >{{ text }}
        </v-btn>
    </div>
</template>

<script>
import { useformsDataStore } from '@/stores/formsData';

    export default {
        props: {
            text: String,
            type: String,
            disabled: Boolean
        },
        data(){
            return {
                // disabled: false
            }
        },
        emits: ['click-on-button'],
        computed: {
            // ruleToDisabled(){
            //     if(this.type === 'request'){
            //         // this.disabled = true
            //         const store = useformsDataStore().getAllData
            //         for(let val in store){
            //             console.log(1, store[val])
            //             const required = store[val].rules.filter(item => item.type === 'required').length !== 0 ? true : false;
            //             const hasErrors = store[val].errors.length !== 0 ? true : false;
            //             console.log('check errors', required, hasErrors)
            //             if(required && hasErrors){
            //                 console.log('h1')
            //                 return true
            //             }else {
            //                 console.log('h2')
            //                 return false
            //             }
                    
            //         }
            //     }else {
            //         return false
            //     }
                
            // }         
        },

        methods: {
            // ruleToDisabled(){
            //     if(this.type === 'request'){
            //         this.disabled = true
            //         const store = useformsDataStore()
            //         this.unsubscribe = store.$subscribe((mutation, state) => {
            //             console.log('state', state)
            //             if(mutation.type === 'direct'){
            //                 // for(let val in state){
            //                 //     console.log(1, state[val])
            //                 //     const required = store[val].rules.filter(item => item.type === 'required').length !== 0 ? true : false;
            //                 //     const hasErrors = store[val].errors.length !== 0 ? true : false;
            //                 //     console.log('check errors', required, hasErrors)
            //                 //     if(required && hasErrors){
            //                 //         console.log('h1')
            //                 //         this.disabled = true
            //                 //     }else {
            //                 //         console.log('h2')
            //                 //         this.disabled = false
            //                 //     }
                    
            //                 // }
            //             }
            //         })
                    
            //     // }else {
                    
            //     }
                
            // }
        },
        created(){
            // this.ruleToDisabled()
        },

        mounted(){
            // this.ruleToDisabled
        }

    }
</script>

<style lang="scss" scoped>
.custom-button {
    .v-btn {
        color: #2c3e50 !important;
    }
}
</style>