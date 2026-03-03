import type { Metadata } from "next";
import MuiProvider from "./MuiProvider";
import StoreProvider from "./StoreProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "ewiHub - Office Ergonomics",
  description: "Ergonomics & Health Management Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <MuiProvider>{children}</MuiProvider>
          <ToastContainer position="bottom-right" theme="light" />
        </StoreProvider>
      </body>
    </html>
  );
}
