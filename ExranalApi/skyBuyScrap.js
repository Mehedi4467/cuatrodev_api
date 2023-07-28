import axios from 'axios';
import { getRndFloat } from '../helperFunction/ratingrandom.js';

export const skybuyScrap = async (page, search) => {
  try {
    const url = `https://api.skybuybd.com/v1/customer/products/search?page=${page}&keyword=${search}`;
    const headers = {
      Host: 'api.skybuybd.com',
      Accept: 'application/json, text/plain, */*',
      Authorization: process.env.SKB_AUTH_TOKEN,
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language':
        'en-BD,en;q=0.9,bn-BD;q=0.8,bn;q=0.7,en-GB;q=0.6,en-US;q=0.5',
      Cookie: process.env.SKB_COOKIES,
      'User-Agent': process.env.SKB_USER_AGENT,
    };

    const response = await axios.get(url, { headers });
    const data = response?.data;
    const result = {
      status: true,
      search,
      page,
      total_count: data?.result?.total_found,
      maximum_page_count: 200,
      result: data?.result?.products.map((x) => ({
        Id: x?.code,
        VendorId: x?.meta?.vendor_id,
        Title: x.title,
        Pictures: x?.thumbnail?.medium,
        Price: x?.regular_price || x?.sale_price,
        currency: 'bd',
        seller: {
          sale: x?.meta?.total_sold.toString(),
          rating: getRndFloat(1, 5),
        },
      })),
      createAt: new Date(),
      response_type: 'skb',
      count:1
    };

    return result;
  } catch (err) {
    throw new Error('API response failed');
  }
};
