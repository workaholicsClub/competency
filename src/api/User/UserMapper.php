<?php

namespace Competencies\User;

use Spot\Mapper;

class UserMapper extends Mapper
{
    /**
     * @param string $email
     * @return UserEntity|bool
     */
    public function loadByEmail(string $email) {
        return $this->first(['email' => $email]);
    }

    /**
     * @param string $uuid
     * @return UserEntity|bool
     */
    public function loadByUuid(string $uuid) {
        return $this->first(['uuid' => $uuid]);
    }

    /**
     * @param string $uuid
     * @return bool|UserModel
     */
    public function getByUuid(string $uuid) {
        $entity = $this->loadByUuid($uuid);
        if (!$entity) {
            $user = UserModel::make();
            $user->setUuid($uuid);

            return $user;
        }

        return UserModel::makeFromEntity($entity);
    }
}