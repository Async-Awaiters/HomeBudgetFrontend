<template>
    <div class="birthdate_container">
        <div class="birthdate_container_outer">
            <label for="id">Дата рождения</label>
            <div class="birthdate_container_inner">
                <!-- <input
                    :type="text"
                    :id="id"
                    :value="modelValue"
                    @input="handleInput"
                    @blur="handleBlur"
                    placeholder="дата рождения"
                    :disabled="disabled"
                    class="field"
                    v-maska="'##.##.####'"

                /> -->
                <input
                    v-model="fieldValue"
                    :id="id"
                    :type="type"
                    :value="value"
                    @input="handleInput"
                    @blur="handleBlur"
                    :placeholder="placeholder"
                    :disabled="disabled"
                    class="birthdate"
                    v-maska="'##.##.####'"
                />
            </div>
        </div>
        <!-- <v-text-field
            :id="id"
            :value="modelValue"
            @input="handleInput"
            :placeholder="placeholder"
            :disabled="disabled"
            >

        </v-text-field> -->
        
        <!-- <p v-if="errorsInfo.status" 
            class="field_error"
            >{{ errorsInfo.message }}
        </p> -->
        
    </div>
</template>

<script>
import { vMaska } from "maska/vue"
import moment from "moment"
import { useformsDataStore } from '@/stores/formsData';

    // export default {
    //     directives: { maska: vMaska },
    //     props: {
    //         label: String,
    //         label: {
    //             type: String,
    //             default: ''
    //         },
    //         modelValue: {
    //             type: [String, Number],
    //             default: ''
    //         },
    //         placeholder: {
    //             type: String,
    //             default: ''
    //         },
    //         disabled: {
    //             type: Boolean,
    //             default: false
    //         },
    //         rules: {
    //             type: Object,
    //             default: () => ({})
    //         }
            
    //     },
    //     emits: ['update:modelValue'],
    //     data(){
    //         return {
    //             errorsInfo: {
    //                 status: false,
    //                 message: ""
    //             },
    //         }
    //     },

    //     methods: {
    //         handleInput(event) {
    //             console.log(event)

    //             this.$emit('update:modelValue', event.target.value)
                
    //             this.$emit('input-data', {
    //                 error: true
    //             });
    //             // this.clearValidation(this.id)
    //         },
    //         handleBlur(e) {
    //             this.validateField(e)
    //             console.log('eee', this.modelValue)
    //             this.$emit('blur')
    //         },
    //         validateField(e) {
    //             const value = e.target.value
    //             const isValidValue = moment(value, "DD.MM.YYYY").isValid()
    //             if(value.length === 0){
    //                 this.errorsInfo.status = true
    //                 this.errorsInfo.message = "Поле пустое"
    //             }
    //             else if(!isValidValue){
    //                 this.errorsInfo.status = true
    //                 this.errorsInfo.message = "Введите валидное значение"
    //             }else {
    //                 this.errorsInfo.status = false
    //                 this.errorsInfo.message = ""
    //             }
                
    //         }
    //     },
    // }
    export default {
        directives: { maska: vMaska },
        props: {
            id: { type: String, required: true },
            label: String,
            type: { type: String, default: 'text' },
            placeholder: String,
            disabled: Boolean,
            rules: { type: Array, default: () => [] },
            showErrors: { type: Boolean, default: true }
        },
        mounted() {
            const store = useformsDataStore();
            store.initField(this.id, '', this.rules);
        },
        computed: {
            value() {
                const store = useformsDataStore();
                return store.getField(this.id)?.value || '';
            },
            errors() {
                const store = useformsDataStore();
                return store.getField(this.id)?.errors || [];
            }
        },
        methods: {
            handleInput(e) {
                const store = useformsDataStore();
                store.updateField(this.id, e.target.value);
                this.$emit('update:modelValue', e.target.value);
            },
            handleBlur() {
                const store = useformsDataStore();
                store.markAsTouched(this.id);
                store.validateField(this.id);
                this.$emit('blur');
            }
        }
    }
</script>

<style lang="scss" scoped>
.birthdate {
    width: 100%;
    height: 42px;
    border-radius: 8px;
    border: 2px solid silver;
    background-color: #fff;
    outline: none;
    border: 1px solid #000;
    padding-left: 10px;
    font-size: 18px;
    margin-bottom: 20px;
    
    &_container {
        margin-bottom: 10px;
        position: relative;
        
        &_inner {
            position: relative;
            overflow: hidden;
            border-radius: 8px;

            &_button {
                background-color: #f3f3f3;
                position: absolute;
                top: 2px;
                right: 2px;
                // transform: translateY(-50%);
                width: 40px;
                height: 38px;
                border-top-right-radius: 8px;
                border-bottom-right-radius: 8px;

                & > img {
                    width: 25px;
                    height: 25px;
                }
            }
        }
    }

    &_error {
        text-align: left;
        color: red;
        position: absolute;
        top: 65px;
        left: 10px;

    }
}
</style>