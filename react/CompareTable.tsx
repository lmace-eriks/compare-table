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
  features: Array<FeatureObject>
}

interface FeatureObject {
  feature: string,
  value: string
}

const CompareTable: StorefrontFunctionComponent<CompareTableProps> = ({ tableData }) => {
  const [openGate, setOpenGate] = useState<Boolean>(true);
  const [featureTitles, setFeatureTitles] = useState<Array<string>>([]);
  const [allProducts, setAllProducts] = useState<Array<ProductObject>>([]);
  const [featureData, setFeatureData] = useState<Array<any>>([]);
  const [thWidth, setThWidth] = useState<number>(0);
  const [featureValues, setFeatureValues] = useState<Array<any>>([]);

  const classPrefix = "eriksbikeshop-comparetable-1-x-";

  useEffect(() => {
    if (!openGate) return;
    console.clear();

    const featureTitleTemp: Array<string> = [];
    tableData.products[0].features.forEach(feature => featureTitleTemp.push(feature.feature));

    const featureValuesTemp: Array<Array<FeatureObject>> = [];
    tableData.products.forEach((product) => featureValuesTemp.push(product.features));


    setFeatureData(featureValuesTemp);
    setFeatureTitles(featureTitleTemp);
    setAllProducts(tableData.products);
    setThWidth(100 / (tableData.products.length + 1));
    setOpenGate(false);
  })

  const handleHighlight = (e: any) => {
    const activeCell: string = e.target.id;
    const activeRow: Number = Number(activeCell.split("row-")[1].split("-cell")[0]);
    const activeCol: Number = Number(activeCell.split("-cell-")[1]);

    // @ts-expect-error
    const redRow: any = document.getElementById(`row-${activeRow}`);
    redRow.classList.add(classPrefix + "redBackground");

    // @ts-expect-error
    const redCol: any = document.getElementById(`col-${activeCol}`);
    redCol.classList.add(classPrefix + "redBackground");
  }

  const handleDim = (e: any) => {
    const activeCell: string = e.target.id;
    const activeRow: Number = Number(activeCell.split("row-")[1].split("-cell")[0]);
    const activeCol: Number = Number(activeCell.split("-cell-")[1]);

    // @ts-expect-error
    const redRow: any = document.getElementById(`row-${activeRow}`);
    redRow.classList.remove(classPrefix + "redBackground");

    // @ts-expect-error
    const redCol: any = document.getElementById(`col-${activeCol}`);
    redCol.classList.remove(classPrefix + "redBackground");
  }

  // When rolling over cell, Feature and Bike cells should highlight

  return (
    <div className={styles.tableContainer}>
      <table>
        <tr>
          <th style={{ width: `${thWidth}%` }} className={styles.noBorder}></th>
          {allProducts.map((product, index) => (
            <th id={`col-${index}`} style={{ width: `${thWidth}%` }}>{product.title}</th>
          ))}
        </tr>
        {featureTitles.map((feature, index) => (
          <tr>
            <td id={`row-${index}`} className={styles.featureTitle}>{feature}</td>
            {featureData.map((data, featureIndex) => (
              <td id={`row-${index}-cell-${featureIndex}`} onMouseOver={handleHighlight} onMouseOut={handleDim}>{data[index].value}</td>
            ))}
          </tr>
        ))}
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