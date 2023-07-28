import axios from 'axios';
import { JSDOM } from 'jsdom';
import decodeURIComponent from 'decode-uri-component';
export const getProductDetails = async (req, res) => {
  const checkUrl = Array.isArray(req?.query?.url);
  const encodedUrl = checkUrl
    ? req?.query?.url[1] + req?.query?.url[2]
    : req?.query?.url;
  const decodedUrl = decodeURIComponent(encodedUrl);
  const newUrl = `https://www.amazon.in${decodedUrl}`;
  try {
    const response = await axios.get('https://www.amazon.in/CASE-PLUS-Rechargable-Cactus-New/dp/B0C7N97J75/ref=sr_1_1_sspa?keywords=toy&qid=1689361093&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1', {
      headers: {
        Authority: 'www.amazon.in',
        Scheme: 'https',
        'Content-Security-Policy':
          'upgrade-insecure-requests;report-uri https://metrics.media-amazon.com/',
        'Content-Security-Policy-Report-Only':
          "default-src 'self' blob: https: data: mediastream: 'unsafe-eval' 'unsafe-inline';report-uri https://metrics.media-amazon.com/",
        'Content-Type': 'text/html;charset=UTF-8',
        'X-Amz-Rid': 'Y1JWJ0EXW88SS0DNZT7V',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language':
          'en-BD,en;q=0.9,bn-BD;q=0.8,bn;q=0.7,en-GB;q=0.6,en-US;q=0.5',
        'Accept-Ch':
          'ect,rtt,downlink,device-memory,sec-ch-device-memory,viewport-width,sec-ch-viewport-width,dpr,sec-ch-dpr,sec-ch-ua-platform,sec-ch-ua-platform-version',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      },
    });
    const html_data = response?.data;
    const dom = new JSDOM(html_data, { includeNodeLocations: true });
    const document = dom.window.document;
    const title = document.querySelector('#productTitle').textContent.trim();
    const mainImg = document
      .querySelector(`.imgTagWrapper`)
      .querySelector(`img`).src;
    const price = document.querySelector(`.a-price-whole`).textContent.trim();
    const currency = document
      .querySelector(`.a-price-symbol`)
      .textContent.trim();
    const availability = document
      .querySelector(`#availability`)
      .querySelector(`span`)
      .textContent.trim();
    const x = document.querySelectorAll('#imageBlock li span.a-button-text');
    const sideBarImage =
      x &&
      Array.from(x).map(
        (innerItem) =>
          innerItem && innerItem.querySelector('img')?.getAttribute('src'),
      );

    let veri = document.querySelectorAll('#variation_color_name li');
    // let variationBySize = document.querySelector('#variation_size_name');
    const selectElement = document.querySelector('select[name="dropdown_selected_size_name"]')
    const productOverview = document.querySelector('[data-feature-name="productOverview"]')
    const options = selectElement?.querySelectorAll('option');
    const sizevalues = selectElement && Array.from(options).map((option) => option?.textContent?.trim());
    veri =
      veri.length <= 0
        ? document.querySelectorAll('#variation_pattern_name li')
        : veri;
    const variation =
      veri &&
      Array.from(veri).map((item) => {
        return {
          img: item.querySelector('img')?.getAttribute('src'),
          type: item
            ?.querySelector('.twisterTextDiv')
            ?.querySelector('p')
            ?.textContent.trim(),
          price: item.querySelector('.twisterSwatchPrice')?.textContent.trim(),
          color: item?.getAttribute('title'),
        };
      });

// bullet details content 
  //   const detailBulletsWrapper = document?.querySelector("#detailBulletsWrapper_feature_div")
  //   // console.log(detailBulletsWrapper)
  //   const htmlContent = detailBulletsWrapper?.querySelectorAll('.a-list-item');
  //   console.log(htmlContent)
  //  const bulletDetails = htmlContent &&  Array.from(htmlContent).map((item) => {
  //     return {
  //       item: item?.textContent.trim(),
        
  //     };
  //   });


    // recommended product 
    // const i = document?.querySelector('#sp_detail2')
    // const c = i?.querySelectorAll('.a-section');
    // const recommendedProduct = x && Array.from(c).map(rec => {
    //   return {
    //     title: rec?.querySelector('img')?.getAttribute('alt'),
    //     image: rec?.querySelector('img')?.getAttribute('src'),
    //     detailsLink: rec?.querySelector('.a-link-normal')?.getAttribute('href'),
    //     price: rec?.querySelector('.a-color-price')?.textContent.trim()?.slice(1),
    //     currency: rec?.querySelector('.a-color-price')?.textContent.trim()?.slice(0, 1),
    //   }

    // });

    // product dectiption 

    const getdiv = document?.querySelectorAll('#productDescription')?.inneHTML
    // const d = Array.from(getdiv).map(u=>u?.querySelector('span')?.textContent?.trim()) ;

    
    
    
    
    // res.send({
    //   title,
    //   link:newUrl,
    //   mainImg,
    //   price,
    //   currency,
    //   availability,
    //   sideBarImage,
    //   variation,
    //   sizevalues,
    //   productOverview:JSON.stringify(productOverview)
    // });
    res.send({discription:getdiv})
  } catch (err) {
    // console.log(err);
    res.send(err);
  }
};
