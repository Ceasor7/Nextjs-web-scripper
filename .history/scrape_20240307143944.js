const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

const url =
  'https://www.amazon.co.uk/Flash-Furniture-Round-Aluminum-Indoor-Outdoor/dp/B00ZADCG22/ref=sr_1_2_sspa?c=ts&keywords=Tables&qid=1666092434&qu=eyJxc2MiOiI3Ljc0IiwicXNhIjoiNi45NCIsInFzcCI6IjYuMDAifQ%3D%3D&s=kitchen&sr=1-2-spons&ts_id=200995031&psc=1';

const product = { name: '', price: '', link: '' };

async function scrape() {
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);
  const item = $('div#dp-container');

  product.name = $(item).find('h1 span#productTitle').text();
  product.link = url;
  const price = $(item)
    .find('span .a-price-whole')
    .first()
    .text()
    .replace(/[,.]/g, '');

  const priceNum = parseInt(price);
  product.price = priceNum;
  console.log(product);

  if (priceNum < 195) {
    client.messages
      .create({
        body: `The price of ${product.name} went below ${price}. Purchase it at ${product.link}`,
        from: '+13464820746',
        to: '+254 115 676977',
      })
      .then((message) => {
        console.log(message);
      });
  }
}

scrape();
