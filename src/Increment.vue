<template>
    <span>
        <button @click="increment">Increment +1</button>
    </span>
</template>

<script>
    import {incrementCounter} from './vuex/actions'

    export default {
        vuex: {
            actions: {
                increment: incrementCounter
            }
        }
    }
</script>

<style>
</style>
