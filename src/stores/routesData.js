import { defineStore } from 'pinia'

export const useroutesDataStore = defineStore('routesData', {
  state: () => ({
    routesData: {
        accountData: null
    }
  })


})