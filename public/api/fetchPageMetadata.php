<?php
require '../../vendor/autoload.php';

function getWebPage( $url ) {
    $user_agent='Mozilla/5.0 (Windows NT 6.1; rv:8.0) Gecko/20100101 Firefox/8.0';

    $options = [
        CURLOPT_CUSTOMREQUEST  =>"GET",        //set request type post or get
        CURLOPT_POST           =>false,        //set to GET
        CURLOPT_USERAGENT      => $user_agent, //set user agent
        CURLOPT_COOKIEFILE     =>"cookie.txt", //set cookie file
        CURLOPT_COOKIEJAR      =>"cookie.txt", //set cookie jar
        CURLOPT_RETURNTRANSFER => true,     // return web page
        CURLOPT_HEADER         => false,    // don't return headers
        CURLOPT_FOLLOWLOCATION => true,     // follow redirects
        CURLOPT_ENCODING       => "",       // handle all encodings
        CURLOPT_AUTOREFERER    => true,     // set referer on redirect
        CURLOPT_CONNECTTIMEOUT => 120,      // timeout on connect
        CURLOPT_TIMEOUT        => 120,      // timeout on response
        CURLOPT_MAXREDIRS      => 10,       // stop after 10 redirects
    ];

    $ch      = curl_init( $url );
    curl_setopt_array( $ch, $options );
    $content = curl_exec( $ch );
    $err     = curl_errno( $ch );
    $errmsg  = curl_error( $ch );
    $header  = curl_getinfo( $ch );
    curl_close( $ch );

    $header['errno']   = $err;
    $header['errmsg']  = $errmsg;
    $header['content'] = $content;
    return $header;
}


$pageUrl = $_REQUEST['url'];
$pageData = getWebPage($pageUrl);
$metaTags = [];

if (!$pageData['errno']) {
    $pageHTML = $pageData['content'];

    $doc = new DOMDocument();
    $doc->loadHTML($pageHTML);

    $xpath = new DOMXPath($doc);
    $nodes = $xpath->query('//head/meta');

    foreach ($nodes as $node) {
        $metaName = $node->getAttribute('name');
        if (!$metaName) {
            $metaName = $node->getAttribute('property');
        }

        $metaName = strtolower($metaName);

        $metaValue = $node->getAttribute('content');

        if ($metaName) {
            if (isset($metaTags[$metaName])) {
                if (is_array($metaTags[$metaName])) {
                    $metaTags[$metaName][] = $metaValue;
                } else {
                    $oldValue = $metaTags[$metaName];
                    $metaTags[$metaName] = [$oldValue, $metaValue];
                }
            } else {
                $metaTags[$metaName] = $metaValue;
            }
        }
    }

    $titleNodes = $xpath->query('//head/title');
    $titleNode = $titleNodes[0];

    $metaTags['title'] = $titleNode->textContent;

    if (!$metaTags['image']) {
        $metaTags['image'] = $metaTags['og:image'];
    }

    if (!$metaTags['provider']) {
        $metaTags['provider'] = $metaTags['og:site_name'] ? $metaTags['og:site_name'] : null;
    }

}

header("Content-type: application/json; charset=utf-8");
echo json_encode($metaTags);