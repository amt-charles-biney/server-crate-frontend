import { ChartData } from './../../types';
import { createFeature, createReducer, on } from "@ngrx/store";
import { Dashboard } from "../../types";
import { gotChartData, gotDashboardData } from "./dashboard.actions";

const dashboardInitialState: { dashboardData: Dashboard, chartData: ChartData }= {
    dashboardData: {
        customers: 0,
        latestOrders: [],
        orders: 0,
        products: 0,
        revenue: 0
    },
    chartData: {
        dayOfWeeks: [],
        revenue: []
    }
}

export const dashboardFeature = createFeature({
    name: 'dashboard',
    reducer: createReducer(
        dashboardInitialState,
        on(gotDashboardData, (state, dashboardData) => {
            return {
                ...state,
                dashboardData
            }
        }),
        on(gotChartData, (state, chartData) => {
            return {
                ...state,
                chartData
            }
        })
    )
})

export const { selectDashboardState, selectDashboardData, selectChartData } = dashboardFeature