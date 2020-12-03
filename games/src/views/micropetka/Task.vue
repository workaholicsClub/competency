<template>
    <b-row class="align-content-center justify-content-center mb-4">
        <b-col sm="6">
            <b-card :img-src="img">
                <b-card-text>
                    <p>&mdash; Так! &mdash; сказал Младший Научный Сотрудник, &mdash; Показывай, Петька, свой цех. Буду думать, как тебе помочь.</p>
                    <p>&mdash; Я вот тут сижу. В большом бидоне с молоком.</p>
                    <p>&mdash; Ясно. Бродильный чан. Удобно тебе там?</p>
                    <p>&mdash; Удобно. Только холодно</p>
                    <p>&mdash; Ясно! Сейчас все настроим! &mdash; воскликнул Младший Научный Сотрудник. А потом начал бегать, крутить ручки и что-то писать на бумажках</p>
                </b-card-text>
                <b-button href="#" variant="primary" @click="$router.push('/micropetka/data')">Петька вылез из бидона и подсмотрел</b-button>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
    import img from "../../assets/petka_scientist.png";
    export default {
        name: "PetkaTask",
        data() {
            return {img}
        }
    }
</script>

<style scoped>

</style>