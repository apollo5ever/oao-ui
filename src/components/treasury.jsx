import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { usePropose } from "../hooks/usePropose";
import { useSendTransaction } from "../hooks/useSendTransaction";
import { useGetRandomAddress } from "../hooks/useGetRandomAddress";

export default function Treasury({ OAO }) {
  const [propose] = usePropose();
  const [sendTransaction] = useSendTransaction();
  const [getRandomAddress] = useGetRandomAddress();
  const [request, setRequest] = useState(false);
  const [withdraw, setWithdraw] = useState(false);
  const [deposit, setDeposit] = useState(false);
  const [amount, setAmount] = useState(0);
  const [recurring, setRecurring] = useState(false);
  const [asset, setAsset] = useState(
    "0000000000000000000000000000000000000000000000000000000000000000"
  );
  const handleShowRequest = () => setRequest(true);
  const handleCloseRequest = () => setRequest(false);
  const handleShowWithdraw = () => setWithdraw(true);
  const handleCloseWithdraw = () => setWithdraw(false);
  const handleShowDeposit = () => setDeposit(true);
  const handleCloseDeposit = () => setDeposit(false);
  const handleRequest = (e) => {
    e.preventDefault();

    if (recurring) {
      return;
    } else {
      let k = OAO.treasury.allowanceSearch.toString().slice(1, -1) + asset;
      let v = amount.toString();
      let ceo = OAO.users.filter((x) => x.type == "CEO")[0].tokenName;
      propose(OAO.scid, "", k, v, 1, ceo, 0, OAO.proposeFunction, OAO.version);
    }
  };
  const handleWithdraw = async (e) => {
    e.preventDefault();
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    let randomAddress = await getRandomAddress();
    let data = {
      scid: OAO.scid,
      ringsize: 2,
      transfers: [
        {
          destination: randomAddress,
          burn: parseInt(amount),
          scid: asset,
        },
      ],
      sc_rpc: [
        {
          name: "entrypoint",
          datatype: "S",
          value: "Deposit",
        },
        {
          name: "token",
          datatype: "S",
          value: asset,
        },
      ],
    };
    sendTransaction(data);
  };

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
          {OAO.treasury &&
            OAO?.treasury?.assets.map((asset) => (
              <tr key={asset.scid}>
                <td>{asset.name}</td>
                <td>{asset.scid}</td>
                <td>{asset.treasury}</td>
                <td>
                  <small
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleShowRequest();
                    }}
                  >
                    Request Allowance
                  </small>
                  <br />
                  {asset.allowances.length > 0 ? (
                    <ul>
                      {asset.allowances.map((allowance, index) => (
                        <li key={index}>
                          Type:{" "}
                          {allowance.interval ? allowance.interval : "One-Time"}
                          , Amount: {allowance.amount}
                          {/*, Role: {allowance.role}*/}
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
      <div>
        <Button
          onClick={() => {
            handleShowWithdraw();
          }}
        >
          Withdraw
        </Button>
        <Button
          onClick={() => {
            handleShowDeposit();
          }}
        >
          Deposit
        </Button>
      </div>
      <Modal show={withdraw} onHide={handleCloseWithdraw}>
        <Form onSubmit={handleWithdraw}>
          <Form.Group className="mb-3">
            <Form.Label>Asset</Form.Label>
            <Form.Control
              type=""
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Allowance Type</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="One-Time"
                name="type"
                value="0"
                checked={!recurring}
                onChange={() => setRecurring(false)}
              />
              <Form.Check
                inline
                type="radio"
                label="Recurring"
                name="type"
                value="1"
                checked={recurring}
                onChange={() => setRecurring(true)}
              />
            </div>
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal>

      <Modal show={deposit} onHide={handleCloseDeposit}>
        <Form onSubmit={handleDeposit}>
          <Form.Group className="mb-3">
            <Form.Label>Asset</Form.Label>
            <Form.Control
              type=""
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Allowance Type</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="One-Time"
                name="type"
                value="0"
                checked={!recurring}
                onChange={() => setRecurring(false)}
              />
              <Form.Check
                inline
                type="radio"
                label="Recurring"
                name="type"
                value="1"
                checked={recurring}
                onChange={() => setRecurring(true)}
              />
            </div>
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal>

      <Modal show={request} onHide={handleCloseRequest}>
        <Form onSubmit={handleRequest}>
          <Form.Group className="mb-3">
            <Form.Label>Asset</Form.Label>
            <Form.Control
              type=""
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Allowance Type</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="One-Time"
                name="type"
                value="0"
                checked={!recurring}
                onChange={() => setRecurring(false)}
              />
              <Form.Check
                inline
                type="radio"
                label="Recurring"
                name="type"
                value="1"
                checked={recurring}
                onChange={() => setRecurring(true)}
              />
            </div>
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </>
  );
}
