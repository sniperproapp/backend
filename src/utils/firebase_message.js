

module.exports = ( data) => {

    var admin = require("firebase-admin");

var serviceAccount = require('serviceAccountKey.json');
if (!admin.apps.length) {
admin.initializeApp({
  credential: admin.credential.cert( {
    "type": serviceAccount.type,
    "project_id": serviceAccount.project_id,
    "private_key_id":serviceAccount.private_key_id,
    "private_key": serviceAccount.private_key,
    "client_email": serviceAccount.client_email,
    "client_id": serviceAccount.client_id,
    "auth_uri": serviceAccount.auth_uri,
    "token_uri":serviceAccount.token_uri,
    "auth_provider_x509_cert_url": serviceAccount.auth_provider_x509_cert_url,
    "client_x509_cert_url": serviceAccount.client_x509_cert_url,
    "universe_domain": serviceAccount.universe_domain
  })
});
}


admin.messaging().sendMulticast({
    tokens:data.tokens,
    data:{
        title:data.title,
        body:data.body
    }
        }).then((response)=>{
    
            console.log('ok')
        }).catch((error)=>{
            console.log('error') 
        })

}