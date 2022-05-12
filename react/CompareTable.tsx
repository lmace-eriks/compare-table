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
  const [shopLinks, setShopLinks] = useState<Array<string>>([]);
  const [thWidth, setThWidth] = useState<number>(0);

  const classPrefix: string = "eriksbikeshop-comparetable-1-x-";
  const hightlightClassName: string = "redBackground"

  useEffect(() => {
    if (!openGate) return;
    console.clear();

    const featureTitleTemp: Array<string> = [];
    tableData.products[0].features.forEach(feature => featureTitleTemp.push(feature.feature));

    const featureValuesTemp: Array<Array<FeatureObject>> = [];
    tableData.products.forEach(product => featureValuesTemp.push(product.features));

    const shopLinkTemp: Array<string> = [];
    tableData.products.forEach(shopLink => shopLinkTemp.push(shopLink.shopLink));

    setFeatureData(featureValuesTemp);
    setFeatureTitles(featureTitleTemp);
    setAllProducts(tableData.products);
    setShopLinks(shopLinkTemp);
    setThWidth(100 / (tableData.products.length + 1));
    setOpenGate(false);
  })

  const handleHighlight = (e: any) => {
    toggleHighlight(true, grabActiveCell(e.target.id));
  }

  const handleDim = (e: any) => {
    toggleHighlight(false, grabActiveCell(e.target.id));
  }

  const handleButtonHighlight = (e: any) => {
    toggleHighlightButton(true, grabActiveButton(e.target.id));
  }

  const handleButtonDim = (e: any) => {
    toggleHighlightButton(false, grabActiveButton(e.target.id));
  }

  const grabActiveButton = (activeButton: string) => Number(activeButton.split("cell-")[1]);

  const grabActiveCell = (activeCell: string) => {
    const activeRow: Number = Number(activeCell.split("row-")[1].split("-cell")[0]);
    const activeCol: Number = Number(activeCell.split("-cell-")[1]);
    return { activeRow, activeCol };
  }

  const toggleHighlightButton = (light: Boolean, col: Number) => {
    // @ts-expect-error
    const redCol: any = document.getElementById(`col-${col}`);
    light ? redCol.classList.add(classPrefix + hightlightClassName) : redCol.classList.remove(classPrefix + hightlightClassName);
  }

  const toggleHighlight = (light: Boolean, info: HighlightObject) => {
    const { activeRow, activeCol } = info;

    // @ts-expect-error
    const redRow: any = document.getElementById(`row-${activeRow}`);

    // @ts-expect-error
    const redCol: any = document.getElementById(`col-${activeCol}`);

    if (redRow) light ? redRow.classList.add(classPrefix + hightlightClassName) : redRow.classList.remove(classPrefix + hightlightClassName);
    light ? redCol.classList.add(classPrefix + hightlightClassName) : redCol.classList.remove(classPrefix + hightlightClassName);
  }

  return (
    <div className={styles.tableContainer}>
      <table>
        <tr>
          <th style={{ width: `${thWidth}%` }} className={styles.noBorder}></th>
          {allProducts.map((product, index) => (
            <th key={`col-${index}`} id={`col-${index}`} style={{ width: `${thWidth}%` }}>{product.title}</th>
          ))}
        </tr>
        {featureTitles.map((feature, index) => (
          <tr>
            <td id={`row-${index}`} className={styles.featureTitle}>{feature}</td>
            {featureData.map((data, featureIndex) => (
              <td key={`row-${index}-cell-${featureIndex}`} id={`row-${index}-cell-${featureIndex}`} onMouseOver={handleHighlight} onMouseOut={handleDim}>{data[index].value}</td>
            ))}
          </tr>
        ))}
        <tr>
          <td style={{ width: `${thWidth}%` }} className={styles.noBorderShop}></td>
          {shopLinks.map((shopLink, index) => (
            <td key={`row-${featureTitles.length}-cell-${index}`} id={`row-${featureTitles.length}-cell-${index}`} onMouseOver={handleHighlight} onMouseOut={handleDim} className={styles.shopButtonCell}>
              <a id={`row-${featureTitles.length}-cell-${index}`} href={shopLink} target="_blank" rel="noreferrer" onMouseOver={handleButtonHighlight} onMouseOut={handleButtonDim} className={styles.shopNowTableButton}>Shop Now</a>
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