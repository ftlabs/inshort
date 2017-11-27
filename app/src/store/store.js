import Vue from "vue";
import Vuex from "vuex";
import API from './API'

Vue.use(Vuex);
const api = new API();

const state = {
    id: null,
    summaryMethod: null,
    extractiveData: null,
    responseData: null
}

const getters = {
    getResults: state => state.responseData,
}

const mutations = {
    updateSavedData (state, data) {
          state.responseData = data
      },
    updateSearchParams (state, data) {
          state.id = data.id;
          state.summaryMethod = data.summaryMethod
          state.extractiveData = data.extractiveData
    }
}

const actions = {
    FETCH_DATA ({ commit }) {
        api.fetch(this.state.id, this.state.summaryMethod, this.state.extractiveData).then((response) => {
            commit('updateSavedData', response)
        }, () => {
            console.log('Error fetching data')
        })
        }
}

export default new Vuex.Store({
    state,
    actions,
    getters,
    mutations
});