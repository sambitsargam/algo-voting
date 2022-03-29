<template>
    <Button @on-click="toggleBetModal" :color="color" text="Vote"></Button>
    <transition name="fade">
        <BetModal v-if="showBetModal" :teamName="teamName" :teamColor="color" :dapp="dapp" @toggle-bet-modal="toggleBetModal"></BetModal>
    </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BetModal from './BetModal.vue'
import Button from './Button.vue'

export default defineComponent({
    name: 'VoteButton',
    components: {
        BetModal,
        Button
    },
    data() {
        return {
            showBetModal: false
        }
    },
    props: {
        text: String,
        color: String,
        teamName: String,
        dapp: Object,
    },
    methods: {
        toggleBetModal: function() {
            this.showBetModal = !this.showBetModal;
        }
    }
})
</script>
