<?php
namespace Competencies\EduProvider;

class EduProvider
{
    /**
     * @var string
     */
    private $code;

    /**
     * @var string
     */
    private $name;

    /**
     * @var string
     */
    private $url;

    public static function fromArray(array $providerProps): EduProvider {
        $instance = new EduProvider();

        $fieldSetters = [
            'code' => 'setCode',
            'name' => 'setName',
            'url'  => 'setUrl',
        ];

        foreach ($fieldSetters as $fieldName => $setterName) {
            if ( isset($providerProps[$fieldName]) ) {
                $instance->$setterName($providerProps[$fieldName]);
            }
        }

        return $instance;
    }

    public static function __set_state(array $providerProps): EduProvider {
        return self::fromArray($providerProps);
    }

    public static function fromEntity(EduProviderEntity $eduProviderEntity): EduProvider {
        $props = $eduProviderEntity->toArray();
        return self::fromArray($props);
    }

    /**
     * @return string
     */
    public function getCode(): string {
        return $this->code;
    }

    /**
     * @param string $code
     */
    public function setCode(string $code) {
        $this->code = $code;
    }

    /**
     * @return string
     */
    public function getName(): string {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName(string $name) {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getUrl(): string {
        return $this->url;
    }

    /**
     * @param string $url
     */
    public function setUrl(string $url) {
        $this->url = $url;
    }

    /**
     * @return array
     */
    public function toArray(): array {
        $fieldGetters = [
            'code' => 'getCode',
            'name' => 'getName',
            'url'  => 'getUrl',
        ];

        $resultArray = [];
        foreach ($fieldGetters as $fieldName => $getterName) {
            $resultArray[$fieldName] = $this->$getterName();
        }

        return $resultArray;
    }
}