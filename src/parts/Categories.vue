<template>
    <div class="categories">
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
                fieldsNotEmpty: false
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
            checkFields(){
                // for()
            }
        },
        methods: {
            selectCategoriesAction(e){
                console.log('selectCategoriesAction', e)
                this.selectedCategoriesAction = e;
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
                                    console.log('addCategories res', res)
                                    this.uiStore.showNotification(false, 'Вы успешно добавили категорию', true);// не работает!
                                })
                                .catch(err => {
                                    console.log('addCategories err', err)
                                    this.uiStore.showNotification(true, 'Не получилось добавить категорию!', true);
                                })
                        }
                        
                    }else if(this.selectedCategoriesAction.nameId === "edit"){
                        if(this.formsStore.fields.categoriesEditFieldValue.value && this.formsStore.fields.categoriesEditFieldValue.valueId){
                            const data = {
                                name: this.formsStore.fields.categoriesEditFieldValue.value
                            }
                            const id = this.formsStore.fields.categoriesEditFieldSelect.valueId;

                            this.connector.updateCategory(data, id)
                                .then(res => {
                                    console.log('updateCategory res', res)
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
                        }
                        
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
                                    console.log(err)
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

    &_btn {
        background-color: #71ceed;
        height: 42px;
        padding: 0 20px;
        border-radius: 8px;
    }
}
</style>