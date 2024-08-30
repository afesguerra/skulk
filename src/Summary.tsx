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

interface SummaryProps {
    readonly sharedItems: number;
    readonly incomes: Income[];
}

export const Summary = ({incomes, sharedItems}: SummaryProps) => {
    const avgHoursOnHouseholdTasks = useMemo(() => sumProp(incomes, 'hoursOnHouseholdTasks') / incomes.length, [incomes]);
    const totalWeeklyHours = useMemo(() => sumProp(incomes, 'weeklyHours'), [incomes]);
    const totalIncome = useMemo(() => sumProp(incomes, 'monthlyIncome'), [incomes]);

    const series: BarChartProps<string>['series'] = incomes.map(i => {
        const contributions = sharedItems * i.monthlyIncome / totalIncome;
        const compensation = (i.hoursOnHouseholdTasks - avgHoursOnHouseholdTasks) * (totalIncome - sharedItems) / totalWeeklyHours;
        const savings = i.monthlyIncome - contributions + compensation;
        return ({
            title: i.name,
            type: 'bar',
            data: [
                {x: Metrics.SHARED, y: Math.round(contributions)},
                {x: Metrics.COMPENSATION, y: Math.round(compensation)},
                {x: Metrics.SAVINGS, y: Math.round(savings)},
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
                        value: `${Math.round(sharedItems / totalIncome * 10000) / 100}%`,
                    }],
                }, {
                    title: "Effort",
                    type: "group",
                    items: [{
                        label: "Average hours spent on household tasks",
                        value: avgHoursOnHouseholdTasks,
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
                yTitle="$$$"
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