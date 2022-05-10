import React from 'react';

// Styles
import styles from "./styles.css";

interface CompareTableProps {

}

const CompareTable: StorefrontFunctionComponent<CompareTableProps> = ({ }) => {

  return (
    <h2>Hello World</h2>
  )
}

CompareTable.schema = {
  title: 'editor.CompareTable.title',
  description: 'editor.CompareTable.description',
  type: 'object',
  properties: {}
}

export default CompareTable;
