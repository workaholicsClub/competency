<?php

namespace Competencies\Skill;

use Spot\Locator;

class Skill
{
    /*
     * Четыре стадии усвоения знаний
     *
     * Новичок (не знаю, не умею) / Не знаю / Отсутствие знаний
     * На этой стадии человек не знает о существовании или не осознает важность определенных знаний. Иногда даже отвергает важность и полезность этих знаний
     *
     * Ученик (знаю, не умею) / Знаком / Знания
     * Это момент, когда мы осознали, что ничего не понимаем в данном вопросе и осознаем – как многому нам еще придется научиться
     *
     * Практик (знаю, умею) / Осознанно применяю / Уменя
     * Когда определенные знания/навыки получены и применяются на постоянной основе, то достигнута стадия осознанной компетентности
     *
     * Эксперт (не знаю, умею) / Применяю автоматически / Навыки
     * Это ступень, когда знания/навыки используются без дополнительных напоминаний/усилий, как например, умение читать, писать, водить автомобиль или плавать. Это становится настолько естественным, что решение использовать знание/навык уже бессознательное
     *
     * https://www.b17.ru/blog/22116/
     */

    const LEVEL_NONE = "none";
    const LEVEL_KNOWLEDGE = "knowledge";
    const LEVEL_SKILL = "skill";
    const LEVEL_ABILITY = "ability";

    /**
     * @var string
     */
    private $id = "";

    /**
     * @var string
     */
    private $text = "";

    /**
     * @var string
     */
    private $description = "";

    /**
     * @var string
     */
    private $level = self::LEVEL_NONE;

    /**
     * @param array $skillProps
     * @return Skill
     */
    public static function fromArray(array $skillProps): Skill {
        $instance = new Skill();

        $fieldSetters = [
            'id'          => 'setId',
            'text'        => 'setText',
            'description' => 'setDescription',
            'level'       => 'setLevel',
        ];

        foreach ($fieldSetters as $fieldName => $setterName) {
            if ( isset($skillProps[$fieldName]) ) {
                $instance->$setterName($skillProps[$fieldName]);
            }
        }

        return $instance;
    }

    /**
     * @param SkillEntity $entity
     * @return Skill
     */
    public static function fromEntity(SkillEntity $entity): Skill {
        $skillProps = [
            'id'          => $entity->get('id'),
            'text'        => $entity->get('text'),
            'description' => $entity->get('additionalDescription'),
        ];

        return self::fromArray($skillProps);
    }

    /**
     * @param array $props
     * @return Skill
     */
    public static function __set_state(array $props): Skill {
        return self::fromArray($props);
    }

    /**
     * @return Skill
     */
    public static function makeEmpty(): Skill {
        $instance = new Skill();
        return $instance;
    }

    /**
     * @return string
     */
    public function getId(): string {
        return $this->id;
    }

    /**
     * @param string $id
     */
    public function setId(string $id) {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getText(): string {
        return $this->text;
    }

    /**
     * @param string $text
     */
    public function setText(string $text) {
        $this->text = $text;
    }

    /**
     * @return string
     */
    public function getDescription(): string {
        return $this->description;
    }

    /**
     * @param string $description
     */
    public function setDescription(string $description) {
        $this->description = $description;
    }

    /**
     * @return string
     */
    public function getLevel(): string {
        return $this->level;
    }

    /**
     * @param string $level
     */
    public function setLevel(string $level) {
        $this->level = $level;
    }


}