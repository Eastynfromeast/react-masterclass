import { useQuery } from "react-query";
import { Link, Outlet, useLocation, useMatch, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";

const Container = styled.div`
	padding: 0px 20px;
	max-width: 480px;
	margin: 0 auto;
`;

const Header = styled.header`
	height: 10vh;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Title = styled.h1`
	font-size: 48px;
	color: ${props => props.theme.accentColor};
`;

const Loader = styled.span`
	display: block;
	text-align: center;
`;

const Overview = styled.div`
	display: flex;
	background-color: rgba(0, 0, 0, 0.5);
	justify-content: space-between;
	align-items: center;
	padding: 10px 20px;
	border-radius: 10px;
`;
const OverviewItem = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	span:first-child {
		font-size: 10px;
		font-weight: 400;
		text-transform: uppercase;
		margin-bottom: 5px;
	}
`;
const Description = styled.p`
	margin: 20px 0;
	line-height: 1.2;
`;

const Tabs = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	margin: 25px 0;
	gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
	text-align: center;
	text-transform: uppercase;
	font-size: 12px;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 10px;
	color: ${props => (props.isActive ? props.theme.accentColor : props.theme.textColor)};
	a {
		display: block;
		padding: 7px 0;
	}
`;
interface IInfoData {
	id: string;
	name: string;
	symbol: string;
	rank: number;
	is_new: boolean;
	is_active: boolean;
	type: string;
	logo: string;
	description: string;
	message: string;
	open_source: boolean;
	started_at: string;
	development_status: string;
	hardware_wallet: boolean;
	proof_type: string;
	org_structure: string;
	hash_algorithm: string;
	first_data_at: string;
	last_data_at: string;
}

interface ITickersData {
	id: string;
	name: string;
	symbol: string;
	rank: number;
	total_supply: number;
	max_supply: number;
	beta_value: number;
	first_data_at: string;
	last_updated: string;
	quotes: {
		USD: {
			ath_date: string;
			ath_price: number;
			market_cap: number;
			market_cap_change_24h: number;
			percent_change_1h: number;
			percent_change_1y: number;
			percent_change_6h: number;
			percent_change_7d: number;
			percent_change_12h: number;
			percent_change_15m: number;
			percent_change_24h: number;
			percent_change_30d: number;
			percent_change_30m: number;
			percent_from_price_ath: number;
			price: number;
			volume_24h: number;
			volume_24h_change_24h: number;
		};
	};
}
/*

*/
function Coin() {
	const { coinId } = useParams();
	const { state } = useLocation();
	const priceMatch = useMatch("/:coinId/price");
	const chartMatch = useMatch("/:coinId/chart");

	const { isLoading: infoLoading, data: infoData } = useQuery<IInfoData>(["info", coinId], () => fetchCoinInfo(coinId));
	const { isLoading: tickersLoading, data: tickersData } = useQuery<ITickersData>(["tickers", coinId], () => fetchCoinTickers(coinId));

	/* const [loading, setLoading] = useState(true);
	const [info, setInfo] = useState<IInfoData>();
	const [priceInfo, setPriceInfo] = useState<IPriceData>();
	useEffect(() => {
		(async () => {
			const infoData = await (await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)).json();
			const priceData = await (await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)).json();
			console.log(infoData);
			setInfo(infoData);
			setPriceInfo(priceData);
			setLoading(false);
		})();
	}, [coinId]); */

	const loading = infoLoading || tickersLoading;
	return (
		<Container>
			<Header>
				<Title>{state?.name ? state.name : loading ? "Loading..." : infoData?.name}</Title>
			</Header>
			{loading ? (
				<Loader>Loading...</Loader>
			) : (
				<>
					<Overview>
						<OverviewItem>
							<span>Rank</span>
							<span>{infoData?.rank}</span>
						</OverviewItem>
						<OverviewItem>
							<span>symbol</span>
							{infoData?.symbol}
						</OverviewItem>
						<OverviewItem>
							<span>open source</span>
							<span>{infoData?.open_source ? "Yes" : "No"}</span>
						</OverviewItem>
					</Overview>
					<Description>{infoData?.description}</Description>
					<Overview>
						<OverviewItem>
							<span>total supply</span>
							<span>{tickersData?.total_supply}</span>
						</OverviewItem>
						<OverviewItem>
							<span>max supply</span>
							<span>{tickersData?.max_supply}</span>
						</OverviewItem>
					</Overview>
					<Tabs>
						<Tab isActive={chartMatch !== null}>
							<Link to={`/${coinId}/chart`}> Chart</Link>
						</Tab>
						<Tab isActive={priceMatch !== null}>
							<Link to={`/${coinId}/price`}> Price</Link>
						</Tab>
					</Tabs>
					<Outlet />
				</>
			)}
		</Container>
	);
}

export default Coin;
