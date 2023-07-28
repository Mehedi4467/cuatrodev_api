// import { translate } from 'bing-translate-api';

// export const bingTranslator = async (tagValue, search, pages) => {
//   const list = {
//     status: true,
//     search: search,
//     maximum_page_count: tagValue?.pageCount,
//     result: [],
//     page: pages,
//     // page: tagValue?.trace?.beginPage || pages,
//     keywords: tagValue?.trace?.keywords,
//     currentPageContent: tagValue?.offerSize,
//     response_type: '1688',
//     updateAt: new Date(),
//   };

//   for (let x of tagValue?.offerList) {
//     await translate(
//       x?.information?.simpleSubject || x?.information?.subject,
//       null,
//       'en',
//     )
//       .then((res) => {
//         // console.log(res.translation);
//         list.result.push({
//           Id: `abb-${x?.id}`,
//           VendorId: `abb-${x?.aliTalk?.categoryId}`,
//           Title: res?.translation,
//           Pictures: x?.image?.imgUrl,
//           seller: {
//             sale: x?.tradeQuantity?.saleQuantity,
//             rating: x?.tradeService?.goodsScore,
//           },
//           Price: x?.tradePrice?.offerPrice?.priceInfo?.price,

//           thumbnail: x?.image,
//           categoryId: x?.aliTalk?.categoryId,
//           brief: x?.information?.brief,
//           priceInfo: x?.tradePrice?.offerPrice,
//           // saleQuantity: x?.tradeQuantity?.saleQuantity,
//           minQty: x?.tradeQuantity?.quantityBegin,
//           compositeNewScore: x?.tradeService?.compositeNewScore,
//           consultationScore: x?.tradeService?.consultationScore,
//           logisticsScore: x?.tradeService?.logisticsScore,
//           logisticsScore: x?.tradeService?.logisticsScore,
//         });
//       })
//       .catch((err) => {
//         console.error(err);
//         list.result.push({
//           Id: `abb-${x?.id}`,
//           VendorId: `abb-${x?.aliTalk?.categoryId}`,
//           Title: x?.information?.simpleSubject || x?.information?.subject,
//           Pictures: x?.image?.imgUrl,
//           seller: {
//             sale: x?.tradeQuantity?.saleQuantity,
//             rating: x?.tradeService?.goodsScore,
//           },
//           Price: x?.tradePrice?.offerPrice?.priceInfo?.price,

//           thumbnail: x?.image,
//           categoryId: x?.aliTalk?.categoryId,
//           brief: x?.information?.brief,
//           priceInfo: x?.tradePrice?.offerPrice,
//           // saleQuantity: x?.tradeQuantity?.saleQuantity,
//           minQty: x?.tradeQuantity?.quantityBegin,
//           compositeNewScore: x?.tradeService?.compositeNewScore,
//           consultationScore: x?.tradeService?.consultationScore,
//           // goodsScore: x?.tradeService?.goodsScore,
//           logisticsScore: x?.tradeService?.logisticsScore,
//           logisticsScore: x?.tradeService?.logisticsScore,
//         });
//         // return title;
//       });
//   }
//   console.log(list);
//   return list;
// };

import { translate } from 'bing-translate-api';

export const bingTranslator = async (tagValue, search, pages) => {
  const list = {
    status: true,
    search: search,
    maximum_page_count: tagValue?.pageCount,
    total_count: +tagValue?.pageCount * +tagValue?.offerSize,
    result: [],
    page: pages,
    keywords: tagValue?.trace?.keywords,
    currentPageContent: tagValue?.offerSize,
    response_type: '1688',
    updateAt: new Date(),
  };

  try {
    const translations = await Promise.all(
      tagValue?.offerList.map(async (x) => {
        try {
          const translation = await translate(
            x?.information?.simpleSubject || x?.information?.subject,
            null,
            'en',
          );
          return translation.translation;
        } catch (err) {
          console.error(err);
          return x?.information?.simpleSubject || x?.information?.subject;
        }
      }),
    );

    tagValue?.offerList.forEach((x, index) => {
      list.result.push({
        Id: `abb-${x?.id}`,
        VendorId: `abb-${x?.aliTalk?.categoryId}`,
        Title: translations[index],
        Pictures: x?.image?.imgUrl,
        seller: {
          sale: x?.tradeQuantity?.saleQuantity,
          rating: x?.tradeService?.goodsScore,
        },
        Price:
          parseFloat(x?.tradePrice?.offerPrice?.priceInfo?.price) *
          parseInt(process.env.RMB_BDT),
        currency: 'bd',
        thumbnail: x?.image,
        categoryId: x?.aliTalk?.categoryId,
        brief: x?.information?.brief,
        priceInfo: x?.tradePrice?.offerPrice,
        minQty: x?.tradeQuantity?.quantityBegin,
        compositeNewScore: x?.tradeService?.compositeNewScore,
        consultationScore: x?.tradeService?.consultationScore,
        logisticsScore: x?.tradeService?.logisticsScore,
      });
    });
  } catch (err) {
    console.error(err);
    list.status = false;
    list.msg = 'API response failed';
  }

  if (list && list?.result.length > 0) {
    return list;
  } else {
    return false;
  }
};
