import { generateOccurrenceDates } from './generate-occurrence-dates';

describe('generateOccurrenceDates', () => {
  it('DAILY cada día, dentro del horizonte', () => {
    const dates = generateOccurrenceDates(
      { frequency: 'DAILY', intervalCount: 1, daysOfWeek: [], startDate: '2026-11-01', endDate: null },
      '2026-11-05',
    );
    expect(dates).toEqual(['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05']);
  });

  it('DAILY cada 2 días', () => {
    const dates = generateOccurrenceDates(
      { frequency: 'DAILY', intervalCount: 2, daysOfWeek: [], startDate: '2026-11-01', endDate: null },
      '2026-11-07',
    );
    expect(dates).toEqual(['2026-11-01', '2026-11-03', '2026-11-05', '2026-11-07']);
  });

  it('DAILY respeta endDate antes del horizonte', () => {
    const dates = generateOccurrenceDates(
      { frequency: 'DAILY', intervalCount: 1, daysOfWeek: [], startDate: '2026-11-01', endDate: '2026-11-03' },
      '2026-11-10',
    );
    expect(dates).toEqual(['2026-11-01', '2026-11-02', '2026-11-03']);
  });

  it('WEEKLY en los días indicados, todas las semanas', () => {
    // 2026-11-01 es domingo. Pide lunes (1) y jueves (4).
    const dates = generateOccurrenceDates(
      { frequency: 'WEEKLY', intervalCount: 1, daysOfWeek: [1, 4], startDate: '2026-11-01', endDate: null },
      '2026-11-14',
    );
    expect(dates).toEqual(['2026-11-02', '2026-11-05', '2026-11-09', '2026-11-12']);
  });

  it('WEEKLY cada 2 semanas', () => {
    const dates = generateOccurrenceDates(
      { frequency: 'WEEKLY', intervalCount: 2, daysOfWeek: [1], startDate: '2026-11-01', endDate: null },
      '2026-11-30',
    );
    expect(dates).toEqual(['2026-11-02', '2026-11-16', '2026-11-30']);
  });
});