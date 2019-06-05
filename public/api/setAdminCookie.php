<?php
    $expire_time = time() + 60 * 60 * 24 * 180;
    setcookie( 'user_is_admin', 'true', $expire_time, '/' );
    echo "Теперь тебя не видно";