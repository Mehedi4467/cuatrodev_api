import axios from 'axios';
import { JSDOM } from 'jsdom';
import { ObjectId } from 'mongodb';

export const getProductList = async (req, res) => {
  const apiKey = req?.params?.api_key;
  const search = req?.query?.search?.toLowerCase();
  const page = req?.query?.page;
  const phone = req.headers['phone'];
  const url = `https://www.amazon.in/s?k=${search}&page=${page || 1}`;
  const currentTime = new Date();
  // const x = createApiKey();
  if (search) {
    try {
      const collection = req.db.collection('product_list');
      const query = {
        $and: [{ search: search }, { page: page }],
      };
      const result = await collection.findOne(query);
      if (result) {
        res.status(200).send(result);
        const objectId = new ObjectId(result?._id);
        const filter = { _id: objectId };

        const response = await axios.get(url, {
          headers: {
            Authority: 'www.amazon.in',
            Scheme: 'https',
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language':
              'en-BD,en;q=0.9,bn-BD;q=0.8,bn;q=0.7,en-GB;q=0.6,en-US;q=0.5',
            Cookie:
              'session-id=261-8295826-4397535; session-id-time=2082787201l; i18n-prefs=INR; ubid-acbin=259-1167275-4907641; session-token=6aekGF1I58qGvD8Rj8xbDQj4MxnlbmMGrZJOQxVt0otmYkhVw5vzDht48VkL5BGvbZZ7CcgbzuxJeZjak0VG5fZlirlAHiz4PCtP5whosb25OMhPOID2mTw3B1GmC9UxKL0yO9FlT/MSquewmz78b5AtU1GzSU7uX1eO4KiI4vYYGiB7X0sgf+ykGbM4hT841Uk6Z3zPpNfOaOevX+qvXfzl7COiPmhD7ZPAZyP8fdQ=; csm-hit=tb:MX957ZHQK2DF3JGA4H82+s-HAMKN3DY9T8ZNDMVP79F|1688669983727&t:1688669983727&adb:adblk_no',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
          },
        });
        const html_data = response?.data;
        const dom = new JSDOM(html_data, { includeNodeLocations: true });
        const document = dom.window.document;
        const allData = document.querySelectorAll(
          '[data-component-type="s-search-result"]',
        );
        const lastPage = Array.from(
          document.querySelectorAll('span.s-pagination-item'),
        ).map((item) => item && item.textContent);

        const dataArray = Array.from(allData).map((item) => {
          return {
            image:
              item.querySelector('img') &&
              item.querySelector('img')?.getAttribute('src'),
            detailsLink:
              item.querySelector('[data-component-type="s-product-image"]') &&
              item
                .querySelector('[data-component-type="s-product-image"]')
                ?.querySelector('a')
                ?.getAttribute('href'),
            title:
              item.querySelector('.a-text-normal') &&
              item.querySelector('.a-text-normal').textContent.trim(),
            price:
              item.querySelector('.a-price-whole') &&
              item.querySelector('.a-price-whole').textContent.trim(),
            // old_price : item.querySelector('.a-offscreen') && item.querySelector('.a-offscreen').textContent.trim(),
            currency:
              item.querySelector('.a-price-symbol') &&
              item.querySelector('.a-price-symbol').textContent.trim(),
            color:
              item.querySelectorAll('.a-section') &&
              Array.from(item.querySelectorAll('.a-section')).map(
                (innerItem) => {
                  const spanElement = innerItem.querySelector(
                    'span.s-color-swatch-inner-circle-fill',
                  );
                  return spanElement
                    ? spanElement.getAttribute('style')
                    : false;
                },
              ),
            rating:
              item.querySelector('span.a-icon-alt') &&
              item.querySelector('span.a-icon-alt').textContent.trim(),
          };
        });

        const update = {
          $set: {
            status: true,
            search: search,
            timestamp: currentTime.toLocaleDateString('en-US'),
            page: page || 1,
            data: dataArray,
            response_type: 'cached',
            lastPage: lastPage || ['10'],
          },
        };

        const Updateresult = await collection.updateOne(filter, update);
      } else {
        const response = await axios.get(url, {
          headers: {
            Authority: 'www.amazon.in',
            Scheme: 'https',
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language':
              'en-BD,en;q=0.9,bn-BD;q=0.8,bn;q=0.7,en-GB;q=0.6,en-US;q=0.5',
            Cookie:
              'session-id=261-8295826-4397535; session-id-time=2082787201l; i18n-prefs=INR; ubid-acbin=259-1167275-4907641; session-token=6aekGF1I58qGvD8Rj8xbDQj4MxnlbmMGrZJOQxVt0otmYkhVw5vzDht48VkL5BGvbZZ7CcgbzuxJeZjak0VG5fZlirlAHiz4PCtP5whosb25OMhPOID2mTw3B1GmC9UxKL0yO9FlT/MSquewmz78b5AtU1GzSU7uX1eO4KiI4vYYGiB7X0sgf+ykGbM4hT841Uk6Z3zPpNfOaOevX+qvXfzl7COiPmhD7ZPAZyP8fdQ=; csm-hit=tb:MX957ZHQK2DF3JGA4H82+s-HAMKN3DY9T8ZNDMVP79F|1688669983727&t:1688669983727&adb:adblk_no',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
          },
        });
        const html_data = response?.data;
        const dom = new JSDOM(html_data, { includeNodeLocations: true });
        const document = dom.window.document;
        const allData = document.querySelectorAll(
          '[data-component-type="s-search-result"]',
        );
        const lastPage = Array.from(
          document.querySelectorAll('span.s-pagination-item'),
        ).map((item) => item && item.textContent);
        const dataArray = Array.from(allData).map((item) => {
          return {
            image:
              item.querySelector('img') &&
              item.querySelector('img')?.getAttribute('src'),
            detailsLink:
              item.querySelector('a') && item.querySelector('a')?.href,
            title:
              item.querySelector('.a-text-normal') &&
              item.querySelector('.a-text-normal').textContent.trim(),
            price:
              item.querySelector('.a-price-whole') &&
              item.querySelector('.a-price-whole').textContent.trim(),
            // old_price : item.querySelector('.a-offscreen') && item.querySelector('.a-offscreen').textContent.trim(),
            currency:
              item.querySelector('.a-price-symbol') &&
              item.querySelector('.a-price-symbol').textContent.trim(),
            color:
              item.querySelectorAll('.a-section') &&
              Array.from(item.querySelectorAll('.a-section')).map(
                (innerItem) => {
                  const spanElement = innerItem.querySelector(
                    'span.s-color-swatch-inner-circle-fill',
                  );
                  return spanElement
                    ? spanElement.getAttribute('style')
                    : false;
                },
              ),
            rating:
              item.querySelector('span.a-icon-alt') &&
              item.querySelector('span.a-icon-alt').textContent.trim(),
          };
        });

        res.status(200).send({
          status: true,
          search: search,
          timestamp: currentTime.toLocaleDateString('en-US'),
          page: page || 1,
          data: dataArray,
          response_type: 'api',
          lastPage: lastPage || ['10'],
        });

        const Datadocument = {
          status: true,
          search: search,
          timestamp: currentTime.toLocaleDateString('en-US'),
          page: page || 1,
          data: dataArray,
          lastPage: lastPage || ['10'],
          response_type: 'cached',
          // expiration: new Date(Date.now() + 1209600000),
        };
        await collection.insertOne(Datadocument);
      }
    } catch (err) {
      if (err.response && err.response.status === 503) {
        res.status(503).send({
          status: false,
          search: search,
          timestamp: currentTime.toLocaleDateString('en-US'),
          page: page || 1,
          data: [],
          lastPage: ['0'],
          response_type: 'api',
          msg: 'Service Unavailable. Please try again later.',
        });

        const collection = req.db.collection('user_list');
        const filter = {
          $and: [{ phone: phone }, { api_key: apiKey }, { status: true }],
        };
        const update = { $inc: { apiFailCount: 1 } };
        const result = await collection.updateOne(filter, update);
      } else {
        res.status(500).send({
          status: false,
          search: search,
          timestamp: currentTime.toLocaleDateString('en-US'),
          page: page || 1,
          data: [],
          lastPage: ['0'],
          response_type: 'api',
          msg: 'Internal Server Error.',
        });
        const collection = req.db.collection('user_list');
        const filter = {
          $and: [{ phone: phone }, { api_key: apiKey }, { status: true }],
        };
        const update = { $inc: { apiFailCount: 1 } };
        const result = await collection.updateOne(filter, update);
      }
    }
  } else {
    res.status(404).send({
      status: true,
      search: search,
      timestamp: currentTime.toLocaleDateString('en-US'),
      page: page || 1,
      data: [],
      lastPage: ['0'],
      response_type: 'api',
    });
    const collection = req.db.collection('user_list');
    const filter = {
      $and: [{ phone: phone }, { api_key: apiKey }, { status: true }],
    };
    const update = { $inc: { apiFailCount: 1 } };
    const result = await collection.updateOne(filter, update);
  }
};
