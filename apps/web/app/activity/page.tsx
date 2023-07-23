"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useWaitForTransaction } from "wagmi";
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
import { TOKEN_DECIMALS } from "@/lib/constans";
import { formatUnits } from "viem";
import OpenIcon from "@mui/icons-material/OpenInNew";
import { useLeP2PEscrowConfirmOrder, useLeP2PEscrowReleaseOrderBuyer, useLeP2PEscrowSubmitPayment } from "@/generated";

export default function Activity() {
  const router = useRouter();
  const { address } = useAccount();
  const { data: activeOrder, refetch } = useActiveOrder();
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [proofOfPaymentFile, setProofOfPaymentFile] = useState<File | undefined>();

  useEffect(() => {
    if (!address) router.push("/");
  }, [router, address]);

  // Contracts
  const releaseCall = useLeP2PEscrowReleaseOrderBuyer();
  const waitingRelease = useWaitForTransaction({
    hash: releaseCall.data?.hash as `0x${string}`,
    onSuccess: () => {
      router.push("/buy");
    },
  });

  const paymentReceivedCall = useLeP2PEscrowConfirmOrder();
  const waitingPaymentReceived = useWaitForTransaction({
    hash: paymentReceivedCall.data?.hash as `0x${string}`,
    onSuccess: () => {
      refetch();
    },
  });

  const paymentSentCall = useLeP2PEscrowSubmitPayment();
  const waitingPaymentSent = useWaitForTransaction({
    hash: paymentSentCall.data?.hash as `0x${string}`,
    onSuccess: () => {
      refetch();
    },
  });

  const checkWallet = paymentSentCall.isLoading || paymentReceivedCall.isLoading || releaseCall.isLoading;
  const isLoading =
    waitingRelease.isLoading || waitingPaymentReceived.isLoading || waitingPaymentSent.isLoading || checkWallet || uploadingFile;

  const handleOnChangeProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProofOfPaymentFile(e.target.files?.[0]);
  };

  const handlePaymentDone = async () => {
    if (!activeOrder) return;
    if (!proofOfPaymentFile) return;
    setUploadingFile(true);

    try {
      // Upload to IPFS and call contract
      const proofCid = await web3StorageClient.put([proofOfPaymentFile], {});
      paymentSentCall.write({
        args: [BigInt(activeOrder.id), proofCid],
      });
    } catch (error) {
      console.log(error);
    } finally {
      setUploadingFile(false);
    }
  };

  const handlePaymentReceived = () => {
    if (!activeOrder) return;

    // Call contract to change status
    paymentReceivedCall.write({
      args: [BigInt(activeOrder.id)],
    });
  };

  const handleCloseOrder = () => {
    if (!activeOrder) return;
    // Call contract and close order
    releaseCall.write({
      args: [BigInt(activeOrder.id), "released by buyer"],
    });
  };

  const buyerView = () => {
    if (!activeOrder) return null;

    const amountFormatted = +formatUnits(BigInt(activeOrder.amount), TOKEN_DECIMALS);
    const exchangeRateFormatted = +formatUnits(BigInt(activeOrder.fiatToTokenExchangeRate), TOKEN_DECIMALS);

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
          <Button variant="destructive" className="w-full mt-3" onClick={handleCloseOrder} disabled={isLoading}>
            {releaseCall.isLoading || waitingRelease.isLoading ? <>Closing order...</> : <>Cancel order</>}
          </Button>

          <p className="mt-5">
            Please, you need to send <strong>{(amountFormatted / exchangeRateFormatted).toFixed(2)}€</strong> to the payment
            method listed below and upload the proof of payment:
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
            <Input id="picture" type="file" onChange={handleOnChangeProof} disabled={isLoading} />
          </div>

          <br />

          <Button variant="default" className="w-full" disabled={!proofOfPaymentFile || isLoading} onClick={handlePaymentDone}>
            {proofOfPaymentFile ? (
              <>
                {isLoading ? (
                  <>Uploading proof and executing...</>
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

    const handleViewProof = () => {
      window.open(`https://cloudflare-ipfs.com/ipfs/${activeOrder.paymentProof}`);
    };

    const amountFormatted = +formatUnits(BigInt(activeOrder.amount), TOKEN_DECIMALS);
    const exchangeRateFormatted = +formatUnits(BigInt(activeOrder.fiatToTokenExchangeRate), TOKEN_DECIMALS);

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
            <strong>{(amountFormatted / exchangeRateFormatted).toFixed(2)}€</strong> to finish the transaction.
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

          <Button variant="outline" className="mt-5" onClick={handleViewProof} disabled={isLoading}>
            <OpenIcon className="mr-2" />
            View payment proof
          </Button>

          <Button variant="default" className="w-full mt-5" onClick={handlePaymentReceived} disabled={isLoading}>
            <CheckIcon className="mr-2" />
            {isLoading ? <>Confirming payment...</> : <>Confirm payment</>}
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
          {address?.toLowerCase() === activeOrder.buyer?.toLowerCase() ? buyerView() : sellerView()}
        </>
      ) : (
        <div>You have no active order</div>
      )}
    </StyledActivity>
  );
}
