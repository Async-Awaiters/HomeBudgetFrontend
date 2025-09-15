<template>
    <div class="custom-select" ref="autocompleteContainer">
        <label for="id">{{ label }}</label>
        <div class="custom-select_input">
            <input 
                @click="openSelect" 
                @blur="handleBlur"
                v-model="localValue"
                :id="id"
                :placeholder="placeholder"
                class="custom-select_choosen"
            />
            <button 
                v-if="isOpen"
                @click="$emit('clear-field')"
                :class="{'position-left': showButton}" 
                class="custom-select_close"
                >
                <svg class="close_image" viewBox="0 0 24 24" width="20px" height="20px">
                    <path d="M11 0.7H13V23.3H11z" transform="rotate(-45.001 12 12)"/>
                    <path d="M0.7 11H23.3V13H0.7z" transform="rotate(-45.001 12 12)"/>
                </svg>
            </button>
            <button 
                v-if="showButton && isOpen"
                @click="addToSelect" 
                class="custom-select_add"
                >добавить
            </button>
            <p class="error">{{ errors }}</p>
        </div>
        <Transition>
            <ul 
                v-if="isOpen" 
                ref="customSelectList" 
                class="custom-select_list"
                >
                <li 
                    v-for="item in searchingItems"
                    :key="item.id"
                    @click="selectItem(item)"  
                    class="custom-select_list-item"
                    >{{ item.name }}
                </li>
            </ul>
        </Transition> 
    </div> 
</template>

<script>
import { useformsDataStore } from '@/stores/formsData'
    export default {
        props: {
            items: Array,
            // maxWidth: Number, //максимальная ширина
            textPosition: String, //позиция текста в input-е, аналог text-align
            modelValue: String,
            showButton: Boolean,
            id: { type: String, required: true },
            label: String,
            type: { type: String, default: 'text' },
            placeholder: String,
            fieldName: String,
            rules: { type: Array, default: () => [] },
            // showErrors: { type: Boolean, default: true }
            
        },
        emits: ['update:modelValue'],
        data(){
            return {
                // selectedItem: null,
                isOpen: false,
                // selectValue: ''
            }
        },

        computed: {
            // maxWidthCondition(){
            //     return this.maxWidth ? this.maxWidth : 400;
            // },
            store(){
                return useformsDataStore();
            },
            selectedValue(){
                return this.store.$state.fields[this.fieldName].value;
            },
            searchingItems(){
                if(this.selectedValue){
                    let result = this.items.filter(item => {
                        return item.code.toLowerCase().includes(this.selectedValue.toLowerCase())
                    })
                    return result
                }else {
                    return this.items
                }
            },
            value() {
                return this.store.getField(this.id)?.value || '';
            },
            errors() {
                return this.store.getField(this.id)?.errors[0]
            },
            localValue: {
                get() {
                    // Преобразуем объект в строку для отображения
                    if (typeof this.modelValue === 'object' && this.modelValue !== null) {
                        return this.modelValue.code || this.modelValue.name || ''
                    }
                    return this.modelValue || ''
                },
                set(value) {
                    // Для select компонента обновляем поисковый запрос
                    this.store.updateField(this.id, value);
                    this.$emit('update:modelValue', value);
                }
            }
        },
        methods: {
            selectItem(item){
                console.log('item', item)
                this.$emit('select-item', item)
                this.isOpen = false
            },
            openSelect(){
                this.isOpen = !this.isOpen
            },
            handleClickOutside(event) {
            // Проверяем, был ли клик вне нашего компонента
                if (this.$refs.autocompleteContainer && 
                    !this.$refs.autocompleteContainer.contains(event.target)) {
                    this.isOpen = false;
                }
            },
            handleInput(e) {
                // const store = useformsDataStore();
                this.store.updateField(this.id, e.target.value);
                console.log('input', e.target.value)
                this.$emit('update:modelValue', e.target.value);
            },
            handleBlur() {
                // const store = useformsDataStore();
                this.store.markAsTouched(this.id);
                this.store.validateField(this.id);
                this.$emit('blur');
            },
            addToSelect(e){
                console.log('e.target.value', this.localValue)
                this.$emit('add-select', this.localValue)
            }

        },
        watch: {
            isOpen(newVal) {
                if (newVal) {
                    this.$nextTick(() => {
                        console.log('Refs доступны:', this.$refs.customSelectList);
                        
                    });
                }
            }
        },
        mounted(){
            document.addEventListener('click', this.handleClickOutside);
            const store = useformsDataStore();
            store.initField(this.id, '', this.rules);
        },
        beforeUnmount() {
            document.removeEventListener('click', this.handleClickOutside);
        },
    }
</script>

<style lang="scss" scoped>
.custom-select {
    // display: none;
    // max-width: v-bind('maxWidthCondition + "px"');
    width: 100%;
    position: relative;

    // -webkit-box-shadow: 0px 2px 8px 0px rgba(34, 60, 80, 0.2);
    // -moz-box-shadow: 0px 2px 8px 0px rgba(34, 60, 80, 0.2);
    // box-shadow: 0px 2px 8px 0px rgba(34, 60, 80, 0.2);

    &_input {
        position: relative;
    }

    &_choosen {
        width: 100%;
        height: 42px;
        border: 1px solid #B5B8B1;
        border-radius: 6px;
        cursor: pointer;
        vertical-align: middle;
        outline: none;
        text-align: v-bind(textPosition);
        padding-left: 10px;
        
    }

    &_close {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 5px;
        // z-index: 100;

        & > .close_image {
            position: absolute;
            top: 50%;
            right: 5px;
            transform: translateY(-50%);
        }

        &.position-left {
            right: 85px;
        }
    }

    &_add {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 3px;
        background-color: #8D917A;
        padding: 5px;
        border-radius: 6px;
        color: #fff;

    }

    &_list {
        list-style-type: none;
        display: flex;
        flex-direction: column;
        gap: 5px;
        position: absolute;
        top: 66px;
        left: 0;
        z-index: 100;
        background-color: #fff;
        // max-width: v-bind('maxWidthCondition + "px"');
        width: 100%;
        -webkit-box-shadow: 0px 8px 12px 4px rgba(34, 60, 80, 0.2);
        -moz-box-shadow: 0px 8px 12px 4px rgba(34, 60, 80, 0.2);
        box-shadow: 0px 8px 12px 4px rgba(34, 60, 80, 0.2);
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;

        &-item {
            cursor: pointer;

            &:hover{
                background-color: #C7D0CC;
            }
        }
    }

    & .error {
        text-align: left;
        color: red;
        position: absolute;
        top: 38px;
        // left: 10px;
    }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.transition_class {
    position: relative;
}


</style>