"use client"

import useSWR from "swr"
import { getIncidents, getSeriesByMonth, getAggByState, getHeatGrid, getLookups } from "../api"
import type { Filters } from "../types"

export function useIncidents(filters?: Filters) {
  const key = filters ? ["incidents", JSON.stringify(filters)] : ["incidents"]

  return useSWR(key, () => getIncidents(filters), {
    revalidateOnFocus: false,
    dedupingInterval: 30000, // 30 seconds
  })
}

export function useTimeSeries(filters?: Filters) {
  const key = filters ? ["time-series", JSON.stringify(filters)] : ["time-series"]

  return useSWR(key, () => getSeriesByMonth(filters), {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  })
}

export function useStateAggregations(filters?: Filters) {
  const key = filters ? ["state-agg", JSON.stringify(filters)] : ["state-agg"]

  return useSWR(key, () => getAggByState(filters), {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  })
}

export function useHeatGrid(filters?: Filters) {
  const key = filters ? ["heat-grid", JSON.stringify(filters)] : ["heat-grid"]

  return useSWR(key, () => getHeatGrid(filters), {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  })
}

export function useLookups() {
  return useSWR("lookups", getLookups, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
  })
}
