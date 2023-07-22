"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { StyledSell } from "./styles";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useSellOffers } from "../buy/service";

const sellFormSchema = z.object({
  amount: z.string(),
  fiatToTokenExchangeRate: z.string(),
  iban: z.string(),
});

type SellFormValues = z.infer<typeof sellFormSchema>;

export default function Sell() {
  const router = useRouter();
  const { address } = useAccount();

  const form = useForm<SellFormValues>({
    resolver: zodResolver(sellFormSchema),
  });

  useEffect(() => {
    if (!address) router.push("/");
  }, [router, address]);

  function onSubmit(data: SellFormValues) {
    // TODO:
    // Call contract
    console.log(data);
  }

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
                  <Input type="number" placeholder="Enter the amount you want to sell" {...field} />
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
                  <Input type="number" placeholder="Enter the sell exchange rate" {...field} />
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
                  <Input type="string" placeholder="Enter the IBAN account" {...field} />
                </FormControl>
                <FormDescription>IBAN account where you want to receive the EUR.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button variant="default" className="w-full mt-5">
            Create sell offer
          </Button>
        </form>
      </Form>
    </StyledSell>
  );
}
