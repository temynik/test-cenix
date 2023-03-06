import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        itemsTable: []
    },
    mutations: {
        ITEMS: (state, payload) => {
            state.itemsTable = payload;
        },
    },
    actions: {
        editItems: (context, data) => {
            context.commit('ITEMS', data);
        },
    }
})
