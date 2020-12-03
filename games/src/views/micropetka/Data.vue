<template>
    <b-row class="align-content-center justify-content-center mb-4">
        <b-col sm="6">
            <b-card :img-src="img">
                <b-card-text>
                    <p>Младший научный сотрудник хмурил брови и кусал ручку.</p>
                    <p>&mdash; А что это за буквы? &mdash; спросил Петька</p>
                    <p>&mdash; Это уравнения реакций процесса брожжения, для которого надо подобрать температурный режим. И время.</p>
                    <p>&mdash; Ничего непонятно, но жутко интересно! А это?</p>
                    <b-table striped hover :items="experiment" :fields="fields">
                        <template #head(cet)>
                            <span>C(C<sub>2</sub>H<sub>5</sub>OH), об. %</span>
                        </template>
                    </b-table>
                    <p>&mdash; Это экспериментальные данные для определения оптимальных параметров процесса. Ну и констант в уравнении Аррениуса заодно.</p>
                    <p>&mdash; Уравнении Варениуса?</p>
                    <p>Младший Научный Сотрудник хихикнул и
                        <b-button
                                :href="notebookUrl"
                                target="_blank"
                                :variant="linkClicked ? 'outline-secondary' : 'outline-primary'"
                                size="sm"
                                class="d-inline-flex"
                                :style="{color: 'black', borderColor: 'black'}"
                                @click="linkClicked = true"
                        >
                            уткнулся носом в свои листочки
                            <b-icon icon="box-arrow-up-right" class="ml-2"></b-icon>
                        </b-button>.
                    </p>
                </b-card-text>
                <b-button
                        href="#"
                        :variant="linkClicked ? 'primary' : 'secondary'"
                        @click="$router.push('/micropetka/check')"
                >А Петька с интересом наблюдал</b-button>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
    import img from "../../assets/petka_formula.png";
    export default {
        name: "PetkaData",
        data() {
            return {
                img,
                linkClicked: false,
                notebookUrl: 'https://colab.research.google.com/drive/14N77G60z1ijlFlYx0K_F6ApBAuLUVHUJ?usp=sharing',
                fields: [
                    {key: 'T', label: 'T, °C'},
                    {key: 'tau', label: 'τ, час'},
                    {key: 'cet', label: 'С(C2H5OH), об. %'},
                    {key: 'pH', label: 'pH'},
                ],
                experiment: [
                    {T: 18, tau: 12, cet: 1.56, pH: 4.19},
                    {T: 23, tau: 7, cet: 1.59, pH: 4.15},
                    {T: 28, tau: 4, cet: 1.59, pH: 4.12},
                    {T: 18, tau: 7, cet: 1.12, pH: 4.26},
                    {T: 23, tau: 7, cet: 1.19, pH: 4.15},
                    {T: 28, tau: 7, cet: 2.07, pH: 4.07},
                ]
            }
        }
    }
</script>

<style scoped>

</style>