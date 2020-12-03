<template>
    <b-row class="align-content-center justify-content-center mb-4">
        <b-col sm="6">
            <b-card :img-src="img">
                <b-card-text>
                    <p>Директор был очень рад! И рабочие тоже. С кефиром всю вредность как рукой сняло!</p>
                    <p>И сделал директор Петьку начальником кефирного цеха.</p>
                    <p>А Младший Научный Сотрудник теперь Старший!</p>
                    <h1 class="text-center">Конец!</h1>
                </b-card-text>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
    import img from "../../assets/petka_prikaz.png";

    export default {
        name: "PetkaSuccess",
        data() {
            return {
                img,
            }
        }
    }
</script>

<style scoped>

</style>