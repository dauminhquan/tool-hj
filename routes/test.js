
var express = require('express');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var router = express.Router();
const $ = require('jquery')
const axios = require('axios')
/* GET home page. */
const urlGetData = [
    'https://www.amazon.com/gp/new-releases/arts-crafts'
]

/*
const urlGetData = [
    'https://www.amazon.com/gp/new-releases/arts-crafts',
    'https://www.amazon.com/gp/new-releases/fashion',
    'https://www.amazon.com/gp/new-releases/home-garden',
    'https://www.amazon.com/gp/new-releases/kitchen',
    'https://www.amazon.com/gp/new-releases/office-products',
    'https://www.amazon.com/gp/new-releases/lawn-garden',
    'https://www.amazon.com/gp/new-releases/pet-supplies',
    'https://www.amazon.com/gp/new-releases/sporting-goods',
    'https://www.amazon.com/gp/new-releases/hi',
    'https://www.amazon.com/gp/new-releases/toys-and-games'
]
*/




router.get('/get-url',function (req,res,next) {
    urlGetData.forEach(item => {
        setTimeout(function () {
            getUrl(item,1)
        },1000)
    })
    res.send('ok')
})

router.get('/', function(req, res, next) {
    axios.get('https://www.amazon.com/gp/new-releases/amazon-devices/9818047011').then(response => {
        const { window } = new JSDOM(response.data);
        const $ = require('jquery')(window);
        let products = $('li.zg-item-immersion')
        let linkProducts = []
        for(let i = 0 ; i < products.length ; i++)
        {
            let reviews = $(products[i]).find('a.a-size-small.a-link-normal:eq(0)')
            if(reviews.length < 1)
            {
                linkProducts.push($(products[i]).find('a.a-link-normal:eq(0)').attr('href'))
            }
            else{
                let review = parseInt($(reviews).text().replace(/,/g,''))
                if(reviews < 20)
                {
                    linkProducts.push($(products[i]).find('a.a-link-normal:eq(0)').attr('href'))
                }
            }
        }
        let asins = []
        if(linkProducts.length > 0)
        {
            linkProducts.forEach(item => {
                let arr_str = item.split('/')
                asins.push(arr_str[3])
            })
        }
        console.log(asins)
        return res.send(response.data)

    }).catch(err => {
        return res.send('err')
        console.log(err)
    })
    // res.render('index', { title: 'Express' });
});
function getUrl(url,index)
{
    axios.get(url).then(response => {
        const { window } = new JSDOM(response.data);
        const $ = require('jquery')(window);
        if(index < 3)
        {
            let uls = $('span.zg_selected').parent().next('ul')
            if(uls.length > 0)
            {
                let lis = uls.find('li')
                if(lis.length > 0)
                {
                    for(let i = 0 ; i < lis.length ; i ++)
                    {
                        let urlData = $(lis[i]).find('a:eq(0)').attr('href')
                        setTimeout(function () {
                            getUrl(urlData.slice(0,urlData.indexOf('/ref=')))
                        },1000)

                    }
                }
                else{
                    console.log('error')
                }

            }
            else{
                console.log($('span.zg_selected').text())
            }
        }
    }).catch(err => {
        console.log(err)
    })
}
module.exports = router;
