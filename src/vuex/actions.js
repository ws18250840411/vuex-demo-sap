export const incrementCounter = function ({dispatch, state}) {
    dispatch('INCREMENT', 1)
}

export const reduceCounter = function ({dispatch, state}) {
    dispatch('REDUCE', 1)
}