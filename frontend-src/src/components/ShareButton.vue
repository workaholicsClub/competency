<template>
    <button type="button" class="btn btn-outline-info btn-share mr-2">
        <i class="fas fa-share-alt"></i>
        <ul class="share-menu dropdown-menu">
            <li class="dropdown-item"><a data-social="vkontakte">Вконтакте</a></li>
            <li class="dropdown-item"><a data-social="facebook">Facebook</a></li>
            <li class="dropdown-item"><a data-social="twitter">Twitter</a></li>
            <li class="dropdown-item"><a data-social="whatsapp">WhatsApp</a></li>
            <li class="dropdown-item"><a data-social="telegram">Telegram</a></li>
        </ul>
    </button>
</template>

<script>
    export default {
        name: 'ShareButton'
    }
</script>