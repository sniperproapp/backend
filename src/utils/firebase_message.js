

module.exports = ( data) => {

    var admin = require("firebase-admin");

 
if (!admin.apps.length) {
admin.initializeApp({
  credential: admin.credential.cert( {
    "type": "service_account",
  "project_id": "sniperpro-eaa57",
  "private_key_id": "e779d6e1e243369f96397d74579fb6ca2aa54a70",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCNnwZIw00ziezl\n0ZPkt7gAiC7RPWT4vMOcL/hPMC1k608Knn/tDAwnd/t8/qA74Kh8nqyXDNoPBvKW\nqN6Ua2Ef3P6d3QrohdjK7T7C9ESlBMpIzY0JgN26ttTu305Zlz6J60CsBiSh/Bcr\n6kQ77miVgDu39N3rxjI7kHN0kfiNF5s6uIaVPkDz9TVZrnXEBDz6po9ZsgLOkDee\nS+GjB7H7EG4SQ40J3KdBmzXc79oVnpYIBxpd93SI+ouXppy+FqSwVrGDsksMSFEi\nnKa0wtXO6RBGh0+pv+AV0KU5YH/rBHpzk7MI80rvV+3FRuBben+gIwTEBclSPYt0\nka8wYVmbAgMBAAECggEAH+xp6TsFCwobOY7tjJARTSVlkEsLmLpMScfSbF9KzEXy\nsk0aPyAJGViFex6WlgjFUhoeg4olGWASjP2R9tjhsuIJDyLFk7agMNYb4KxZUO1s\nf8697Rd8Y9tU0mfJ7I4YTdSW5nAYD9+YhZCwQuYx8wlN7OCoqb4qkpy0OeGxqnQC\n7JNg4xS+sPwLZczLN8iehD8jHf4+M1TduA22PFLUxOCnwyndL+yquBTA6vhSdAKb\ndC++tQ66qFX1j1r8fAhydzMgYlMP6F24Xa301bRX8q5MGDR00Sbwaw2YbDO7be2G\nblnnCYrlnt+DXozMPt2l+hjOGpbz9zTr2nrKs0fOCQKBgQDDydHOa8eavTJi8VRM\nSfd0yTuIbf/MSXhN3FqgjtNIiZzNnBiWf310SJ2ec5fB3W3JQGy0yLTGVtGnoCO7\nUuDMd8BpeHvjgCrSN6jClRa78HSqJlRF7q/XirnD+OvLi10TqEcXrkDQbPIuzbF8\n2CIL9+ea1HSBU0fEkAOO4jFsVwKBgQC5LLB9PFdOIsAuaNWGtq/FxPHxkbfb3MbL\nrQ24eXlGfu0b1EmhD4edxmqo3dMsrd7GLlNQwdKna1EumNV9f/0nMewnRFsENekL\nucAWCW+p8OxNMrbksDOd+HyOxQlknVQLEwkAAp2PSmw5B+eMcyUTBKsT7PMpogbu\ndw9YQlwyXQKBgQCI3SsqJlPJStrPKa5pCgfO/uD79REsyGst2o0L0evGuFQBs03I\n3uRfBmgQnPOIFPcrCTs0gV1FjOlQSXTQ/RWiOVArKotINI86lqgFJd1XkbasPtEI\ndds8TIChiv+iMRDmrerMlgY+7Pm7WBTrldbvEOQ5aqzqvsHbmWSzXFF6TwKBgF/A\n1S6dYkP8QkZ9XVUA6NmqorWY9WsSuhWeUgb/gY/LmI6Ycs5/OlCCxqq1sjpbWmQ+\nlkSfRW/fVaZzz4nLAjwfW49ekHYX7n9quQJsNLq642Z0ABE3cCmS0c3944KMvGXR\nnQjNUW5EPLws8zY0YIp6EoEGOSNhLpZnKJ8qCYTdAoGAHOhge+BA7x9fg6mqtQ97\nAv4ddvFb+/b6YQoALeckDjR271D/EBJ0CoLDg9krOdDSJRMrSoAHXQSBzbkN40+F\nfItWn1JjgTP0oB+PE+2iQwIOz4MvCyavrpVot1IzQwxYooxNvtkRUcBmCk80+M3r\ncZsdb0MV02jHusC8VorWW2o=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-rl45o@sniperpro-eaa57.iam.gserviceaccount.com",
  "client_id": "103298826422998640573",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-rl45o%40sniperpro-eaa57.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
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