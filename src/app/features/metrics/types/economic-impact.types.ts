export interface EconomicImpactDefaults {
  annualFailedHearings: number
  averageCostPerHearing: number
  reductionScenarios: {
    veryConservative: number
    mediumConservative: number
    moderatelyConservative: number
  }
}

export interface EconomicImpactInputs {
  annualFailedHearings: number
  averageCostPerHearing: number
  reductionPercentage: number
}

export interface EconomicImpactResult {
  reductionPercentage: number
  avoidedCancellations: number
  estimatedAnnualSavings: number
  inputs: {
    annualFailedHearings: number
    averageCostPerHearing: number
  }
  timestamp: string
}

export interface Scenario {
  name: string
  reductionPercentage: number
  avoidedCancellations: number
  estimatedAnnualSavings: number
}

