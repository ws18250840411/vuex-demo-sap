<template>
    <div>
        <div>
            <p>{{data}}</p>
            <p>{{reversedMessage}}</p>

        </div>
    </div>
</template>



<script>

    export default{
        data(){
            return{
                data:'page1我是第一个页面的内容'
            }
        },
        computed:{
            reversedMessage: function () {
                return this.data.split('').reverse().join('')
            }

        }
    }

    </script>