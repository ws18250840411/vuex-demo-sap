<template>
    <div>
        <Display></Display>
        <Increment></Increment>
        <Reduce></Reduce>
    </div>
</template>

<script>
    import Display from './Display.vue'
    import Increment from './Increment.vue'
    import Reduce from './Reduce.vue'
    import store from './vuex/store'

    export default {
        components: {
            Display,
            Increment,
            Reduce
        },
        store
    }
</script>

<style>
</style>
