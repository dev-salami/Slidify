/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { formatEther } from "viem";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRightIcon,
  BanknoteIcon,
  LockIcon,
  ShieldCheckIcon,
} from "lucide-react";
import {
  useContractBalance,
  useHintPrices,
  useIsAdmin,
  useTotalGames,
  useWithdrawFunds,
} from "@/utils/adminInteraction";
import { publicClient } from "@/utils/wagmi";
import { CA } from "@/utils/contract";

const AdminDashboard = () => {
  // Contract data hooks
  const {
    isAdmin,
    isLoading: adminCheckLoading,
    error: adminError,
  } = useIsAdmin();
  const { totalGames, isLoading: gamesLoading } = useTotalGames();
  const { prices, isLoading: pricesLoading } = useHintPrices();
  const {
    balance,
    isLoading: balanceLoading,
    error: balanceError,
    refetch,
  } = useContractBalance();

  // Withdraw funds hook
  const {
    withdraw,
    isWithdrawing,
    error: withdrawError,
    isSuccess,
  } = useWithdrawFunds();

  // Balance state (would be fetched from contract in a real implementation)

  // Function to handle funds withdrawal
  const handleWithdraw = async () => {
    try {
      await withdraw();
      refetch();
    } catch (error) {
      console.error("Withdrawal failed:", error);
    }
  };

  // Show access denied for non-admins
  if (!adminCheckLoading && !isAdmin) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert variant="destructive" className="mb-6">
          <LockIcon className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            Only the contract admin can access this dashboard.
          </AlertDescription>
        </Alert>

        {/* <Button onClick={() => window.history.back()}>Go Back</Button> */}
      </div>
    );
  }

  // Display loading state
  if (adminCheckLoading || gamesLoading || pricesLoading || balanceLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Skeleton className="h-[28px] w-[250px] mb-6" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-[28px] w-[120px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[40px] w-[80px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-[150px] w-full mt-6" />
      </div>
    );
  }

  // Display any errors
  if (adminError) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{adminError.message}</AlertDescription>
        </Alert>

        {/* <Button onClick={() => window.location.reload()}>Retry</Button> */}
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1
          onClick={async () => {
            const balance = await publicClient.getBalance({
              address: CA,
            });

            console.log(balance);
          }}
          className="text-3xl font-bold"
        >
          Admin Dashboard
        </h1>
        <div className="flex items-center">
          <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-sm text-gray-500">Admin Access</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Games</CardTitle>
            <CardDescription>All-time puzzles created</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {totalGames?.toString() || "0"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Contract Balance</CardTitle>
            <CardDescription>Available for withdrawal</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatEther(balance)} CORE</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Hint Prices</CardTitle>
            <CardDescription>Current prices for hints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm">Gold Hint:</span>
                <span className="font-semibold">
                  {prices ? formatEther(prices.gold) : "0"} CORE
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Silver Hint:</span>
                <span className="font-semibold">
                  {prices ? formatEther(prices.silver) : "0"} CORE
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Withdraw Funds Card */}
      <Card>
        <CardHeader>
          <CardTitle>Withdraw Contract Funds</CardTitle>
          <CardDescription>
            Transfer all CORE from the contract to the admin wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <BanknoteIcon className="h-5 w-5 text-gray-500" />
            <p className="text-sm text-gray-500">
              Current Balance:{" "}
              <span className="font-medium">{formatEther(balance)} CORE</span>
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={handleWithdraw}
            disabled={isWithdrawing || Number(balance) === 0}
            className="w-full"
          >
            {isWithdrawing ? "Processing..." : "Withdraw Funds"}
            {!isWithdrawing && <ArrowRightIcon className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>

      {/* Success Message */}
      {isSuccess && (
        <Alert className="mt-6 bg-green-50 border-green-200">
          <ShieldCheckIcon className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">
            Funds Withdrawn Successfully
          </AlertTitle>
          <AlertDescription className="text-green-600">
            The contract funds have been successfully transferred to your
            wallet.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {withdrawError && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Withdrawal Failed</AlertTitle>
          <AlertDescription>{"Error occured"}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AdminDashboard;
