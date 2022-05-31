import React, { useEffect, useRef, useState } from 'react';

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

  const tableRef = useRef<any>(null);

  const classPrefix: string = "eriksbikeshop-comparetable-1-x-";
  const hightlightClassName: string = "redBackground"
  const highlight: string = classPrefix + hightlightClassName;
  const rowHeight: number = 2.5;
  const imageHeight: number = 5;
  const scrollbarBuffer: number = 1.5;

  useEffect(() => {
    if (!openGate) return;
    // console.clear();

    const featureTitleTemp: Array<string> = [];
    const featureValuesTemp: Array<Array<FeatureObject>> = [];
    const shopLinkTemp: Array<string> = [];
    const productImagesTemp: Array<string> = [];

    tableData.products[0].features.forEach(feature => featureTitleTemp.push(feature.feature));

    tableData.products.forEach(product => {
      featureValuesTemp.push(product.features);
      shopLinkTemp.push(product.shopLink);
      productImagesTemp.push(product.image);
    });

    setFeatureData(featureValuesTemp);
    setFeatureTitles(featureTitleTemp);
    setAllProducts(tableData.products);
    setProductImages(productImagesTemp);
    setShopLinks(shopLinkTemp);
    setThWidth(100 / (tableData.products.length + 1));
    // setTableContainerHeight(((featureTitleTemp.length + 3) * rowHeight + imageHeight) + scrollbarBuffer);
    setOpenGate(false);
    setAppHeight();
  })

  const setAppHeight = () => {
    setTimeout(() => {
      setTableContainerHeight(tableRef.current.clientHeight);
    }, 1000)
  }

  const handleToggle = (e: any) => {
    const light = e.type === "mouseover";
    const cellInfo = grabActive(e.target);
    const { activeRow, activeCol } = cellInfo;

    // @ts-expect-error 
    const redCol: any = document.getElementById(`col-${activeCol}`);
    light ? redCol.classList.add(highlight) : redCol.classList.remove(highlight);

    if (activeRow < featureTitles.length) {
      // @ts-expect-error
      const redRow: any = document.getElementById(`row-${activeRow}`);
      light ? redRow.classList.add(highlight) : redRow.classList.remove(highlight);
    }
  }

  const grabActive = (activeElement: any) => {
    const activeRow: number = Number(activeElement.id.split("row-")[1].split("-cell")[0]);
    const activeCol: number = Number(activeElement.id.split("-cell-")[1]);
    return { activeRow, activeCol };
  }

  return (
    <div style={{ height: `${tableContainerHeight}px` }} className={styles.tableContainer}>
      <table ref={tableRef} className={styles.compareTable}>
        <tr className={styles.track}>
          <td className={styles.noBorderImageCell}></td>
          {productImages.map(image => (
            <td key={`td-${image}`} className={styles.noBorderImageCell}>
              <img key={`image-${image}`} src={image} className={styles.productImage} style={{ height: `${imageHeight}rem` }} />
            </td>
          ))}
        </tr>
        <tr className={styles.track}>
          <th style={{ width: `${thWidth}%` }} className={styles.noBorderTh}></th>
          {allProducts.map((product, index) => (
            <th key={`col-${index}`} id={`col-${index}`} className={styles.tableHeader} style={{ width: `${thWidth}%`, height: `${rowHeight}rem` }}>{product.title}</th>
          ))}
        </tr>
        {featureTitles.map((feature, index) => (
          <tr className={styles.track} key={`tr-${index}`}>
            <td key={`row-${index}`} id={`row-${index}`} style={{ height: `${rowHeight}rem` }} className={styles.featureTitle}>{feature}</td>
            {featureData.map((data, featureIndex) => (
              <td key={`row-${index}-cell-${featureIndex}`} id={`row-${index}-cell-${featureIndex}`} onMouseOver={handleToggle} onMouseOut={handleToggle} className={styles.tableData}>{data[index].value}</td>
            ))}
          </tr>
        ))}
        <tr className={styles.track}>
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