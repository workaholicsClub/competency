<template>
    <b-container fluid>
        <b-container fluid v-if="showRules">
            <h1>Правила</h1>
            <b-button variant="success" class="mb-4" @click="showRules = false">К игре</b-button>

            <h3>Дисклеймер</h3>
            <p>Скажу сразу: эта игра сделана для освоения основных операций в Экселе. А навести порядок с продажами
            &mdash; это самая частая тема для того, чтобы засесть за таблички. Поэтому рекомендую пользоваться Экселем,
                чтобы миллион упал в карман быстрее</p>

            <h3>Интро</h3>
            <p>Вы решили открыть свой бизнес по продаже аптекарских товаров. Бром, йод, сера &mdash; вы всю
            жизнь мечтали ими торговать и перестать работать на дядю или тетю. И вот, вы закупили
            немного товара, накопили 50 000, уволились и зарегистрировали ИП.</p>
            <p>Долгожданная свобода! Будем работать на себя и заработаем миллион. Не так много по нынешним временам, но
            интересно, насколько быстро получится его заработать на продажах.</p>
            <p>Перед вами будет панель, на которой показаны текущие заказы и немного статистики вашего магазина.</p>
            <p>Чтобы было удобнее анализировать происходящее, сделаны кнопки копирования данных о заказах и статистике
            в буфер обмена. А потом можно вставить все в Эксель, строить графики, линии тренда и принимать оптимальные
            решения. Можно и наугад, конечно. Но кто сказал, что так можно быстрее заработать миллион?</p>

            <h3>Заказы</h3>
            <p>Поначалу заказов в магазине почти не будет. Правильно - кто о вас слышал-то? Чтобы их было больше, можно
            запускать рекламу. Реклама стоит денег, поэтому следите за остатками товаров и ценами, чтобы не потратить
            их впустую.</p>
            <p>Покупатели бывают капризные. Если товар будет слишком дорогим, его не купят. Если какого-то товара
            не будет на складе, то они пойдут в другой магазин. Все или ничего! Заказы, на которых не хватило товара,
            будут помечены красным.</p>

            <h3>Реклама</h3>
            <p>При запуске рекламы учтите, что рекламных поверхностей конечное количество. И рекламодатели за них
            конкурируют. Тот рекламщик, который больше платит -- получает больше показов. Хочу заметить, что и аудитория
            тоже не резиновая. Широкая аудитория не обязательно подходит вашему магазину. Когда вы показываете свою
            рекламу всем-всем, не стоит ожидать больших конверсий и большого количества заказов. Вряд-ли ваша сера нужна
            тем кто ищет как испечь пирог и какой сервер выбрать для дачи.</p>
            <p>Рекламу можно и не давать. Потихоньку люди узнают о вашем магазине из поиска или от знакомых. Растет
            посещаемость магазина. Может быть не так быстро, как хотелось-бы, но все же.</p>

            <h3>Зарплата, налоги и расходы</h3>
            <p>То, что на расчетном счету &mdash; еще не ваше. Вашим оно станет, когда вы снимите деньги с расчетного
            счета и положите себе в карман. Сделать это можно в конце месяца. И тут вас ждет сюрприз.</p>
            <p>Оказывается, раз в месяц нужно оплачивать налоги. В том числе и за те деньги, которые вы решите положить
            в свой карман. Нужно платить банку за операции с картами. Нужно платить за хостинг сайта. Если закуплено много
            товара, то нужно платить за комнатку-склад для их хранения. И, самый главный сюрприз! Нужно платить за
            доставку заказов. Логистическая компания выставляет счет ежемесячно.</p>
            <p>Тут бы не разориться, что уж там миллион!</p>
            <b-button variant="success" @click="showRules = false" class="mb-4">К игре</b-button>
        </b-container>
        <b-container fluid v-else>
            <b-row>
                <b-col cols="12" md="7">
                    <b-table
                        striped
                        hover
                        show-empty
                        empty-text="Сегодня заказов нет"
                        :items="todayOrdersForTable"
                        :fields="fields"
                    >
                        <template #cell(date)="data">
                            {{moment.unix(data.value).format('DD.MM.YYYY HH:mm')}}
                        </template>
                        <template #cell(goods)="data">
                            <p class="mb-0" v-for="product in data.value" :key="product.code">
                                {{product.name}}: {{product.quantity}} шт
                            </p>
                        </template>
                    </b-table>
                    <b-button @click="copyOrdersToBuffer" class="mr-2">Копировать историю заказов в буфер</b-button>
                    <b-button @click="showRules = true">Правила</b-button>
                </b-col>
                <b-col cols="12" md="5">
                    <b-card no-body class="mb-4">
                        <b-list-group flush>
                            <b-list-group-item>
                                <p class="mb-0">День: {{dayNumber}}</p>
                                <small class="text-muted">{{today.format('DD.MM.YYYY')}}, {{weekDays[dayOfWeek]}}</small>
                            </b-list-group-item>
                            <b-list-group-item class="d-flex justify-content-between">
                                <span>Денег на счету: {{budget}}</span>
                                <span>
                                <b-badge variant="danger" class="mr-2">-{{todayMoneyMinus}}</b-badge>
                                <b-badge variant="success">+{{todayMoneyPlus}}</b-badge>
                            </span>
                            </b-list-group-item>
                            <b-list-group-item>
                                <p class="mb-0">Заработано: {{totalWin}}</p>
                                <small class="text-muted">Дождись конца месяца, чтобы пополнить карман</small>
                            </b-list-group-item>
                        </b-list-group>
                        <b-card-text class="p-2">
                            <b-button @click="nextDay" class="mr-2" :disabled="balance < 0">Новый день</b-button>
                            <b-button size="sm" @click="showPopup('adsModal')" v-if="!adIsRunning" class="mr-2">Реклама</b-button>
                            <b-button size="sm" variant="danger" class="mr-2" @click="stopAds" v-else>Остановить</b-button>
                            <b-button size="sm" @click="showPopup('priceModal')" class="mr-2">Товары</b-button>
                        </b-card-text>
                    </b-card>
                    <b-card no-body class="mb-4">
                        <b-list-group flush>
                            <b-list-group-item>Посетителей сегодня: {{todayVisitors}}</b-list-group-item>
                            <b-list-group-item>Показов рекламы: {{ads.todayViews}}</b-list-group-item>
                            <b-list-group-item>Посетителей по рекламе: {{todayAdVisitors}}</b-list-group-item>
                            <b-list-group-item>Конверсия рекламы: {{fractionToPercent(todayAdVisitors/ads.todayViews)}}</b-list-group-item>
                            <b-list-group-item>Заказов за сегодня: {{todayOrders.length}}</b-list-group-item>
                            <b-list-group-item>Конверсия в заказы: {{fractionToPercent(visitorConversion)}}</b-list-group-item>
                        </b-list-group>
                    </b-card>
                    <b-button @click="copyNumbersToBuffer">Копировать историю цифр в буфер</b-button>
                </b-col>
            </b-row>
            <b-modal id="adsModal" title="Запуск рекламы" centered>
                <b-form>
                    <b-form-group label="Сколько дней показывать рекламу:">
                        <b-form-spinbutton v-model="adsSettings.days" min="1" max="365"></b-form-spinbutton>
                    </b-form-group>
                    <b-form-group
                        label="Стоимость одного показа:"
                        description="Количество рекламных мест ограничено, а рекламодателей много. Кто больше платит за показ, у того показов больше"
                    >
                        <b-form-spinbutton
                            v-model="adsSettings.pricePerView"
                            :min="settings.minViewPrice"
                            :max="settings.maxViewPrice">
                        </b-form-spinbutton>
                    </b-form-group>
                    <b-form-group
                        label="Рекламный бюджет в день:"
                        description="Чтобы не потратить все деньги за один день"
                    >
                        <b-form-spinbutton
                            v-model="adsSettings.pricePerDay"
                            min="100"
                            :max="settings.maxPricePerDay"
                            step="100">
                        </b-form-spinbutton>
                    </b-form-group>
                    <b-form-group
                        label="Размер аудитории:"
                        :description="`Чем точнее (и меньше) аудитория, тем больше в ней тех, кому нужен ваш товар. Максимальная конверсия:
                    ${fractionToPercent(generateAdsConversion(adsSettings.auditorium, true))}`"
                    >
                        <b-form-spinbutton
                            v-model="adsSettings.auditorium"
                            min="1000"
                            :max="settings.maxAdsAuditorium"
                            step="1000"
                        >
                        </b-form-spinbutton>
                    </b-form-group>
                </b-form>
                <template #modal-footer="{ ok, cancel }">
                    <b-button variant="success" @click="startAds() && ok()">Запустить</b-button>
                    <b-button variant="secondary" size="sm" @click="cancel">Отмена</b-button>
                </template>
            </b-modal>
            <b-modal id="priceModal" title="Товары и цены" centered>
                <b-form>
                    <b-list-group flush>
                        <b-list-group-item v-for="product in goods" :key="product.code" class="d-flex justify-content-between">
                            <div>
                                <p class="mb-0">{{product.name}}</p>
                                <p class="mb-0"><small>Себестоимость: {{product.buyPrice}}</small></p>
                                <p class="mb-0"><small>Остаток: {{product.stock}}</small></p>
                            </div>
                            <b-form-group label="Купить:" :description="`Остаток: ${product.stock}`">
                                <b-form-spinbutton
                                    v-model="buy[product.code]"
                                    min="0"
                                    max="10000"
                                    step="1"
                                >
                                </b-form-spinbutton>
                            </b-form-group>
                            <b-form-group label="Цена продажи:" :description="`Закупочная цена: ${product.buyPrice}`">
                                <b-form-spinbutton
                                    v-model="product.sellPrice"
                                    min="0"
                                    max="10000"
                                    step="10"
                                >
                                </b-form-spinbutton>
                            </b-form-group>
                        </b-list-group-item>
                        <b-list-group-item class="d-flex justify-content-between">
                            <b>Итого:</b>
                            <span>{{buyPrice}}</span>
                            <span></span>
                        </b-list-group-item>
                        <b-list-group-item v-if="!enoughMoney">
                            <b-alert variant="danger" show>Недостаточно денег</b-alert>
                        </b-list-group-item>
                    </b-list-group>
                </b-form>
                <template #modal-footer="{ ok }">
                    <b-button variant="success" @click="buyStocks() && ok()" :disabled="!enoughMoney">Купить</b-button>
                    <b-button variant="secondary" size="sm" @click="ok">Закрыть</b-button>
                </template>
            </b-modal>
            <b-modal id="salaryModal" title="Зарплата и налоги"
                centered
                no-close-on-backdrop
                no-close-on-esc
                hide-header-close
            >
                <b-form>
                    <b-form-group label="Сколько денег взять себе:">
                        <b-form-spinbutton v-model="thisMonthSalary" min="0" :max="budget" step="100"></b-form-spinbutton>
                    </b-form-group>
                </b-form>
                <h5>Налоги и дополнительные расходы:</h5>
                <b-tabs content-class="mt-3">
                    <b-tab title="Общие данные" active>
                        <b-list-group>
                            <b-list-group-item>Зарплата: {{taxes.salary}}</b-list-group-item>
                            <b-list-group-item>Налоги: {{taxes.totalTaxes}}</b-list-group-item>
                            <b-list-group-item>Доп. расходы: {{taxes.totalAdditionalExpenses}}</b-list-group-item>
                            <b-list-group-item>Итого: {{taxes.total}}</b-list-group-item>
                        </b-list-group>
                    </b-tab>
                    <b-tab title="Подробно">
                        <b-list-group>
                            <b-list-group-item>Зарплата: {{taxes.salary}}</b-list-group-item>
                            <b-list-group-item>УСН (6% дохода): {{taxes.usnTax}}</b-list-group-item>
                            <b-list-group-item>НДФЛ с доходов: {{taxes.salaryTax}}</b-list-group-item>
                            <b-list-group-item>Взносы на пенсионное страхование: {{taxes.pensionTax}}</b-list-group-item>
                            <b-list-group-item>Взносы на медицинское страхование: {{taxes.medicalTax}}</b-list-group-item>
                            <b-list-group-item>Оплата банку за операции с картами: {{taxes.acquiring}}</b-list-group-item>
                            <b-list-group-item>Доставка заказов: {{taxes.delivery}}</b-list-group-item>
                            <b-list-group-item>Оплата сайта: {{taxes.hosting}}</b-list-group-item>
                            <b-list-group-item>Аренда комнаты для склада: {{taxes.rent}}</b-list-group-item>
                            <b-list-group-item>Итого налогов: {{taxes.totalTaxes}}</b-list-group-item>
                            <b-list-group-item>Итого доп. расходы: {{taxes.totalAdditionalExpenses}}</b-list-group-item>
                            <b-list-group-item>Итого: {{taxes.total}}</b-list-group-item>
                        </b-list-group>
                    </b-tab>
                </b-tabs>
                <template #modal-footer="{ ok }">
                    <b-button variant="success" @click="nextMonth() && ok()">Готово</b-button>
                </template>
            </b-modal>
            <b-modal id="looseModal" title="Вы банкрот!"
                centered
                no-close-on-backdrop
                no-close-on-esc
                hide-header-close
            >
                <h5>Денег нет, игра закончилась:(</h5>
                <p>Обновите страницу, чтобы начать снова</p>
                <template #modal-footer><span></span></template>
            </b-modal>
            <b-modal id="winModal" title="Вы выиграли!"
                centered
                no-close-on-backdrop
                no-close-on-esc
                hide-header-close
            >
                <h5>Поздравляю!</h5>
                <p>И вот сколько дней на это ушло: {{dayNumber}}</p>
                <p>Можно продолжить зарабатывать или обновить страницу, чтобы начать заново и улучшить результат</p>
                <template #modal-footer="{ ok }">
                    <b-button variant="success" @click="ok()">Продолжить</b-button>
                </template>
            </b-modal>
        </b-container>
    </b-container>
</template>

<script>
import moment from "moment";
import clone from "lodash.clonedeep";

export default {
    data() {
        let defaultAds = {
            days: 0,
            dayStarted: 0,
            pricePerDay: 0,
            pricePerView: 0,
            daysLeft: 0,
            conversion: 0,
            auditorium: 0,
            auditoriumLeft: 0,
            todayViews: 0,
        }

        return {
            dayNumber: 0,
            todayAdVisitors: 0,
            todayVisitors: 0,
            todayGoodsConversion: {},
            todayOrders: [],
            budget: 50000,
            thisMonthSalary: 0,
            totalWin: 0,
            winAccepted: false,
            todayAdditionalExpenses: 0,
            adsSettings: {
                days: 1,
                pricePerDay: 100,
                pricePerView: 1,
                auditorium: 1000,
            },
            fields: [
                {key: 'date', label: 'Дата', sortable: true},
                {key: 'goods', label: 'Товары', sortable: false},
                {key: 'price', label: 'Стоимость', sortable: false},
            ],
            buy: {},
            taxes: {},
            weekDays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
            defaultAds,
            ads: clone(defaultAds),
            goods: [
                {
                    code:'brom',
                    name: 'Бром',
                    buyPrice: 100,
                    sellPrice: 150,
                    stock: 10,
                },
                {
                    code: 'iod',
                    name: 'Йод',
                    buyPrice: 75,
                    sellPrice: 100,
                    stock: 10,
                },
                {
                    code: 'sera',
                    name: 'Сера',
                    buyPrice: 200,
                    sellPrice: 300,
                    stock: 10,
                },
            ],
            settings: {
                halfOfOrganicVisitorGrowthAtDay: 180,
                minOrganicVisitorsPerDayPercent: 0.4,
                maxOrganicVisitorsPerDay: 200,
                organicVisitorsSigmoidSkew: 0.03,
                freePriceConversion: 0.5,
                maxAdsConversion: 0.7,
                minAdsConversion: 0.0001,
                priceSkew: 0.03,
                bestAdConversion: 0.9,
                noisePercent: 0.1,
                adsViewsPerDayPerPrice: 1000,
                minViewPrice: 0.5,
                maxViewPrice: 1200,
                maxAdsAuditorium: 1200000,
                avgAdsAuditorium: 20000,
                adsMaxConversionSigmoidSkew: 0.00009,
                maxPricePerDay: 1000000,
                usnType: '6',
                hostingPrice: 150,
                goodsQuantityToStartRent: 100,
                rentPrice: 5000,
                orderDeliveryPrice: 150,
                needToWin: 1000000,
            },
            history: {
                orders: [],
                numbers: [],
                buys: [],
                taxes: [],
            },
            moment: moment,
            showRules: true,
        }
    },
    watch: {
        thisMonthSalary() {
            this.computeTaxesAndExpenses(this.thisMonthSalary, true);
        }
    },
    created() {
        this.resetBuy();
    },
    methods: {
        nextDay() {
            this.saveHistory();
            this.dayNumber++;

            if (this.ads.daysLeft > 0) {
                this.ads.daysLeft--;

                if (this.ads.daysLeft === 0) {
                    this.stopAds();
                }
            }

            this.updateTodayVisitors();
            this.updateGoodsConversion();
            this.updateTodayOrders();
            this.updateBudget();
            this.updateStocks();

            if (this.isNewMonth) {
                this.computeTaxesAndExpenses(this.thisMonthSalary);
                this.showPopup('salaryModal');
            }
            else {
                this.checkWinOrLoose();
            }
        },
        nextMonth() {
            let taxes = clone(this.taxes);
            taxes.date = this.today.unix();
            this.history.taxes.push(taxes);

            this.todayAdditionalExpenses += taxes.total;
            this.totalWin += this.thisMonthSalary;

            return true;
        },
        saveHistory() {
            this.history.orders = this.history.orders.concat(this.todayOrders);
            this.history.numbers.push({
                date: this.today.unix(),
                visitors: this.todayVisitors,
                adViews: this.ads.todayViews,
                adVisitors: this.todayAdVisitors,
                adConversion: this.fractionToPercent(this.todayAdVisitors/this.ads.todayViews),
                orderCount: this.todayOrders.length,
                orderConversion: this.fractionToPercent(this.visitorConversion),
                balance: this.balance,
                income: this.todayMoneyPlus,
                expenses: this.todayMoneyMinus,
            });
        },
        startAds() {
            let {days, pricePerDay, pricePerView, auditorium} = this.adsSettings;
            this.ads.dayStarted = this.dayNumber;
            this.ads.days = days;
            this.ads.daysLeft = days+1;
            this.ads.pricePerDay = pricePerDay;
            this.ads.pricePerView = pricePerView;
            this.ads.auditorium = auditorium;
            this.ads.viewsLeft = auditorium;
            this.ads.conversion = this.generateAdsConversion(auditorium);
            return true;
        },
        stopAds() {
            this.ads = clone(this.defaultAds);
        },
        showPopup(code) {
            this.$bvModal.show(code);
        },
        fractionToPercent(fraction) {
            if (fraction > 0) {
                return `${Math.round(fraction * 10000) / 100}%`;
            }
            else {
                return '0%';
            }
        },
        normalRandom(min, max, skew) {
            //https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
            let u = 0, v = 0;
            while(u === 0) u = Math.random();
            while(v === 0) v = Math.random();
            let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

            num = num / 10.0 + 0.5;
            if (num > 1 || num < 0) {
                num = this.normalRandom(min, max, skew);
            }
            else {
                num = Math.pow(num, skew);
                num *= max - min;
                num += min;
            }

            return num;
        },
        uniformRandom(min, max) {
            return min + Math.random()*max;
        },
        normalPdf(x, variance, mean) {
            return 1/(variance * Math.sqrt(2*Math.PI)) * Math.exp(-0.5*Math.pow((x-mean)/variance, 2));
        },
        scaledNormalPdf(x, variance, mean) {
            let max = this.normalPdf(mean, variance, mean);
            return this.normalPdf(x, variance, mean)/max;
        },
        noisedValue(base) {
            let noiseLevel = base * this.settings.noisePercent;
            return base+this.normalRandom(-noiseLevel, noiseLevel, 1);
        },
        sigmoidFunction(x, min, max, center, skew = 1) {
            return (max+min)/(1+Math.exp(-skew*(x-center)))-min;
        },
        reverseSigmoidFunction(x, min, max, center, skew = 1) {
            return max - (max-min)/(1+Math.exp(-skew*(x-center)));
        },
        someRandomNumbers(count, min, max, skew) {
            return Array(count).fill(0).map(() => this.normalRandom(min, max, skew));
        },
        generateAdsConversion(auditorium, returnBase = false) {
            let baseAdsConversion = this.reverseSigmoidFunction(
                auditorium,
                0,
                1,
                this.settings.avgAdsAuditorium,
                this.settings.adsMaxConversionSigmoidSkew
            ) * this.settings.maxAdsConversion + this.settings.minAdsConversion;
            return returnBase
                ? baseAdsConversion
                : this.noisedValue(baseAdsConversion);
        },
        generateOrganicVisits() {
            let lifetimeMaxVisits = this.sigmoidFunction(
                this.dayNumber,
                0,
                this.settings.maxOrganicVisitorsPerDay,
                this.settings.halfOfOrganicVisitorGrowthAtDay,
                this.settings.organicVisitorsSigmoidSkew
            )

            let lifetimeMinVisits = lifetimeMaxVisits * this.settings.minOrganicVisitorsPerDayPercent

            //максимум на четверг
            let weekdayDependentProbability = this.scaledNormalPdf(this.dayOfWeek, 1, 3);
            return Math.round(this.noisedValue(lifetimeMaxVisits * weekdayDependentProbability + lifetimeMinVisits));
        },
        generateRandomTodayTimes(count) {
            let todayStart = this.today.unix();
            let hours = this.someRandomNumbers(count, 0, 24, 0.6); // максимум на 16 часов
            return hours.map(hour => todayStart + hour*3600);
        },
        generateGoodsConversion() {
            return this.goods.reduce((conversions, product) => {
                let baseConversion = this.reverseSigmoidFunction(
                    product.sellPrice,
                    0,
                    1,
                    product.buyPrice,
                    this.settings.priceSkew,
                );
                conversions[product.code] = this.noisedValue(baseConversion * this.settings.freePriceConversion);
                return conversions;
            }, {});
        },
        generateAdViews() {
            let dailyAuditory = this.ads.auditorium / this.ads.days;
            let advertiserCount = Math.round(this.normalRandom(0, 100, 4)); //максимум на 4-х
            let otherPricePerViews = Array(advertiserCount).fill(0).map(() => {
                //максимум примерно на 20
                return this.normalRandom(this.settings.minViewPrice, this.settings.maxViewPrice, 5);
            });
            let pricePerViewSum = otherPricePerViews.reduce((sum, pricePerView) => sum+pricePerView, 0) + this.ads.pricePerView;
            let myPercentage = this.ads.pricePerView / pricePerViewSum;
            let adViews = Math.round(dailyAuditory * myPercentage);
            if (adViews * this.ads.pricePerView > this.ads.pricePerDay) {
                adViews = Math.floor(this.ads.pricePerDay / this.ads.pricePerView);
            }

            return adViews;
        },
        generateOrderGoods() {
            let positionsCount = Math.round(this.normalRandom(1, 4, 3));
            let positions = Array(positionsCount).fill(0).map(() => {
                let positionIndex = Math.round(this.uniformRandom(0, this.goods.length-1));
                let position = clone(this.goods[positionIndex]);
                position.quantity = Math.round(this.normalRandom(1, 20, 6));
                return position;
            });

            let finalPositions = [];
            for (let position of positions) {
                let existingPosition = finalPositions.find(finalPosition => finalPosition.code === position.code);
                if (existingPosition) {
                    existingPosition.quantity += position.quantity;
                }
                else {
                    finalPositions.push(position);
                }
            }

            return finalPositions;
        },
        updateTodayVisitors() {
            let adViews = this.adIsRunning
                ? this.generateAdViews()
                : 0;

            let conversion = this.generateAdsConversion(this.ads.auditorium);

            if (adViews > this.ads.viewsLeft) {
                adViews = this.ads.viewsLeft;
                this.stopAds();
            }

            this.ads.todayViews = adViews;
            this.ads.viewsLeft -= adViews;

            let adVisits = Math.round(adViews * conversion);
            let organicVisits = this.generateOrganicVisits();

            this.todayAdVisitors = adVisits;
            this.todayVisitors = adVisits+organicVisits;
        },
        updateGoodsConversion() {
            this.todayGoodsConversion = this.generateGoodsConversion();
        },
        updateTodayOrders() {
            let averageConversion = Object.keys(this.todayGoodsConversion)
                .reduce((sum, code) => sum+this.todayGoodsConversion[code], 0)/this.goods.length;

            let orderCount = Math.round(this.todayVisitors * averageConversion);
            let dates = this.generateRandomTodayTimes(orderCount).sort();

            let stocks = this.goods.reduce((stocks, product) => {
                stocks[product.code] = product.stock;
                return stocks;
            }, {});

            this.todayOrders = dates.map((date) => {
                let goods = this.generateOrderGoods();
                let price = goods.reduce((sum, position) => {
                    return sum + position.sellPrice * position.quantity;
                }, 0);
                price = Math.round(price * 100)/100;

                let cancelled = false;
                for (let orderProduct of goods) {
                    stocks[orderProduct.code] -= orderProduct.quantity;
                    if (stocks[orderProduct.code] < 0) {
                        cancelled = true;
                    }
                }

                return {
                    date,
                    goods,
                    price,
                    cancelled
                }
            });
        },
        updateBudget() {
            this.budget += this.todayDelta;
            this.todayAdditionalExpenses = 0;
        },
        updateStocks() {
            for (let order of this.todayOrders) {
                if (!order.cancelled) {
                    for (let orderProduct of order.goods) {
                        let product = this.goods.find(storeProduct => storeProduct.code === orderProduct.code);
                        if (product) {
                            product.stock -= orderProduct.quantity;
                        }
                    }
                }
            }
        },
        resetBuy() {
            this.buy = this.goods.reduce((aggr, product) => {
                aggr[product.code] = 0;
                return aggr;
            }, {});
        },
        buyStocks() {
            this.todayAdditionalExpenses += this.buyPrice;
            let buyHistory = [];
            for (let product of this.goods) {
                product.stock += this.buy[product.code] || 0;
                buyHistory.push({
                    product: product.name,
                    quantity: this.buy[product.code] || 0,
                    pricePerUnit: product.buyPrice
                });
            }

            this.history.buys = this.history.buys.concat(buyHistory);
            this.resetBuy();
            return true;
        },
        computeTaxesAndExpenses(salary, updateState = true) {
            let startOfMonth = this.today.clone().subtract(5, 'd').startOf('month');
            let endOfMonth = this.today.clone().subtract(5, 'd').endOf('month');
            let monthOrders = this.history.orders.filter(order => {
                let orderDate = moment.unix(order.date);
                let dateFits = orderDate.isBetween(startOfMonth, endOfMonth);
                return dateFits && order.cancelled === false;
            });
            let monthHistory = this.history.numbers.filter(dayNumbers => {
                return moment.unix(dayNumbers.date).isBetween(startOfMonth, endOfMonth);
            });

            let monthIncome = monthHistory.reduce((sum, dayNumbers) => sum + dayNumbers.income, 0);
            let monthExpenses = monthHistory.reduce((sum, dayNumbers) => sum + dayNumbers.expenses, 0);

            let totalStocks = this.goods.reduce((sum, product) => sum + product.stock, 0);

            let usnTax = 0;
            if (this.settings.usnType === '6') {
                usnTax = monthIncome * 0.06;
            }
            else {
                if (monthIncome - monthExpenses > 0) {
                    usnTax = (monthIncome - monthExpenses) * 0.15;
                }
                else {
                    usnTax = monthIncome * 0.01;
                }
            }

            let salaryTax = salary * 0.09;
            let pensionYearlyTax = 32448;
            if (monthIncome > 300000) {
                pensionYearlyTax += (monthIncome-300000) * 0.01;
            }
            let pensionTax = pensionYearlyTax / 12;
            let medicalYearlyTax = 8426;
            let medicalTax = medicalYearlyTax / 12;

            let acquiring = monthIncome * 0.02;
            let hosting = this.settings.hostingPrice;
            let rent = totalStocks > this.settings.goodsQuantityToStartRent
                ? this.settings.rentPrice
                : 0;
            let delivery = monthOrders.length * this.settings.orderDeliveryPrice;

            let totalTaxes = usnTax+salaryTax+pensionTax+medicalTax;
            let totalAdditionalExpenses = salary+delivery+acquiring+hosting+rent;
            let total = totalTaxes + totalAdditionalExpenses;

            let taxes = {
                salary,
                monthIncome,
                monthExpenses,
                usnTax: Math.round(usnTax),
                salaryTax: Math.round(salaryTax),
                pensionTax: Math.round(pensionTax),
                medicalTax: Math.round(medicalTax),
                acquiring: Math.round(acquiring),
                delivery,
                hosting,
                rent,
                totalTaxes: Math.round(totalTaxes),
                totalAdditionalExpenses: Math.round(totalAdditionalExpenses),
                total: Math.round(total),
            }

            if (updateState) {
                this.taxes = taxes;
            }

            return taxes;
        },
        checkWinOrLoose() {
            if (this.budget < 0) {
                this.showPopup('looseModal');
            }

            if (this.totalWin >= this.settings.needToWin && !this.winAccepted) {
                this.showPopup('winModal');
                this.winAccepted = true;
            }
        },
        testDistribution(testMin, testMax, testSkew) {
            let results = {};
            for (let n = 0; n<10000; n++) {
                let number = Math.round(this.normalRandom(testMin, testMax, testSkew));
                results[number] = typeof (results[number]) !== 'undefined'
                    ? results[number]+1
                    : 1;
            }

            console.log(results);
            return results;
        },
        copyOrdersToBuffer() {
            let csv = this.history.orders.map(order => {
                let goods = order.goods.map(product => {
                    return `${product.name}: ${product.quantity} шт`;
                }).join(', ');

                return [
                    moment.unix(order.date).format('DD.MM.YYYY HH:mm'),
                    goods,
                    order.price,
                    order.cancelled ? 'Отменен': ''
                ].join('\t');
            }).join('\n');
            csv = `Дата\tТовары\tЦена\tОтмена\n` + csv;

            return navigator.clipboard.writeText(csv);
        },
        copyNumbersToBuffer() {
            let csv = this.history.numbers.map(numbers => {
                let values = [
                    moment.unix(numbers.date).format('DD.MM.YYYY'),
                    numbers.visitors,
                    numbers.adViews,
                    numbers.adVisitors,
                    numbers.orderCount,
                    numbers.income,
                    numbers.expenses,
                ]
                return values.join('\t');
            }).join('\n');

            csv = `Дата\tПосетители\tПоказы рекламы\tРекламные посетители\tЗаказы\tДоходы\tРасходы\n` + csv;
            return navigator.clipboard.writeText(csv);
        }
    },
    computed: {
        zeroDayStart() {
            return moment().startOf('d');
        },
        yesterday() {
            return moment().startOf('d').add(this.dayNumber-1, 'd');
        },
        today() {
            return moment().startOf('d').add(this.dayNumber, 'd');
        },
        isNewMonth() {
            return this.today.date() === 1;
        },
        adIsRunning() {
            return this.ads.daysLeft > 0;
        },
        goodsAveragePrice() {
            return this.goods.reduce((sum, product) => sum+product.sellPrice, 0)/this.goods.length;
        },
        visitorConversion() {
            return this.todayVisitors > 0
                ? this.todayOrders.length / this.todayVisitors
                : 0;
        },
        dayOfWeek() {
            return this.today.day();
        },
        todayOrderEarnings() {
            return this.todayOrders.reduce((sum, order) => {
                if (order.cancelled) {
                    return sum;
                }

                let earnings = order.goods.reduce((sum, position) => {
                    return sum + position.sellPrice * position.quantity;
                }, 0);
                earnings = Math.round(earnings * 100)/100;

                return sum+earnings;
            }, 0);
        },
        todayAdPrice() {
            return this.todayAdVisitors * this.ads.pricePerView;
        },
        buyPrice() {
            let totalPrice = 0;
            for (let product of this.goods) {
                totalPrice += product.buyPrice * (this.buy[product.code] || 0);
            }
            return totalPrice;
        },
        enoughMoney() {
            return this.buyPrice <= this.budget;
        },
        todayMoneyPlus() {
            return this.todayOrderEarnings;
        },
        todayMoneyMinus() {
            return this.todayAdPrice + this.todayAdditionalExpenses;
        },
        todayDelta() {
            return this.todayMoneyPlus - this.todayMoneyMinus;
        },
        todayOrdersForTable() {
            return this.todayOrders.map(order => {
                let newOrder = clone(order);
                if (order.cancelled) {
                    newOrder._rowVariant = 'danger';
                }

                return newOrder;
            })
        }
    }
}
</script>

<style scoped>

</style>