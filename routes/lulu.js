const express = require('express')
const router = express.Router()
const axios = require('axios')




/**
 * /api/token route retrieves a jwt for access to the lulu print api
 * this access_token must be sent with all subsequent requests
 * THIS WAS HARD... DONT TOUCH ANYTHING OR RISK BEING BITTEN
 */
 router.get('/token', async (req,res)=>{
    console.log("attempting lulu api authentication.........\n")
    

    const baseurl = "https://api.lulu.com/auth/realms/glasstree/protocol/openid-connect/token"
    const data = new URLSearchParams()
    data.append('client_key', process.env.CLIENT_KEY)
    data.append('client_secret', process.env.CLIENT_SECRET)
    data.append('grant_type', 'client_credentials')


await axios({
    method: 'post',
    url: baseurl,
    data: data,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': process.env.AUTH,
    },

}).then((response)=>{
    console.log(response.data)
    console.log('this is the access token....... \n' + `access token: \n ${response.data.access_token}`)
    res.send(response.data)
})

})

module.exports = router