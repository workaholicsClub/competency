import Enums from './Enums';

export default {
    matchAttr(attrValue, value) {
        if (attrValue instanceof Array) {
            return attrValue.indexOf(value) !== -1;
        }

        if (attrValue !== false) {
            return attrValue === value;
        }

        return true;
    },
    matchRule(rule, who, experience, wish) {
        return this.matchAttr(rule.who, who) && this.matchAttr(rule.experience, experience) && this.matchAttr(rule.wish, wish);
    },
    getTemplateCode(request, professionName) {
        let defaultTemplate = 'novice';
        if (!request || !request.who || !request.exp || !request.want) {
            return defaultTemplate;
        }

        let who = request.who;
        let experience = request.exp;
        let wish = request.want;

        let templateRules = [
            {
                who: 'новичок',
                experience: false,
                wish: false,
                template: 'novice',
                score: 0
            },
            {
                who: 'новичок',
                experience: false,
                wish: ['продолжить обучение', 'повысить квалификацию'],
                template: 'novice-continue',
                score: 10
            },
            {
                who: 'специалист из другой области',
                experience: false,
                wish: false,
                template: 'other-novice',
                score: 0
            },
            {
                who: 'специалист из другой области',
                experience: false,
                wish: ['продолжить обучение', 'повысить квалификацию'],
                template: 'other-novice-continue',
                score: 10
            },
            {
                who: false,
                experience: false,
                wish: 'прокачать навык',
                template: 'skill',
                score: 100
            },
            {
                who: false,
                experience: false,
                wish: 'начать с нуля',
                template: 'novice',
                score: 100
            },
            {
                who: professionName,
                experience: ['с опытом работы до 3 лет', 'с небольшим опытом работы'],
                wish: false,
                template: 'middle-continue',
                score: 50
            },
            {
                who: professionName,
                experience: ['с опытом работы 3 или более года', 'с большим опытом работы'],
                wish: false,
                template: 'senior-continue',
                score: 50
            }
        ];

        let finalRule = templateRules.reduce((matchedRule, rule) => {
            let isScoreGreater = (matchedRule && matchedRule.score < rule.score) || (!matchedRule);
            return this.matchRule(rule, who, experience, wish) && isScoreGreater
                ? rule
                : matchedRule;
        }, false);

        return finalRule
            ? finalRule.template
            : defaultTemplate;
    },
    getTemplate(templateCode) {
        return Enums.templates[templateCode] || false;
    }
}