import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App";
import { RouterProvider } from "react-router-dom";
import router from "./router";

/*
	/ -> All Coins
	/:id -> /btc -> Coin detail
	/btc/information
	/btc/chart
*/

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement as HTMLElement);

const queryClient = new QueryClient();
root.render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<App />
		</QueryClientProvider>
	</React.StrictMode>
);
