let Share = {
    getUrl: function (social, url, title, img, text) {
        let titleUrl = encodeURIComponent(title+': '+url);
        url = encodeURIComponent(url);
        title = encodeURIComponent(title);
        img = encodeURIComponent(img);
        text = encodeURIComponent(text);

        let urlTemplates = {
            vkontakte: `https://vk.com/share.php?url=${url}&title=${title}`,
            odnoklassniki: `http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st.comments=${text}&st._surl=${url}`,
            facebook: `https://www.facebook.com/sharer.php?src=sp&u=${url}&title=${title}`,
            twitter: `http://twitter.com/share?text=${title}&url=${url}&counturl=${url}`,
            mailru: `http://connect.mail.ru/share?url=${url}&title=${title}&description=${text}&imageurl=${img}`,
            whatsapp: `https://api.whatsapp.com/send?text=${titleUrl}`,
            telegram: `https://telegram.me/share/url?url=${url}&text=${title}`
        };

        return urlTemplates[social] || false;
    },
    popup: function(social, url, title, img, text) {
        let windowUrl = this.getUrl(social, url, title, img, text);
        window.open(windowUrl,'','toolbar=0,status=0,width=626,height=436');
    },
    modal: function(social, url, title, img, text) {
        let windowUrl = this.getUrl(social, url, title, img, text);
        $('#shareModal iframe').attr('src', windowUrl);
        $('#shareModal').modal({show:true});
    }
};