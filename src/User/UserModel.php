<?php

namespace Competencies\User;

use Competencies\Entity\UserEntity;
use Exception;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Spot\Locator;
use Competencies\UserModelInterface;

class UserModel implements UserModelInterface
{
    const TOKEN_ISSUER = 'matrix';
    const TOKEN_SIGN_KEY = 'matrixSecret';

    private $email;
    private $name;
    private $mapper;

    /**
     * @param string|null  $email
     * @param Locator|null $db
     * @return UserModel
     */
    public static function make($email = null, $db = null) {
        $instance = new self();

        if ($email) {
            $instance->setEmail($email);
        }

        $instance->setMapperFromDb($db);

        return $instance;
    }

    /**
     * @param string|null  $token
     * @param Locator|null $db
     * @return UserModel
     */
    public static function makeFromToken($token = null, $db = null) {
        $instance = new self();

        if ($token) {
            $parsedToken = (new Parser())->parse($token);
            $email = $parsedToken->getClaim('email');
            if ($email) {
                $instance->setEmail($email);
            }
        }

        $instance->setMapperFromDb($db);

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
    protected function getMapper() {
        return $this->mapper;
    }

    /**
     * @param \Spot\Mapper $mapper
     */
    public function setMapper($mapper) {
        $this->mapper = $mapper;
    }

    /**
     * @param Locator|null $db
     */
    public function setMapperFromDb($db = null) {
        if ($db instanceof Locator) {
            $mapper = $db->mapper('Competencies\Entity\UserEntity');
            $this->setMapper($mapper);
        }
    }

    /**
     * @return UserEntity|false
     */
    public function loadFromDatabase() {
        $mapper = $this->getMapper();

        return $mapper->first(['email' => $this->getEmail()]);
    }

    public function saveToDatabase() {
        if (!$this->getEmail()) {
            throw new Exception('Email not set');
        }

        $mapper = $this->getMapper();

        $entity = $this->loadFromDatabase();

        if ($entity !== false) {
            $entity->set('name', $this->getName());
        }
        else {
            $entity = $mapper->build([
                'name'  => $this->getName(),
                'email' => $this->getEmail(),
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

}