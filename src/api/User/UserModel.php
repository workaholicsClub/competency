<?php

namespace Competencies\User;

use Exception;
use function FastRoute\TestFixtures\empty_options_cached;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Spot\Locator;
use Competencies\UserModelInterface;

class UserModel implements UserModelInterface
{
    const TOKEN_ISSUER = 'matrix';
    const TOKEN_SIGN_KEY = 'matrixSecret';

    const SUBSCRIBE_COURSES = 'courses';
    const SUBSCRIBE_STATS = 'stats';
    const SUBSCRIBE_ALL = 'all';

    private $uuid;
    private $email;
    private $name;
    private $subscribe;
    private $remindMonths;
    private $mapper;

    /**
     * @param string|null  $email
     * @param Locator|null $db
     * @return UserModel
     */
    public static function make($email = null, $db = null) {
        $instance = new self();
        $instance->setMapperFromLocator($db);

        if ($email) {
            $instance->setEmail($email);
        }

        return $instance;
    }

    public static function makeFromEntity(UserEntity $entity) {
        $instance = new self();
        $instance->setUuid($entity->get('uuid') ?? '');
        $instance->setName($entity->get('name'));
        $instance->setEmail($entity->get('email'));
        $instance->setRemindMonths($entity->get('remindMonths'));
        $instance->setSubscribe($entity->get('subscribe'));

        return $instance;
    }

    /**
     * @param string|null  $token
     * @param Locator|null $locator
     * @return UserModel
     */
    public static function makeFromToken($token = null, $locator = null) {
        $instance = new self();

        if ($token) {
            $parsedToken = (new Parser())->parse($token);
            $email = $parsedToken->getClaim('email');
            if ($email) {
                $instance->setEmail($email);
            }
        }

        $instance->setMapperFromLocator($locator);

        return $instance;
    }

    public function getEmail() {
        return $this->email;
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    public function getName() {
        return $this->name;
    }

    public function setName($name) {
        $this->name = $name;
    }

    /**
     * @return \Spot\Mapper
     */
    public function getMapper() {
        return $this->mapper;
    }

    /**
     * @param \Spot\Mapper $mapper
     */
    public function setMapper($mapper) {
        $this->mapper = $mapper;
    }

    /**
     * @param Locator|null $locator
     */
    public function setMapperFromLocator($locator = null) {
        if ($locator instanceof Locator) {
            $mapper = $locator->mapper(UserEntity::class);
            $this->setMapper($mapper);
        }
    }

    /**
     * @return UserEntity|false
     */
    public function load() {
        $mapper = $this->getMapper();

        return $mapper->first(['email' => $this->getEmail()]);
    }

    /**
     * @return bool
     * @throws Exception
     */
    public function save() {
        if (!$this->getEmail() && !$this->getUuid()) {
            throw new Exception('Email or uuid not set');
        }

        $mapper = $this->getMapper();

        $entity = $this->load();

        if ($entity !== false) {
            $entity->set('name', $this->getName());

            if ($this->getRemindMonths()) {
                $entity->set('remindMonths', $this->getRemindMonths());
            }

            if ($this->getSubscribe()) {
                $entity->set('subscribe', $this->getSubscribe());
            }
        }
        else {
            $entity = $mapper->build([
                'uuid'         => $this->getUuid(),
                'name'         => $this->getName(),
                'email'        => $this->getEmail(),
                'remindMonths' => $this->getRemindMonths(),
                'subscribe'    => $this->getSubscribe(),
            ]);
        }

        $recordId = $mapper->save($entity);
        $isSuccess = $recordId !== false;
        return $isSuccess;
    }

    /**
     * @param int|null $issuedAt
     * @return string
     */
    public function getToken($issuedAt = null) {
        $tokenTtlSeconds = 3 * 3600;

        if (is_null($issuedAt)) {
            $issuedAt = time();
        }

        $signer = new Sha256();
        $token = (new Builder())
            ->setIssuer(self::TOKEN_ISSUER)
            ->setIssuedAt($issuedAt)
            ->setExpiration($issuedAt+$tokenTtlSeconds)
            ->set('email', $this->getEmail())
            ->sign($signer, self::TOKEN_SIGN_KEY)
            ->getToken();

        return $token->__toString();
    }

    /**
     * @return mixed
     */
    public function getSubscribe() {
        return $this->subscribe;
    }

    /**
     * @param string $subscribe
     */
    public function setSubscribe($subscribe) {
        if (!empty($subscribe)) {
            $this->subscribe = $subscribe;
        }
    }

    /**
     * @return integer
     */
    public function getRemindMonths() {
        return $this->remindMonths;
    }

    /**
     * @param integer $remindMonths
     */
    public function setRemindMonths($remindMonths) {
        if (!empty($remindMonths)) {
            $this->remindMonths = $remindMonths;
        }
    }

    /**
     * @return string|null
     */
    public function getUuid() {
        return $this->uuid;
    }

    /**
     * @param string $uuid
     */
    public function setUuid(string $uuid) {
        $this->uuid = $uuid;
    }

}