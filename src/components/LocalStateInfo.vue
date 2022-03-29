<template>
    <div v-if="!hasClaimed">
        <h1>{{localStateBetAlgos}}</h1>
        <img src="../assets/algorand_logo_mark_black.svg" alt="">
        <h1>on </h1>
        <h1 :style="{color: color}">{{localState.Team}}</h1>
    </div>
    <div v-else>
        <h2>Your Votes on </h2>
        <h2 :style="{color: color}">{{localState.Team}}</h2>
        <h2> has already been claimed</h2>
    </div>
</template>

<script lang="ts">
import { DappLocalState } from '@/types'
import { defineComponent, PropType } from 'vue'
import {microalgosToAlgos} from 'algosdk'


export default defineComponent({
    props: {
        localState: {
            type: Object as PropType<DappLocalState>,
            required: true,
        },
        color: {
            type: String,
            default: 'black'
        }
    },
    computed: {
        localStateBetAlgos(): number {
            return microalgosToAlgos((this.localState as DappLocalState).Bet)
        },
        hasClaimed(): boolean {
            return this.localState.Bet === 0
        }
    }
})
</script>

<style scoped>
h1 {
    display: inline;
    color: black;
    font-size: 36px;
}

h2 {
    display: inline;
    color: black;
    font-size: 24px;
}

img {
    width: 80px;
    margin-top: -20px;
    margin-left: -20px;
    margin-right: -10px;
    margin-bottom: -25px;
}
</style>
