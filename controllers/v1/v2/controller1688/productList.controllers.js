import { bingTranslator } from '../../../helperFunction/translator.js';
import { skybuyScrap } from '../../../ExranalApi/skyBuyScrap.js';
import { ObjectId } from 'mongodb';

// API endpoint to get product data
export const getProductV2 = async (req, res) => {
  const search = req?.query?.search?.toLowerCase();
  const pages = req?.query?.page || 1;

  if (search) {
    try {
      const collection = req.db.collection('product_list_1688');
      const query = {
        $and: [{ search: search }, { page: pages }],
      };
      const result = await collection.findOne(query);
      if (result) {
        res.status(200).send(result);
        if (
          result?.updateAt &&
          new Date(result?.updateAt).getTime() + 60000 <= Date.now()
        ) {
          const objectId = new ObjectId(result?._id);
          const filter = { _id: objectId };

          const updateTime = { $set: { updateAt: Date.now() } };
          await collection.updateOne(filter, updateTime);

          try {
            const getData = async () => {
              const z = await bingTranslator(tagValue, search, pages);
              return z;
            };
            const dd = await getData();
            const update = {
              $set: { ...dd },
            };

            await collection.updateOne(filter, update);
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        const skb = await skybuyScrap(pages, search);
        res.status(201).send(skb);

        try {
          const getData = async () => {
            const z = await bingTranslator(tagValue, search, pages);
            return z;
          };

          const dd = await getData();

          collection.insertOne(dd);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(404).send({
      status: false,
      msg: 'Enter something for search',
    });
  }
};

// import axios from 'axios';
// import cheerio from 'cheerio';
// import { JSDOM } from 'jsdom';
// import VM from 'vm';

// export const testProductList = async (req, res) => {
//   try {
//     const url = `https://s.1688.com/selloffer/offer_search.htm?keywords=bag&n=y&netType=1%2C11%2C16&spm=a260k.dacugeneral.search.0&beginPage=1#sm-filtbar`;
//     const headers = {
//       Authority: 's.1688.com',
//       Method: 'GET',
//       Path: `/selloffer/offer_search.htm?keywords=bag&n=y&netType=1%2C11%2C16&spm=a260k.dacugeneral.search.0`,
//       Scheme: 'https',
//       Accept:
//         'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
//       'Accept-Encoding': 'gzip, deflate, br',
//       'Accept-Language':
//         'en-BD,en;q=0.9,bn-BD;q=0.8,bn;q=0.7,en-GB;q=0.6,en-US;q=0.5',
//       'Cache-Control': 'max-age=0',
//       Cookie:
//         '__wpkreporterwid_=39b7ec6b-fa31-4bf9-9ca1-0b5a6926b817; taklid=938c3bb82a574178927175b47364dd68; cna=XhQFHT2evlMCAWdwgY73LcAt; ali_ab=185.80.221.235.1688398527917.6; keywordsHistory=bag; xlly_s=1; cookie2=1fb0eb54141940c7d9c8dc30adb6cba4; t=b8f3d9c4b48e56b7474bf270394c1c38; _tb_token_=ef913fe3f57e3; __cn_logon__=false; _m_h5_tk=adc77263a71c8278bb6929be5a9978f7_1689541180776; _m_h5_tk_enc=3ba9c94d395712445b88a83fd05beb60; isg=BOzsMvEIpAt0OrD949m9NKI_vcoepZBP7JWHukYt-Bc6UYxbb7Vg3-LtdQFpb8in; l=fBIjBXL7NB-dAF1fBOfZrurza77tIIR2ouPzaNbMi9fPs-6y5EjFW1_Rg6-2CnMNEsSM53lDK4dwBjT_SyUIZhmqtRigwjbmndLhikfL9; tfstk=c9eRBeqyYZbkrjC0GyCcLrxLxSXRaEs--3gwp8GHUzJdpg9HLsjYIRnJQ_it74IA.',
//       Dnt: '1',
//       Referer: 'https://www.1688.com/',
//       'Sec-Ch-Ua':
//         '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
//       'Sec-Ch-Ua-Mobile': '?0',
//       'Sec-Ch-Ua-Platform': 'Windows',
//       'Sec-Fetch-Dest': 'document',
//       'Sec-Fetch-Mode': 'navigate',
//       'Sec-Fetch-Site': 'same-site',
//       'Sec-Fetch-User': '?1',
//       'Upgrade-Insecure-Requests': '1',
//       'User-Agent':
//         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
//     };

//     const response = await axios.get(url, { headers });

//     const data = response?.data;

//     // res.send($);

//     // if (!response || !response.data) {
//     //   throw new Error('API response is empty');
//     // }

//     // const responseData = response?.data;

//     // // Extract the JSON data from the response using regex
//     const jsonRegex = /window\.data\.offerresultData\s*=\s*({[^;]+})/;
//     const match = data.match(jsonRegex);
//     res.send(data);

//     // if (match && match[1]) {
//     //   // Parse the extracted JSON data
//     //   const jsonStr = match[1];
//     //   const jsonData = JSON.parse(jsonStr);

//     //   // Access the desired data (window.data.offerresultData)
//     //   const offerresultData = jsonData.data.abResponse.data.offerresultData;
//     //   console.log(offerresultData);

//     //   res.send(offerresultData);
//     // } else {
//     //   res.send('no data');
//     // }

//     // const jsonpRegex = /window\.data\.offerresultData\s*=\s*([^;]+);<\/script>/;
//     // const match = data.match(jsonpRegex);
//     // res.send(match);

//     // if (!match || !match[1]) {
//     //   console.error('Failed to extract JSONP data from the HTML content');
//     // } else {
//     //   const jsonpStr = match[1];
//     //   try {
//     //     // Parse the JSONP data into a JavaScript object
//     //     const jsonData = JSON.parse(jsonpStr);

//     //     // Access the desired value: window.data.offerresultData
//     //     const offerresultData = jsonData.data.abResponse.data.offerresultData;
//     //     console.log(offerresultData);
//     //   } catch (error) {
//     //     console.error('Error parsing JSONP data:', error);
//     //   }
//     // }
//   } catch (err) {
//     console.log(err);
//     throw new Error('API response failed');
//   }
// };
