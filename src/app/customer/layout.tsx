"use client";

import React from "react";
import CustomerHeader from "../../components/customer/CustomerHeader/page";
import CustomerFooter from "../../components/customer/CustomerFooter/page";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CustomerHeader />
      <main className="pt-20">{children}</main>
      <CustomerFooter />
    </>
  );
}
