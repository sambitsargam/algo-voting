<template>
    <DarkModeSwitch @switched="onSwitched" :initialState="isDarkModeEnabled" />
    <NavBar text="Algo-Votes"></NavBar>
    <router-view></router-view>
    <div v-if="hasAlgoSigner">
        
    </div>
    <NeedAlgoSigner v-else-if="!loading"></NeedAlgoSigner>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavBar from './components/NavBar.vue'
import NeedAlgoSigner from './components/NeedAlgoSigner.vue'
declare var AlgoSigner: any; // eslint-disable-line



export default defineComponent({
    name: 'App',
    components: {
        NavBar,
        NeedAlgoSigner,
    },
    data() {
        return {
            loading: true,
        }
    },
    computed: {
        hasAlgoSigner() {
            return this.$store.state.hasAlgoSigner;
        },
    },
    mounted() {
        this.checkAlgoSigner();
        setTimeout(() => this.loading = false, 200)
    },
    methods: {
        async checkAlgoSigner() {
            if (typeof AlgoSigner !== 'undefined') {
                this.$store.commit('setHasAlgoSigner', true);
                await AlgoSigner.connect();
                this.$store.dispatch('getAll');
            } else {
                setTimeout(() => this.checkAlgoSigner(), 1);
            }
        }
        
    }
});


</script>

<style>
#app {
    text-align: center;
    margin-top: 100px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #266faa;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}


html, body {
  width: 100%;
  height:100%;
}

body {
    margin: 0px;
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

</style>




