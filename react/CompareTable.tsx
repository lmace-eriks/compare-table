import { forEach } from 'ramda';
import React, { useEffect, useState } from 'react';

// Styles
import styles from "./styles.css";

interface CompareTableProps {
  tableData: TableDataObject
}

interface TableDataObject {
  products: Array<ProductObject>
}

interface ProductObject {
  title: string
  image: string
  shopLink: string
  features: Array<FeatureObject>
}

interface FeatureObject {
  feature: string,
  value: string
}

interface HighlightObject {
  activeRow: Number
  activeCol: Number
}

const CompareTable: StorefrontFunctionComponent<CompareTableProps> = ({ tableData }) => {
  const [openGate, setOpenGate] = useState<Boolean>(true);
  const [featureTitles, setFeatureTitles] = useState<Array<string>>([]);
  const [allProducts, setAllProducts] = useState<Array<ProductObject>>([]);
  const [featureData, setFeatureData] = useState<Array<any>>([]);
  const [productImages, setProductImages] = useState<Array<string>>([]);
  const [shopLinks, setShopLinks] = useState<Array<string>>([]);
  const [thWidth, setThWidth] = useState<number>(0);
  const [tableContainerHeight, setTableContainerHeight] = useState<Number>(0);

  const classPrefix: string = "eriksbikeshop-comparetable-1-x-";
  const hightlightClassName: string = "redBackground"
  const rowHeight: number = 2.5;
  const imageHeight: number = 5;

  useEffect(() => {
    if (!openGate) return;
    console.clear();

    const featureTitleTemp: Array<string> = [];
    tableData.products[0].features.forEach(feature => featureTitleTemp.push(feature.feature));

    const featureValuesTemp: Array<Array<FeatureObject>> = [];
    tableData.products.forEach(product => featureValuesTemp.push(product.features));

    const shopLinkTemp: Array<string> = [];
    tableData.products.forEach(shopLink => shopLinkTemp.push(shopLink.shopLink));

    const productImagesTemp: Array<string> = [];
    tableData.products.forEach(image => productImagesTemp.push(image.image));

    setFeatureData(featureValuesTemp);
    setFeatureTitles(featureTitleTemp);
    setAllProducts(tableData.products);
    setProductImages(productImagesTemp);
    setShopLinks(shopLinkTemp);
    setThWidth(100 / (tableData.products.length + 1));
    setTableContainerHeight((featureTitleTemp.length + 3) * rowHeight + imageHeight);
    setOpenGate(false);
  })

  const handleToggle = (e: any) => {
    const light = e.type === "mouseover";
    const cellInfo = grabActive(e.target);
    const { activeRow, activeCol } = cellInfo;

    // @ts-expect-error 
    const redCol: any = document.getElementById(`col-${activeCol}`);
    light ? redCol.classList.add(classPrefix + hightlightClassName) : redCol.classList.remove(classPrefix + hightlightClassName);

    if (activeRow < featureTitles.length) {
      // @ts-expect-error
      const redRow: any = document.getElementById(`row-${activeRow}`);
      light ? redRow.classList.add(classPrefix + hightlightClassName) : redRow.classList.remove(classPrefix + hightlightClassName);
    }
  }

  const grabActive = (activeElement: any) => {
    const activeRow: number = Number(activeElement.id.split("row-")[1].split("-cell")[0]);
    const activeCol: number = Number(activeElement.id.split("-cell-")[1]);
    return { activeRow, activeCol };
  }

  return (
    <div style={{ height: `${tableContainerHeight}rem` }} className={styles.tableContainer}>
      <table>
        <tr>
          <td className={styles.noBorderImageCell}></td>
          {productImages.map(image => (
            <td key={`td-${image}`} className={styles.noBorderImageCell}>
              <img key={`image-${image}`} src={image} style={{ height: `${imageHeight}rem` }} />
            </td>
          ))}
        </tr>
        <tr>
          <th style={{ width: `${thWidth}%` }} className={styles.noBorderTh}></th>
          {allProducts.map((product, index) => (
            <th key={`col-${index}`} id={`col-${index}`} style={{ width: `${thWidth}%`, height: `${rowHeight}rem` }}>{product.title}</th>
          ))}
        </tr>
        {featureTitles.map((feature, index) => (
          <tr key={`tr-${index}`}>
            <td key={`row-${index}`} id={`row-${index}`} style={{ height: `${rowHeight}rem` }} className={styles.featureTitle}><span>{feature}</span></td>
            {featureData.map((data, featureIndex) => (
              <td key={`row-${index}-cell-${featureIndex}`} id={`row-${index}-cell-${featureIndex}`} onMouseOver={handleToggle} onMouseOut={handleToggle}>{data[index].value}</td>
            ))}
          </tr>
        ))}
        <tr>
          <td style={{ width: `${thWidth}%` }} className={styles.noBorderShop}></td>
          {shopLinks.map((shopLink, index) => (
            <td key={`row-${featureTitles.length}-cell-${index}`} className={styles.shopButtonCell}>
              <a id={`row-${featureTitles.length}-cell-${index}`} href={shopLink} target="_blank" rel="noreferrer" onMouseOver={handleToggle} onMouseOut={handleToggle} className={styles.shopNowTableButton}>Shop Now</a>
            </td>
          ))}
        </tr>
      </table>
    </div>
  )
}

CompareTable.schema = {
  title: 'editor.CompareTable.title',
  description: 'editor.CompareTable.description',
  type: 'object',
  properties: {}
}

export default CompareTable;