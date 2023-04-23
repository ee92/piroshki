"use client";

import React, { useEffect, useState } from "react";

import DialogButton from "../DialogButton";
import StakeHedron from "../StakeHedron";
import StakeIcosa from "../StakeIcosa";
import useHedronData from "../../hooks/useHedron";
import useHexData from "../../hooks/useHex";
import useIcosaData from "../../hooks/useIcosa";
import NativeStake from "../NativeStake";
import Card from "../Card";
import { formatHedron, formatHex, formatIcosa } from "../../utils/format";
import { commify } from "ethers/lib/utils.js";

export default function App() {
  const { data: hexData } = useHexData();
  const { data: hedronData } = useHedronData();
  const icosaData = useIcosaData();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-4">
        <Card>
          <label htmlFor="hex">HEX</label>
          <div id="hex">{commify(formatHex(hexData?.balance))}</div>
        </Card>
        <Card>
          <label htmlFor="hdrn">HDRN</label>
          <div id="hdrn">{commify(formatHedron(hedronData?.balance))}</div>
          <DialogButton title="Stake Hedron" component={StakeHedron} />
        </Card>
        <Card>
          <label htmlFor="icsa">ICSA</label>
          <div id="icsa">{commify(formatIcosa(icosaData?.balance))}</div>
          <DialogButton title="Stake Icosa" component={StakeIcosa} />
        </Card>
      </div>
      <NativeStake type="HDRN" stake={icosaData?.stakes.hdrn} />
      <NativeStake type="ICSA" stake={icosaData?.stakes.icsa} />
    </div>
  );
}
