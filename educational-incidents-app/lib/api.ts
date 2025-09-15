import type { SchoolIncidentData, Filters, TimePoint, StateAgg, GridCell, LookupData, Shooter } from "./types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function getIncidents(filters?: Filters): Promise<SchoolIncidentData[]> {
  const params = new URLSearchParams()

  if (filters) {
    if (filters.from) params.append("from", filters.from)
    if (filters.to) params.append("to", filters.to)
    if (filters.state?.length) params.append("state", filters.state.join(","))
    if (filters.district_id?.length) params.append("district_id", filters.district_id.join(","))
    if (filters.school_type?.length) params.append("school_type", filters.school_type.join(","))
    if (filters.min_killed !== undefined) params.append("min_killed", filters.min_killed.toString())
    if (filters.max_killed !== undefined) params.append("max_killed", filters.max_killed.toString())
    if (filters.min_injured !== undefined) params.append("min_injured", filters.min_injured.toString())
    if (filters.max_injured !== undefined) params.append("max_injured", filters.max_injured.toString())
    if (filters.shooting_type?.length) params.append("shooting_type", filters.shooting_type.join(","))
    if (filters.has_resource_officer !== undefined)
      params.append("has_resource_officer", filters.has_resource_officer.toString())
  }

  const response = await fetch(`${BASE_URL}/api/incidents?${params.toString()}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch incidents: ${response.statusText}`)
  }

  return response.json()
}

export async function getIncident(uid: string): Promise<SchoolIncidentData & { shooters: Shooter[] }> {
  const response = await fetch(`${BASE_URL}/api/incidents/${uid}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch incident: ${response.statusText}`)
  }

  return response.json()
}

export async function getSeriesByMonth(filters?: Filters): Promise<TimePoint[]> {
  const params = new URLSearchParams()

  if (filters) {
    if (filters.from) params.append("from", filters.from)
    if (filters.to) params.append("to", filters.to)
    if (filters.state?.length) params.append("state", filters.state.join(","))
    if (filters.school_type?.length) params.append("school_type", filters.school_type.join(","))
  }

  const response = await fetch(`${BASE_URL}/api/stats/series?${params.toString()}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch time series: ${response.statusText}`)
  }

  return response.json()
}

export async function getAggByState(filters?: Filters): Promise<StateAgg[]> {
  const params = new URLSearchParams()

  if (filters) {
    if (filters.from) params.append("from", filters.from)
    if (filters.to) params.append("to", filters.to)
    if (filters.school_type?.length) params.append("school_type", filters.school_type.join(","))
  }

  const response = await fetch(`${BASE_URL}/api/stats/by-state?${params.toString()}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch state aggregations: ${response.statusText}`)
  }

  return response.json()
}

export async function getHeatGrid(filters?: Filters): Promise<GridCell[]> {
  const params = new URLSearchParams()

  if (filters) {
    if (filters.from) params.append("from", filters.from)
    if (filters.to) params.append("to", filters.to)
    if (filters.state?.length) params.append("state", filters.state.join(","))
    if (filters.school_type?.length) params.append("school_type", filters.school_type.join(","))
  }

  const response = await fetch(`${BASE_URL}/api/stats/heat?${params.toString()}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch heat grid: ${response.statusText}`)
  }

  return response.json()
}

export async function getLookups(): Promise<LookupData> {
  const response = await fetch(`${BASE_URL}/api/lookups`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch lookups: ${response.statusText}`)
  }

  return response.json()
}
