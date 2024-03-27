import { createAction, props } from "@ngrx/store";
import { ChartData, Dashboard } from "../../types";

export const getDashboardData = createAction('[dashboard] get dashboard data')
export const gotDashboardData = createAction('[dashboard] got dashboard data', props<Dashboard>())


export const getChartData = createAction('[dashboard] get chart data')
export const gotChartData = createAction('[dashboard] got chart data', props<ChartData>())
