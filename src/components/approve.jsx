import React from "react";
import { useApprove } from "../hooks/useApprove";

export default function Approve({ scid, voteFunction, index, asset }) {
  const [approve] = useApprove();

  const handleClick = () => {
    console.log(voteFunction.name, index, asset, scid);
    approve({
      scid: scid,
      name: voteFunction.name,
      index: index,
      asset: asset,
    });
  };
  return <button onClick={handleClick}>Approve</button>;
}
