<template>
    <div id="app" @click="foo">
        {{ message }}
    </div>
</template>

<script>
var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    },
    methods: {
        foo: function () {
            // single comment
            /* 
             * block comment
            
             */
            this.message += "!"
        }
    },
})
</script>