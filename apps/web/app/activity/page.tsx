"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { StyledActivity } from "./styles";
import OfferCard from "@/components/OfferCard/OfferCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CheckIcon from "@mui/icons-material/Check";

export default function Activity() {
  const router = useRouter();
  const { address } = useAccount();
  console.log(address);

  const activeOrder = true;

  useEffect(() => {
    if (!address) router.push("/");
  }, [router, address]);

  const buyerView = () => {
    const waiting = false;

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
                    <p className="text-sm text-muted-foreground">LU 28 001 94006447500003</p>
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
            Please, you need to send <strong>23EUR</strong> to the payment method listed below:
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
                    <p className="text-sm text-muted-foreground">LU 28 001 94006447500003</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button variant="default" className="w-full mt-5">
            <CheckIcon className="mr-2" />
            Payment done
          </Button>
        </>
      );
    }
  };

  const sellerView = () => {
    const waiting = true;

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
                    <p className="text-sm text-muted-foreground">LU 28 001 94006447500003</p>
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
            The buyer already paid you to your IBAN account. Please, confirm the payment to finish the transaction.
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
                    <p className="text-sm text-muted-foreground">LU 28 001 94006447500003</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button variant="default" className="w-full mt-5">
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
          <OfferCard />
          {buyerView()}
        </>
      ) : (
        <div>You have no active order</div>
      )}
    </StyledActivity>
  );
}
