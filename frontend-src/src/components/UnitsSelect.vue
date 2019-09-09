<template>
    <div class="units-control-container">
        <span class="select-arrow fa fa-sort"></span>
        <select class="form-control" :value="value" @change="$emit('input', $event.target.value)">
            <option v-for="item in itemsEnum" :value="item.code" :key="item.code">{{item.title}}</option>
        </select>
    </div>
</template>

<script>
    export default {
        name: 'UnitsSelect',
        props: ['value', 'items-enum']
    }
</script>

<style>
    .units-control-container {
        position: relative;
        padding-left: 0.5em;
    }

    .units-control-container select {
        background-color: transparent;
        border: 0;
        color: #333;
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
    }

    .units-control-container select::-ms-expand {
        display: none;
    }

    .units-control-container select:-moz-focusring {
        color: transparent;
        text-shadow: 0 0 0 #000;
    }

    .units-control-container select:focus {
        outline: none !important;
        box-shadow: none;
        background-color: transparent;
    }

    .units-control-container .select-arrow {
        color: #333;
        left: 0.25em;
        top: 50%;
        height: 1em;
        margin-top: -0.5em;
        position: absolute;
        pointer-events: none;
        font-size: 0.75em;
    }
</style>