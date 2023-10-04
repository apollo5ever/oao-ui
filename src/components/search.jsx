import React from "react";
import { useGetSC } from "../hooks/useGetSC";

export default function Search() {
  //create form which will fetch contract data and create object in state

  return (
    <>
      <form>
        <input id="scid" placeholder="Enter scid..." />
        <button type={"submit"}>Search</button>
      </form>
    </>
  );
}
