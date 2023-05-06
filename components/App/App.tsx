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
    <div className="flex flex-col gap-4 py-16 px-8">
      <div className="flex">
        <Card>
          <label htmlFor="hex" className="font-bold text-2xl">HEX</label>
          <div id="hex" className="font-base text-base">{commify(formatHex(hexData?.balance))}</div>
        </Card>
      </div>
      <div className="flex gap-4 border-b-4 border-dotted pb-8">
        <Card>
          <div className="flex justify-between">
            <div>
              <label htmlFor="hdrn">HDRN</label>
              <div id="hdrn">{commify(formatHedron(hedronData?.balance))}</div>
            </div>
            <div>
              <DialogButton title="Stake Hedron" component={StakeHedron} />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex justify-between">
            <div>
              <label htmlFor="icsa">ICSA</label>
              <div id="icsa">{commify(formatIcosa(icosaData?.balance))}</div>
            </div>
            <div>
              <DialogButton title="Stake Icosa" component={StakeIcosa} />
            </div>
          </div>
        </Card>
      </div>
      <div className="pt-8">
        <div className="pb-4">
          <NativeStake type="HDRN" stake={icosaData?.stakes.hdrn} />
        </div>
        <div className="pb-4">
          <NativeStake type="ICSA" stake={icosaData?.stakes.icsa} />
        </div>
      </div>
    </div>
  );
}
