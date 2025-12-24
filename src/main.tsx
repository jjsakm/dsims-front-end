import { StrictMode } from "react";

import { createRoot } from "react-dom/client";
import { StyledEngineProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";

import "./utils/globalFunc";

import "ag-grid-community/styles/ag-theme-alpine.css";

import dayjs from "dayjs";
import "dayjs/locale/ko";

const queryClient = new QueryClient();

dayjs.locale("ko"); // 전역 로케일을 한국으로 설정

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <StyledEngineProvider injectFirst>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StyledEngineProvider>
    </QueryClientProvider>
  </StrictMode>
);
