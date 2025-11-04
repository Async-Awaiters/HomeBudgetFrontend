<template>
    <div :class="{isHidden: isHidden}" class="categories">
        <h2 class="categories_title">Категории</h2>
        <p class="categories_subtitle">здесь вы можете добавить, изменить или удалить категории...</p>
        <div class="categories_inner">
            <SwitchPanel
                @select-item="selectCategoriesAction"
                :items="categoriesSwitchPanel"
            />
            <div class="categories_actions">
                <Field
                    v-for="field in fieldName"
                    :key="field"
                    :fieldName="field"
                />
                <button
                    @click="categoriesAction"
                    :disabled="loading" 
                    class="categories_btn"
                    >{{ buttonText }}
                </button>
            </div>
        </div>
        <button 
            @click="hideCategories" 
            :class="{isHidden: isHidden}" 
            class="categories_hide-button"
            >
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
                <path style="fill:#0089FF;" d="M507.344,154.765c-7.713-10.283-22.301-12.367-32.582-4.655L256.005,314.182L37.238,150.111
                    c-10.283-7.713-24.869-5.626-32.582,4.655c-7.713,10.282-5.627,24.871,4.655,32.582l232.732,174.544
                    c4.138,3.103,9.05,4.655,13.964,4.655c4.912,0,9.826-1.552,13.964-4.655l232.72-174.544
                    C512.971,179.636,515.056,165.048,507.344,154.765z"
                />
            </svg>
        </button>
    </div>
</template>

<script>
import SwitchPanel from './SwitchPanel.vue';
import Field from '@/components/Field.vue';
import { useUIDataStore } from '@/stores/UIData';
import { useformsDataStore } from '@/stores/formsData';

    export default {
        components: {
            SwitchPanel,
            Field,
        },
        data(){
            return {
                categoriesSwitchPanel: [
                    {
                        id: 1,
                        nameId: 'create',
                        name: "создать",
                        initialSelect: true
                    },
                    {
                        id: 2,
                        nameId: 'edit',
                        name: "изменить",
                        initialSelect: false
                    },
                    {
                        id:3,
                        nameId: 'delete',
                        name: "удалить",
                        initialSelect: false
                    }
                ],
                selectedCategoriesAction: null,
                loading: false,
                categoriesIsChanged: false,
                fieldsNotEmpty: false,
                isHidden: true
            }
        },
        computed:{
            fieldName(){
                if(!this.selectedCategoriesAction){
                    return ['categoriesCreateField']
                }else {
                    if(this.selectedCategoriesAction.nameId === 'create'){
                        return ['categoriesCreateField']
                    }else if(this.selectedCategoriesAction.nameId === 'edit'){
                        return ['categoriesEditFieldSelect', 'categoriesEditFieldValue']
                    }else if(this.selectedCategoriesAction.nameId === 'delete'){
                        return ['categoriesDeleteField']
                    }else {
                        return ['categoriesCreateField']
                    }
                }
            },
            buttonText(){
                return this.selectedCategoriesAction ? this.selectedCategoriesAction.name : this.categoriesSwitchPanel[0].name;
            },
            connector(){
                return this.$root.connector;
            },
            uiStore(){
                return useUIDataStore();
            },
            formsStore(){
                return useformsDataStore().$state;
            },
            // checkFields(){
            //     // for()
            // }
        },
        methods: {
            selectCategoriesAction(e){
                this.selectedCategoriesAction = e;
                if(this.selectedCategoriesAction.nameId !== 'create'){
                    this.getCategories();
                }
            },
            categoriesAction(){
                if(this.selectedCategoriesAction){
                    if(this.selectedCategoriesAction.nameId === "create"){
                        if(this.formsStore.fields.categoriesCreateField.value){
                            const data = {
                                name: this.formsStore.fields.categoriesCreateField.value
                            };
                            this.connector.addCategories(data)
                                .then(res => {
                                    this.formsStore.fields.categoriesCreateField.value = '';
                                    this.uiStore.showNotification(false, 'Вы успешно добавили категорию', true);
                                })
                                .catch(err => {
                                    this.uiStore.showNotification(true, 'Не получилось добавить категорию!', true);
                                })
                        }
                        
                    }else if(this.selectedCategoriesAction.nameId === "edit"){
                        const data = {
                            name: this.formsStore.fields.categoriesEditFieldValue.value
                        }
                        const id = this.formsStore.fields.categoriesEditFieldSelect.valueId;

                        this.connector.updateCategory(data, id)
                            .then(res => {
                                this.loading = true
                                this.getCategories();
                                this.formsStore.fields['categoriesEditFieldSelect'].value = ''
                                this.formsStore.fields['categoriesEditFieldSelect'].valueId = null
                                this.formsStore.fields['categoriesEditFieldValue'].value = ''
                                this.uiStore.showNotification(false, 'Вы успешно изменили категорию', true);
                            })
                            .catch(err => {
                                console.log('updateCategory err', err)
                                this.uiStore.showNotification(true, 'Не получилось изменить категорию', true);
                            }) 
                            .finally(() => {
                                this.loading = false;
                            })   
                        
                        
                    }else if(this.selectedCategoriesAction.nameId === "delete"){
                        if(this.formsStore.fields.categoriesDeleteField.value){
                            const id = this.formsStore.fields.categoriesDeleteField.valueId;
                            this.connector.deleteCategory(id)
                                .then(res => {
                                    this.formsStore.fields.categoriesDeleteField.value = '';
                                    this.getCategories()
                                    this.uiStore.showNotification(false, 'Вы успешно удалили категорию', true);
                                })
                                .catch(err => {
                                    this.uiStore.showNotification(true, 'Не получилось удалить категорию', true);
                                }) 
                        }
                        
                    }
                }
            },
            getCategories(){
                this.loading = true;
                this.connector.getCategories()
                    .then(res => {
                        this.formsStore.fields['categoriesEditFieldSelect'].items = res.data
                        this.formsStore.fields['categoriesDeleteField'].items = res.data
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .finally(()=> {
                        this.loading = false;
                    })
            },
            hideCategories(){
                this.isHidden = !this.isHidden
            }
        },
        created(){
            this.getCategories()
        }
        
    }
</script>

<style lang="scss" scoped>
.categories {
    background-color: #fff;
    max-width: 800px;
    width: 100%;
    border-radius: 8px;
    padding: 20px;
    position: relative;

    &_subtitle {
        margin-bottom: 20px;
    }

    &_btn {
        background-color: #71ceed;
        height: 42px;
        padding: 0 20px;
        border-radius: 8px;
        margin-top: 10px;
    }

    &_hide-button {
        position: absolute;
        top: 20px;
        right: 20px;
        transform: rotate(180deg);

        &.isHidden {
            top: 10px;
            transform: rotate(0deg);
        }

        & > svg {
            width: 25px;
            height: 25px;
        }

    }

    &.isHidden {
        height: 40px;
        padding: 0;
        overflow: hidden;
    }
}
</style>