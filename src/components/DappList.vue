<template>
    <Header :text="listName"></Header>
    <div v-bind:key="dapp.Id" v-for="dapp in dapps">
        <DappBlock v-if="!('dapp' in dapp)" :dapp="dapp"></DappBlock>
        <DappBlock v-else :dapp="dapp.dapp" :localState="dapp"></DappBlock>
    </div>
</template>

<script lang="ts">
import { Dapp } from '@/types'
import { defineComponent, PropType } from 'vue'
import DappBlock from './DappBlock.vue'
import Header from './Header.vue'


export default defineComponent({
    name: 'Dapps',
    components: {
        DappBlock,
        Header
    },
    props: {
        listName: String,
        dapps: {
            type: Array as PropType<Array<Dapp>>, // or Array<DappLocalState>
            required: true,
        }
    },
})
</script>
