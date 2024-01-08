import { Box, PieChart, PieChartProps, SpaceBetween } from "@cloudscape-design/components";
import { Income } from "./model";

interface ContributionSummaryProps {
    readonly avgHoursOnFamilyTasks: number;
    readonly sharedPoolContributions: number;
    readonly income: Income;
    readonly maxWeeklyHours: number;
    readonly totalIncome: number;
    readonly totalWeeklyHours: number;
}

export const ContributionSummary = ({
                                        avgHoursOnFamilyTasks,
                                        sharedPoolContributions,
                                        income: {monthlyIncome, hoursOnFamilyTasks, weeklyHours},
                                        maxWeeklyHours,
                                        totalIncome,
                                        totalWeeklyHours
                                    }: ContributionSummaryProps) => {
    const familyContributions = sharedPoolContributions * monthlyIncome / totalIncome;
    const savingsSubtotal = monthlyIncome - familyContributions;
    const familyHoursSurplus = hoursOnFamilyTasks - avgHoursOnFamilyTasks;
    const familyCompensation = familyHoursSurplus * (totalIncome - sharedPoolContributions) / totalWeeklyHours;
    const incomeOnMaxHours = monthlyIncome * maxWeeklyHours / weeklyHours;
    const totalSavings = savingsSubtotal + familyCompensation;

    const data: PieChartProps.Datum[] = [];
    familyContributions && data.push({title: "Contribution to family expenses & savings", value: familyContributions});
    familyCompensation < 0 && data.push({title: "Compensation contributed for deficit of hours on family", value: Math.abs(familyCompensation)});
    familyCompensation > 0 && data.push({title: "Compensation received for surplus of hours on family", value: familyCompensation});
    savingsSubtotal && data.push({title: "Savings from individual income", value: savingsSubtotal});

    return <SpaceBetween direction={"vertical"} size={"xxl"}>
        <PieChart
            data={data}
            ariaDescription="Donut chart showing generic example data."
            ariaLabel="Donut chart"
            innerMetricDescription="Total savings"
            innerMetricValue={`${Math.round(totalSavings)}`}
            hideFilter
            hideLegend
            size={'medium'}
            variant={'donut'}
            empty={
                <Box textAlign="center" color="inherit">
                    <b>No data available</b>
                    <Box variant="p" color="inherit">
                        There is no data available
                    </Box>
                </Box>
            }
        />
        <div>
            <Box variant="awsui-key-label">Contribution to family expenses</Box>
            <div>{Math.round(familyContributions)}</div>
        </div>
        <div>
            <Box variant="awsui-key-label">Savings before family compensation</Box>
            <div>{Math.round(savingsSubtotal)} - {Math.round(savingsSubtotal / monthlyIncome * 100)}%</div>
        </div>
        <div>
            <Box variant="awsui-key-label">Additional family hours contributed</Box>
            <div>{familyHoursSurplus}</div>
        </div>
        <div>
            <Box variant="awsui-key-label">Compensation for family hours</Box>
            <div>{Math.round(familyCompensation)}</div>
        </div>
        <div>
            <Box variant="awsui-key-label">Savings after family compensation</Box>
            <div>{Math.round(totalSavings)} - {Math.round(totalSavings / monthlyIncome * 100)}%</div>
        </div>
        <div>
            <Box variant="awsui-key-label">Loss if equal family effort</Box>
            <div>{incomeOnMaxHours * avgHoursOnFamilyTasks / maxWeeklyHours}</div>
        </div>
        <div>
            <Box variant="awsui-key-label">Lost income</Box>
            <div>{incomeOnMaxHours * hoursOnFamilyTasks / maxWeeklyHours}</div>
        </div>
    </SpaceBetween>;
};