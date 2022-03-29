<template>
    <Button @on-click="claimBet" :color="color" text="Claim"></Button>
</template>

<script lang="ts">
import { DappLocalState } from '@/types';
import { defineComponent, PropType } from 'vue'
import Button from './Button.vue'
import api from '../api/dapps'

export default defineComponent({
    name: 'ClaimButton',
    components: {
        Button
    },
    props: {
        color: String,
        localState: {
            type: Object as PropType<DappLocalState>,
            required: true,
        }
    },
    methods: {
        claimBet: function() {
            api.claimFromDapp(this.localState);
        }
    }
})
</script>
