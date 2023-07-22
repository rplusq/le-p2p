"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { StyledActivity } from "./styles";
import OfferCard from "@/components/OfferCard/OfferCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CheckIcon from "@mui/icons-material/Check";
import { useActiveOrder } from "./service";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/Input";
import { web3StorageClient } from "@/lib/web3storage";

export default function Activity() {
  const router = useRouter();
  const { address } = useAccount();
  const { data: activeOrder } = useActiveOrder();
  const [loading, setLoading] = useState<boolean>(false);

  const [proofOfPaymentFile, setProofOfPaymentFile] = useState<File | undefined>();

  useEffect(() => {
    if (!address) router.push("/");
  }, [router, address]);

  const handleOnChangeProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProofOfPaymentFile(e.target.files?.[0]);
  };

  const handlePaymentDone = async () => {
    if (!proofOfPaymentFile) return;
    setLoading(true);

    try {
      // TODO:
      // Upload to IPFS
      const proofCid = await web3StorageClient.put([proofOfPaymentFile], {});
      console.log(proofCid);
      // Call contract
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentReceived = () => {
    // TODO:
    // Call contract
  };

  const buyerView = () => {
    if (!activeOrder) return null;

    // If paymentProof is set, buyer is waiting for seller to confirm payment
    const waiting = !!activeOrder?.paymentProof;

    if (waiting) {
      return (
        <>
          <p className="mt-5">You have done the EUR payment. Please wait while the seller confirms the payment.</p>

          <Card className="mt-3">
            <CardHeader className="pb-0"></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/eu-flag.png" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">IBAN account</p>
                    <p className="text-sm text-muted-foreground">{activeOrder.iban}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      );
    } else {
      return (
        <>
          <p className="mt-5">
            Please, you need to send{" "}
            <strong>{((activeOrder?.amount ?? 0) / (activeOrder?.fiatToTokenExchangeRate ?? 0)).toFixed(2)}€</strong> to the
            payment method listed below and upload the proof of payment:
          </p>

          <Card className="mt-3">
            <CardHeader className="pb-0"></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/eu-flag.png" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">IBAN account</p>
                    <p className="text-sm text-muted-foreground">{activeOrder?.iban}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
            <Label htmlFor="picture">Proof of payment</Label>
            <Input id="picture" type="file" onChange={handleOnChangeProof} disabled={loading} />
          </div>

          <Button variant="default" className="w-full mt-5" disabled={!proofOfPaymentFile || loading} onClick={handlePaymentDone}>
            {proofOfPaymentFile ? (
              <>
                {loading ? (
                  <>Uploading and executing...</>
                ) : (
                  <>
                    <CheckIcon className="mr-2" />
                    Payment done
                  </>
                )}
              </>
            ) : (
              <>Please, upload proof first</>
            )}
          </Button>
        </>
      );
    }
  };

  const sellerView = () => {
    if (!activeOrder) return null;

    // If paymentProof is not set, seller is waiting for buyer to make the payment
    const waiting = !activeOrder?.paymentProof;

    if (waiting) {
      return (
        <>
          <p className="mt-5">The buyer is making the payment to your IBAN account. Please wait for them.</p>

          <Card className="mt-3">
            <CardHeader className="pb-0"></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/eu-flag.png" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">IBAN account</p>
                    <p className="text-sm text-muted-foreground">{activeOrder?.iban}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      );
    } else {
      return (
        <>
          <p className="mt-5">
            The buyer already paid you to your IBAN account. Please, confirm you received{" "}
            <strong>{((activeOrder?.amount ?? 0) / (activeOrder?.fiatToTokenExchangeRate ?? 0)).toFixed(2)}€</strong> to finish
            the transaction.
          </p>

          <Card className="mt-3">
            <CardHeader className="pb-0"></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/eu-flag.png" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">IBAN account</p>
                    <p className="text-sm text-muted-foreground">{activeOrder.iban}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button variant="default" className="w-full mt-5" onClick={handlePaymentReceived}>
            <CheckIcon className="mr-2" />
            Payment received
          </Button>
        </>
      );
    }
  };

  return (
    <StyledActivity>
      <h2 className="text-4xl font-bold tracking-tight mb-5">Activity</h2>

      {activeOrder ? (
        <>
          <OfferCard offer={activeOrder} noActions />
          {address === activeOrder.buyer ? buyerView() : sellerView()}
        </>
      ) : (
        <div>You have no active order</div>
      )}
    </StyledActivity>
  );
}
