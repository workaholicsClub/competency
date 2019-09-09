<template>
    <div class="skill-list">
        <span class="skill" v-for="skill in skills" :key="skill.name">
            {{skill.name}}
            <span class="skill-strength" :class="['level'+skill.level]">
                <span></span><span></span><span></span><span></span>
            </span>
        </span>
    </div>
</template>

<script>
    export default {
        name: 'SkillList',
        props: ['skills']
    }
</script>