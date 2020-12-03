<template>
    <b-row class="align-content-center justify-content-center mb-4">
        <b-col sm="6">
            <b-card title="Микроб Петька и Бродильный Чан" :img-src="img">
                <b-card-text>
                    <p>Однажды Микроб Петька устроился на молочный завод. Кефир делать. Директору завода Петькин кефир очень понравился.</p>
                    <p>&mdash; Петька! Мне так нравится твой кефир, что я решил давать его всем рабочим на заводе! За вредность, вместо молока.</p>
                    <p>Петька надулся от гордости. А потом нахмурился и говорит:</p>
                    <p>&mdash; Хорошо, я сделаю. Только как успеть? Это же целую цистерну кефира надо. А может и больше</p>
                    <p>&mdash; Не переживай, Петька! &mdash; махнул рукой директор &mdash; Ради такого дела я тебе помощь пришлю. Целого Младшего Научного Сотрудника.</p>
                </b-card-text>
                <b-button href="#" variant="primary" @click="$router.push('/micropetka/task')">И прислал</b-button>
                <b-card-text class="mt-4">
                    <small class="text-muted mt-4">По мотивам рассказов Григория Остера</small>
                </b-card-text>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
    import img from "../../assets/petka_intro.png";
    export default {
        name: "PetkaIntro",
        data() {
            return {img}
        }
    }
</script>

<style scoped>

</style>