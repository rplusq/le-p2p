"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount, useWaitForTransaction } from "wagmi";
import { StyledSell } from "./styles";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { leP2PEscrowAddress, useLeP2PEscrowCreateOrder, useUsdcMockAllowance, useUsdcMockApprove } from "@/generated";
import { parseUnits } from "viem";
import { TOKEN_DECIMALS } from "@/lib/constans";
import { polygonMumbai } from "wagmi/chains";
import { useToast } from "@/components/ui/use-toast";

const sellFormSchema = z.object({
  amount: z.string().min(1),
  fiatToTokenExchangeRate: z.string().min(1),
  iban: z.string().min(1),
});

type SellFormValues = z.infer<typeof sellFormSchema>;

export default function Sell() {
  const router = useRouter();
  const { toast } = useToast();
  const { address } = useAccount();
  const { data: tokenAllowance } = useUsdcMockAllowance({ account: address });

  useEffect(() => {
    if (!address) router.push("/");
  }, [router, address]);

  const form = useForm<SellFormValues>({
    resolver: zodResolver(sellFormSchema),
    defaultValues: {
      amount: "",
      fiatToTokenExchangeRate: "",
      iban: "",
    },
  });

  // Contracts
  const approveCall = useUsdcMockApprove();
  const waitingApprove = useWaitForTransaction({
    hash: approveCall.data?.hash as `0x${string}`,
    onSuccess: () => handleCreateOffer(),
  });

  const createOfferCall = useLeP2PEscrowCreateOrder({
    onError: (error) => {
      if (error.message.includes("Address needs to be kycd for amounts greater than 1000")) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "You need polygon ID for creating offers greater than 1000 USDC.",
        });
      }
    },
  });
  const waitingCreateOffer = useWaitForTransaction({
    hash: createOfferCall.data?.hash as `0x${string}`,
    onSuccess: () => router.push("/buy"),
  });

  const hasAllowance =
    tokenAllowance && form.watch("amount") ? tokenAllowance > parseUnits(`${+form.watch("amount")}`, TOKEN_DECIMALS) : false;

  const onSubmit = async (data: SellFormValues) => {
    // Call contract
    if (!hasAllowance) {
      approveCall.write({
        args: [leP2PEscrowAddress[polygonMumbai.id], parseUnits(`${+data.amount}`, TOKEN_DECIMALS)],
      });
    } else {
      handleCreateOffer();
    }
  };

  const handleCreateOffer = async () => {
    const data = form.getValues();
    createOfferCall.write({
      args: [
        parseUnits(`${+data.amount}`, TOKEN_DECIMALS),
        parseUnits(`${+data.fiatToTokenExchangeRate}`, TOKEN_DECIMALS),
        data.iban,
      ],
    });
  };

  const checkWallet = approveCall.isLoading || createOfferCall.isLoading;
  const isLoading = waitingApprove.isLoading || waitingCreateOffer.isLoading || checkWallet;

  return (
    <StyledSell>
      <h2 className="text-4xl font-bold tracking-tight">Sell USDC</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <br />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} type="number" placeholder="Enter the amount you want to sell" {...field} />
                </FormControl>
                <FormDescription>This is the amount in USDC you want to sell by EUR.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <br />
          <FormField
            control={form.control}
            name="fiatToTokenExchangeRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exchange rate</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} type="number" placeholder="Enter the sell exchange rate" {...field} />
                </FormControl>
                <FormDescription>
                  Please enter how much EUR you want for 1 USDC. <br /> (i.e. 1.12 EUR per USDC)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <br />
          <FormField
            control={form.control}
            name="iban"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IBAN account</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} type="string" placeholder="Enter the IBAN account" {...field} />
                </FormControl>
                <FormDescription>IBAN account where you want to receive the EUR.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading || !form.formState.isValid} variant="default" className="w-full mt-5">
            {isLoading
              ? checkWallet
                ? "Check your wallet..."
                : waitingApprove.isLoading
                ? "Approving token spending..."
                : "Creating offer..."
              : "Create sell offer"}
          </Button>
        </form>
      </Form>
    </StyledSell>
  );
}
