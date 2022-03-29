<template>
    <Button @on-click="claimBet" color="black" text="Reclaim"></Button>
</template>

<script lang="ts">
import { DappLocalState } from '@/types';
import { defineComponent, PropType } from 'vue'
import Button from './Button.vue'
import api from '../api/dapps'

export default defineComponent({
    name: 'ReclaimButton',
    components: {
        Button
    },
    props: {
        localState: {
            type: Object as PropType<DappLocalState>,
            required: true,
        }
    },
    methods: {
        claimBet: function() {
            api.reclaimFromDapp(this.localState);
        }
    }
})
</script>
