import React from "react";
import Table from "react-bootstrap/Table";

export default function Treasury({ OAO }) {
  return (
    <>
      <h3>Treasury</h3>
      <Table striped bordered>
        <thead>
          <tr>
            <th>ASSET</th>
            <th>ALLOWANCE</th>
            <th>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(OAO.treasury).map((key) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{OAO.treasury[key].ALLOWANCE}</td>
              <td>{OAO.treasury[key].AMOUNT}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
