<template>
    <b-row class="align-content-center justify-content-center mb-4">
        <b-col sm="6">
            <b-card>
                <b-card-text>
                    <p>Скоро Петьке стало скучно и он пошел делать кефир. А потом пошел домой.</p>
                    <p>А Младший Научный Сотрудник возмущенно тыкал кнопки на большом калькуляторе.</p>
                    <p>На следующий день все повтороилось. А потом снова.</p>
                    <p>&mdash; Готово! &mdash; воскликнул Младший Научный Сотрудник</p>
                    <p>Петька аж выпрыгнул из бидона смотреть результат</p>
                </b-card-text>
                <b-card-text>
                    <b-row class="my-1">
                        <b-col sm="3">
                            <label>T<sub>опт</sub>, К</label>
                        </b-col>
                        <b-col sm="9">
                            <b-form-input v-model="T" :state="success" placeholder="Укажи результат"></b-form-input>
                        </b-col>
                    </b-row>
                    <b-row class="my-1">
                        <b-col sm="3">
                            <label>τ<sub>опт</sub>, сек</label>
                        </b-col>
                        <b-col sm="9">
                            <b-form-input v-model="tau" :state="success" placeholder="Укажи результат"></b-form-input>
                        </b-col>
                    </b-row>
                </b-card-text>
                <b-card-text>
                    &mdash; Опять цифры... &mdash; расстроился Петька
                </b-card-text>
                <b-button
                        href="#"
                        v-if="success"
                        variant="success"
                        @click="$router.push('/micropetka/success')"
                >&mdash; Зато теперь тебе будет тепло и уютно!</b-button>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        name: "PetkaCheck",
        data() {
            return {
                T: '',
                tau: '',
            }
        },
        computed: {
            success() {
                let bothEntered = this.T && this.tau;
                if (!bothEntered) {
                    return null;
                }

                let parsedOk;
                let T;
                let tau;

                try {
                    T = parseFloat(this.T);
                    tau = parseFloat(this.tau);

                    parsedOk = T>0 && tau>0;
                }
                catch (e) {
                    parsedOk = false;
                }

                if (!parsedOk) {
                    return null;
                }

                const [A1, A2] = [9.80E+09, 1.07E+10];
                const [E1, E2] = [1.03E+05, 8.22E+04];

                const k1 = A1 * Math.exp( -E1/(8.314 * T) );
                const k2 = A2 * Math.exp( -E2/(8.314 * T) );

                const C_gl = 0.2/(1+k1*tau + k2*tau);

                const w1 = k1*C_gl;
                const w2 = k2*C_gl;

                const C_mk = 2*tau*w1;
                const C_sp = 2*tau*w2;

                const H = Math.sqrt(C_mk*0.000138);
                const pH = -Math.log10(H);

                const C_sp_ob = C_sp*100*46 / 790.5;

                let ispHOk = (pH > 4.25) && (pH < 4.35);
                let isSpOk = C_sp_ob <= 0.61;
                let isSuccess = ispHOk && isSpOk;

                return isSuccess;
            }
        }
    }
</script>

<style scoped>

</style>