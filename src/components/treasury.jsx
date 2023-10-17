import React from "react";
import Table from "react-bootstrap/Table";

export default function Treasury({ OAO }) {
  return (
    <>
      <h3>Treasury</h3>
      <Table striped bordered>
        <thead>
          <tr>
            <th>ASSET NAME</th>
            <th>ASSET SCID</th>
            <th>TREASURY</th>
            <th>ALLOWANCES</th>
          </tr>
        </thead>
        <tbody>
          {OAO.treasury.assets.map((asset) => (
            <tr key={asset.scid}>
              <td>{asset.name}</td>
              <td>{asset.scid}</td>
              <td>{asset.treasury}</td>
              <td>
                {asset.allowances.length > 0 ? (
                  <ul>
                    {assetasset.allowances.map((allowance, index) => (
                      <li key={index}>
                        Type:{" "}
                        {allowance.interval ? allowance.interval : "One-Time"},
                        Amount: {allowance.amount}, Role: {allowance.role}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "No Active Allowances"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
