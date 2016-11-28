import WooCommerceAPI from "./WooCommerceAPI"

// var rootURL = 'http://beo.local';
// var consumeKey = 'ck_a4996a8387b8ac510e3c2e5ca13f51daedf34a9e';
// var consumerSecret = 'cs_f390eac98545b6683fd1a6f654bd25cd597771fa';

var rootURL = 'http://beostore.io';
var consumeKey = 'ck_223378193c406cd3fa5124fb4532a0cc7c22bf66';
var consumerSecret = 'cs_0eaf41aedaf0bd40d074cf551cd53842e2f83853';

var Api = new WooCommerceAPI({
    url: rootURL,
    consumerKey: consumeKey,
    consumerSecret: consumerSecret,
    wp_api: true,
    version: 'wc/v1',
    queryStringAuth: true
});

export default Api;
