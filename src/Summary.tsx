import {
    BarChart,
    BarChartProps,
    Box,
    Button,
    Container,
    Header,
    KeyValuePairs,
    SpaceBetween
} from "@cloudscape-design/components";
import { useMemo } from "react";
import { Income } from "./model.ts";

type NumberFields<T> = keyof {
    [P in keyof T as T[P] extends number ? P : never]: unknown
}

const sumProp = (values: Income[], prop: NumberFields<Income>) => values
    .map(x => x[prop])
    .reduce((a, b) => a + b, 0);

const enum Metrics {
    SHARED = 'Contribution to household expenses',
    COMPENSATION = 'Compensation for time on household tasks',
    SAVINGS = 'Total savings',
}

const locale = [...navigator.languages, navigator.language][0];

const currencyFormatter = Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
});

const percentFormatter = Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: 2,
});

const decimalFormatter = Intl.NumberFormat(locale, {
    style: 'decimal',
    maximumFractionDigits: 2,
});

interface SummaryProps {
    readonly sharedItems: number;
    readonly incomes: Income[];
}

export const Summary = ({incomes, sharedItems}: SummaryProps) => {
    const avgHoursOnHouseholdTasks = useMemo(() => sumProp(incomes, 'hoursOnHouseholdTasks') / incomes.length, [incomes]);
    const totalWeeklyHours = useMemo(() => sumProp(incomes, 'weeklyHours'), [incomes]);
    const totalIncome = useMemo(() => sumProp(incomes, 'monthlyIncome'), [incomes]);

    const series: BarChartProps<string>['series'] = incomes.map(i => {
        const contributions = i.monthlyIncome * sharedItems / totalIncome;
        const compensation = (i.hoursOnHouseholdTasks - avgHoursOnHouseholdTasks) * (totalIncome - sharedItems) / totalWeeklyHours;
        const savings = i.monthlyIncome - contributions + compensation;
        return ({
            title: i.name,
            type: 'bar',
            valueFormatter: currencyFormatter.format,
            data: [
                {x: Metrics.SHARED, y: contributions},
                {x: Metrics.COMPENSATION, y: compensation},
                {x: Metrics.SAVINGS, y: savings},
            ],
        });
    });

    return <Container header={<Header variant={"h1"}>Summary</Header>}>
        <SpaceBetween size={'l'} direction={'vertical'}>
            <KeyValuePairs
                columns={2}
                items={[{
                    title: "Expenses",
                    type: "group",
                    items: [{
                        label: "Percentage of income for shared items",
                        value: percentFormatter.format(sharedItems / totalIncome),
                    }],
                }, {
                    title: "Effort",
                    type: "group",
                    items: [{
                        label: "Average hours spent on household tasks",
                        value: decimalFormatter.format(avgHoursOnHouseholdTasks),
                    }],
                }]}
            />
            <BarChart
                series={series}
                hideFilter
                xDomain={[
                    Metrics.SHARED,
                    Metrics.COMPENSATION,
                    Metrics.SAVINGS,
                ]}
                ariaLabel="Stacked bar chart"
                height={300}
                yTickFormatter={currencyFormatter.format}
                empty={
                    <Box textAlign="center" color="inherit">
                        <b>No data available</b>
                        <Box variant="p" color="inherit">
                            There is no data available
                        </Box>
                    </Box>
                }
                noMatch={
                    <Box textAlign="center" color="inherit">
                        <b>No matching data</b>
                        <Box variant="p" color="inherit">
                            There is no matching data to display
                        </Box>
                        <Button>Clear filter</Button>
                    </Box>
                }
            />
        </SpaceBetween>
    </Container>;
};