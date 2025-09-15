export interface SchoolIncidentData {
  uid: string
  nces_school_id: string
  school_name: string
  nces_district_id: string
  district_name: string
  date: string
  school_year: string
  year: number
  time: string
  day_of_week: string
  city: string
  state: string
  school_type: string
  enrollment: number
  killed: number
  injured: number
  casualties: number
  shooting_type: string
  age_shooter1?: number
  gender_shooter1?: string
  race_ethnicity_shooter1?: string
  shooter_relationship1?: string
  shooter_deceased1?: boolean
  deceased_notes1?: string
  age_shooter2?: number
  gender_shooter2?: string
  race_ethnicity_shooter2?: string
  shooter_relationship2?: string
  shooter_deceased2?: boolean
  deceased_notes2?: string
  white: number
  black: number
  hispanic: number
  asian: number
  american_indian_alaska_native: number
  hawaiian_native_pacific_islander: number
  two_or_more: number
  resource_officer: boolean
  weapon: string
  weapon_source: string
  lat: number
  long: number
  staffing: number
  low_grade: string
  high_grade: string
  lunch: string
  county: string
  state_fips: string
  county_fips: string
  ulocale: string
}

// Helper function to convert CSV data to display format
export function convertToDisplayFormat(csvData: SchoolIncidentData): IncidentData {
  return {
    id: csvData.uid,
    date: csvData.date,
    institutionName: csvData.school_name,
    city: csvData.city,
    state: csvData.state,
    affectedCount: csvData.casualties,
    latitude: csvData.lat,
    longitude: csvData.long,
    source: "School Incident Database",
    institutionType: getInstitutionType(csvData.school_type, csvData.low_grade, csvData.high_grade),
    severity: getSeverityLevel(csvData.casualties, csvData.killed, csvData.injured),
    description: `${csvData.shooting_type} - ${csvData.killed} killed, ${csvData.injured} injured`,
    // Additional CSV-specific data
    csvData: csvData,
  }
}

function getInstitutionType(
  schoolType: string,
  lowGrade: string,
  highGrade: string,
): "elementary" | "middle" | "high" | "university" {
  if (schoolType?.toLowerCase().includes("university") || schoolType?.toLowerCase().includes("college")) {
    return "university"
  }

  // Parse grade levels
  const lowGradeNum = Number.parseInt(lowGrade?.replace(/[^0-9]/g, "") || "0")
  const highGradeNum = Number.parseInt(highGrade?.replace(/[^0-9]/g, "") || "12")

  if (highGradeNum <= 5) return "elementary"
  if (highGradeNum <= 8) return "middle"
  return "high"
}

function getSeverityLevel(casualties: number, killed: number, injured: number): "low" | "medium" | "high" | "critical" {
  if (killed > 0) return "critical"
  if (casualties >= 10 || injured >= 10) return "high"
  if (casualties >= 3 || injured >= 3) return "medium"
  return "low"
}

// Keep the original interface for backward compatibility
export interface IncidentData {
  id: string
  date: string
  institutionName: string
  city: string
  state: string
  affectedCount: number
  latitude: number
  longitude: number
  source: string
  institutionType: "elementary" | "middle" | "high" | "university"
  severity: "low" | "medium" | "high" | "critical"
  description?: string
  csvData?: SchoolIncidentData // Optional reference to original CSV data
}

export interface District {
  id: string
  name: string
  state: string
  county: string
  nces_district_id: string
}

export interface School {
  id: string
  name: string
  district_id: string
  nces_school_id: string
  school_type: string
  enrollment: number
  low_grade: string
  high_grade: string
  city: string
  state: string
  county: string
  lat: number
  long: number
}

export interface Shooter {
  id: string
  incident_uid: string
  age?: number
  gender?: string
  race_ethnicity?: string
  relationship?: string
  deceased?: boolean
  deceased_notes?: string
  weapon?: string
  weapon_source?: string
}

export interface Filters {
  from?: string
  to?: string
  state?: string[]
  district_id?: string[]
  school_type?: string[]
  min_killed?: number
  max_killed?: number
  min_injured?: number
  max_injured?: number
  shooting_type?: string[]
  has_resource_officer?: boolean
}

export interface TimePoint {
  period: string
  incidents: number
  killed: number
  injured: number
}

export interface StateAgg {
  state: string
  incidents: number
  killed: number
  injured: number
}

export interface GridCell {
  geohash6: string
  incidents: number
  lat: number
  lng: number
}

export interface LookupData {
  states: string[]
  school_types: string[]
  shooting_types: string[]
  districts: District[]
}
