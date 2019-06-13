export interface SimpleStatistic {
  type: 'simple';
  statistic: Statistic;
}

export interface PercentileStatistic {
  type: 'percentile';
  percentile: number;
}
/**
 * Parse a statistic, returning the type of metric that was used (simple or percentile)
 */
export function parseStatistic(stat: string): SimpleStatistic | PercentileStatistic {
  const lowerStat = stat.toLowerCase();

  // Simple statistics
  const statMap: {[k: string]: Statistic} = {
    average: Statistic.Average,
    avg: Statistic.Average,
    minimum: Statistic.Minimum,
    min: Statistic.Minimum,
    maximum: Statistic.Maximum,
    max: Statistic.Maximum,
    samplecount: Statistic.SampleCount,
    n: Statistic.SampleCount,
    sum: Statistic.Sum,
  };

  if (lowerStat in statMap) {
    return {
      type: 'simple',
      statistic: statMap[lowerStat]
    };
  }

  // Percentile statistics
  const re = /^p([\d.]+)$/;
  const m = re.exec(lowerStat);
  if (m) {
    return {
      type: 'percentile',
      percentile: parseFloat(m[1])
    };
  }

  throw new Error(`Not a valid statistic: '${stat}', must be one of Average | Minimum | Maximum | SampleCount | Sum | pNN.NN`);
}

export function normalizeStatistic(stat: string): string {
  const parsed = parseStatistic(stat);
  if (parsed.type === 'simple') {
    return parsed.statistic;
  } else {
    // Already percentile. Avoid parsing because we might get into
    // floating point rounding issues, return as-is but lowercase the p.
    return stat.toLowerCase();
  }
}

/**
 * Statistic to use over the aggregation period
 */
const enum Statistic {
  SampleCount = 'SampleCount',
  Average = 'Average',
  Sum = 'Sum',
  Minimum = 'Minimum',
  Maximum = 'Maximum',
}
